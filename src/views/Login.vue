<template>
  <main class="login-page">
    <form class="form">
      <div class="form-icon">
        <i class="bx bxs-user"></i>
      </div>
      <h1 class="form-heading">Login Admin</h1>
      <div class="form-group">
        <input
          type="text"
          class="form-input"
          placeholder="Username"
          v-model="username"
        />
        <div class="form-group-icon">
          <i class="bx bxs-user"></i>
        </div>
      </div>
      <p v-if="isError.name" class="form-input-error">Username is required.</p>
      <div class="form-group">
        <input
          type="password"
          class="form-input"
          placeholder="Password"
          v-model="password"
        />
        <div class="form-group-icon">
          <i class="bx bx-key"></i>
        </div>
      </div>
      <p v-if="isError.pass" class="form-input-error">Password is required.</p>
      <p v-if="error" class="form-error">{{ error }}</p>
      <button class="form-btn" @click="submitForm">Login</button>
    </form>
  </main>
</template>

<script>
import { ref, watch } from "vue";
import axios from "axios";
import { environment, ENDPOINT } from "../shared/config/index";
import { setData } from "../shared/common/common";
import { ACCESS_TOKEN } from "../shared/constant/constant";
import router from "@/router";
import { createToast } from "mosha-vue-toastify";

export default {
  name: "Login",
  setup() {
    const username = ref("");
    const password = ref("");
    const error = ref("");
    const isError = ref({ name: false, pass: false });

    watch(username, (newUsername) => {
      if (newUsername) {
        isError.value.name = false;
      }
    });

    watch(password, (newPass) => {
      if (newPass) {
        isError.value.pass = false;
      }
    });

    const submitForm = (e) => {
      e.preventDefault();
      const data = {
        name: username.value,
        password: password.value,
        role: "ADMIN",
        status: "INACTIVE",
        username: username.value,
      };
      if (username.value && password.value) {
        axios
          .post(`${environment.API_URL}${ENDPOINT.auth.login}`, data)
          .then((res) => {
            setData(ACCESS_TOKEN, res.data.data.jwt);
            createToast("Đăng nhập thành công.", {
              type: "success",
              timeout: 1500,
            });
            router.push("/home");
            error.value = "";
          })
          .catch((err) => {
            error.value = err.response.data.message;
          });
      } else {
        !username.value
          ? (isError.value.name = true)
          : (isError.value.name = false);
        !password.value
          ? (isError.value.pass = true)
          : (isError.value.pass = false);
      }
    };
    return {
      username,
      password,
      error,
      isError,
      submitForm
    }
  },
};
</script>
