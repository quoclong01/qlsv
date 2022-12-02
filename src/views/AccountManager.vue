<template>
  <div class="account-manager">
    <h2 class="title">Quản lý tài khoản</h2>
    <AddAccount :listAccount="listAccount" :current="current" />
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
              <span v-if="editableData[record.key]">
                <div class="editable-row-group">
                  <a-button @click="save(record.key)">Save</a-button>
                  <a-popconfirm
                    title="Sure to cancel?"
                    @confirm="cancel(record.key)"
                  >
                    <a-button type="danger">Cancel</a-button>
                  </a-popconfirm>
                </div>
              </span>
              <span v-else>
                <a-button type="primary" @click="edit(record.key)"
                  >Sửa</a-button
                >
              </span>
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
import { ref, onMounted, reactive } from "vue";
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

    const columns = [
      {
        title: "STT",
        dataIndex: "stt",
        width: "5%",
        slots: {
          customRender: "stt",
        },
        className: "text-center",
      },
      {
        title: "Tài khoản",
        dataIndex: "username",
        width: "22%",
        slots: {
          customRender: "username",
        },
        className: "text-center",
      },
      {
        title: "Mật khẩu",
        dataIndex: "password",
        width: "22%",
        slots: {
          customRender: "password",
        },
        className: "text-center",
      },
      {
        title: "Loại",
        dataIndex: "role",
        width: "22%",
        slots: {
          customRender: "role",
        },
        className: "text-center",
      },
      {
        title: "Chức năng",
        dataIndex: "operation",
        width: "22%",
        slots: {
          customRender: "operation",
        },
        className: "text-center",
      },
    ];
    const editableData = reactive({});

    const getListAccount = (page, pageSize) => {
      const config = {
        headers: {
          Authorization: getData(ACCESS_TOKEN, ""),
        },
      };
      if (getData(ACCESS_TOKEN, "")) {
        axios
          .get(
            `${environment.API_URL}${ENDPOINT.users.index}?page=${page}&page-size=${pageSize}`,
            config
          )
          .then((res) => {
            listAccount.value = res.data.data.map((item, index) => ({
              key: (index + (current.value - 1) * 10).toString(),
              stt: index + (current.value - 1) * 10,
              id: item.id,
              username: item.username,
              password: item.password,
              role: item.role,
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

    const edit = (key) => {
      editableData[key] = {
        ...listAccount.value.filter((item) => key === item.key)[0],
      };
    };

    const save = (key) => {
      Object.assign(
        listAccount.value.filter((item) => key === item.key)[0],
        editableData[key]
      );
      const user = {
        ...editableData[key],
        name: editableData[key].username,
        status: "ACTIVE",
      };
      delete user.key;
      delete user.stt;

      if (getData(ACCESS_TOKEN, "")) {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: getData(ACCESS_TOKEN, ""),
          },
        };
        axios
          .put(
            `${environment.API_URL}${ENDPOINT.users.index}/${user.id}`,
            JSON.stringify(user),
            config
          )
          .then((res) => {
            createToast(res.data.message, {
              type: "success",
              timeout: 1500,
            });
          })
          .catch((err) => {
            createToast("Update failed.", {
              type: "danger",
              timeout: 1500,
            });
          });
      }
      delete editableData[key];
    };

    const cancel = (key) => {
      delete editableData[key];
    };

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

    return {
      totalPage,
      listAccount,
      getListAccount,
      columns,
      edit,
      save,
      cancel,
      editableData,
      onDelete,
      onChange,
      current,
    };
  },
};
</script>
