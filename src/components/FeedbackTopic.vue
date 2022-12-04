

<template>
  <div class="qlsv">
    <p>Danh sách sinh viên làm đồ án tốt nghiệp</p>
    <div class="form">
  
      <div class="form__table">
        <table>
          <tr>
            <th>STT</th>
            <th>MSSV</th>
            <th>Họ tên</th>
            
            <th>Mã khoa</th>
            <th>Lớp</th>
            <th>Nơi thực tập</th>
            <th>Giáo viên hướng dẫn</th>
            <th>Đợt thực tập</th>
            <th>Năm học</th>

            
            <th class="size">Chức năng</th>
          </tr>

          <tr v-for="item in liststudents" :key="item.id">
            <td>{{ item.id }}</td>
             <td>{{ item.studentCode }}</td>
            <td>{{ item.name }}</td>
            
            <td>{{ item.maKhoa }}</td>
            <td>{{ item.className }}</td>
            <td>{{ item.internshipPlace }}</td>
            <td>{{ item.teacher }}</td>
             <td>{{ item.batch }}</td>
            <td>{{ item.year }}</td>
            

            

            <td class="btn-edit-delete">
              
              <router-link to="/feedbacktopics">
                <button @click="feedbackItem(item)" class="btn-feedback">
                 Đánh giá
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
import axios from "axios";
// import FormAdd from "../components/FormAdd.vue";
import {
  SearchOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";
import { defineComponent } from "vue";
import { Button } from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

export default defineComponent({
  components: {
    PlusCircleOutlined,
    EditOutlined,
  
    // FormAdd,
    Button,
  },

  name: " nhap2",
  data() {
    return {
    

      liststudent: {
        id: "",
        studentCode: "",
        name: "",
        maKhoa: "",
        className: "",
        internshipPlace: "",
        teacher:"",
        batch:"",
        year:"",
      },

      liststudents: [
        {
          id: "1",
          studentCode: "111 ",
          name: "Nguyễn Văn A",  
          
          maKhoa: "CNTT",
          className: "IT2",
          internshipPlace: "ETC",
          teacher:"Thầy phong",
          batch:"Đợt 1",
          year:"2022",
          
        },

        {
          id: "2",
          studentCode: "222",
          name: "Nguyễn Văn b",
           
          maKhoa: "CNTT",
          className: "IT2",
          internshipPlace: "vp Bank",
          teacher:"Thầy Quang",
          batch:"Đợt 1",
          year:"2022",
          
        },
      ],
    };
  },

  

  methods: {
    clickSave(itemSave){
  
     this.liststudents.push(itemSave)
     console.log(itemSave)
   },
 

    deleteItem(item) {
      const i = this.liststudents.findIndex((x) => x.id == item.id);
      this.liststudents.splice(i, 1);
    },
    editItem(item){
      this.liststudent=item;
      
    },

    
  }, //methods
});
</script>
