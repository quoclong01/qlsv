<template>
  <div class="list-student">
    <h2 class="title">Danh sách sinh viên đồ án</h2>
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
      <FormGraduation
        v-model:visible="visible"
        :listStudent="listStudent"
        :current="current"
        :listTeacher="listTeacher"
      />
    </template>
    <template v-if="isRequestAPI">
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
                  title="Nhập"
                  @ok="handleOk(record)"
                >
                  <a-row :gutter="[16, 16]">
                    <a-col :span="12">
                      <a-form-item label="Tên đề tài" name="graduationId">
                        <a-input
                          placeholder="Nhập"
                          v-model:value="graduation.graduationTopic"
                        ></a-input>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item
                        label="Giáo viên hướng dẫn"
                        name="teacherId"
                        style="
                          display: flex;
                          align-items: flex-start;
                          flex-direction: column;
                        "
                      >
                        <a-select
                          placeholder="Chọn"
                          :options="listTeacher"
                          v-model:value="graduation.teacherId"
                        >
                        </a-select>
                      </a-form-item>
                    </a-col>
                  </a-row>
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
import { getData, getDataById } from "../shared/common/common";
import { ACCESS_TOKEN } from "../shared/constant/constant";

import FormGraduation from "../components/FormGraduation.vue";
import { createToast } from "mosha-vue-toastify";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue";

export default {
  components: {
    PlusOutlined,
    FormGraduation,
    LoadingOutlined,
  },
  setup() {
    const listStudent = ref([]);
    const filterStudent = ref([]);
    const searchStudent = ref("");
    const listTeacher = ref([]);
    const route = useRoute();
    const current = ref(1);
    const totalPage = ref(1);
    const id = route.params.id;
    const type = "graduation";
    const isRequestAPI = ref(false);
    const graduation = ref({
      teacherId: "",
      graduationTopic: "",
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
        title: "Đề tài",
        dataIndex: "graduationTopic",
        className: "text-center",
      },
      {
        title: "Giáo viên hướng dẫn",
        dataIndex: "teacher",
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
    // show form
    const visible = ref(false);
    const showDrawer = () => {
      visible.value = true;
    };
    // show modal
    const visibleModal = ref(false);
    const showModal = (student) => {
      graduation.value.graduationTopic = student.graduationTopic;
      graduation.value.teacherId = student.teacherId;
      visibleModal.value = true;
    };

    const getListStudent = (page, pageSize) => {
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
                  teacher: getDataById(listTeacher.value, item.teacherId),
                }));
                isRequestAPI.value = false;
                filterStudent.value = listStudent.value;
                totalPage.value = res.data.pagination.total_page;
              }
            })
            .catch((err) => {
              isRequestAPI.value = false;
            });
        }
      }
    };

    const getListTeacher = () => {
      if (getData(ACCESS_TOKEN, "")) {
        const config = {
          headers: {
            Authorization: getData(ACCESS_TOKEN, ""),
          },
        };
        axios
          .get(
            `${environment.API_URL}${ENDPOINT.users.index}?page=0&page-size=1000`,
            config
          )
          .then((res) => {
            listTeacher.value = res.data.data
              .filter((item) => item.role === "TEACHER")
              .map((item) => ({
                value: item.id,
                label: item.name,
              }));
          })
          .catch((err) => {
            console.log(err);
          });
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
            graduationId: 0,
            graduationTopic: "",
            teacherId: 0,
          };
          delete data.key;
          delete data.stt;
          delete data.teacher;
          axios
            .put(
              `${environment.API_URL}${ENDPOINT.students.index}/${student.id}`,
              data,
              config
            )
            .then((res) => {
              if (res.data.success) {
                isRequestAPI.value = false;
                createToast("Delete successfully", {
                  type: "success",
                  timeout: 1500,
                });
                listStudent.value = listStudent.value.filter(
                  (item) => item.key !== key
                );
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
      getListTeacher();
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
                  teacher: getDataById(listTeacher.value, item.teacherId),
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

    const handleOk = (student) => {
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
            graduationTopic: graduation.value.graduationTopic,
            teacherId: graduation.value.teacherId,
          };
          delete data.key;
          delete data.stt;
          delete data.teacher;

          axios
            .put(
              `${environment.API_URL}${ENDPOINT.students.index}/${student.id}`,
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
                  (item) => item.id === student.id
                );
                listStudent.value[studentIdx] = {
                  ...listStudent.value[studentIdx],
                  graduationTopic: res.data.data.graduationTopic,
                  teacherId: getDataById(
                    listTeacher.value,
                    res.data.data.teacherId
                  ),
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

    return {
      columns,
      listStudent,
      route,
      id,
      type,
      getListStudent,
      current,
      totalPage,
      onDelete,
      onChange,
      showDrawer,
      visible,
      getListTeacher,
      listTeacher,
      searchStudent,
      onSearch,
      filterStudent,
      isRequestAPI,
      indicator,
      graduation,
      visibleModal,
      showModal,
      handleOk,
    };
  },
};
</script>
