<template>
  <div class="form-intern">
    <div class="form-intern-group">
      <a-select
        show-search
        placeholder="Select a batch"
        style="width: 200px"
        :options="optionBatchs"
        @change="handleChangeBatch"
      ></a-select>
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

    <div class="form-intern-group">
      <a-select
        placeholder="Select a status"
        show-search
        style="width: 200px"
        :options="optionStatus"
        @change="handleChangeType"
      ></a-select>
    </div>

    <a-button @click.prevent="addSemester" type="primary">Submit</a-button>
  </div>
</template>
<script>
import axios from "axios";
import { ref } from "vue";
import { environment, ENDPOINT } from "../shared/config/index";
import { getData } from "../shared/common/common";
import { ACCESS_TOKEN } from "../shared/constant/constant";
import { createToast } from "mosha-vue-toastify";

export default {
  props: {
    listSemester: Array,
    current: Number,
    typeSemester: String
  },
  setup(props) {
    const internship = ref({
      semester: "",
      year: "",
      status: "",
    });

    const optionBatchs = [
      {
        value: "Đợt 1",
        label: "Đợt 1",
      },
      {
        value: "Đợt 2",
        label: "Đợt 2",
      },
      {
        value: "Đợt 3",
        label: "Đợt 3",
      },
    ];

    const optionStatus = [
      {
        value: "OPEN",
        label: "OPEN",
      },
      {
        value: "CLOSE",
        label: "CLOSE",
      },
    ];

    const addSemester = () => {
      if (
        internship.value.semester ||
        internship.value.year ||
        internship.value.status
      ) {
        if (getData(ACCESS_TOKEN, "")) {
          const data = { ...internship.value, type: props.typeSemester };
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
            })
            .catch((err) => {
              createToast("Create Failed.", {
                type: "danger",
                timeout: 1500,
              });
            });
        }
      }
    };

    const handleChangeYear = (value) => {
      internship.value.year = value.$y.toString();
    };

    const handleChangeBatch = (value) => {
      internship.value.semester = value;
    };

    const handleChangeType = (value) => {
      internship.value.status = value;
    };

    return {
      optionBatchs,
      optionStatus,
      internship,
      addSemester,
      handleChangeBatch,
      handleChangeYear,
      handleChangeType,
    };
  },
};
</script>
