<template>
  <transition name="product">
    <div class="product-page">
      <!-- 子路由 -->
      <router-view />

      <div class="header">
        <span class="go-back" @click="goBack">&lt;</span>
        <span class="title">零食详情页</span>
      </div>

      <base-scroll
        scrollbar
        pullUp
        @pull-up="pullToLoadMore"
        @scroll-end="scrollEnd"
        ref="scroll"
      >
        <!-- 用户信息 -->
        <div class="user-info">
          <div class="user-pic">
            <img :src="headPic" />
          </div>
          <div class="user-name">{{ productData.publisher }}</div>
          <div class="time">{{ productData.time | timeFormat }}</div>
        </div>
        <!-- 零食信息 -->
        <div class="snack-info">
          <div class="snack-title">
            {{ productData.productName }}
            <span class="snack-price">￥{{ productData.price }}</span>
          </div>
          <div class="snack-pic">
            <img
              :src="productData.productPic"
            />
          </div>
          <div class="snack-desc">
            {{ productData.content }}
          </div>
        </div>
        <!-- 零食状况 -->
        <div class="snack-state" @click="changeIcon">
          <!-- 点击增加喜欢数 -->
          <div class="like" @click="clickLike($event)" ref="likeIcon">
            <i class="iconfont">&#xe657;</i>
            <span class="num" ref="likeNumText">{{ productData.likeNum }}</span>
          </div>
          <!-- 点击增加收藏数 -->
          <div class="collect" @click="clickCollect($event)" ref="collectIcon">
            <i class="iconfont">&#xe65a;</i>
            <span class="num" ref="collectNumText">{{
              productData.collectNum
            }}</span>
          </div>
          <div class="message active" @click="showMsgLayer">
            <!-- 点击出现留言区 -->
            <i class="iconfont">&#xe72c;</i>
            <span class="num">{{ msgTotalNum }}</span>
          </div>
        </div>
        <!-- 留言区 -->
        <div class="msg-layer" v-show="showLayer">
          <msg-content
            ref="msgContent"
            @writeMsg="openWritingLayer"
            @writeSubMsg="openWritingLayer"
            :publisher="productData.publisher"
            :productId="productData._id"
            @loaded="updateScroll"
            @updateMsgNum="msgNum"
            @alertMsg="alertMessage"
          />
        </div>
      </base-scroll>

      <!-- 留言编辑区 -->
      <writing-msg
        class="writing-msg-layer"
        @close="closeWritingLayer"
        v-show="showWritingLayer"
        :info="msgInfo"
        @refreshMsg="refreshMessage"
      />

      <!-- 提示信息框 -->
      <div class="alert-box" v-show="alerting">
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
import alertBox from "components/helper/alertMsg";
import pic from "@/assets/pictures/orange.png";
import BaseScroll from "base/scroll";
import MsgContent from "./msg";
import writingMsg from "./writingMsg";
import BaseBacktop from "base/backtop";

import { getUserInfo } from "@/api/user";
import { getMsgNum } from "@/api/message";
import { likeCtrl, checkExisted, collectCtrl } from "@/api/like";

