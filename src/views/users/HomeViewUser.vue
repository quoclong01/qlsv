<script setup>
// import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <div class="homeuser">
    <!-- <SideBarUser /> -->
    <div class="contentuser">
      <RouterView />
    </div>
  </div>
</template>

<script>
// import SideBarUser from '//ĐồÁnTốtNghiệp/quanlysinhvien/src/components/SideBarUser.vue'
export default {
  name: "HomeUser",
  // components: {
  //   SideBarUser,
  // },
};
</script>

<style scoped>
.homeuser {
  display: grid;
  grid-template-columns: 1fr 5fr;
  background-color: teal;
  height: 100vh;
  width: 100vw;
}
.contentuser {
  border-radius: 20px;
  margin: 6px 6px 6px 0px;
  background-color: white;
  text-align: center;
}
</style>
