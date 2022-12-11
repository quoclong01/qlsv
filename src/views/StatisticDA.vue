<template>
  <div class="class-manager">
    <h2 class="title">Thông kê đợt đồ án tốt nghiệp</h2>
    <div class="form-class-header">
      <div class="form-intern">
        <div class="form-intern-group">
          <a-input
            placeholder="Nhập tên đợt"
            v-model:value="searchSemester.semester"
          ></a-input>
        </div>
        <div class="form-intern-group">
          <a-space direction="vertical" :size="12">
            <a-date-picker
              style="width: 200px"
              picker="year"
              @change="handleChangeYear"
            />
          </a-space>
        </div>
        <a-button @click.prevent="handleSearchSemester" type="primary"
          >Search</a-button
        >
      </div>
    </div>
    <template v-if="isRequestAPI">
      <div class="loading-container">
        <a-spin :indicator="indicator" />
      </div>
    </template>
    <template v-else>
      <div class="class-manager-table">
        <a-table
          :columns="columns"
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
                <a-button type="primary" class="btn-secondary"
                  ><router-link
                    :to="{
                      name: 'statisticStudentDA',
                      params: { id: record.id },
                    }"
                    >Danh sách sinh viên</router-link
                  ></a-button
                >
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

import { environment, ENDPOINT } from "../shared/config/index";
import { getData } from "../shared/common/common";
import { ACCESS_TOKEN, optionStatus } from "../shared/constant/constant";

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
    const searchSemester = ref({
      year: "",
      semester: "",
    });
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
        title: "Đợt",
        dataIndex: "semester",
        width: "22%",
        className: "text-center",
      },
      {
        title: "Năm học",
        dataIndex: "year",
        width: "22%",
        className: "text-center",
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        width: "22%",
        className: "text-center",
      },
      {
        title: "Chức năng",
        dataIndex: "operation",
        width: "22%",
        className: "text-center",
      },
    ];

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
              `${environment.API_URL}${ENDPOINT.semesters.index}?page=${page}&page-size=${pageSize}&status=CLOSE&type=GRADUATION`,
              config
            )
            .then((res) => {
              if (res.data.success) {
                listSemester.value = res.data.data.map((item, index) => ({
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
              listSemester.value = [];
            });
        }
      }
    };

    onMounted(() => {
      getListSemeters(0, 10);
    });

    const onChange = (page, pageSize) => {
      getListSemeters(page - 1, pageSize);
    };

    const handleChangeYear = (value) => {
      if (value) {
        searchSemester.value.year = value.$y.toString();
      } else {
        searchSemester.value.year = "";
      }
    };

    const handleSearchSemester = () => {
      getSemesterByStatusAndYear(0, 10);
    };

    const getSemesterByStatusAndYear = (page, pageSize) => {
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
                ENDPOINT.semesters.search
              }?page=${page}&page-size=${pageSize}&type=GRADUATION${
                searchSemester.value.year
                  ? `&year=${searchSemester.value.year}`
                  : ""
              }&status=CLOSE${
                searchSemester.value.semester
                  ? `&semester=${searchSemester.value.semester}`
                  : ""
              }`,
              config
            )
            .then((res) => {
              if (res.data.success) {
                listSemester.value = res.data.data.map((item, index) => ({
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

    return {
      columns,
      listSemester,
      current,
      onChange,
      totalPage,
      handleChangeYear,
      handleSearchSemester,
      searchSemester,
      optionStatus,
      isRequestAPI,
      indicator,
    };
  },
}; //export
</script>
