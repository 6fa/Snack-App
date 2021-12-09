<template>
  <!-- <transition name="login" appear> -->
    <div class="login-layer">
      <!-- 切换选项卡 -->
      <div class="tab-box">
        <button class="tab-option active" @click="toLoginPage" ref="loginBtn">
          登录
        </button>
        <button class="tab-option" @click="toRegisterPage" ref="registerBtn">
          注册
        </button>
      </div>
      <!-- 信息提示框 -->
      <alert-msg :msg="alertMessage" ref="alertMsgBox" />
      <!-- 登录框 -->
      <login-box
        @cancelLoginbox="cancel"
        @alertFromLogin="showMyMsg"
        v-if="signIn"
      />

      <!-- 注册框 -->
      <register-box
        @cancelRegistbox="cancel"
        @alertFromRegister="showMyMsg"
        @jumpToLogin="toLoginPage"
        v-if="!signIn"
      />
    </div>
  <!-- </transition> -->
</template>

<script>
import alertMsg from "@/components/helper/alertMsg";
import LoginBox from "./login";
import RegisterBox from "./register";

export default {
  name: "LoginLayer",
  data() {
    return {
      alertMessage: "成功", //提示信息
      signIn: true
    };
  },
  components: {
    alertMsg,
    LoginBox,
    RegisterBox
  },
  methods: {
    //关闭登录窗口
    cancel() {
      this.$router.back();
    },
    //提示信息弹窗
    showMyMsg(msg) {
      this.alertMessage = msg;
      this.$refs.alertMsgBox.showMsg();
    },
    toLoginPage() {
      console.log(this.signIn)
      if (!this.signIn) {
        this.signIn = true;
        this.$refs.loginBtn.classList.add("active");
        this.$refs.registerBtn.classList.remove("active");
      }
    },
    toRegisterPage() {
      if (this.signIn) {
        this.signIn = false;
        this.$refs.loginBtn.classList.remove("active");
        this.$refs.registerBtn.classList.add("active");
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "~assets/scss/_variables.scss";
@import "~assets/scss/_mixins.scss";
.login-enter-active,
.login-leave-active {
  transition: all 0.3s;
}
.login-enter,
.login-leave-to {
  transform: translate3d(100%, 0, 0);
}

.login-layer {
  width: 100%;
  height: 100%;
  padding: 0 1rem;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: $login-z-index;
  background-color: rgba($color: #f8d4aa, $alpha: 0.7);
  color: $font-color;
  font-size: 1rem;
  input {
    width: 8rem;
  }
  @include flex-center(column);
  .tab-box {
    align-self: flex-start;
    button {
      width: 3rem;
      height: 2rem;
      background-color: #fff;
      border-radius: 0.3rem;
      margin: 0.5rem 0.3rem;
      &.active {
        background-color: rgb(252, 174, 30);
      }
    }
  }
}
</style>
