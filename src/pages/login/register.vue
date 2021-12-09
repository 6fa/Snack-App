<template>
  <!-- 注册框 -->
  <div class="sign-up">
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
</template>

<script>
import { userRegister, isNameExisted } from "@/api/user.js";
import uploadPic from "@/api/uploadPic.js";

export default {
  name: "RegisterBox",
  data() {
    return {
      registerFlag: {
        //用于检测注册输入框是否有输入，且输入正确
        name: false,
        pwd: false,
        confirmPwd: false
      },
      imgSrc: "",
      registerLoding: false, //防注册重复提交
      checking: false, //防止检查的重复提交
      hideMsg: false,
      showPic: false,
      alertMessage: "成功", //提示信息
      file: "", //头像图片文件
      isRegisterSuccess: false
    };
  },
  methods: {
    //关闭登录窗口
    cancel() {
      this.$emit("cancelRegistbox");
    },
    //提示信息弹窗
    showMyMsg(msg) {
      this.alertMessage = msg;
      this.$refs.alertMsgBox.showMsg();
    },

    //注册
    signUpAxios() {
      if (
        !this.registerFlag.name ||
        !this.registerFlag.pwd ||
        !this.registerFlag.confirmPwd
      ) {
        this.$emit("alertFromRegister", "信息填写不正确！");
        return;
      }
      let data = {
        userName: this.$refs.signupName.value,
        password: this.$refs.signupPwd.value
      };
      this.isRegisterSuccess = false;
      if (!this.registerLoding) {
        this.registerLoding = true;
        userRegister(data)
          .then(response => {
            if (response.data.code == "200") {
              this.registerLoding = false;
              this.$emit("alertFromRegister", "注册成功");
              this.isRegisterSuccess = true;
              setTimeout(() => {
                //注册成功后跳转到登录页面，及上传头像
                this.toLogin();
                this.upload();
              }, 1000);
            } else {
              this.registerLoding = false;
              this.$emit("alertFromRegister", "注册失败");
              this.isRegisterSuccess = false;
            }
          })
          .catch(err => {
            console.log(err);
            this.registerLoding = false;
            this.$emit("alertFromRegister", "注册失败");
            this.isRegisterSuccess = false;
          })
      }
    },
    // 注册成功后跳转到登录
    toLogin() {
      this.$emit("jumpToLogin");
    },
    //注册成功后上传头像
    upload() {
      if (!this.file || !this.isRegisterSuccess) return; //无头像或者注册失败都不往下执行
      let userName = this.$refs.signupName.value;
      uploadPic(this.file, userName, 1)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
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
      const signupName = this.$refs.signupName;

      //检测用户名长度
      let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{4,8}$/;

      if (!reg.test(signupName.value)) {
        this.setWarnMsg(signupName, "!用户名为4-8位字母、数字、中文、下划线");
      } else {
        //检测用户名是否存在
        if (!this.checking) {
          this.checking = true;
          isNameExisted({ userName: signupName.value }).then(res => {
            if (res.data.code == 200 && res.data.message == true) {
              this.setWarnMsg(signupName, "用户名已存在");
              this.checking = false;
            } else {
              this.setSuccessMsg(signupName);
              this.registerFlag["name"] = true;
              this.checking = false;
            }
          });
        }
      }
    },
    //检查注册密码
    checkPwd() {
      let reg = /^[0-9a-zA-Z]{5,10}$/;
      const signupPwd = this.$refs.signupPwd;
      if (!reg.test(signupPwd.value)) {
        this.setWarnMsg(signupPwd, "!密码为5-10位字母、数字");
      } else {
        this.registerFlag["pwd"] = true;
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
        this.registerFlag["confirmPwd"] = true;
        this.setSuccessMsg(pwdAgain);
      }
    },
    //图片预览
    previewPic() {
      let picInput = this.$refs.picInput;
      this.file = picInput.files[0];
      if (!this.file) return;
      if (this.file.size / 1024 / 1024 > 2) {
        this.setWarnMsg(picInput, "!图片不能超过2MB");
        return;
      }
      this.hideMsg = false;
      this.imgSrc = window.URL.createObjectURL(this.file);

      this.showPic = true;
    },
    // 取消上传图片
    cancelPic() {
      this.showPic = false;
      this.file = "";
      this.imgSrc = "";
    }
  }
};
</script>

<style scoped lang="scss">
@import "~assets/scss/_variables.scss";
@import "~assets/scss/_mixins.scss";

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
      border: 2px solid $font-color;
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
</style>
