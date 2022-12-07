<template>
  <div class="class-manager">
    <h2 class="title mb-30">Đánh giá thực tập tốt nghiệp</h2>
    <template v-if="isRequestAPI || isRequestAPI1">
      <div class="loading-container">
        <a-spin :indicator="indicator" />
      </div>
    </template>
    <template v-else>
      <div class="class-manager-table">
        <a-table
          :columns="columnSemester"
          :data-source="listSemester"
          class="table-wrapper"
          :pagination="false"
          bordered
        >
          <template #bodyCell="{ column, text, record }">
            <template v-if="column.dataIndex === 'status'">
              <div v-if="text == 'OPEN'">
                <a-badge status="success" />
                Mở
              </div>
              <div v-else>
                <a-badge status="error" />
                Đóng
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'operation'">
              <div class="editable-row-group">
                <div class="editable-row-operations">
                  <a-button type="primary">
                    <router-link
                      :to="{
                        name: 'EvaluationStudentDA',
                        params: { id: record.id },
                      }"
                      >Xem sinh viên</router-link
                    >
                  </a-button>
                </div>
              </div>
            </template>
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
import { useStudentStore } from "../../stores/teacher";

import { environment, ENDPOINT } from "../../shared/config/index";
import { getData } from "../../shared/common/common";
import {
  ACCESS_TOKEN,
  columnSemester,
  USER_INFO,
} from "../../shared/constant/constant";

import { LoadingOutlined } from "@ant-design/icons-vue";

export default {
  components: {
    LoadingOutlined,
  },
  setup() {
    const listSemester = ref([]);
    const current = ref(1);
    const totalPage = ref(1);
    const isRequestAPI = ref(false);
    const isRequestAPI1 = ref(false);
    const userId = ref("");
    const store = useStudentStore();
    const listGraduationId = store.getListSemesterGraduation;

    const indicator = h(LoadingOutlined, {
      style: {
        fontSize: "36px",
      },
      spin: true,
    });

    const getListSemeters = (page, pageSize) => {
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
              `${environment.API_URL}${ENDPOINT.semesters.type}?page=${page}&page-size=${pageSize}&type=GRADUATION`,
              config
            )
            .then((res) => {
              if (res.data.success) {
                const newlistGraduationId = [...new Set(listGraduationId)];
                listSemester.value = res.data.data
                  .filter((item) => newlistGraduationId.includes(item.id))
                  .map((item, index) => ({
                    key: (index + (current.value - 1) * 10).toString(),
                    stt: index + (current.value - 1) * 10,
                    ...item,
                  }));

                totalPage.value = res.data.pagination.total_page;
                isRequestAPI.value = false;
              }
            })
            .catch((err) => {
              isRequestAPI.value = false;
              listSemester.value = [];
            });
        }
      }
    };
    onMounted(() => {
      if (getData(USER_INFO, {})) {
        userId.value = getData(USER_INFO, {}).id;
      }
      getListSemeters(0, 10);
    });

    const onChange = (page, pageSize) => {
      getListSemeters(page - 1, pageSize);
    };

    return {
      listSemester,
      current,
      onChange,
      totalPage,
      isRequestAPI,
      indicator,
      columnSemester,
      isRequestAPI1,
    };
  },
}; //export
</script>
