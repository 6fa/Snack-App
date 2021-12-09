<template>
  <div class="search-box-wrapper">
    <div class="cancel-button" @click="goBack">
      &lt;
    </div>
    <input
      type="text"
      placeholder="请输入搜索内容"
      class="search-box"
      ref="input"
      maxlength="10"
    />
    <div class="start-search-button" @click="query">
      <i class="iconfont">&#xe66b;</i>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseSearch",
  methods: {
    goBack() {
      this.$router.back();
    },
    query() {
      const input = this.$refs.input;
      const val = input.value;
      this.$emit("startQuery", val);
      input.value = "";
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/_mixins.scss";
@import "~assets/scss/_variables.scss";
.search-box-wrapper {
  @include flex-center();
  background-color: #fff;
  width: 100%;
  height: 2.5rem;
  color: orange;
  font-size: 1.2rem;
  box-shadow: 0 0 0.5rem 0 #f7edd3;
  .start-search-button,
  .cancel-button {
    width: 15%;
    @include flex-center();
  }
  .cancel-button {
    font-size: 1rem;
    color: $icon-color-default;
    font-weight: bold;
  }
  .search-box {
    width: 70%;
    font-size: 0.8rem;
    padding: 0.2rem;
  }
}
</style>
