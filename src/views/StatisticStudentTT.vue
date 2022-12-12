<template>
  <div class="list-student">
    <h2 class="title">Danh sách sinh viên thực tập</h2>
    <div class="flex-al-sp" style="margin-bottom: 50px">
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
    <template v-if="isRequestAPIs || isRequestAPI">
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
import { getData } from "../shared/common/common";
import { ACCESS_TOKEN, PAGE_SIZE_LARGE } from "../shared/constant/constant";

import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue";

export default {
  components: {
    PlusOutlined,
    LoadingOutlined,
  },
  setup() {
    const listStudent = ref([]);
    const filterStudent = ref({
      good: 0,
      rather: 0,
      medium: 0,
      fall: 0,
    });
    const semester = ref();
    const route = useRoute();
    const current = ref(1);
    const totalPage = ref(1);
    const totalStudent = ref(0);
    const id = route.params.id;
    const isRequestAPI = ref(false);
    const isRequestAPIs = ref(false);
    const isRequestAPI2 = ref(false);
    const searchStudent = ref("");
    const internshipPlace = ref("");
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
        title: "Điểm",
        dataIndex: "mark",
        className: "text-center",
      },
    ];

    const visibleModal = ref(false);
    const showModal = (record) => {
      student.value = record;
      internshipPlace.value = record.internshipPlace;
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
              `${environment.API_URL}${ENDPOINT.students.index}/statistic-internship/${id}?page=${page}&page-size=${pageSize}`,
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
                totalStudent.value = res.data.pagination.total;
              }
            })
            .catch((err) => {
              isRequestAPI.value = false;
              listStudent.value = [];
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
              `${environment.API_URL}${ENDPOINT.students.index}/statistic-internship/${id}?page=0&page-size=${PAGE_SIZE_LARGE}`,
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

    onMounted(() => {
      getSemeterById();
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
              }?internship-id=${id}&page=${page}&page-size=${pageSize}${
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
      getListStudent,
      current,
      totalPage,
      isRequestAPI,
      isRequestAPIs,
      onChange,
      searchStudent,
      onSearch,
      indicator,
      visibleModal,
      showModal,
      internshipPlace,
      semester,
      totalStudent,
      filterStudent,
      isRequestAPI2,
    };
  },
};
</script>
