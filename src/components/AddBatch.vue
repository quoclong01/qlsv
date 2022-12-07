<template>
  <div class="form-intern">
    <a-button type="primary" @click="showDrawer">
      <PlusOutlined />
      <template v-if="typeSemester === 'INTERNSHIP'">
        Thêm đợt thực tập
      </template>
      <template v-else> Thêm đợt đồ án </template>
    </a-button>
    <a-drawer
      :visible="visible"
      :width="800"
      :body-style="{ paddingBottom: '80px' }"
      :footer-style="{ textAlign: 'right' }"
      @close="onClose"
    >
      <a-form layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Đợt" name="semester">
              <a-input
                v-model:value="semesters.semester"
                placeholder="Nhập đợt thực tập"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Năm học" name="year">
              <a-date-picker
                style="width: 100%"
                picker="year"
                @change="handleChangeYear"
                placeholder="Chọn năm học"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Trạng thái" name="year">
              <a-select
                placeholder="Chọn trạng thái"
                show-search
                :options="optionStatus"
                @change="handleChangeType"
              ></a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <template #extra>
        <a-space>
          <a-button type="primary" @click="addSemester">Thêm</a-button>
        </a-space>
      </template>
    </a-drawer>
  </div>
</template>
<script>
import axios from "axios";
import { ref, toRef } from "vue";

import { environment, ENDPOINT } from "../shared/config/index";
import { getData } from "../shared/common/common";
import { ACCESS_TOKEN, optionStatus } from "../shared/constant/constant";

import { createToast } from "mosha-vue-toastify";
import { PlusOutlined } from "@ant-design/icons-vue";

export default {
  components: {
    PlusOutlined,
  },
  props: {
    listSemester: Array,
    current: Number,
    typeSemester: String,
  },
  setup(props) {
    const typeSemester = toRef(props, 'typeSemester');
    const semesters = ref({
      semester: "",
      year: "",
      status: "",
    });
    const visible = ref(false);

    const showDrawer = () => {
      visible.value = true;
    };

    const onClose = () => {
      visible.value = false;
    };

    const addSemester = () => {
      if (getData(ACCESS_TOKEN, "")) {
        const data = { ...semesters.value, type: props.typeSemester };
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: getData(ACCESS_TOKEN, ""),
          },
        };
        axios
          .post(
            `${environment.API_URL}${ENDPOINT.semesters.index}`,
            JSON.stringify(data),
            config
          )
          .then((res) => {
            if (res.data.success) {
              createToast(res.data.message, {
                type: "success",
                timeout: 1500,
              });
              props.listSemester.push({
                key: (
                  props.listSemester.length +
                  (props.current - 1) * 10
                ).toString(),
                stt: props.listSemester.length + (props.current - 1) * 10,
                ...res.data.data,
              });
              visible.value = false;
            }
          })
          .catch((err) => {
            createToast("Create Failed.", {
              type: "danger",
              timeout: 1500,
            });
          });
      }
    };

    const handleChangeYear = (value) => {
      semesters.value.year = value.$y.toString();
    };

    const handleChangeType = (value) => {
      semesters.value.status = value;
    };

    return {
      optionStatus,
      semesters,
      addSemester,
      handleChangeYear,
      handleChangeType,
      visible,
      showDrawer,
      onClose,
      typeSemester,
    };
  },
};
</script>
