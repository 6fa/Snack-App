<template>
  <div class="home-page">
    <t-header ref="header" :loaded="isloaded" />
    <base-scroll
      scrollbar
      pullDown
      pullUp
      @pull-down="pullToFresh"
      @pull-up="pullToLoadMore"
      @scroll-end="scrollEnd"
      ref="scroll"
    >
      <hot-list class="hot-list" ref="hotList" />

      <all-list
        class="all-list"
        @updateFinish="update"
        @loadedAll="showMessage"
        ref="allList"
      />
    </base-scroll>
    <!-- 返回顶部按钮 -->
    <base-backtop
      :visible="isBacktopVisible"
      class="back-to-top"
      @backtop="backToTop"
    />

    <!-- 提示信息框 -->
    <div class="alert-box">
      <alert-box ref="alertBox" :msg="alertContent" class="alert-content" />
    </div>
  </div>
</template>

<script>
import THeader from "components/Header";

import HotList from "./hot";
import AllList from "./all";

import BaseScroll from "base/scroll";
import BaseBacktop from "base/backtop";

import alertBox from "components/helper/alertMsg";

export default {
  name: "homePage",
  data() {
    return {
      isBacktopVisible: false,
      isloaded: Boolean(this.$store.state.isloaded),
      productPageNum: 0,
      alertContent: "",
      isLoadedAll: false
    };
  },
  components: {
    THeader,
    HotList,
    AllList,
    BaseScroll,
    BaseBacktop,
    alertBox
  },
  watch: {
    $route() {
      this.isloaded = Boolean(this.$store.state.isloaded);
    }
  },
  methods: {
    update() {
      this.$refs.scroll.updateScroll();
      return new Promise(resolve => {
        resolve();
      });
    },
    pullToFresh(end) {
      this.$refs.hotList.getHotPds();
      this.productPageNum = 0;
      this.isLoadedAll = false;
      this.$refs.allList.reset();
      setTimeout(() => {
        end();
      }, 1000);
    },
    pullToLoadMore(end) {
      if (this.isLoadedAll) {
        this.showMessage();
        end();
        return;
      }
      this.productPageNum++;
      this.$refs.allList.getNewProducts(this.productPageNum);
      end();
    },
    backToTop() {
      this.$refs.scroll && this.$refs.scroll.scrollToTop();
    },
    scrollEnd(translate, swiper) {
      this.isBacktopVisible = translate < 0 && -translate > swiper.height;
    },
    showMessage() {
      this.isLoadedAll = true;
      this.alertContent = "已加载全部";
      this.$refs.alertBox.showMsg();
    }
  }
};
</script>

<style scoped lang="scss">
@import "~assets/scss/_variables.scss";
@import "~assets/scss/_mixins.scss";
.home-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.swiper-container {
  padding-top: $navbar-height;
}
.hot-list,
.all-list {
  margin-top: 1rem;
}
.all-list {
  margin-bottom: 0.5rem;
}
.back-to-top {
  position: absolute;
  bottom: 4rem;
  right: 2rem;
  z-index: $backtop-z-index;
}
.alert-box {
  display: flex;
  justify-content: center;
  .alert-content {
    z-index: $msg-z-index;
  }
}
</style>
