<template>
  <div>
    <a-button type="primary" @click="showDrawer">
      <template #icon><PlusOutlined /></template>
      Add New
    </a-button>
    <a-drawer
      title="Thêm mới sinh viên"
      :width="1280"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      :footer-style="{ textAlign: 'right' }"
      @close="onClose"
    >
      <a-form :model="form"  layout="vertical">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Mã số sinh viên" name="mssv">
              <a-input v-model="form.studentCode" placeholder="Nhập mã số sinh viên" />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="Họ tên" name="name">
              <a-input
                v-model="form.name"
                placeholder="Nhập họ tên sinh viên"
              />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="Mã Khoa" name="maKHoa">
              <a-select v-model="form.maKhoa" placeholder="Nhập mã khoa">
                <a-select-option value="CNTT"
                  >Công nghệ thông tin</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="Đề tài tốt nghiệp" name="topic">
              <a-input v-model="form.graduationTopic" placeholder="Nhập đề tài" />
            </a-form-item>
          </a-col>

          <a-col :span="12">
            <a-form-item label="Lớp" name="class">
              <a-select v-model="form.className" placeholder="Chọn lớp">
                <a-select-option value="63IT1">63IT1</a-select-option>
                <a-select-option value="63IT2">63IT2</a-select-option>
                <a-select-option value="63IT3">63IT3</a-select-option>
                <a-select-option value="63IT4">63IT4</a-select-option>
                <a-select-option value="63TH1">63TH1</a-select-option>
                <a-select-option value="63TH2">63TH2</a-select-option>
                <a-select-option value="63TH3">63TH3</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          

          <a-col :span="12">
            <a-form-item label="Teacher" name="teacher">
              <a-select
                v-model="form.teacher"
                placeholder="Chọn giáo viên hướng dẫn"
              >
                <a-select-option value="Phong">Thầy Phong</a-select-option>
                <a-select-option value="Quang">Thầy Quang</a-select-option>
                <a-select-option value="Dương">Thầy Dương</a-select-option>
                <a-select-option value="Thọ">Thầy Thọ</a-select-option>
                <a-select-option value="Nga">Cô Nga</a-select-option>
                <a-select-option value="Dương1">Cô Dương</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <template #extra>
        <a-space>
          <a-button type="primary" @click="clickAdd()">Submit</a-button>
        </a-space>
      </template>
    </a-drawer>
  </div>
</template>
<script>
import { PlusOutlined } from "@ant-design/icons-vue";
import { defineComponent, reactive, ref } from "vue";
import { Drawer } from "ant-design-vue";
export default defineComponent({
  components: {
    PlusOutlined,
    Drawer,
  },

  data() {
    return {
      liststudent: {
        id: "",
        studentCode: "",
        name: "",
        
        maKhoa: "",
        className: "",
        graduationTopic: "",
        teacher: "",
      },

      liststudents: [],
    };
  },

  methods: {
    clickAdd() {
      this.$emit("save", this.liststudent);
      console.log(this.liststudent)
      this.liststudent = {
        id: Math.floor(Math.random() * 10000),
        studentCode: "",
        name: "",
        maKhoa: "",
        className: "",
        graduationTopic: "",
        teacher: "",
      };
      //  this.liststudents.push( this.liststudent);
      // this.$emit("save",this.liststudent)
      //  this.liststudent=''
      //  console.log(this.liststudent)
    },

    // clickAdd() {
    //   if (this.validate()) {
    //     axios
    //       .post(
    //         "http://10.8.64.157:8080/api/v1/student/create",
    //         this.liststudent
    //       )
    //       .then((response) => {
    //         console.log(response);
    //         this.liststudents.push(response.data.data);
    //         alert("Đã thêm tài khoản mới thành công");
    //       })
    //       .catch((error) => console.log(error));
    //   }

    //   this.liststudents.push(this.liststudent);
    //   console.log(this.liststudent);
    // },
   
  },

  setup() {
    const form = reactive({
      id: "",
      studentCode: "",
      name: "",
     
      maKhoa: "",
      className: "",
      graduationTopic: "",
      teacher: "",
    });

    const visible = ref(false);

    const showDrawer = () => {
      visible.value = true;
    };

    const onClose = () => {
      visible.value = false;
    };

    return {
      form,
      visible,
      showDrawer,
      onClose,
      
    };
  },
});
</script>