<template>
  <div class="drawer-wrapper">
    <a-drawer
      :visible="isVisible"
      :width="800"
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
            <a-form-item label="Lớp" name="className">
              <a-select
                v-model:value="student.className"
                placeholder="Chọn lớp"
                :options="listClassName"
                @change="handleChangeClassName"
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Đợt thực tập" name="internshipId">
              <a-select
                v-model:value="student.internshipId"
                placeholder="Chọn đợt thực tập"
                :options="listInternship"
                @change="handleChangeInternship"
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Nơi thực tập" name="internshipPlace">
              <a-input
                v-model:value="student.internshipPlace"
                placeholder="Nhập địa chỉ thực tập"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Đợt đồ án" name="graduationId">
              <a-select
                v-model:value="student.graduationId"
                placeholder="Chọn đợt đồ án"
                :options="listGraduation"
                @change="handleChangeGraduation"
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Đề tài" name="graduationTopic">
              <a-input
                v-model:value="student.graduationTopic"
                placeholder="Nhập đề tài đồ án"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Giáo viên hướng dẫn" name="teacher">
              <a-select
                v-model:value="student.teacherId"
                placeholder="Chọn giáo viên"
                :options="listTeacher"
                @change="handleChangeTeacher"
              >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <template #extra>
        <a-space>
          <a-button
            v-if="isEdit.status"
            type="primary"
            @click.prevent="editStudent"
            >Edit</a-button
          >
          <a-button v-else type="primary" @click.prevent="addStudent"
            >Submit</a-button
          >
        </a-space>
      </template>
    </a-drawer>
  </div>
</template>

<script>
import axios from "axios";
import { onMounted, ref, toRef } from "vue";

import { environment, ENDPOINT } from "../shared/config/index";
import { getData, getDataById } from "../shared/common/common";
import {
  ACCESS_TOKEN,
  listClassName,
  PAGE_SIZE_LARGE,
} from "../shared/constant/constant";

import { createToast } from "mosha-vue-toastify";

export default {
  props: {
    visible: Boolean,
    isEdit: Object,
    listStudent: Array,
    listTeacher: Array,
    current: Number,
  },
  setup(props, { emit }) {
    const isVisible = toRef(props, "visible");
    const isEdit = toRef(props, "isEdit");
    const listTeacher = toRef(props, "listTeacher");
    const listInternship = ref([]);
    const listGraduation = ref([]);

    const student = ref({
      className: "",
      internshipId: "",
      internshipPlace: "",
      name: "",
      studentCode: "",
      graduationTopic: "",
      teacherId: "",
      graduationId: "",
    });

    const onClose = () => {
      emit("update:visible", false);
    };

    const handleChangeClassName = (value) => {
      student.value.className = value;
    };

    const handleChangeTeacher = (value) => {
      student.value.teacherId = value;
    };

    const handleChangeInternship = (value) => {
      student.value.internshipId = value;
    };

    const handleChangeGraduation = (value) => {
      student.value.graduationId = value;
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
              props.listStudent.push({
                ...res.data.data,
                key: (
                  props.listStudent.length +
                  (props.current - 1) * 10
                ).toString(),
                stt: props.listStudent.length + (props.current - 1) * 10,
                teacher: getDataById(
                  props.listTeacher,
                  res.data.data.teacherId
                ),
              });
              student.value = {
                className: "",
                internshipId: 0,
                internshipPlace: "",
                name: "",
                studentCode: "",
                graduationTopic: "",
                teacherId: 0,
                graduationId: 0,
              };
              emit("update:visible", false);
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
              const studentIndex = props.listStudent.findIndex(
                (item) => item.id === isEdit.value.id
              );
              const studentEL = props.listStudent[studentIndex]; 
              props.listStudent[studentIndex] = {
                ...studentEL,
                ...res.data.data,
                teacher: getDataById(props.listTeacher, res.data.data.teacherId)
              };
              emit('update:visible', false);
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

    const getListInternship = () => {
      if (getData(ACCESS_TOKEN, "")) {
        const config = {
          headers: {
            Authorization: getData(ACCESS_TOKEN, ""),
          },
        };
        axios
          .get(
            `${environment.API_URL}${ENDPOINT.semesters.type}?page=0&page-size=${PAGE_SIZE_LARGE}&type=INTERNSHIP`,
            config
          )
          .then((res) => {
            listInternship.value = res.data.data.map((item) => ({
              value: item.id,
              label: item.semester,
            }));
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    const getListGraduation = () => {
      if (getData(ACCESS_TOKEN, "")) {
        const config = {
          headers: {
            Authorization: getData(ACCESS_TOKEN, ""),
          },
        };
        axios
          .get(
            `${environment.API_URL}${ENDPOINT.semesters.type}?page=0&page-size=${PAGE_SIZE_LARGE}&type=GRADUATION`,
            config
          )
          .then((res) => {
            listGraduation.value = res.data.data.map((item) => ({
              value: item.id,
              label: item.semester,
            }));
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    onMounted(() => {
      getListInternship();
      getListGraduation();
      if (isEdit.value.id) {
        getStudentById(isEdit.value.id);
      }
    });

    return {
      getStudentById,
      onClose,
      student,
      isEdit,
      isVisible,
      listTeacher,
      listClassName,
      handleChangeClassName,
      addStudent,
      editStudent,
      handleChangeTeacher,
      listInternship,
      listGraduation,
      handleChangeInternship,
      handleChangeGraduation,
    };
  },
};
</script>
