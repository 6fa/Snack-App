<template>
  <div class="header g-header-container">
    <div class="header-item line1">
      <div class="logo">
        <img :src="imgSrc" />
      </div>
      <!-- 已登录 -->
      <div class="signed" v-if="loaded" @click="logout">
        <i class="iconfont">&#xe6c8;</i><span class="text">退出登录</span>
      </div>
      <!-- 未登录时 -->
      <div class="sign" v-else @click="toLoginLayer">
        <i class="iconfont">&#xe6c8;</i><span class="text">登录/注册</span>
      </div>
    </div>

    <div class="header-item line2">
      <div class="search">
        <i class="iconfont">&#xe66b;</i>
      </div>

      <input
        type="text"
        value="搜索"
        class="search-input"
        @focus="gotoSearch"
      />
    </div>
  </div>
</template>

<script>
import img from "assets/pictures/logo.png";
export default {
  data() {
    return {
      userName: this.$store.state.userName,
      imgSrc: img
    };
  },
  props: {
    loaded: {
      type: Boolean
    }
  },
  methods: {
    gotoSearch() {
      this.$router.push("/search");
    },
    toLoginLayer() {
      this.$router.push("/login");
    },
    logout() {
      this.$store.dispatch("TOLOGOUT")
      console.log('退出登录')
      //刷新页面
      window.location.reload();
    }
  }
};
</script>

<style scoped lang="scss">
@import "~assets/scss/_variables";
@import "~assets/scss/_mixins";
.header {
  width: 100%;
  background-color: $bgc-theme; 
  // background-color: #f5dcc0;
}
.header-item {
  display: flex;
  width: 100%;
  height: $navbar-height/2;
  box-shadow: 0 0 2px 0 $border-color;
}
.line1 {
  flex-grow: 1;
  z-index: $navbar-z-index;
  .logo {
    width: 50%;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .sign {
    width: 50%;
    position: relative;
    color: rgb(255, 81, 0);
    @include flex-center();
    .text {
      font-size: 0.8rem;
    }
  }
  .signed {
    width: 50%;
    @include flex-center();
    color: rgb(21, 155, 21);
    .text {
      font-size: 0.8rem;
    }
  }
}
.line2 {
  display: flex;
  position: relative;
  .search {
    font-size: 1.5rem;
    position: absolute;
    left: 2rem;
  }
  .search-input {
    width: 100%;
    height: 100%;
    text-indent: 4rem;
    color: grey;
    font-size: 0.8rem;
  }
}
</style>
