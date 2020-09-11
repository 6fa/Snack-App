<template>
  <transition name="login">
    <div class="login-layer">
      <!-- 信息提示框 -->
      <alert-msg :msg="alertMessage" ref="alertMsgBox" />
      <!-- 登录框 -->
      <div class="sign-in" v-if="signIn">
        <div class="form">
          <p class="title">请登录</p>
          <p class="input-box">
            <span class="label">用户名:</span>
            <input
              type="text"
              placeholder="请输入用户名"
              required
              name="username"
              v-model="inName"
            />
          </p>
          <p class="input-box">
            <span class="label">密码:</span>
            <input
              type="password"
              placeholder="请输入密码"
              required
              name="pwd"
              v-model="inPwd"
            />
          </p>
          <p class="btn">
            <button @click="cancel" type="button">取消</button>
            <button type="button" @click="signInAxios">登录</button>
          </p>
        </div>
      </div>

      <!-- 注册框 -->
      <div class="sign-up" v-if="signUp">
        <div class="form">
          <p class="title">请注册</p>
          <p class="warn-message" ref="warnMsg" v-show="hideMsg">!提示信息</p>
          <p class="input-box">
            <span class="label">*用户名:</span>
            <input
              type="text"
              placeholder="请输入用户名"
              required
              @input="checkName"
              ref="signupName"
            />
          </p>
          <p class="input-box">
            <span class="label">*密码:</span>
            <input
              type="password"
              placeholder="请输入密码"
              @input="checkPwd"
              required
              ref="signupPwd"
            />
          </p>
          <p class="input-box">
            <span class="label">*确认密码:</span>
            <input
              type="password"
              placeholder="请再次输入密码"
              @input="checkIfSame"
              required
              ref="pwdAgain"
            />
          </p>
          <p class="select-picture">
            <span class="label">头像:</span>
            <input
              class="choose-file-input"
              type="file"
              accept="image/gif,image/jpg,image/png,image/jpeg"
              ref="picInput"
              id="picInput"
              @change="previewPic"
            />
            <label for="picInput" class="choose-file">选择照片</label>
          </p>
          <p class="pic-box" v-show="showPic">
            <img class="user-pic" :src="imgSrc" />
            <span class="pic-cancel" @click="cancelPic">取消</span>
          </p>
          <p class="btn">
            <button type="button" @click="cancel">取消</button>
            <button type="submit" @click="signUpAxios">
              注册
            </button>
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { userSignIn, userRegister } from "@/api/user.js";
import alertMsg from "@/components/helper/alertMsg";

