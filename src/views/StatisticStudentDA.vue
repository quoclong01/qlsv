<template>
  <div class="list-student">
    <h2 class="title">Danh sách sinh viên đồ án</h2>
    <div class="flex-al-sp mb-30">
      <a-input-search
        v-model:value="searchStudent"
        placeholder="Tìm sinh viên"
        style="width: 400px"
        @change="onSearch"
      />
      <template v-if="isRequestAPI2">
        <div class="loading-container">
          <a-spin :indicator="indicator" />
        </div>
      </template>
      <template v-else>
        <div class="fl-cl">
          <span class="txt-bold">Tổng số sinh viên: {{ totalStudent }}</span>
          <span class="txt-bold"
            >Tổng số sinh viên đạt giỏi: {{ filterStudent.good }}</span
          >
          <span class="txt-bold"
            >Tổng số sinh viên đạt khá: {{ filterStudent.rather }}</span
          >
          <span class="txt-bold"
            >Tổng số sinh viên đạt trung bình: {{ filterStudent.medium }}</span
          >
          <span class="txt-bold"
            >Tổng số sinh viên trượt: {{ filterStudent.fall }}</span
          >
        </div>
      </template>
    </div>
    <a-button
      type="primary"
      class="btn-secondary mb-30"
      @click.prevent="exportExcel"
    >
      <VerticalAlignBottomOutlined />
      Download
    </a-button>
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
import { ACCESS_TOKEN, PAGE_SIZE_LARGE } from "../shared/constant/constant";

import {
  PlusOutlined,
  LoadingOutlined,
  VerticalAlignBottomOutlined,
} from "@ant-design/icons-vue";
import xlsx from "xlsx/dist/xlsx.full.min";

export default {
  components: {
    PlusOutlined,
    LoadingOutlined,
    VerticalAlignBottomOutlined,
  },
  setup() {
    const listStudent = ref([]);
    const filterStudent = ref({
      good: 0,
      rather: 0,
      medium: 0,
      fall: 0,
    });
    const searchStudent = ref("");
    const listTeacher = ref([]);
    const route = useRoute();
    const current = ref(1);
    const totalPage = ref(1);
    const totalStudent = ref(0);
    const id = route.params.id;
    const type = "graduation";
    const isRequestAPI = ref(false);
    const isRequestAPI2 = ref(false);

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
        title: "Điểm",
        dataIndex: "mark",
        className: "text-center",
      },
    ];
    // show modal
    const visibleModal = ref(false);
    const showModal = (record) => {
      student.value = record;
      graduation.value.graduationTopic = record.graduationTopic;
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
              `${environment.API_URL}${ENDPOINT.students.index}/statistic-graduation/${id}?page=${page}&page-size=${pageSize}`,
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
                totalStudent.value = res.data.pagination.total;
              }
            })
            .catch((err) => {
              isRequestAPI.value = false;
            });
        }
      }
    };

    const getAllStudent = () => {
      if (!isRequestAPI2.value) {
        if (getData(ACCESS_TOKEN, "")) {
          isRequestAPI2.value = true;
          const config = {
            headers: {
              Authorization: getData(ACCESS_TOKEN, ""),
            },
          };
          axios
            .get(
              `${environment.API_URL}${ENDPOINT.students.index}/statistic-graduation/${id}?page=0&page-size=${PAGE_SIZE_LARGE}`,
              config
            )
            .then((res) => {
              if (res.data.success) {
                res.data.data.map((item, index) => {
                  const mark = +item.mark;
                  mark > 8
                    ? (filterStudent.value.good += 1)
                    : mark > 7
                    ? (filterStudent.value.rather += 1)
                    : mark > 4
                    ? (filterStudent.value.medium += 1)
                    : (filterStudent.value.fall += 1);
                });
                isRequestAPI2.value = false;
              }
            })
            .catch((err) => {
              isRequestAPI2.value = false;
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
            `${environment.API_URL}${ENDPOINT.users.index}?page=0&page-size=${PAGE_SIZE_LARGE}`,
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
      getAllStudent();
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

    const exportExcel = () => {
      const data = [...listStudent.value];
      data.forEach((item) => delete item.key);
      const XLSX = xlsx;
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, "listStudent");
      XLSX.writeFile(workbook, `DSDA_${id}.xlsx`);
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
      onChange,
      getListTeacher,
      listTeacher,
      searchStudent,
      onSearch,
      isRequestAPI,
      indicator,
      visibleModal,
      showModal,
      totalStudent,
      isRequestAPI2,
      filterStudent,
      exportExcel,
    };
  },
};
</script>
