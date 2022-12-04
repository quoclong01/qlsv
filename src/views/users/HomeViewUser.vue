<template>
  <div class="home">
    <SideBarUser />
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<script>
import SideBarUser from '../../components/SideBarUser.vue';
export default {
  name: "HomeUser",
  components: {
    SideBarUser,
  },
};
</script>

