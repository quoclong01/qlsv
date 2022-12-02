<template>
  <form class="form-account">
    <table class="form-account-table">
      <tr>
        <td><label for="username">Tài khoản:</label></td>
        <td>
          <div class="form-account-group">
            <a-input
              id="username"
              class="form-account-input"
              v-model:value="account.username"
            />
          </div>
        </td>
      </tr>
      <tr>
        <td><label for="password">Mật khẩu:</label></td>
        <td>
          <div class="form-account-group">
            <a-input
              id="password"
              class="form-account-input"
              type="password"
              v-model:value="account.password"
            />
          </div>
        </td>
      </tr>
      <tr>
        <td><label for="role">Loại:</label></td>
        <td>
          <div class="form-account-group">
            <a-select
              name="role"
              id="role"
              v-model:value="account.role"
              class="form-account-input"
              style="text-align: left"
            >
              <a-select-option value="ADMIN">ADMIN</a-select-option>
              <a-select-option value="TEACHER">TEACHER</a-select-option>
            </a-select>
          </div>
        </td>
      </tr>
    </table>
    <a-button type="primary" size="large" class="btn-account" @click="addUser"
      >Thêm tài khoản</a-button
    >
  </form>
</template>

<script>
import { ref } from "vue";
import { environment, ENDPOINT } from "../shared/config/index";
import { getData } from "../shared/common/common";
import { ACCESS_TOKEN } from "../shared/constant/constant";
import axios from "axios";
import { createToast } from "mosha-vue-toastify";

export default {
  props: {
    listAccount: Array,
    current: Number
  },
  setup(props) {
    const account = ref({
      username: "",
      password: "",
      role: "",
    });

    const addUser = (e) => {
      e.preventDefault();
      if (getData(ACCESS_TOKEN, "")) {
        const data = {
          ...account.value,
          name: account.value.username,
        };
        const config = {
          headers: {
            Authorization: getData(ACCESS_TOKEN, ""),
          },
        };
        if (
          account.value.username ||
          account.value.password ||
          account.value.role
        ) {
          axios
            .post(`${environment.API_URL}${ENDPOINT.users.index}`, data, config)
            .then((res) => {
              if (res.data.success) {
                createToast(res.data.message, {
                  type: "success",
                  timeout: 1500,
                });
                props.listAccount.push({
                  key: (props.listAccount.length + ((props.current - 1) * 10)).toString(),
                  stt: (props.listAccount.length + ((props.current - 1) * 10)),
                  ...res.data.data
                });
                account.value = {
                  username: "",
                  password: "",
                  role: "",
                };
              } else {
                createToast(res.data.message, {
                  type: "danger",
                  timeout: 1500,
                });
              }
            })
            .catch((err) => {
              createToast(err.message, {
                type: "danger",
                timeout: 1500,
              });
            });
        }
      }
    };

    return {
      account,
      addUser,
    };
  },
};
</script>
