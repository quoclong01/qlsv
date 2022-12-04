<template>
  <div class="sidebarusers">
    <h1 class="sidebar-title">HUCE Manager</h1>
    <div class="sidebar-menu">
      <router-link
        to="/evaluationtt"
        active-class="active"
        tag="button"
        class="side-btn"
      >
        <p class="sidebar-link">Đánh giá thực tập tốt nghiệp</p>
      </router-link>

      <router-link
        to="/evaluationda"
        active-class="active"
        tag="button"
        class="side-btn"
      >
        <p class="sidebar-link">Đánh giá đồ án tốt nghiệp</p>
      </router-link>
      <button
        class="side-btn"
        style="text-align: left"
        @click.prevent="handleSignOut"
      >
        <p class="sidebar-link">Đăng xuất</p>
      </button>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { getData } from "../shared/common/common";
import { ACCESS_TOKEN } from "../shared/constant/constant";

export default {
  setup() {
    const route = useRouter();
    const handleSignOut = () => {
      if (getData(ACCESS_TOKEN, "")) {
        localStorage.removeItem(ACCESS_TOKEN);
        route.push("/");
      }
    };
    return {
      handleSignOut,
    };
  },
};
</script>
