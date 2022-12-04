

<template>
  <div class="qlsv">
    <p>Danh sách sinh viên thực tập tốt nghiệp</p>
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
              
              <router-link to="/feedback">
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
