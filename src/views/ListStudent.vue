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
              <a-form-item label="Nơi thực tập" name="addressTT">
                <a-input
                  v-model:value="student.internshipPlace"
                  placeholder="Nhập địa chỉ thực tập"
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
import { ref, onMounted, reactive } from "vue";
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
    const semester = ref({});
    const route = useRoute();
    const current = ref(1);
    const totalPage = ref(1);
    const id = route.params.id;
    const type = "internship";
    const loadingRequestAPI = ref(false);
    const searchStudent = ref("");
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

    const student = ref({
      className: "",
      internshipId: id,
      internshipPlace: "",
      name: "",
      studentCode: "",
      graduationTopic: "",
      teacherId: 0,
      graduationId: 0,
    });

    const visible = ref(false);

    const showDrawer = () => {
      visible.value = true;
      isEdit.value = false;
      student.value = {
        className: "",
        internshipId: id,
        internshipPlace: "",
        name: "",
        studentCode: "",
        graduationTopic: "",
        teacherId: 0,
        graduationId: 0,
      };
    };

    const onClose = () => {
      visible.value = false;
      isEdit.value = false;
      student.value = {
        className: "",
        internshipId: id,
        internshipPlace: "",
        name: "",
        studentCode: "",
        graduationTopic: "",
        teacherId: 0,
        graduationId: 0,
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
              });
              filterStudent.value = listStudent.value;
              student.value = {
                className: "",
                internshipId: id,
                internshipPlace: "",
                name: "",
                studentCode: "",
                graduationTopic: "",
                teacherId: 0,
                graduationId: 0,
              };
              visible.value = false;
            }
          })
          .catch((err) => {
            createToast("Add failed.", {
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
                internshipPlace: newStudent.internshipPlace,
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
                internshipPlace: item.internshipPlace,
                semester: semester.value.semester,
                year: semester.value.year,
              }));
              filterStudent.value = listStudent.value;
              totalPage.value = res.data.pagination.total_page;
            }
          })
          .catch((err) => {
            listStudent.value = [];
          });
      }
    };

    const getSemeterById = () => {
      if (getData(ACCESS_TOKEN, "")) {
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
            semester.value = res.data.data;
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
            filterStudent.value = listStudent.value;
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
      getSemeterById();
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
      searchStudent,
      onSearch,
    };
  },
};
</script>
