<template>
  <div class="list-student">
    <h2 class="title">Đánh giá đồ án tốt nghiệp</h2>
    <div class="flex-al-sp">
      <a-input-search placeholder="Tìm đề tài" style="width: 400px" />
      <div class="btn-add">
        <a-button type="primary" @click="showDrawer"> Thêm đánh giá</a-button>
      </div>
    </div>
    <template v-if="visible">
      <FormFeedback
        v-model:visible="visible"
        :isEdit="isEdit"
        :listEvaluation="listEvaluation"
        :type="'INTERNSHIP'"
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
          :columns="columns"
          :data-source="listEvaluation"
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
                  title="Bạn muốn xóa feedback này?"
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

import { environment, ENDPOINT } from "../../shared/config/index";
import { getData } from "../../shared/common/common";
import { ACCESS_TOKEN } from "../../shared/constant/constant";

import FormFeedback from "../../components/FormFeedback.vue";
import { createToast } from "mosha-vue-toastify";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue";

export default {
  components: {
    PlusOutlined,
    LoadingOutlined,
    FormFeedback,
  },
  setup() {
    const listEvaluation = ref([]);
    const route = useRoute();
    const current = ref(1);
    const totalPage = ref(1);
    const isRequestAPI = ref(false);
    const type = "GRADUATION";
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
    const columns = [
      {
        title: "STT",
        dataIndex: "stt",
        width: "5%",
        className: "text-center",
      },
      {
        title: "Tên đề tài",
        dataIndex: "topic",
        className: "text-center",
      },
      {
        title: "Điểm",
        dataIndex: "mark",
        className: "text-center",
      },
      {
        title: "Ghi chú",
        dataIndex: "note",
        width: "35%",
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

    const visible = ref(false);

    const showDrawer = () => {
      visible.value = true;
      isEdit.value = { status: false, id: "" };
    };

    const onChange = (page, pageSize) => {
      getListEvaluation(page - 1, pageSize);
    };

    const onDelete = (key) => {
      const evaluation = listEvaluation.value.find((item) => item.key == key);
      if (!isRequestAPI.value) {
        if (getData(ACCESS_TOKEN, "")) {
          isRequestAPI.value = true;
          const config = {
            headers: {
              Authorization: getData(ACCESS_TOKEN, ""),
            },
          };
          axios
            .delete(
              `${environment.API_URL}${ENDPOINT.evaluations.index}/${evaluation.id}`,
              config
            )
            .then((res) => {
              if (res.data.success) {
                createToast(res.data.message, {
                  type: "success",
                  timeout: 1500,
                });
                listEvaluation.value = listEvaluation.value.filter(
                  (item) => item.key !== key
                );
                isRequestAPI.value = false;
              }
            })
            .catch((err) => {
              createToast("Delete failed.", {
                type: "danger",
                timeout: 1500,
              });
              isRequestAPI.value = false;
            });
        }
      }
    };

    const getListEvaluation = (page, pageSize) => {
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
              `${environment.API_URL}${ENDPOINT.evaluations.type}?page=${page}&page-size=${pageSize}&type=${type}`,
              config
            )
            .then((res) => {
              if (res.data.success) {
                listEvaluation.value = res.data.data.map((item, index) => ({
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
            });
        }
      }
    };

    const edit = (record) => {
      visible.value = true;
      isEdit.value = { status: true, id: record.id };
    };

    onMounted(() => {
      getListEvaluation(0, 10);
    });

    return {
      columns,
      route,
      current,
      totalPage,
      isRequestAPI,
      onChange,
      indicator,
      listEvaluation,
      isEdit,
      visible,
      showDrawer,
      onDelete,
      edit
    };
  },
};
</script>
