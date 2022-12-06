<template>
  <div class="list-student">
    <h2 class="title">Danh sách sinh viên đồ án</h2>
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
          <template #operation="{ record }">
            <div class="editable-row-group">
              <div class="editable-row-operations">
                <a-button type="danger">
                  <router-link
                    :to="{
                      name: 'EvaluationFeedbackDA',
                      params: { id: record.id },
                    }"
                    >Đánh giá</router-link
                  ></a-button
                >
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

import { environment, ENDPOINT } from "../../shared/config/index";
import { getData } from "../../shared/common/common";
import { ACCESS_TOKEN, USER_INFO } from "../../shared/constant/constant";

import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue";

export default {
  components: {
    PlusOutlined,
    LoadingOutlined,
  },
  setup() {
    const listStudent = ref([]);
    const semester = ref({});
    const route = useRoute();
    const current = ref(1);
    const totalPage = ref(1);
    const id = route.params.id;
    const isRequestAPI = ref(false);
    const isRequestAPIs = ref(false);
    const userId = ref("");
    const type = "graduation";

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
        title: "Chức năng",
        dataIndex: "operation",
        className: "text-center",
        slots: {
          customRender: "operation",
        },
      },
    ];

    const onChange = (page, pageSize) => {
      getListStudent(page - 1, pageSize);
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
              `${environment.API_URL}${ENDPOINT.students.index}?${type}-id=${id}&page=${page}&page-size=${pageSize}&teacher-id=${userId.value}`,
              config
            )
            .then((res) => {
              if (res.data.success) {
                listStudent.value = res.data.data.map((item, index) => ({
                  key: (index + (current.value - 1) * 10).toString(),
                  stt: index + (current.value - 1) * 10,
                  ...item,
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

    onMounted(() => {
      if (getData(USER_INFO, {})) {
        userId.value = getData(USER_INFO, {}).id;
      }
      getSemeterById();
      getListStudent(0, 10);
    });

    return {
      columns,
      route,
      id,
      current,
      totalPage,
      isRequestAPI,
      onChange,
      indicator,
      listStudent,
      isRequestAPIs,
    };
  },
};
</script>
