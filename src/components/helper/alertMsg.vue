<template>
  <div class="alert-msg hide" ref="msgbox">
    <p class="msg">{{ msg }}</p>
  </div>
</template>

<script>
export default {
  name: "AlertMsg",
  props: {
    msg: {
      type: String,
      default: "登录成功"
    }
  },
  methods: {
    showMsg() {
      this.$refs.msgbox.classList.remove("hide");
      setTimeout(() => {
        this.$refs.msgbox.classList.add("hide");
      }, 1000);
    }
  }
};
</script>

<style scoped lang="scss">
@import "~assets/scss/mixins";
.alert-msg {
  position: absolute;
  background-color: rgba($color: #000000, $alpha: 0.7);
  max-width: 95%;
  top: 40%;
  font-size: 1.2rem;
  color: #ffffff;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  text-align: center;
  .msg {
    max-width: 100%;
    @include ellipsis();
  }
  &.hide {
    display: none;
  }
}
</style>
