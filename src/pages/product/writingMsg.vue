<template>
  <transition name="message">
    <div class="writing-msg">
      <div class="title">
        <span class="text">回复</span>
        <span class="replyto">{{ info.replyTo }}</span>
        <span class="cancel" @click="close">取消</span>
      </div>

      <textarea
        placeholder="限120字内"
        class="text-area"
        maxlength="120"
        ref="text"
      />

      <div class="btn">
        <button @click="commitMsg">提交</button>
      </div>

      <div class="alert-box">
        <alert-box :msg="promptInfo" ref="alertBox" />
      </div>
    </div>
  </transition>
</template>

<script>
import alertBox from "components/helper/alertMsg";
import { submitMsg } from "@/api/message";
export default {
  data() {
    return {
      promptInfo: ""
    };
  },
  props: {
    info: {
      type: Object
    }
  },
  components: {
    alertBox
  },
  methods: {
    close() {
      this.$emit("close");
      //清空留言内容
      this.$refs.text.value = "";
    },

    //提交留言
    commitMsg() {
      let content = this.$refs.text.value;
      let infomation;
      if (content == "") {
        this.promptInfo = "内容不能为空";
        this.$refs.alertBox.showMsg();
        return;
      }
      //当为一级留言
      if (this.info.msgType == 1) {
        infomation = {
          proId: this.info.prodcutId,
          msgContent: content,
          publisher: this.info.username,
          replyTo: this.info.replyTo
        };
      }
      //当为二级留言
      if (this.info.msgType == 2) {
        infomation = {
          msgId: this.info.msgId,
          proId: this.info.prodcutId,
          subMsgContent: content,
          publisher: this.info.username,
          replyTo: this.info.replyTo
        };
      }

      this.submitMsgAxios({ data: infomation, type: this.info.msgType });
    },
    submitMsgAxios(data) {
      submitMsg(data)
        .then(res => {
          if (res.data.code == 200) {
            this.promptInfo = "留言成功";
            this.$refs.alertBox.showMsg();
            setTimeout(() => {
              this.$emit("close");
              this.$refs.text.value = "";
              //刷新留言
              this.$emit("refreshMsg");
            }, 1000);
          } else {
            this.promptInfo = "留言失败";
            this.$refs.alertBox.showMsg();
          }
        })
        .catch(err => {
          this.promptInfo = "留言失败";
          this.$refs.alertBox.showMsg();
          console.log(err);
        });
    }
  }
};
</script>

<style scoped lang="scss">
@import "~assets/scss/_variables.scss";
.writing-msg {
  z-index: $msg-z-index;
  width: 100%;
  background-color: $bgc-theme;
  padding: 0 1rem;
  .title {
    height: 1.5rem;
    background-color: $border-color;
    line-height: 1.5rem;
    margin: 0 -1rem;
    .text {
      padding-left: 1rem;
    }
    .replyto {
      color: $font-color;
      padding: 0 0.5rem;
    }
    .cancel {
      position: absolute;
      right: 1rem;
    }
  }

  .text-area {
    border: 2px solid $border-color;
    width: 100%;
    margin: 1rem 0;
    padding: 0.5rem;
    height: 10rem;
    border-radius: 0.5rem;
  }

  .btn {
    padding-bottom: 0.5rem;
    width: 100%;
    text-align: center;
    button {
      width: 4rem;
      height: 2rem;
      color: $font-color;
      background-color: $border-color;
      border-radius: 0.2rem;
    }
  }

  .alert-box {
    display: flex;
    justify-content: center;
  }
}

.message-enter-active,
.message-leave-active {
  transition: all 0.5s !important;
}
.message-enter,
.message-leave-to {
  transform: translate(0, 100%) !important;
}
</style>
