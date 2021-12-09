<template>
  <div id="app" class="g-container">
    <div class="g-view-container">

      <transition name="page" appear>
          <router-view />
      </transition>
    
    </div>
    <div class="g-footer-container">
      <f-tabbar />
    </div>
  </div>
</template>

<script>
import FTabbar from "components/FTabbar";
export default {
  name: "APP",
  components: {
    FTabbar
  }
};
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}
.page-enter,
.page-leave-to {
  opacity: 0;
}
</style>


