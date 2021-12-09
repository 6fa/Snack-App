<template>
  <div class="f-tabbar">
    <router-link to="/home" class="f-tabbar-item">
      <i class="iconfont">&#xe664;</i>
    </router-link>
    <router-link to="/publish" class="f-tabbar-item">
      <i class="iconfont">&#xf0175;</i>
    </router-link>
    <router-link to="/personal" class="f-tabbar-item">
      <i class="iconfont">&#xe659;</i>
    </router-link>
  </div>
</template>

<script>
export default {
  // methods: {
  //   switchBar: e => {
  //     let doms = document
  //       .querySelector(".f-tabbar")
  //       .querySelectorAll(".iconfont");
  //     let targetdom = e.target;
  //     for (let i = 0, len = doms.length; i < len; i++) {
  //       doms[i].classList.remove("icon-active");
  //     }
  //     targetdom.classList.add("icon-active");
  //   }
  // }
};
</script>

<style scoped lang="scss">
@import "~assets/scss/_mixins";
@import "~assets/scss/_variables";
.f-tabbar {
  height: 100%;
  width: 100%;
  @include flex-between();
  font-size: 1.5rem;
  background-color: #fff;

  &-item {
    height: 100%;
    width: 100%;
    @include flex-center();
    .iconfont {
      color: $icon-color-default;
      width: 100%;
      font-size: 1.3rem;
      @include flex-center();
    }
  }
}
.router-link-active {
  .iconfont {
    font-size: 1.5rem;
    font-weight: bold;
    color: $icon-color;
    text-shadow: 1px 1px 5px grey;
  }
}
</style>
