<template>
  <transition name="search">
    <div class="search-page">
      <!-- 搜索框 -->
      <base-search @startQuery="search" />
      <!-- 历史记录 -->
      <div class="history-wrapper" v-if="!ifShowResult">
        <div class="title-box">
          <div class="title">搜索历史</div>
          <div class="clear" @click="clearAll">
            清空
          </div>
        </div>
        <div class="list">
          <div
            class="item"
            v-for="(item, index) in historySearchList"
            :key="index"
            @click="search(item)"
          >
            {{ item }}
          </div>
        </div>
      </div>

      <!-- 搜索结果 -->

      <base-scroll
        scrollbar
        pullUp
        @pull-up="pullToLoadMore"
        @scroll-end="scrollEnd"
        ref="scroll"
      >
        <div class="result-list" v-if="ifShowResult">
          <div
            class="result-item"
            v-for="(item, index) in searchRes"
            :key="item._id"
            @click="toProductPage(item)"
          >
            <span class="floor">{{ index + 1 }}</span>
            <span class="pd-name">{{ item.productName }}</span>
            <span class="arrow">></span>
          </div>
        </div>
      </base-scroll>
      <!-- 提示框 -->
      <div class="alert-box">
        <alert-box :msg="promptInfo" ref="alertBox" class="alert-box-content" />
      </div>
      <!-- 返回顶部按钮 -->
      <base-backtop
        :visible="isBacktopVisible"
        class="back-to-top"
        @backtop="backToTop"
      />
    </div>
  </transition>
</template>

<script>
import BaseSearch from "base/search-box";
import BaseScroll from "base/scroll";
import { searchPd } from "@/api/product";
import alertBox from "components/helper/alertMsg";
import BaseBacktop from "base/backtop";
export default {
  name: "searchPage",
  components: {
    BaseSearch,
    BaseScroll,
    alertBox,
    BaseBacktop
  },
  data() {
    return {
      promptInfo: "",
      searchContent: "",
      historySearchList: [], //后期这里应该本地储存
      ifShowResult: false,
      pageNum: 0,
      pageSize: 10,
      searchRes: [], //搜索结果
      loadedAll: false,
      isBacktopVisible: false //返回顶部按钮
    };
  },
  created() {
    let data = window.localStorage.getItem("searchHistory");
    if (data) {
      this.historySearchList = JSON.parse(data);
    }
  },
  methods: {
    search(val) {
      if (!val) return;
      //搜索功能
      this.pageNum = 0;
      this.searchRes = [];
      this.loadedAll = false;
      this.searchContent = val;
      this.toSearch(val);
      //历史记录
      let temp = this.historySearchList;
      let len = temp.length;
      if (len > 9) {
        temp = this.historySearchList.slice(0, len - 1);
        temp.unshift(val);
      } else {
        temp.unshift(val);
      }
      let data = JSON.stringify(temp);
      window.localStorage.setItem("searchHistory", data);
    },
    toSearch(val) {
      let data = { text: val, pageNum: this.pageNum, pageSize: this.pageSize };
      searchPd(data)
        .then(res => {
          console.log("搜索商品", res);
          this.ifShowResult = true;
          if (res.data.data.length == 0 && this.pageNum !== 0) {
            this.loadedAll = true;
            //提示已经加载全部
            this.promptInfo = "已加载全部";
            this.$refs.alertBox.showMsg();
            return;
          } else if (res.data.data.length == 0 && this.pageNum == 0) {
            this.promptInfo = "无匹配数据";
            this.$refs.alertBox.showMsg();
            return;
          }
          this.searchRes = this.searchRes.concat(res.data.data);
        })
        .catch(err => {
          console.log(err);
        });
    },

    clearAll() {
      this.historySearchList = [];
      window.localStorage.removeItem("searchHistory");
    },
    //加载更多搜索结果
    pullToLoadMore(end) {
      this.pageNum++;
      this.toSearch(this.searchContent);
      end();
    },
    //是否出现返回顶部按钮
    scrollEnd(translate, swiper) {
      this.isBacktopVisible = translate < 0 && -translate > swiper.height;
    },
    backToTop() {
      this.$refs.scroll && this.$refs.scroll.scrollToTop();
    },

    //跳转到商品页
    toProductPage(data) {
      this.$router.push({ name: "product", params: data });
    }
  }
};
</script>

<style scoped lang="scss">
@import "~assets/scss/_variables.scss";
@import "~assets/scss/_mixins.scss";
.search-page {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: $search-z-index;
  background-color: $bgc-theme;
}
.search-enter-active,
.search-leave-active {
  transition: all 0.3s;
}
.search-enter,
.search-leave-to {
  transform: translate3d(100%, 0, 0);
}

.history-wrapper {
  width: 100%;
  background-color: #fff;
  padding: 1rem;
  margin-top: 1.5rem;
  font-size: 0.8rem;
  .list {
    color: grey;
    display: flex;
    flex-wrap: wrap;
    .item {
      margin: 0.5rem 1rem 0 0;
      flex-shrink: 0;
      padding: 0 0.5rem;
      background-color: rgb(252, 242, 229);
      border-radius: 0.5rem;
      height: 1.5rem;
      line-height: 1.5rem;
    }
  }
}

.history-wrapper {
  .title-box {
    width: 100%;
    @include flex-between();
    .title {
      font-weight: bold;
    }
    .clear {
      width: 2.2rem;
      height: 1.5rem;
      font-size: 0.7rem;
      border-radius: 1rem;
      background-color: rgb(243, 206, 137);
      @include flex-center();
    }
  }
}

.result-list {
  width: 100%;
  padding: 1rem 0 1rem 0;
  .result-item {
    background-color: #fff;
    padding: 1rem 0.5rem;
    font-size: 0.8rem;
    color: grey;
    display: flex;
    margin-bottom: 0.5rem;
    .pd-name {
      color: grey;
      padding-left: 0.5rem;
    }
    .floor {
      color: orange;
    }
    .arrow {
      position: absolute;
      right: 0.5rem;
      color: orange;
    }
  }
}

.alert-box {
  display: flex;
  justify-content: center;
  .alert-box-content {
    z-index: 2000;
  }
}
</style>
