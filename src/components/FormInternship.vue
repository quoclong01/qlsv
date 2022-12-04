<template>
  <a-drawer
    :visible="isVisible"
    :width="1000"
    :footer-style="{ textAlign: 'right' }"
    @close="onClose"
  >
    <template v-if="isRequestAPI">
      <div class="loading-container">
        <a-spin :indicator="indicator" />
      </div>
    </template>
    <template v-else>
      <div class="list-student-table">
        <h2 class="title">Danh sách sinh viên</h2>
        <a-table
          :columns="columnStudentIntership"
          :data-source="listStudentInternship"
          class="table-wrapper"
          :pagination="false"
          bordered
        >
          <template #operation="{ record }">
            <div class="editable-row-group">
              <div class="editable-row-operations">
                <a-button type="primary" @click="showModal">Thêm</a-button>
                <a-modal
                  v-model:visible="visibleModal"
                  title="Nơi thực tập"
                  @ok="handleOk(record)"
                >
                  <a-input
                    placeholder="Nhập"
                    v-model:value="internshipPlace"
                  ></a-input>
                </a-modal>
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
  </a-drawer>
</template>

<script>
import axios from "axios";
import { ref, onMounted, h, toRef } from "vue";
import { useRoute } from "vue-router";

import { environment, ENDPOINT } from "../shared/config/index";
import { getData } from "../shared/common/common";
import {
  ACCESS_TOKEN,
  columnStudentIntership,
  PAGE_SIZE_LARGE,
} from "../shared/constant/constant";

import { createToast } from "mosha-vue-toastify";
import { LoadingOutlined } from "@ant-design/icons-vue";

import FormStudent from "../components/FormStudent.vue";

export default {
  components: {
    FormStudent,
    LoadingOutlined,
  },
  props: {
    visible: Boolean,
    listStudent: Array,
    current: Number,
  },
  setup(props, { emit }) {
    const isVisible = toRef(props, "visible");
    const listStudentInternship = ref([]);
    const route = useRoute();
    const current = ref(1);
    const totalPage = ref(1);
    const type = route.params.type;
    const id = route.params.id;
    const isRequestAPI = ref(false);
    const internshipPlace = ref("");

    const indicator = h(LoadingOutlined, {
      style: {
        fontSize: "36px",
      },
      spin: true,
    });
    const visibleModal = ref(false);
    const showModal = () => {
      visibleModal.value = true;
    };

    const handleOk = (student) => {
      if (!isRequestAPI.value) {
        if (getData(ACCESS_TOKEN, "")) {
          isRequestAPI.value = true;
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: getData(ACCESS_TOKEN, ""),
            },
          };
          const data = {
            ...student,
            internshipPlace: internshipPlace.value,
            internshipId: id,
          };
          delete data.key;
          delete data.stt;
          axios
            .put(
              `${environment.API_URL}${ENDPOINT.students.index}/${student.id}`,
              JSON.stringify(data),
              config
            )
            .then((res) => {
              if (res.data.success) {
                createToast("Thêm thành công", {
                  type: "success",
                  timeout: 1500,
                });
                props.listStudent.push({
                  key: (
                    props.listStudent.length +
                    (props.current - 1) * 10
                  ).toString(),
                  stt: props.listStudent.length + (props.current - 1) * 10,
                  ...res.data.data,
                });
                listStudentInternship.value = listStudentInternship.value.filter(
                  (item) => item.id !== student.id
                );

                isRequestAPI.value = false;
                visibleModal.value = false;
              }
            })
            .catch((err) => {
              isRequestAPI.value = false;
              createToast("Update failed.", {
                type: "danger",
                timeout: 1500,
              });
            });
        }
      }
    };
    const onClose = () => {
      emit("update:visible", false);
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
              `${environment.API_URL}${ENDPOINT.students.index}?page=${page}&page-size=${pageSize}`,
              config
            )
            .then((res) => {
              if (res.data.success) {
                listStudentInternship.value = res.data.data
                  .filter((item) => item.internshipId != id)
                  .map((item, index) => ({
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

    onMounted(() => {
      getListStudent(0, 10);
    });

    const onChange = (page, pageSize) => {
      getListStudent(page - 1, pageSize);
    };

    return {
      listStudentInternship,
      route,
      type,
      getListStudent,
      current,
      totalPage,
      isRequestAPI,
      indicator,
      isVisible,
      onClose,
      id,
      onChange,
      columnStudentIntership,
      visibleModal,
      showModal,
      handleOk,
      internshipPlace,
    };
  },
};
</script>