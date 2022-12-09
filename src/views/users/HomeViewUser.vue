<template>
  <div class="home">
    <SideBarUser />
    <template v-if="isRequestAPI">
      <div class="loading-container">
        <a-spin :indicator="indicator" />
      </div>
    </template>
    <template v-else>
      <div class="content">
        <RouterView />
      </div>
    </template>
  </div>
</template>

<script>
import { useStudentStore } from "../../stores";
import axios from "axios";
import { ref, onMounted, h } from "vue";

import { environment, ENDPOINT } from "../../shared/config/index";
import { getData } from "../../shared/common/common";
import {
  ACCESS_TOKEN,
  PAGE_SIZE_LARGE,
  USER_INFO,
} from "../../shared/constant/constant";

import { LoadingOutlined } from "@ant-design/icons-vue";
import SideBarUser from "../../components/SideBarUser.vue";
export default {
  name: "HomeUser",
  components: {
    SideBarUser,
    LoadingOutlined,
  },
  setup() {
    const isRequestAPI = ref(false);
    const userId = ref("");
    const store = useStudentStore();
    const listInternshipId = ref([]);
    const listGraduationId = ref([]);
    const indicator = h(LoadingOutlined, {
      style: {
        fontSize: "36px",
      },
      spin: true,
    });
    const getListStudent = () => {
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
              `${environment.API_URL}${ENDPOINT.students.index}?page=0&page-size=${PAGE_SIZE_LARGE}&teacher-id=${userId.value}`,
              config
            )
            .then((res) => {
              if (res.data.success) {
                res.data.data.map((item) => {
                  listInternshipId.value.push(item.internshipId);
                  listGraduationId.value.push(item.graduationId);
                });
                
                store.addSemesterGraduation(listGraduationId.value);
                store.addSemesterInternship(listInternshipId.value);
                isRequestAPI.value = false;
              }
            })
            .catch((err) => {
              isRequestAPI.value = false;
            });
        }
      }
    };
    onMounted(() => {
      if (getData(USER_INFO, {})) {
        userId.value = getData(USER_INFO, {}).id;
        getListStudent();
      }
    });
    return {
      isRequestAPI,
      indicator,
    };
  },
};
</script>
