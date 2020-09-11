<template>
  <transition name="back-top">
    <a href="javascript:;" @click="backtotop" v-show="visible" class="backtop">
      <i class="iconfont">&#xe619;</i>
    </a>
  </transition>
</template>

<script>
export default {
  name: "BaseBacktop",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    backtotop() {
      this.$emit("backtop");
    }
  }
};
</script>

<style scoped lang="scss">
@import "~assets/scss/_variables.scss";
.backtop {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.4s;
  }

  &-enter,
  &-leave-to {
    opacity: 0;
  }
  .iconfont {
    color: orange;
    font-size: 2rem;
  }
}
</style>
