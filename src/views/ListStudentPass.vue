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
          Add New
        </a-button>
      </div>
    </div>
    <div class="drawer-wrapper">
      <a-drawer
        :width="800"
        :visible="visible"
        :body-style="{ paddingBottom: '80px' }"
        :footer-style="{ textAlign: 'right' }"
        @close="onClose"
      >
        <a-form layout="vertical">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="Mã số sinh viên" name="mssv">
                <a-input
                  v-model:value="student.studentCode"
                  placeholder="Nhập mã số sinh viên"
                />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="Họ tên" name="name">
                <a-input
                  v-model:value="student.name"
                  placeholder="Nhập họ tên sinh viên"
                />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="Lớp" name="class">
                <a-select
                  v-model:value="student.className"
                  placeholder="Chọn lớp"
                >
                  <a-select-option value="63IT1">63IT1</a-select-option>
                  <a-select-option value="63IT2">63IT2</a-select-option>
                  <a-select-option value="63IT3">63IT3</a-select-option>
                  <a-select-option value="63IT4">63IT4</a-select-option>
                  <a-select-option value="63TH1">63TH1</a-select-option>
                  <a-select-option value="63TH2">63TH2</a-select-option>
                  <a-select-option value="63TH3">63TH3</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="Đề tài" name="addressTT">
                <a-input
                  v-model:value="student.graduationTopic"
                  placeholder="Đề tài thực tập"
                />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item label="Giáo viên hướng dẫn" name="teacher">
                <a-select
                  v-model:value="student.teacherId"
                  placeholder="Chọn giáo viên hướng dẫn"
                  :options="listTeacher"
                >
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <template #extra>
          <a-space>
            <a-button v-if="isEdit" type="primary" @click.prevent="editStudent"
              >Edit</a-button
            >
            <a-button v-else type="primary" @click.prevent="addStudent"
              >Submit</a-button
            >
          </a-space>
        </template>
      </a-drawer>
    </div>
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
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { environment, ENDPOINT } from "../shared/config/index";
import { getData } from "../shared/common/common";
import { ACCESS_TOKEN } from "../shared/constant/constant";
import FormAdd from "../components/FormAdd.vue";
import { createToast } from "mosha-vue-toastify";
import { PlusOutlined } from "@ant-design/icons-vue";

export default {
  components: {
    FormAdd,
    PlusOutlined,
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
    const loadingRequestAPI = ref(false);
    const isEdit = ref(false);
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

    const student = ref({
      className: "",
      internshipId: 0,
      internshipPlace: "",
      name: "",
      studentCode: "",
      graduationTopic: "",
      teacherId: "",
      graduationId: id,
    });

    const visible = ref(false);

    const showDrawer = () => {
      visible.value = true;
      isEdit.value = false;
      student.value = {
        className: "",
        internshipId: 0,
        internshipPlace: "",
        name: "",
        studentCode: "",
        graduationTopic: "",
        teacherId: "",
        graduationId: id,
      };
    };

    const onClose = () => {
      visible.value = false;
      isEdit.value = false;
      student.value = {
        className: "",
        internshipId: 0,
        internshipPlace: "",
        name: "",
        studentCode: "",
        graduationTopic: "",
        teacherId: "",
        graduationId: id,
      };
    };

    const addStudent = () => {
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
            JSON.stringify(student.value),
            config
          )
          .then((res) => {
            if (res.data.success) {
              createToast(res.data.message, {
                type: "success",
                timeout: 1500,
              });
              listStudent.value.push({
                ...res.data.data,
                key: (
                  listStudent.value.length +
                  (current.value - 1) * 10
                ).toString(),
                stt: listStudent.value.length + (current.value - 1) * 10,
                teacher: getTeacher(res.data.data.teacherId),
              });
              student.value = {
                className: "",
                internshipId: 0,
                internshipPlace: "",
                name: "",
                studentCode: "",
                graduationTopic: "",
                teacherId: "",
                graduationId: id,
              };
              filterStudent.value = listStudent.value;
              visible.value = false;
            }
          })
          .catch((err) => {
            createToast("Added failed.", {
              type: "danger",
              timeout: 1500,
            });
          });
      }
    };

    const editStudent = () => {
      if (getData(ACCESS_TOKEN, "")) {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: getData(ACCESS_TOKEN, ""),
          },
        };
        axios
          .put(
            `${environment.API_URL}${ENDPOINT.students.index}/${student.value.id}`,
            JSON.stringify(student.value),
            config
          )
          .then((res) => {
            if (res.data.success) {
              createToast(res.data.message, {
                type: "success",
                timeout: 1500,
              });
              const newStudent = res.data.data;
              const studentIndex = listStudent.value.findIndex(
                (item) => item.id === newStudent.id
              );
              const studentEl = listStudent.value[studentIndex];
              listStudent.value[studentIndex] = {
                ...studentEl,
                studentCode: newStudent.studentCode,
                name: newStudent.name,
                className: newStudent.className,
                graduationTopic: newStudent.graduationTopic,
                teacher: getTeacher(newStudent.teacherId),
              };
              filterStudent.value = listStudent.value;
              isEdit.value = false;
              visible.value = false;
            }
          })
          .catch((err) => {
            createToast("Update failed.", {
              type: "danger",
              timeout: 1500,
            });
          });
      }
    };

    const getListStudent = (page, pageSize) => {
      if (getData(ACCESS_TOKEN, "")) {
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
                id: item.id,
                studentCode: item.studentCode,
                name: item.name,
                className: item.className,
                graduationTopic: item.graduationTopic,
                teacher: getTeacher(item.teacherId),
              }));
              filterStudent.value = listStudent.value;
              totalPage.value = res.data.pagination.total_page;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    const getTeacher = (id) => {
      if (id) {
        return listTeacher.value.find((item) => item.value === id).label;
      }
      return "";
    };

    const getListTeacher = () => {
      const config = {
        headers: {
          Authorization: getData(ACCESS_TOKEN, ""),
        },
      };
      if (getData(ACCESS_TOKEN, "")) {
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

    const getStudentById = (id) => {
      if (getData(ACCESS_TOKEN, "")) {
        const config = {
          headers: {
            Authorization: getData(ACCESS_TOKEN, ""),
          },
        };
        axios
          .get(`${environment.API_URL}${ENDPOINT.students.index}/${id}`, config)
          .then((res) => {
            if (res.data.success) {
              student.value = {
                ...res.data.data,
              };
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    const edit = (record) => {
      visible.value = true;
      isEdit.value = true;
      getStudentById(record.id);
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

    onMounted(() => {
      getListTeacher();
      getListStudent(0, 10);
    });

    const onChange = (page, pageSize) => {
      getListStudent(page - 1, pageSize);
    };

    const onSearch = () => {
      if (searchStudent.value) {
        const listsStudent = [...listStudent.value];
        const newListStudent = listsStudent.filter((item) =>
          item.name.includes(searchStudent.value.toLowerCase())
        );
        listStudent.value = newListStudent;
      } else {
        listStudent.value = filterStudent.value;
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
      loadingRequestAPI,
      edit,
      onDelete,
      onChange,
      student,
      showDrawer,
      onClose,
      addStudent,
      visible,
      isEdit,
      editStudent,
      getListTeacher,
      listTeacher,
      searchStudent,
      onSearch,
      filterStudent,
    };
  },
};
</script>
