<template>
  <div class="class-manager">
    <h2 class="title">Quản lý đợt đồ án tốt nghiệp</h2>
    <AddBatch
      :listSemester="listSemester"
      :current="current"
      :typeSemester="'GRADUATION'"
    />
    <div class="class-manager-table">
      <a-table
        :columns="columns"
        :data-source="listSemester"
        class="table-wrapper"
        :pagination="false"
        bordered
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'status'">
            <div v-if="text == 'OPEN'">
              <a-badge status="success" />
              Mở
            </div>
            <div v-else>
              <a-badge status="error" />
              Đóng
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'operation'">
            <div class="editable-row-group">
              <div class="editable-row-operations">
                <a-button
                  type="primary"
                  style="
                    width: 66px;
                    background-color: rgb(108 27 28);
                    border-color: rgb(108 27 28);
                  "
                  @click="handleStatus(record.key)"
                  v-if="record.status == 'OPEN'"
                >
                  Đóng
                </a-button>
                <a-button
                  type="primary"
                  style="width: 66px"
                  @click="handleStatus(record.key)"
                  v-else
                >
                  Mở
                </a-button>
              </div>
              <a-popconfirm
                title="Bạn muốn xóa đợt thực tập không?"
                @confirm="handleDelete(record.key)"
              >
                <a-button type="danger">Xóa</a-button>
              </a-popconfirm>
              <a-button type="primary" class="btn-secondary"
                ><router-link
                  :to="{
                    name: 'listStudentPass',
                    params: { id: record.id },
                  }"
                  >Danh sách sinh viên</router-link
                ></a-button
              >
            </div>
          </template>
        </template>
      </a-table>
      <a-pagination
        :total="totalPage * 10"
        v-model:current="current"
        @change="onChange"
        style="margin-top: 30px; display: flex; justify-content: right"
      >
      </a-pagination>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import AddBatch from "../components/AddBatch.vue";
import { ref, onMounted } from "vue";
import { environment, ENDPOINT } from "../shared/config/index";
import { getData } from "../shared/common/common";
import { ACCESS_TOKEN } from "../shared/constant/constant";
import { createToast } from "mosha-vue-toastify";

export default {
  components: {
    AddBatch,
  },
  setup() {
    const listSemester = ref([]);
    const current = ref(1);
    const totalPage = ref(1);
    const columns = [
      {
        title: "STT",
        dataIndex: "stt",
        width: "5%",
        className: "text-center",
      },
      {
        title: "Đợt",
        dataIndex: "semester",
        width: "22%",
        className: "text-center",
      },
      {
        title: "Năm học",
        dataIndex: "year",
        width: "22%",
        className: "text-center",
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        width: "22%",
        className: "text-center",
      },
      {
        title: "Chức năng",
        dataIndex: "operation",
        width: "22%",
        className: "text-center",
      },
    ];

    const getListSemeters = (page, pageSize) => {
      if (getData(ACCESS_TOKEN, "")) {
        const config = {
          headers: {
            Authorization: getData(ACCESS_TOKEN, ""),
          },
        };
        axios
          .get(
            `${environment.API_URL}${ENDPOINT.semesters.type}?page=${page}&page-size=${pageSize}&type=GRADUATION`,
            config
          )
          .then((res) => {
            listSemester.value = res.data.data.map((item, index) => ({
              key: (index + (current.value - 1) * 10).toString(),
              stt: index + (current.value - 1) * 10,
              id: item.id,
              year: item.year,
              semester: item.semester,
              status: item.status,
              type: item.type,
            }));
            totalPage.value = res.data.pagination.total_page;
          })
          .catch((err) => {
            listSemester.value = [];
          });
      }
    };
    onMounted(() => {
      getListSemeters(0, 10);
    });

    const handleDelete = (key) => {
      const semester = listSemester.value.find((item) => item.key == key);

      if (getData(ACCESS_TOKEN, "")) {
        const config = {
          headers: {
            Authorization: getData(ACCESS_TOKEN, ""),
          },
        };
        axios
          .delete(
            `${environment.API_URL}${ENDPOINT.semesters.index}/${semester.id}`,
            config
          )
          .then((res) => {
            createToast(res.data.message, {
              type: "success",
              timeout: 1500,
            });
            listSemester.value = listSemester.value.filter(
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
      getListSemeters(page - 1, pageSize);
    };
    const handleStatus = (key) => {
      const semester = listSemester.value.find((item) => item.key == key);
      semester.status = semester.status === "OPEN" ? "CLOSE" : "OPEN";
      const semesterIndex = listSemester.value.findIndex(
        (item) => item.key == key
      );

      if (getData(ACCESS_TOKEN, "")) {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: getData(ACCESS_TOKEN, ""),
          },
        };
        const newSemester = { ...semester };

        delete newSemester.stt;
        delete newSemester.key;
        axios
          .put(
            `${environment.API_URL}${ENDPOINT.semesters.index}/${newSemester.id}`,
            JSON.stringify(newSemester),
            config
          )
          .then((res) => {
            createToast(res.data.message, {
              type: "success",
              timeout: 1500,
            });
            listSemester.value[semesterIndex] = { ...semester };
          })
          .catch((err) => {
            createToast("Update failed.", {
              type: "danger",
              timeout: 1500,
            });
          });
      }
    };

    return {
      columns,
      listSemester,
      current,
      handleDelete,
      onChange,
      totalPage,
      handleStatus
    };
  },
}; //export
</script>
