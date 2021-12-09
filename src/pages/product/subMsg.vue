<template>
  <transition name="message">
    <div class="sub-msg">
      <div class="header">
        <span class="go-back" @click="goBack">&lt;</span>
        <span class="title">评论详情页</span>
      </div>

      <base-scroll
        scrollbar
        pullDown
        pullUp
        @pull-down="pullToFresh"
        @pull-up="pullToLoadMore"
        @scroll-end="scrollEnd"
        ref="scroll"
      >
        <div class="sub-comment-list">
          <div
            class="sub-comment"
            v-for="(item, index) in msgList"
            :key="item._id"
          >
            <div class="sub-comment-user">
              <span class="author">{{ item.publisher }}</span>
              <span class="text">评论</span>
              <span class="replyto">{{ item.replyTo }}</span>
              <span class="floor">{{ index + 1 }}楼</span>
            </div>
            <div class="sub-comment-content">{{ item.subMsgContent }}</div>
            <div class="sub-ctrl-comment">
              <!-- 删除按钮只有回复本人有 -->
              <span @click="writeSubMsg(item.publisher)">回复</span>
              <span
                v-if="user == item.publisher"
                @click="deleteMessage(item._id)"
                >删除</span
              >
            </div>
          </div>
        </div>
      </base-scroll>

      <!-- 返回顶部按钮 -->
      <base-backtop
        :visible="isBacktopVisible"
        class="back-to-top"
        @backtop="backToTop"
      />

      <!-- 留言编辑区 -->
      <writing-msg
        class="writing-msg-layer"
        @close="closeWritingLayer"
        v-show="showWritingLayer"
        :info="msgInfo"
        @refreshMsg="refreshMessage"
        ref="writingMsg"
      />
      <!-- 提示框 -->
      <div class="alert-box" v-show="alerting">
        <alert-box :msg="promptInfo" ref="alertBox" class="alert-content" />
      </div>
    </div>
  </transition>
</template>

<script>
import { getMsgContent, deleteMsg } from "@/api/message";
import alertBox from "components/helper/alertMsg";
import writingMsg from "./writingMsg";
import BaseScroll from "@/base/scroll";
import BaseBacktop from "base/backtop";
export default {
  data() {
    return {
      promptInfo: "",
      pdId: "", //商品id
      msgId: "", //一级留言id
      msgPubliser: "", //一级留言发布者
      msgList: [],
      pageNumber: 0,
      user: this.$store.state.userName,
      showWritingLayer: false,
      msgInfo: {}, //提交留言时的信息
      isBacktopVisible: false, //返回顶部按钮
      alerting: false //提示框
    };
  },
  created() {
    let params = this.$route.params;
    this.pdId = params.pdId;
    this.msgId = params.messageId;
    this.msgPubliser = params.msgPubliser;
    //获取二级留言
    this.getMessage(this.msgId, 2, this.pageNumber, 10);
  },
  components: {
    writingMsg,
    alertBox,
    BaseScroll,
    BaseBacktop
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    alertMsg(msg) {
      this.alerting = true;
      this.promptInfo = msg;
      this.$refs.alertBox.showMsg();
      setTimeout(() => {
        this.alerting = false;
      }, 1000);
    },
    getMessage(id, type, pageNum, pageSize) {
      getMsgContent({ id, type, pageNum, pageSize })
        .then(res => {
          console.log("获取二级留言", res);
          //如果返回的数据为空
          if (res.data.data.length == 0) {
            if (pageNum == 0) {
              return;
            }
            this.alertMsg("已加载全部");
            this.pageNumber--;
            return;
          }
          this.msgList.push(...res.data.data);
        })
        .catch(err => {
          console.log(err);
        });
    },
    writeSubMsg(publisher) {
      if (!this.$store.state.isloaded) {
        this.alertMsg("未登录");
        return;
      }
      this.openWritingLayer(publisher, this.user, 2, this.msgId);
    },
    //删除留言
    deleteMessage(id) {
      if (!this.$store.state.isloaded) {
        this.promptInfo = "未登录";
        this.$refs.alertBox.showMsg();
        return;
      }
      deleteMsg({ id, type: 2 })
        .then(res => {
          if (res.data.code == 200) {
            this.promptInfo = "删除成功";
            this.$refs.alertBox.showMsg();
            this.refreshMessage();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    refreshMessage() {
      this.msgList = [];
      this.pageNumber = 0;
      console.log("刷新二级留言");
      console.log(this.msgId);
      this.getMessage(this.msgId, 2, this.pageNumber, 10);
    },

    //关闭、打开留言编辑区
    closeWritingLayer() {
      this.showWritingLayer = false;
    },
    openWritingLayer(replyTo, username, msgType, msgId) {
      this.showWritingLayer = true;
      this.msgInfo = {
        replyTo,
        username,
        msgType,
        prodcutId: this.pdId,
        msgId
      };
    },

    //上拉刷新
    pullToFresh(end) {
      this.refreshMessage();
      setTimeout(() => {
        end();
      }, 1000);
    },
    //下拉加载更多
    pullToLoadMore(end) {
      this.pageNumber++;
      this.getMessage(this.msgId, 2, this.pageNumber, 10);
      end();
    },
    //是否出现返回顶部按钮
    scrollEnd(translate, swiper) {
      this.isBacktopVisible = translate < 0 && -translate > swiper.height;
    },
    backToTop() {
      this.$refs.scroll && this.$refs.scroll.scrollToTop();
    }
  }
};
</script>

<style scoped lang="scss">
@import "~assets/scss/_variables.scss";
@import "~assets/scss/_mixins.scss";
.sub-msg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: $bgc-theme;
  z-index: $search-z-index;
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
  .sub-comment-list {
    width: 100%;
    padding-bottom: 4rem;
    .sub-comment {
      font-size: 0.7rem;
      margin-top: 0.5rem;
      padding: 0.2rem;
      background-color: rgb(252, 250, 250);
      width: 100%;
    }
    .sub-comment-user {
      color: $font-color;
      .text {
        color: grey;
        padding: 0 0.5rem;
      }
      .floor {
        position: absolute;
        right: 1rem;
        color: lightgrey;
      }
    }
    .sub-comment-content {
      padding: 0.2rem 0 0.2rem 0.5rem;
      width: 90%;
      word-wrap: break-word;
      word-break: normal;
    }
    .sub-ctrl-comment {
      text-align: right;
      padding-bottom: 0.3rem;
      color: rgb(50, 70, 136);
      span {
        padding: 0 0.3rem;
        font-size: 0.7rem;
      }
    }
  }
  .writing-msg-layer {
    width: 100%;
    position: absolute;
    bottom: 0;
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
  .back-to-top {
    position: absolute;
    bottom: 2rem;
    right: 2rem;
    z-index: 2500;
  }
}
.message-enter-active,
.message-leave-active {
  transition: all 0.3s;
}
.message-enter,
.message-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
