<template>
  <div class="message">
    <div class="reply">
      <button class="reply-btn" @click="writeMsg">我要留言</button>
    </div>

    <div class="all-msg">
      <div class="comment" v-for="item in msgList" :key="item._id">
        <p class="comment-user">{{ item.publisher }}</p>
        <p class="comment-content">
          {{ item.msgContent }}
        </p>
        <p class="reply-comment">
          <!-- 删除按钮只有回复本人有 -->
          <span @click="writeSubMsg(item.publisher, item._id)">回复</span>
          <span v-if="user === item.publisher" @click="deleteMessage(item._id)"
            >删除</span
          >
          <span @click="toSubComment(item._id, item.publisher, item.subMsgNum)"
            >评论({{ item.subMsgNum }})></span
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { getMsgContent, deleteMsg } from "@/api/message";
export default {
  data() {
    return {
      user: this.$store.state.userName,
      msgList: [],
      promptInfo: "",
      pageNumber: 0
    };
  },
  props: {
    publisher: {
      type: String
    },
    productId: {
      type: String
    }
  },
  watch: {
    $route(newR, oldR) {
      if (oldR.name == "submsg") {
        this.updateMessage();
        this.$emit("updateMsgNum");
      }
    }
  },
  created() {
    //获取留言
    this.getMessage(this.productId, 1, this.pageNumber, 5);
  },
  methods: {
    toSubComment(msgId, publisher) {
      // if (subMsgNum == 0) {

      // }; //如果评论为0，不进入详情页
      this.$router.push({
        name: "submsg",
        params: {
          pdId: this.productId,
          messageId: msgId,
          msgPubliser: publisher
        }
      });
    },
    getMessage(id, type, pageNum, pageSize) {
      getMsgContent({ id, type, pageNum, pageSize })
        .then(res => {
          console.log("获取一级留言", res);
          if (res.data.data.length == 0) {
            if (pageNum == 0) return;
            this.pageNumber--;
            this.$emit("alertMsg", "已加载全部");
            return;
          }
          this.msgList.push(...res.data.data);
          this.$emit("loaded");
        })
        .catch(err => {
          console.log(err);
        });
    },
    //刷新留言
    updateMessage() {
      this.msgList = [];
      this.pageNumber = 0;
      this.getMessage(this.productId, 1, this.pageNumber, 5);
    },
    //删除留言
    deleteMessage(id) {
      if (!this.$store.state.isloaded) {
        this.$emit("alertMsg", "未登录");
        return;
      }
      deleteMsg({ id, type: 1 })
        .then(res => {
          if (res.data.code == 200) {
            this.updateMessage();
            this.$emit("updateMsgNum");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    checkIfLoaded() {
      if (!this.$store.state.isloaded) {
        this.$emit("alertMsg", "未登录");
        return false;
      } else {
        return true;
      }
    },
    writeMsg() {
      if (!this.$store.state.isloaded) {
        // this.promptInfo = "未登录";
        // this.$refs.alertBox.showMsg();
        this.$emit("alertMsg", "未登录");
        return;
      }
      //传参：回复谁(publisher，回复人本身(user,一级留言(1
      console.log(this.publisher, this.user);
      this.$emit("writeMsg", this.publisher, this.user, 1);
    },
    writeSubMsg(publisher, msgId) {
      //没有登录则不往下执行
      if (!this.$store.state.isloaded) {
        this.$emit("alertMsg", "未登录");
        return;
      }
      //传参：回复谁(publisher，回复人本身(user,一级留言(1
      this.$emit("writeSubMsg", publisher, this.user, 2, msgId);
    },
    //加载更多
    loadMore() {
      this.pageNumber++;
      this.getMessage(this.productId, 1, this.pageNumber, 5);
    }
  }
};
</script>

<style scoped lang="scss">
@import "~assets/scss/_variables.scss";
.message {
  background-color: #fff;
  padding: 0.8rem 2rem;
  color: rgb(90, 89, 89);
  width: 100%;
  // padding: .5rem 2rem;
  .reply {
    display: flex;
    justify-content: space-between;
    .reply-btn {
      padding: 0.3rem 0.5rem;
      background-color: orange;
      border-radius: 10px;
    }
  }

  .all-msg {
    .comment {
      border-bottom: 1px solid orange;
      padding: 1rem 0;
    }
    .comment-user {
      color: $font-color;
    }
    .comment-content {
      font-size: 0.7rem;
      padding: 0.5rem;
      word-wrap: break-word;
      word-break: normal;
    }
    .reply-comment {
      font-size: 0.7rem;
      text-align: right;
      span {
        display: inline-block;
        text-align: center;
        padding: 0.1rem 0.3rem;
        background-color: $border-color;
        margin-left: 0.5rem;
      }
    }

    .sub-reply {
      text-align: right;
      margin-left: 1.5rem;
      margin-top: 0.5rem;
      font-size: 0.7rem;
      input {
        border: 1px solid orange;
        width: 75%;
      }
      .sub-reply-btn {
        width: 25%;
        background-color: transparent;
        color: $font-color;
      }
    }
  }
}
</style>