export default {
  name: "LoginLayer",
  data() {
    return {
      signUpError: true, //用于检测注册输入框是否全部输入正确
      imgSrc: "",
      registerLoding: false, //防注册重复提交
      signinLoading: false, //防止重复登录
      inName: "",
      inPwd: "",
      hideMsg: false,
      showPic: false,
      alertMessage: "成功" //提示信息
    };
  },
  components: {
    alertMsg
  },
  props: {
    signIn: {
      type: Boolean,
      default: false
    },
    signUp: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    //关闭登录窗口
    cancel() {
      this.$emit("cancel");
    },
    //提示信息弹窗
    showMyMsg(msg) {
      this.alertMessage = msg;
      this.$refs.alertMsgBox.showMsg();
    },
    //登录
    signInAxios() {
      let data = { userName: this.inName, password: this.inPwd };
      if (!this.signinLoading) {
        this.signinLoading = true;
        userSignIn(data)
          .then(res => {
            console.log(res);
            if (res.data.code == 200) {
              if (res.data.message == true) {
                this.showMyMsg("登录成功");
                setTimeout(() => {
                  this.cancel();
                }, 1000);
              } else {
                this.showMyMsg("用户名不存在");
              }
              this.signinLoading = false;
            }
          })
          .catch(err => {
            console.log(err);
            this.showMyMsg("登录失败");
            this.signinLoading = false;
          });
      }
    },
    //注册
    signUpAxios() {
      let data1 = {
        userName: this.$refs.signupName.value,
        password: this.$refs.signupPwd.value,
        userHead: this.imgSrc || ""
      };

      if (!this.registerLoding) {
        this.registerLoding = true;
        userRegister(data1)
          .then(response => {
            if (response.data.code == "200") {
              alert(response.data.message);
              this.registerLoding = false;
              // this.cancel();
              console.log(response);
            } else {
              this.registerLoding = false;
              alert("！注册失败----");
            }
          })
          .catch(err => {
            console.log(err);
            this.registerLoding = false;
            alert("注册失败");
          });
      }
    },
    //检查不通过的提示信息
    setWarnMsg(input, msg) {
      this.hideMsg = true;
      this.$refs.warnMsg.innerHTML = msg;
      input.classList.remove("success");
      input.classList.add("warn");
      this.signUpError = true;
    },
    // 检查通过的提示信息
    setSuccessMsg(input) {
      this.hideMsg = false;
      input.classList.remove("warn");
      input.classList.add("success");
      this.signUpError = false;
    },
    //检查注册用户名
    checkName() {
      //检测用户名是否已经存在+长度
      let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{4,8}$/;
      const signupName = this.$refs.signupName;
      if (!reg.test(signupName.value)) {
        this.setWarnMsg(signupName, "!用户名为4-8位字母、数字、中文、下划线");
      } else {
        this.setSuccessMsg(signupName);
      }
    },
    //检查注册密码
    checkPwd() {
      let reg = /^[0-9a-zA-Z]{5,10}$/;
      const signupPwd = this.$refs.signupPwd;
      if (!reg.test(signupPwd.value)) {
        this.setWarnMsg(signupPwd, "!密码为5-10位字母、数字");
      } else {
        this.setSuccessMsg(signupPwd);
      }
    },
    //检查注册密码是否相同
    checkIfSame() {
      const signupPwd = this.$refs.signupPwd;
      const pwdAgain = this.$refs.pwdAgain;
      if (signupPwd.value !== pwdAgain.value) {
        this.setWarnMsg(pwdAgain, "!密码不一致");
      } else {
        this.setSuccessMsg(pwdAgain);
      }
    },
    //图片预览
    previewPic() {
      let picInput = this.$refs.picInput;
      let file = picInput.files[0];
      if (!file) return;
      if (file.size / 1024 / 1024 > 2) {
        this.setWarnMsg(picInput, "!图片不能超过2MB");
        return;
      }
      this.hideMsg = false;
      this.imgSrc = window.URL.createObjectURL(file);
      console.log(typeof this.imgSrc);
      this.showPic = true;
    },
    // 取消上传图片
    cancelPic() {
      this.showPic = false;
      this.imgSrc = "";
    }
  }
};
</script>

<style scoped lang="scss">
@import "~assets/scss/_variables.scss";
@import "~assets/scss/_mixins.scss";
.login-layer {
  width: 100%;
  height: 100%;
  padding: 0 1rem;
  position: absolute;
  left: 0;
  top: 0;
  z-index: $login-z-index;
  background-color: rgba(0, 0, 0, 0.3);
  color: $font-color;
  font-size: 1rem;
  input {
    width: 8rem;
  }
  @include flex-center();
  .sign-in,
  .sign-up {
    width: 100%;
    background-color: #fff;
    border-radius: 30px;
    .form {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
    }
    .title {
      text-align: center;
    }
    .warn-message {
      text-align: center;
      font-size: 0.8rem;
      color: red;
      @include ellipsis();
    }
    .label {
      width: 5rem;
    }
    .input-box {
      padding: 0 1rem;
      display: flex;
      input {
        border: 1px solid $font-color;
        font-size: 0.8rem;
        text-indent: 0.2rem;
        &.warn {
          border: 2px solid red;
        }
        &.success {
          border: 2px solid green;
        }
      }
    }
    .btn {
      @include flex-center();
      button {
        margin-right: 1rem;
        background-color: $border-color;
        color: $font-color;
        padding: 10px 20px;
        border-radius: 10px;
      }
    }
  }
  .sign-in {
    height: 10rem;
  }
  .sign-up {
    height: 20rem;
    .select-picture {
      padding: 0 1rem;
      display: flex;
      .choose-file-input {
        opacity: 0;
        width: 0;
      }
      .choose-file {
        background-color: $border-color;
        color: $font-color;
        font-size: 0.8rem;
        width: 4rem;
        @include flex-center();
      }
    }
    .pic-box {
      width: 100%;
      height: 4rem;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 4rem;
        height: 100%;
        border-radius: 50%;
      }
      .pic-cancel {
        font-size: 0.8rem;
        padding-left: 10px;
      }
    }
  }
}

.login-enter-active,
.login-leave-active {
  transition: all 0.3s;
}
.login-enter,
.login-leave-to {
  transform: translate(0, -100%);
}
</style>
