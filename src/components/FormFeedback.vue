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
            <a-form-item label="Tên đề tài" name="topic">
              <a-input
                v-model:value="feedback.topic"
                placeholder="Nhập tên đề tài"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Điểm" name="mark">
              <a-input v-model:value="feedback.mark" placeholder="Nhập điểm" />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="Ghi chú" name="note">
              <a-textarea
                v-model:value="feedback.note"
                placeholder="Nhập ghi chú"
                :rows="6"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <template #extra>
        <a-space>
          <a-button
            v-if="isEdit.status"
            type="primary"
            @click.prevent="editEvaluation"
            >Edit</a-button
          >
          <a-button v-else type="primary" @click.prevent="addEvaluation"
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
import { useRoute } from "vue-router";

import { environment, ENDPOINT } from "../shared/config/index";
import { getData, getDataById } from "../shared/common/common";
import { ACCESS_TOKEN } from "../shared/constant/constant";

import { createToast } from "mosha-vue-toastify";

export default {
  props: {
    visible: Boolean,
    isEdit: Object,
    listEvaluation: Array,
    type: String,
    current: Number,
  },
  setup(props, { emit }) {
    const isVisible = toRef(props, "visible");
    const isEdit = toRef(props, "isEdit");
    const route = useRoute();
    const listEvaluation = toRef(props, "listEvaluation");
    const type = toRef(props, "type");
    const id = route.params.id;
    const feedback = ref({
      id: '',
      mark: "",
      note: "",
      studentId: +id,
      topic: "",
      type: type.value,
    });

    const onClose = () => {
      emit("update:visible", false);
    };

    const addEvaluation = () => {
      if (getData(ACCESS_TOKEN, "")) {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: getData(ACCESS_TOKEN, ""),
          },
        };
        axios
          .post(
            `${environment.API_URL}${ENDPOINT.evaluations.index}`,
            JSON.stringify(feedback.value),
            config
          )
          .then((res) => {
            if (res.data.success) {
              createToast(res.data.message, {
                type: "success",
                timeout: 1500,
              });
              props.listEvaluation.push({
                ...res.data.data,
                key: (
                  props.listEvaluation.length +
                  (props.current - 1) * 10
                ).toString(),
                stt: props.listEvaluation.length + (props.current - 1) * 10,
              });
              feedback.value = {
                mark: "",
                note: "",
                studentId: id,
                topic: "",
                type: type.value,
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

    const editEvaluation = () => {
      if (getData(ACCESS_TOKEN, "")) {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: getData(ACCESS_TOKEN, ""),
          },
        };
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
              const evaluationIdx = props.listEvaluation.findIndex(
                (item) => item.id === res.data.data.id
              );
              const evaluationEl = props.listEvaluation[evaluationIdx];
              props.listEvaluation[evaluationIdx] = {
                ...evaluationEl,
                ...res.data.data
              };
              emit("update:visible", false);
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

    const getEvanluationById = (id) => {
      if (getData(ACCESS_TOKEN, "")) {
        const config = {
          headers: {
            Authorization: getData(ACCESS_TOKEN, ""),
          },
        };
        axios
          .get(`${environment.API_URL}${ENDPOINT.evaluations.index}/${id}`, config)
          .then((res) => {
            if (res.data.success) {
              feedback.value = {
                ...res.data.data,
              };
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    onMounted(() => {
      if (isEdit.value.id) {
        getEvanluationById(isEdit.value.id);
      }
    });

    return {
      getEvanluationById,
      onClose,
      feedback,
      isEdit,
      isVisible,
      listEvaluation,
      addEvaluation,
      editEvaluation,
    };
  },
};
</script>
