

<template>
  <div class="qlsv">
    <p>Đánh giá đồ án tốt nghiệp</p>

   
    <div class="form">
      <div class="form__table">
        <table>
          <tr>
            <th>STT</th>
            <th>Đợt</th>
            <th>Năm học</th>
            <th>Trạng thái</th>
            <th class="size">Thao tác</th>
          </tr>

          <tr v-for="item in lists" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.batch }}</td>
            <td>{{ item.year }}</td>
            <td><a-badge status="success" />{{ item.status }}</td>
            
              <td class="btn-openn">
                <router-link to="/feedbacktopic">
              <button class="btn-open">
                 Mở
              </button>
              </router-link>
            </td>
            
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>


<script>

import {
  PlusCircleOutlined, 
} from "@ant-design/icons-vue";
import { defineComponent } from "vue";
import { Button } from "ant-design-vue";
import "ant-design-vue/dist/antd.css";


export default defineComponent({
  components: {
    PlusCircleOutlined,
    Button,
  
  },

  name: " danhgiadoan",
  data() {
    return {
      list: {
        id: "",
        batch: "",
        year: "",
        status: "",
      },

      lists: [
        { id: 1, batch: 1, year: 2022, status: "mở" },

        { id: 2, batch: 2, year: 2023, status: "mở" },

        { id: 3, batch: 3, year: 2024, status: "mở" },
      ],
    };
  },

  methods: {
    // openItem(item) {
    //   const i = this.lists.findIndex((x) => x.id == item.id);
    //   this.lists.splice(i, 1);
    // },
  }, //methods
});
</script>

