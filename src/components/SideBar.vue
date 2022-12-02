<template>
  <div class="sidebar">
    <h1 class="sidebar-title">Manager</h1>

    <div class="sidebar-menu">
      <router-link
        to="/accountmanager"
        active-class="active"
        tag="button"
        class="side-btn"
      >
        <p class="sidebar-link">Quản lý tài khoản</p>
      </router-link>

      <router-link
        to="/classmanager"
        active-class="active"
        tag="button"
        class="side-btn"
      >
        <p class="sidebar-link">Quản lý đợt thực tập</p>
      </router-link>

      <router-link
        to="/listdoan"
        active-class="active"
        tag="button"
        class="side-btn"
      >
        <p class="sidebar-link">Quản lý đợt đồ án tốt nghiệp</p>
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
