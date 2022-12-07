<template>
  <div>
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
            <a-form-item label="Tài khoản" name="username">
              <a-input
                v-model:value="account.username"
                placeholder="Nhập tài khoản"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Mật khẩu" name="password">
              <a-input-password
                v-model:value="account.password"
                placeholder="Nhập mật khẩu"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Họ và tên" name="name">
              <a-input
                v-model:value="account.name"
                placeholder="Nhập họ và tên"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Chức năng" name="role">
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
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <template #extra>
        <a-space>
          <a-button type="primary" @click="addUser">Thêm</a-button>
        </a-space>
      </template>
    </a-drawer>
    <a-button type="primary" class="btn-add" @click="showDrawer"
      >Thêm tài khoản</a-button
    >
  </div>
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
    current: Number,
  },
  setup(props) {
    const account = ref({
      username: "",
      password: "",
      name: "",
      role: "",
    });
    const visible = ref(false);
    const showDrawer = () => {
      visible.value = true;
    };

    const onClose = () => {
      visible.value = false;
    };
    const addUser = (e) => {
      e.preventDefault();
      if (getData(ACCESS_TOKEN, "")) {
        const data = {
          ...account.value,
        };
        const config = {
          headers: {
            Authorization: getData(ACCESS_TOKEN, ""),
          },
        };
        if (
          account.value.username ||
          account.value.password ||
          account.value.name
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
                  key: (
                    props.listAccount.length +
                    (props.current - 1) * 10
                  ).toString(),
                  stt: props.listAccount.length + (props.current - 1) * 10,
                  ...res.data.data,
                });
                account.value = {
                  username: "",
                  password: "",
                  role: "",
                  name: "",
                };
                visible.value = false;
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
      visible,
      showDrawer,
      onClose,
    };
  },
};
</script>
