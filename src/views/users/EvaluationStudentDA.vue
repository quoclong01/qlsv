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
                <a-button type="danger" @click="showModal(record.id)">
                  Đánh giá
                </a-button>
                <a-modal
                  v-model:visible="visibleModal"
                  title="Bảng đánh giá"
                  @ok="handleOk"
                  @cancel="handleCancel"
                >
                  <template #footer>
                    <a-button key="back" @click="handleCancel">Cancel</a-button>
                    <template v-if="isEdit.showInput">
                      <a-button type="danger" @click="handleEdit"
                        >Edit</a-button
                      >
                    </template>
                    <template v-else>
                      <a-button key="submit" type="primary" @click="handleOk"
                        >Ok</a-button
                      >
                    </template>
                  </template>
                  <a-form layout="vertical">
                    <a-row :gutter="16">
                      <a-col :span="12">
                        <a-form-item label="Tên đề tài" name="topic">
                          <a-input
                            placeholder="Nhập tên đề tài"
                            v-model:value="feedback.topic"
                            :disabled="isEdit.showInput"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col :span="12">
                        <a-form-item label="Điểm" name="mark">
                          <a-input
                            placeholder="Nhập điểm"
                            v-model:value="feedback.mark"
                            :disabled="isEdit.showInput"
                          />
                        </a-form-item>
                      </a-col>
                      <a-col :span="24">
                        <a-form-item label="Ghi chú" name="note">
                          <a-textarea
                            v-model:value="feedback.note"
                            placeholder="Nhập ghi chú"
                            :rows="6"
                            :disabled="isEdit.showInput"
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </a-form>
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
import { createToast } from "mosha-vue-toastify";

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

    const visibleModal = ref(false);
    const isEdit = ref({
      status: false,
      showInput: false,
    });

    const showModal = (id) => {
      getEvanluationById(id);
    };

    const feedback = ref({
      id: "",
      mark: "",
      note: "",
      studentId: "",
      topic: "",
      type: "GRADUATION",
    });

    const resetData = () => {
      feedback.value = {
        id: "",
        mark: "",
        note: "",
        studentId: "",
        topic: "",
        type: "GRADUATION",
      };
      isEdit.value = {
        status: false,
        showInput: false,
      };
    };

    const handleOk = () => {
      if (!isRequestAPI.value) {
        if (getData(ACCESS_TOKEN, "")) {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: getData(ACCESS_TOKEN, ""),
            },
          };
          isRequestAPI.value = true;
          if (!isEdit.value.status) {
            const data = { ...feedback.value };
            delete data.id;
            axios
              .post(
                `${environment.API_URL}${ENDPOINT.evaluations.index}`,
                JSON.stringify(data),
                config
              )
              .then((res) => {
                if (res.data.success) {
                  createToast(res.data.message, {
                    type: "success",
                    timeout: 1500,
                  });
                  visibleModal.value = false;
                  isRequestAPI.value = false;
                  resetData();
                }
              })
              .catch((err) => {
                isRequestAPI.value = false;
                createToast("Added failed.", {
                  type: "danger",
                  timeout: 1500,
                });
              });
          } else {
            axios
              .put(
                `${environment.API_URL}${ENDPOINT.evaluations.index}/${feedback.value.id}`,
                JSON.stringify(feedback.value),
                config
              )
              .then((res) => {
                if (res.data.success) {
                  createToast(res.data.message, {
                    type: "success",
                    timeout: 1500,
                  });
                  visibleModal.value = false;
                  isRequestAPI.value = false;
                  resetData();
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
      }
    };

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

    const getEvanluationById = (id) => {
      if (getData(ACCESS_TOKEN, "")) {
        const config = {
          headers: {
            Authorization: getData(ACCESS_TOKEN, ""),
          },
        };
        axios
          .get(
            `${environment.API_URL}${ENDPOINT.evaluations.student}/${id}?type=GRADUATION`,
            config
          )
          .then((res) => {
            if (res.data.success) {
              feedback.value = {
                ...res.data.data,
              };
              isEdit.value = {
                status: true,
                showInput: true,
              };
              visibleModal.value = true;
            } else {
              feedback.value.studentId = id;
              visibleModal.value = true;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    const handleCancel = () => {
      visibleModal.value = false;
      resetData();
    };

    const handleEdit = () => {
      isEdit.value.showInput = false;
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
      visibleModal,
      showModal,
      handleOk,
      feedback,
      isEdit,
      handleCancel,
      handleEdit,
    };
  },
};
</script>
