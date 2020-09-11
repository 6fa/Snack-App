<template>
  <div id="app" class="g-container">
    <div class="g-view-container">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" />
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive" />
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
