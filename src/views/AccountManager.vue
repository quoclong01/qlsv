<template>
  <div class="account-manager">
    <h2 class="title">Quản lý tài khoản</h2>
    <div class="flex-al-sp">
      <a-input-search
        v-model:value="searchUser"
        placeholder="Tìm tài khoản"
        style="width: 400px"
        @change="onSearch"
      />
      <AddAccount :listAccount="listAccount" :current="current" />
    </div>
    <div class="account-manager-content">
      <a-table
        class="table-wrapper"
        :columns="columns"
        :data-source="listAccount"
        :pagination="false"
        bordered
      >
        <template
          v-for="col in ['username', 'password', 'role']"
          #[col]="{ text, record }"
          :key="col"
        >
          <div>
            <a-input
              v-if="editableData[record.key]"
              v-model:value="editableData[record.key][col]"
              style="margin: -5px 0"
            />
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template #operation="{ record }">
          <div class="editable-row-group">
            <div class="editable-row-operations">
              <div class="editable-row-group">
                <a-button type="primary" @click="showModal(record)"
                  >Đổi mật khẩu
                </a-button>
                <a-modal
                  v-model:visible="visibleModal"
                  title="Thay đổi mật khẩu"
                  @ok="handleOk"
                >
                  <a-input-password
                    placeholder="Mậu khẩu cũ"
                    v-model:value="password.old_password"
                    style="margin-bottom: 20px"
                  ></a-input-password>
                  <a-input-password
                    placeholder="Mậu khẩu mới"
                    v-model:value="password.new_password"
                  ></a-input-password>
                </a-modal>
              </div>
            </div>
            <div class="editable-row-operations">
              <a-popconfirm
                title="Bạn muốn xóa tài khoản?"
                @confirm="onDelete(record.key)"
              >
                <a-button type="danger">Xóa</a-button>
              </a-popconfirm>
            </div>
          </div>
        </template>
      </a-table>
    </div>
    <a-pagination
      :total="totalPage * 10"
      v-model:current="current"
      @change="onChange"
      style="margin-top: 30px; display: flex; justify-content: right"
    >
    </a-pagination>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted } from "vue";

import { environment, ENDPOINT } from "../shared/config/index";
import { getData } from "../shared/common/common";
import { ACCESS_TOKEN } from "../shared/constant/constant";

import AddAccount from "../components/AddAccount.vue";
import { createToast } from "mosha-vue-toastify";

export default {
  components: {
    AddAccount,
  },

  setup() {
    const totalPage = ref(1);
    const listAccount = ref([]);
    const current = ref(1);
    const isRequestAPI = ref(false);
    const searchUser = ref("");
    const password = ref({
      id: "",
      new_password: "",
      old_password: "",
    });

    // show modal change password
    const visibleModal = ref(false);
    const showModal = (user) => {
      password.value.id = user.id;
      visibleModal.value = true;
    };
    const handleOk = () => {
      if (!isRequestAPI.value) {
        if (getData(ACCESS_TOKEN, "")) {
          isRequestAPI.value = true;
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: getData(ACCESS_TOKEN, ""),
            },
          };
          const data = { ...password.value };
          delete data.id;
          axios
            .put(
              `${environment.API_URL}${ENDPOINT.auth.changePass}/${password.value.id}`,
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
                password.value = {
                  id: "",
                  new_password: "",
                  old_password: "",
                };
              } else {
                createToast(res.data.message, {
                  type: "danger",
                  timeout: 1500,
                });
              }
            })
            .catch((err) => {
              createToast("Update failed.", {
                type: "danger",
                timeout: 1500,
              });
            });
        }
      }
    };

    const columns = [
      {
        title: "STT",
        dataIndex: "stt",
        width: "5%",
        className: "text-center",
      },
      {
        title: "Tài khoản",
        dataIndex: "username",
        width: "30%",
        className: "text-center",
      },
      {
        title: "Loại",
        dataIndex: "role",
        width: "30%",
        className: "text-center",
      },
      {
        title: "Chức năng",
        dataIndex: "operation",
        slots: {
          customRender: "operation",
        },
        className: "text-center",
      },
    ];

    const getListAccount = (page, pageSize) => {
      if (getData(ACCESS_TOKEN, "")) {
        const config = {
          headers: {
            Authorization: getData(ACCESS_TOKEN, ""),
          },
        };
        axios
          .get(
            `${environment.API_URL}${ENDPOINT.users.index}?page=${page}&page-size=${pageSize}`,
            config
          )
          .then((res) => {
            listAccount.value = res.data.data.map((item, index) => ({
              key: (index + (current.value - 1) * 10).toString(),
              stt: index + (current.value - 1) * 10,
              ...item,
            }));
            totalPage.value = res.data.pagination.total_page;
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    onMounted(() => {
      getListAccount(0, 10);
    });

    const onDelete = (key) => {
      const user = listAccount.value.find((item) => item.key == key);

      if (getData(ACCESS_TOKEN, "")) {
        const config = {
          headers: {
            Authorization: getData(ACCESS_TOKEN, ""),
          },
        };
        axios
          .delete(
            `${environment.API_URL}${ENDPOINT.users.index}/${user.id}`,
            config
          )
          .then((res) => {
            createToast(res.data.message, {
              type: "success",
              timeout: 1500,
            });
            listAccount.value = listAccount.value.filter(
              (item) => item.key !== key
            );
          })
          .catch((err) => {
            createToast("Delete failed.", {
              type: "danger",
              timeout: 1500,
            });
          });
      }
    };

    const onChange = (page, pageSize) => {
      getListAccount(page - 1, pageSize);
    };

    const onSearch = () => {};

    return {
      totalPage,
      listAccount,
      getListAccount,
      columns,
      onDelete,
      onChange,
      current,
      visibleModal,
      handleOk,
      showModal,
      password,
      onSearch,
    };
  },
};
</script>
