<template>
  <div class="home">
    <SideBar />
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<script>
import SideBar from "../components/SideBar.vue";
export default {
  name: "Home",
  components: {
    SideBar,
  },
};
</script>

