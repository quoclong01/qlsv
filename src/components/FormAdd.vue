<template>
  <div>

  </div>
</template>
<script>
import { environment, ENDPOINT } from "../shared/config/index";
import { getData } from "../shared/common/common";
import { ACCESS_TOKEN } from "../shared/constant/constant";
import axios from "axios";
import { PlusOutlined } from "@ant-design/icons-vue";
import { reactive, ref, onMounted } from "vue";
import { createToast } from "mosha-vue-toastify";

export default {
  components: {
    PlusOutlined,
  },

  props: {
    id: String,
    listStudent: Array,
    current: Number,
    keyValue: String,
  },

  setup(props) {
    const listTeacher = ref([]);
    const listSemester = ref([]);
    const student = reactive({
      className: "",
      internshipId: props.id,
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
    };

    const onClose = () => {
      visible.value = false;
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
            JSON.stringify(student),
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
              });
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
            console.log(listTeacher.value);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    const getListSemeters = () => {
      if (getData(ACCESS_TOKEN, "")) {
        const config = {
          headers: {
            Authorization: getData(ACCESS_TOKEN, ""),
          },
        };
        axios
          .get(
            `${environment.API_URL}${ENDPOINT.semesters.type}?page=0&page-size=1000&type=INTERNSHIP`,
            config
          )
          .then((res) => {
            if (res.data.success) {
              listSemester.value = res.data.data.map((item) => ({
                value: item.id,
                label: item.semester,
              }));
            }
          })
          .catch((err) => {});
      }
    };
    console.log(props.keyValue);
    onMounted(() => {
      // getListTeacher();
      // getListSemeters();
    });

    return {
      student,
      visible,
      showDrawer,
      onClose,
      addStudent,
      getListTeacher,
      getListSemeters,
      listTeacher,
      listSemester,
    };
  },
};
</script>
