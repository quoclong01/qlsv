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
        <div class="file-input">
          <input
            type="file"
            name="file-input"
            id="file-input"
            class="file-input__input"
            @change="handleChange"
          />
          <label class="file-input__label" for="file-input">
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="upload"
              class="svg-inline--fa fa-upload fa-w-16"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
              ></path>
            </svg>
            <span>Import file</span></label
          >
        </div>
        <a-button type="primary" @click="showDrawer"> Thêm sinh viên </a-button>
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
import readXlsxFile from "read-excel-file";

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

    const addStudent = (student) => {
      if (getData(ACCESS_TOKEN, "")) {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: getData(ACCESS_TOKEN, ""),
          },
        };
        axios
          .post(
            `${environment.API_URL}${ENDPOINT.students.index}`,
            JSON.stringify(student),
            config
          )
          .then((res) => {
            if (res.data.success) {
              console.log("them thanh cong");
            }
          })
          .catch((err) => {});
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

    const handleChange = (event) => {
      const file = event.target.files ? event.target.files[0] : null;
      if (file) {
        readXlsxFile(file).then((rows) => {
          listStudent.value = rows.splice(1).map((item, index) => ({
            key: (index + (current.value - 1) * 10).toString(),
            stt: index + (current.value - 1) * 10,
            className: item[2],
            internshipPlace: "",
            name: item[1],
            studentCode: item[0],
            graduationTopic: "",
            teacher: getDataById(listTeacher.value, item[3]),
            teacherId: item[3],
          }));
          listStudent.value.map((item) => {
            const data = {
              ...item,
              internshipId: 0,
              graduationId: 0,
            };
            delete data.stt;
            delete data.key;
            delete data.teacher;
            addStudent(data);
          });
        });
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
      handleChange,
      addStudent,
    };
  },
};
</script>