export default {
  name: "ProductPage",
  components: {
    BaseScroll,
    MsgContent,
    writingMsg,
    BaseBacktop,
    alertBox
  },
  data() {
    return {
      headPic: pic, //发布者头像
      imgSrc: '',
      showLayer: true, //留言区的显示
      showWritingLayer: false, //编辑留言区的显示
      msgInfo: {}, //提交留言时的信息
      productData: {}, //零食信息
      msgTotalNum: 0,
      isBacktopVisible: false, //返回顶部按钮
      alerting: false, //提示信息框的显示
      liked: false, //已喜欢
      collected: false, //已收藏
      promptInfo: ""
    };
  },
  filters: {
    timeFormat(val) {
      if (/.T./.test(val)) {
        let newVal = val.split("T")[0];
        return newVal;
      }
    }
  },
  created() {
    let params = Object.keys(this.$route.params);

    if (!params.length == 0) {
      let res = JSON.stringify(this.$route.params);
      window.localStorage.setItem("productData", res);
    }
    let data = window.localStorage.getItem("productData");
    this.productData = JSON.parse(data);

    this.getUserPic(); //获取发布者头像
    this.msgNum(); //获取留言数
    this.ifHightlight(); //是否已经喜欢/收藏
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    changeIcon(e) {
      const ele = e.target;
      if (ele.classList.contains("snack-state")) return;
      ele.parentNode.classList.toggle("active");
    },
    alertMessage(msg) {
      if (this.alerting) {
        console.log("xxx");
        return;
      }
      this.alerting = true;
      this.promptInfo = msg;
      this.$refs.alertBox.showMsg();

      setTimeout(() => {
        this.alerting = false;
      }, 1000);
    },
    //是否已经喜欢/收藏
    ifHightlight() {
      let data = {
        productId: this.productData._id,
        userName: this.$store.state.userName
      };
      checkExisted({ data, type: 1 }).then(res => {
        //检查喜欢
        if (res.data.existed) {
          //已存在
          this.liked = true;
          this.$refs.likeIcon.classList.add("active");
        } else {
          //不存在
          this.liked = false;
        }
      });
      checkExisted({ data, type: 2 }).then(res => {
        //检查收藏
        if (res.data.existed) {
          //已存在
          this.collected = true;
          this.$refs.collectIcon.classList.add("active");
        } else {
          //不存在
          this.collected = false;
        }
      });
    },

    //获取发布者头像
    getUserPic() {
      let data = { name: this.productData.publisher };
      getUserInfo(data)
        .then(res => {
          this.headPic = res.data.data.userHead;
          if (!this.headPic) {
            this.headPic = pic;
          }
        })
        .catch(err => {
          console.log("获取用户头像失败", err);
        });
    },

    //获取留言总数
    msgNum() {
      let data = {
        productId: this.productData._id
      };
      getMsgNum(data)
        .then(res => {
          console.log("获取留言总数", res);
          if (res.data.code == 200) {
            this.msgTotalNum = res.data.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //刷新留言
    refreshMessage() {
      console.log("刷新留言");
      this.$refs.msgContent.updateMessage();
      this.msgNum();
    },

    showMsgLayer() {
      this.showLayer = !this.showLayer;

      //更新滚动条
      this.updateScroll();
    },
    updateScroll() {
      this.$refs.scroll && this.$refs.scroll.updateScroll();
    },

    //关闭、打开留言编辑区
    closeWritingLayer() {
      this.showWritingLayer = false;
    },
    openWritingLayer(replyTo, username, msgType, msgId) {
      this.showWritingLayer = true;
      if (msgType == 1) {
        this.msgInfo = {
          replyTo,
          username,
          msgType,
          prodcutId: this.productData._id
        };
      } else if (msgType == 2) {
        this.msgInfo = {
          replyTo,
          username,
          msgType,
          prodcutId: this.productData._id,
          msgId
        };
      }
    },
    //上拉加载更多留言
    pullToLoadMore(end) {
      this.$refs.msgContent.loadMore();
      end();
    },
    //是否出现返回顶部按钮
    scrollEnd(translate, swiper) {
      this.isBacktopVisible = translate < 0 && -translate > swiper.height;
    },
    backToTop() {
      this.$refs.scroll && this.$refs.scroll.scrollToTop();
    },

    //点击喜欢时
    clickLike() {
      let data = {
        productId: this.productData._id,
        userName: this.$store.state.userName
      };
      let type;
      if (!this.liked) {
        type = 1;
      } else {
        type = 2;
      }
      likeCtrl({ data, type })
        .then(res => {
          this.$refs.likeNumText.innerText = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
      this.liked = !this.liked;
    },

    //点击收藏时
    clickCollect(e) {
      //没有登录不能收藏
      if (!this.$store.state.isloaded) {
        e.stopPropagation();
        this.alertMessage("未登录");
        return;
      }
      let data = {
        productId: this.productData._id,
        userName: this.$store.state.userName
      };
      let type;
      if (!this.collected) {
        type = 1;
      } else {
        type = 2;
      }
      collectCtrl({ data, type })
        .then(res => {
          this.$refs.collectNumText.innerText = res.data.data;
        })
        .catch(err => {
          console.log(err);
        });
      this.collected = !this.collected;
    }
  }
};
</script>

<style scoped lang="scss">
@import "~assets/scss/_variables.scss";

.product-page {
  width: 100%;
  height: 100%;
  font-size: 0.8rem;
  z-index: $product-z-index;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: $bgc-theme;
  .header {
    height: 2.5rem;
    background-color: #f5dcc0;
    line-height: 2.5rem;
    color: $font-color;
    position: relative;
    display: flex;
    justify-content: center;
    .go-back {
      position: absolute;
      left: 1rem;
      font-weight: bold;
    }
  }

  .user-info {
    display: flex;
    align-items: center;
    padding: 0.3rem 0.8rem;
    position: relative;
    box-shadow: 0 0 5px 0 $border-color;
    .user-pic {
      width: 2rem;
      height: 2rem;
      margin-right: 0.5rem;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .time {
      color: grey;
      position: absolute;
      right: 0.8rem;
      font-size: 0.7rem;
    }
  }

  .snack-info {
    background-color: #fff;
    padding: 0.5rem 2rem;
    .snack-title {
      font-size: 1rem;
      color: $font-color;
      .snack-price {
        font-size: 0.7rem;
        padding-left: 0.3rem;
      }
    }
    .snack-pic {
      width: 6.25rem;
      height: 7.5rem;
      margin: 0.5rem 0;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .snack-desc {
      color: rgb(90, 89, 89);
    }
  }

  .snack-state {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding: 0.3rem 0.8rem;
    // position: relative;
    box-shadow: 0 0 5px 0 $border-color;
    .iconfont {
      color: grey;
    }
    .num {
      color: rgb(90, 89, 89);
    }

    .like.active,
    .collect.active,
    .message.active {
      .iconfont {
        color: orange;
      }
    }
  }

  .msg-layer {
    width: 100%;
    padding-bottom: 5rem;
  }

  .writing-msg-layer {
    width: 100%;
    position: absolute;
    bottom: 0;
  }
  .back-to-top {
    position: absolute;
    bottom: 2rem;
    right: 2rem;
    z-index: 2500;
  }
  .alert-box {
    position: absolute;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 5rem;
    top: 50%;
    z-index: $msg-z-index;
  }
}

.product-enter-active,
.product-leave-active {
  transition: all 0.3s;
}
.product-enter,
.product-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
