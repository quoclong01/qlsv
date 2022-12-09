<template>
  <div class="list-student">
    <h2 class="title">Danh sách sinh viên thực tập</h2>
    <div class="flex-al-sp">
      <a-input-search
        v-model:value="searchStudent"
        placeholder="Tìm sinh viên"
        style="width: 400px"
        @change="onSearch"
      />
      <div class="btn-add">
        <a-button type="primary" @click="showDrawer">
          <template #icon><PlusOutlined /></template>
          Thêm sinh viên
        </a-button>
      </div>
    </div>
    <template v-if="visible">
      <FormInternship
        v-model:visible="visible"
        :listStudent="listStudent"
        :current="current"
        :semester="semester"
      />
    </template>
    <template v-if="isRequestAPI || isRequestAPIs">
      <div class="loading-container">
        <a-spin :indicator="indicator" />
      </div>
    </template>
    <template v-else>
      <div class="list-student-table">
        <a-table
          :columns="columns"
          :data-source="listStudent"
          class="table-wrapper"
          :pagination="false"
          bordered
        >
          <template #operation="{ record }">
            <div class="editable-row-group">
              <div class="editable-row-operations">
                <a-button type="primary" @click="showModal(record)"
                  >Sửa</a-button
                >
                <a-modal
                  v-model:visible="visibleModal"
                  title="Thông tin thực tập"
                  @ok="handleOk"
                >
                  <a-form-item label="Nơi thực tập" name="graduationId">
                    <a-input
                      placeholder="Nhập nơi thực tập"
                      v-model:value="internshipPlace"
                    ></a-input
                  ></a-form-item>
                </a-modal>
              </div>
              <div class="editable-row-operations">
                <a-popconfirm
                  title="Bạn muốn xóa sinh viên?"
                  @confirm="onDelete(record.key)"
                >
                  <a-button type="danger">Xóa</a-button>
                </a-popconfirm>
              </div>
            </div>
          </template>
        </a-table>
        <a-pagination
          :total="totalPage * 10"
          v-model:current="current"
          @change="onChange"
          style="margin-top: 30px; display: flex; justify-content: right"
        >
        </a-pagination>
      </div>
    </template>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted, h } from "vue";
import { useRoute } from "vue-router";

import { environment, ENDPOINT } from "../shared/config/index";
import { getData } from "../shared/common/common";
import { ACCESS_TOKEN } from "../shared/constant/constant";

import FormInternship from "../components/FormInternship.vue";
import { createToast } from "mosha-vue-toastify";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue";

