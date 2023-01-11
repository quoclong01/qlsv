<template>
  <div class="list-student">
    <h2 class="title">Danh sách sinh viên</h2>
    <div class="flex-al-sp">
      <a-input-search
        v-model:value="searchStudent"
        placeholder="Tìm sinh viên"
        style="width: 400px"
        @change="onSearch"
      />
      <div class="btn-add">
        <a-button type="danger" @click="handleDeleteAll">Delete All</a-button>
        <a-button type="primary" @click="showDrawer" style="margin-left: 20px;"> Thêm sinh viên </a-button>
      </div>
    </div>
    <template v-if="visible">
      <FormStudent
        v-model:visible="visible"
        :isEdit="isEdit"
        :listStudent="listStudent"
        :listTeacher="listTeacher"
        :current="current"
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
          :columns="columnStudents"
          :data-source="listStudent"
          class="table-wrapper"
          :pagination="false"
          bordered
        >
          <template #operation="{ record }">
            <div class="editable-row-group">
              <div class="editable-row-operations">
                <a-button type="primary" @click="edit(record)">Sửa</a-button>
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
import { ACCESS_TOKEN, columnStudents } from "../shared/constant/constant";

import { createToast } from "mosha-vue-toastify";
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons-vue";

import FormStudent from "../components/FormStudent.vue";

export default {
  components: {
    FormStudent,
    LoadingOutlined,
    UploadOutlined,
  },
  setup() {
    const listStudent = ref([]);
    const listTeacher = ref([]);
    const route = useRoute();
    const current = ref(1);
    const totalPage = ref(1);
    const type = "internship";
    const searchStudent = ref("");
    const isRequestAPI = ref(false);
    const isEdit = ref({
      status: false,
      id: "",
    });
    const indicator = h(LoadingOutlined, {
      style: {
        fontSize: "36px",
      },
      spin: true,
    });

    const visible = ref(false);

    const showDrawer = () => {
      visible.value = true;
      isEdit.value = { status: false, id: "" };
    };

    const getListStudent = (page, pageSize, name) => {
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
              }?page=${page}&page-size=${pageSize}${
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

    const edit = (record) => {
      visible.value = true;
      isEdit.value = { status: true, id: record.id };
    };

    const onDelete = (key) => {
      const student = listStudent.value.find((item) => item.key == key);
      if (getData(ACCESS_TOKEN, "")) {
        const config = {
          headers: {
            Authorization: getData(ACCESS_TOKEN, ""),
          },
        };
        axios
          .delete(
            `${environment.API_URL}${ENDPOINT.students.index}/${student.id}`,
            config
          )
          .then((res) => {
            createToast(res.data.message, {
              type: "success",
              timeout: 1500,
            });
            listStudent.value = listStudent.value.filter(
              (item) => item.key !== key
            );
          })
          .catch((err) => {
            createToast("Delete failed.", {
              type: "danger",
              timeout: 1500,
            });
          });
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

    onMounted(() => {
      getListTeacher();
      getListStudent(0, 10);
    });

    const onChange = (page, pageSize) => {
      if (searchStudent.value) {
        getListStudent(page - 1, pageSize, searchStudent.value);
      } else {
        getListStudent(page - 1, pageSize);
      }
    };

    const onSearch = () => {
      if (searchStudent.value) {
        getListStudent(0, 10, searchStudent.value);
      } else {
        getListStudent(0, 10);
      }
    };

    const handleDeleteAll = () => {
      if (!isRequestAPI.value) {
        isRequestAPI.value = true;
        if (getData(ACCESS_TOKEN, "")) {
          const config = {
            headers: {
              Authorization: getData(ACCESS_TOKEN, ""),
            },
          };
          axios
            .delete(`${environment.API_URL}${ENDPOINT.students.all}`, config)
            .then((res) => {
              createToast(res.data.message, {
                type: "success",
                timeout: 1500,
              });
              listStudent.value = [];
              isRequestAPI.value = false;
            })
            .catch((err) => {
              createToast("Delete failed.", {
                type: "danger",
                timeout: 1500,
              });
              isRequestAPI.value = false;
            });
        }
      }
    };

    return {
      listStudent,
      route,
      type,
      getListStudent,
      current,
      totalPage,
      edit,
      onDelete,
      onChange,
      showDrawer,
      visible,
      isEdit,
      searchStudent,
      onSearch,
      columnStudents,
      listTeacher,
      isRequestAPI,
      indicator,
      handleDeleteAll,
    };
  },
};
</script>