export default {
  components: {
    PlusOutlined,
    FormInternship,
    LoadingOutlined,
  },
  setup() {
    const listStudent = ref([]);
    const semester = ref({});
    const route = useRoute();
    const current = ref(1);
    const totalPage = ref(1);
    const id = route.params.id;
    const type = "internship";
    const isRequestAPI = ref(false);
    const isRequestAPIs = ref(false);
    const searchStudent = ref("");
    const internshipPlace = ref("");
    const student = ref({
      id: "",
      name: "",
      studentCode: "",
      className: "",
      teacherId: "",
      internshipPlace: "",
      graduationTopic: "",
      internshipId: "",
      graduationId: "",
    });
    const indicator = h(LoadingOutlined, {
      style: {
        fontSize: "36px",
      },
      spin: true,
    });
    const columns = [
      {
        title: "STT",
        dataIndex: "stt",
        width: "5%",
        className: "text-center",
      },
      {
        title: "MSSV",
        dataIndex: "studentCode",
        className: "text-center",
      },
      {
        title: "Họ và tên",
        dataIndex: "name",
        className: "text-center",
      },
      {
        title: "Lớp",
        dataIndex: "className",
        className: "text-center",
      },
      {
        title: "Nơi thực tập",
        dataIndex: "internshipPlace",
        className: "text-center",
      },
      {
        title: "Đợt thực tập",
        dataIndex: "semester",
        className: "text-center",
      },
      {
        title: "Năm học",
        dataIndex: "year",
        className: "text-center",
      },
      {
        title: "Chức năng",
        dataIndex: "operation",
        className: "text-center",
        slots: {
          customRender: "operation",
        },
      },
    ];
    const visible = ref(false);
    const showDrawer = () => {
      visible.value = true;
    };

    const visibleModal = ref(false);
    const showModal = (record) => {
      student.value = record;
      internshipPlace.value = record.internshipPlace;
      visibleModal.value = true;
    };

    const handleOk = () => {
      if (!isRequestAPI.value) {
        if (getData(ACCESS_TOKEN, "")) {
          isRequestAPI.value = true;
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: getData(ACCESS_TOKEN, ""),
            },
          };
          const data = {
            ...student.value,
            internshipPlace: internshipPlace.value,
          };

          delete data.key;
          delete data.stt;
          delete data.semester;
          delete data.year;

          axios
            .put(
              `${environment.API_URL}${ENDPOINT.students.index}/${student.value.id}`,
              JSON.stringify(data),
              config
            )
            .then((res) => {
              if (res.data.success) {
                createToast("Update successfully", {
                  type: "success",
                  timeout: 1500,
                });
                const studentIdx = listStudent.value.findIndex(
                  (item) => item.id == res.data.data.id
                );

                listStudent.value[studentIdx] = {
                  ...listStudent.value[studentIdx],
                  internshipPlace: res.data.data.internshipPlace,
                };

                isRequestAPI.value = false;
                visibleModal.value = false;
              }
            })
            .catch((err) => {
              isRequestAPI.value = false;
              createToast("Update failed.", {
                type: "danger",
                timeout: 1500,
              });
            });
        }
      }
    };

    const getListStudent = async (page, pageSize) => {
      if (!isRequestAPI.value) {
        if (getData(ACCESS_TOKEN, "")) {
          isRequestAPI.value = true;
          const config = {
            headers: {
              Authorization: getData(ACCESS_TOKEN, ""),
            },
          };
          axios
            .get(
              `${environment.API_URL}${ENDPOINT.students.index}/${type}/${id}?page=${page}&page-size=${pageSize}`,
              config
            )
            .then((res) => {
              if (res.data.success) {
                listStudent.value = res.data.data.map((item, index) => ({
                  key: (index + (current.value - 1) * 10).toString(),
                  stt: index + (current.value - 1) * 10,
                  ...item,
                  semester: semester.value.semester,
                  year: semester.value.year,
                }));
                isRequestAPI.value = false;
                totalPage.value = res.data.pagination.total_page;
              }
            })
            .catch((err) => {
              isRequestAPI.value = false;
              listStudent.value = [];
            });
        }
      }
    };

    const getSemeterById = () => {
      if (!isRequestAPIs.value) {
        if (getData(ACCESS_TOKEN, "")) {
          isRequestAPIs.value = true;
          const config = {
            headers: {
              Authorization: getData(ACCESS_TOKEN, ""),
            },
          };
          axios
            .get(
              `${environment.API_URL}${ENDPOINT.semesters.index}/${id}`,
              config
            )
            .then((res) => {
              isRequestAPIs.value = false;
              semester.value = res.data.data;
            })
            .catch((err) => {
              isRequestAPIs.value = false;
            });
        }
      }
    };

    const onDelete = (key) => {
      const student = listStudent.value.find((item) => item.key == key);

      if (!isRequestAPI.value) {
        if (getData(ACCESS_TOKEN, "")) {
          isRequestAPI.value = true;
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: getData(ACCESS_TOKEN, ""),
            },
          };
          const data = {
            ...student,
            internshipPlace: "",
            internshipId: 0,
          };
          delete data.key;
          delete data.stt;
          delete data.semester;
          delete data.year;
          axios
            .put(
              `${environment.API_URL}${ENDPOINT.students.index}/${student.id}`,
              JSON.stringify(data),
              config
            )
            .then((res) => {
              if (res.data.success) {
                createToast("Xóa thành công", {
                  type: "success",
                  timeout: 1500,
                });
                listStudent.value = listStudent.value.filter(
                  (item) => item.key !== key
                );
                isRequestAPI.value = false;
              }
            })
            .catch((err) => {
              isRequestAPI.value = false;
              createToast("Delete failed.", {
                type: "danger",
                timeout: 1500,
              });
            });
        }
      }
    };

    onMounted(() => {
      getSemeterById();
      getListStudent(0, 10);
    });

    const onChange = (page, pageSize) => {
      if (searchStudent.value) {
        getListStudentByName(page - 1, pageSize, searchStudent.value);
      } else {
        getListStudent(page - 1, pageSize);
      }
    };

    const getListStudentByName = (page, pageSize, name) => {
      if (!isRequestAPI.value) {
        if (getData(ACCESS_TOKEN, "")) {
          isRequestAPI.value = true;
          const config = {
            headers: {
              Authorization: getData(ACCESS_TOKEN, ""),
            },
          };
          axios
            .get(
              `${environment.API_URL}${
                ENDPOINT.students.index
              }?${type}-id=${id}&page=${page}&page-size=${pageSize}${
                name ? `&name=${name}` : ""
              }`,
              config
            )
            .then((res) => {
              if (res.data.success) {
                listStudent.value = res.data.data.map((item, index) => ({
                  key: (index + (current.value - 1) * 10).toString(),
                  stt: index + (current.value - 1) * 10,
                  ...item,
                  semester: semester.value.semester,
                  year: semester.value.year,
                }));
                isRequestAPI.value = false;
                totalPage.value = res.data.pagination.total_page;
              }
            })
            .catch((err) => {
              isRequestAPI.value = false;
              listStudent.value = [];
            });
        }
      }
    };

    const onSearch = () => {
      if (searchStudent.value) {
        getListStudentByName(0, 10, searchStudent.value);
      } else {
        getListStudent(0, 10);
      }
    };

    return {
      columns,
      listStudent,
      route,
      id,
      type,
      getListStudent,
      current,
      totalPage,
      isRequestAPI,
      isRequestAPIs,
      onDelete,
      onChange,
      showDrawer,
      visible,
      searchStudent,
      onSearch,
      indicator,
      visibleModal,
      showModal,
      handleOk,
      internshipPlace,
      semester,
    };
  },
};
</script>
