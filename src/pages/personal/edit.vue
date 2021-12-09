<template>
  <div class="edit-page">
    <div class="header">
      <span class="go-back" @click="goBack">&lt;</span>
      <span class="title">个人设置</span>
    </div>

    <div class="edit-item">
      <span>用户名：</span><span>{{ username }}</span>
    </div>
    <!-- 密码修改 -->
    <div class="edit-item">
      <span>修改密码</span>
      <span class="revise" @click="pwdBox"
        ><i class="iconfont">&#xe63d;</i></span
      >
      <div class="edit-box" v-show="showPwdBox">
        <input
          type="password"
          placeholder="请输入原密码"
          @input="checkOldPwd"
          ref="oldPwd"
        />
        <input
          type="password"
          placeholder="请输入新密码"
          @input="checkPwd"
          ref="newPwd"
        />
        <input type="password" placeholder="请确认新密码" @input="confirmPwd" />
        <span class="confirm" @click="modifyPwd">确认</span>
        <p class="warn-msg" v-show="showMsg">{{ warnMsg }}</p>
      </div>
    </div>
    <!-- 头像修改 -->
    <div class="edit-item">
      <span>修改头像</span>
      <span class="revise" @click="picBox"
        ><i class="iconfont">&#xe63d;</i></span
      >
      <div class="edit-box" v-show="showPicBox">
        <input
          type="file"
          id="picInput"
          accept="image/gif,image/jpg,image/png,image/jpeg"
          class="choose-file-input"
          @change="previewPic"
          ref="picInput"
        />
        <label for="picInput" class="choose-file">选择照片</label>
        <span class="confirm" @click="modifyPic">确认</span>
        <div class="user-pic">
          <img :src="imgsrc" />
        </div>
      </div>
    </div>

    <!-- 信息提示 -->
    <div class="alert-box" v-show="alerting">
      <alert-msg :msg="alertMessage" ref="alertbox" />
    </div>
  </div>
</template>

<script>
import img from "@/assets/pictures/orange.png";
import { modifyPassword, checkPassword } from "@/api/user.js";
import alertMsg from "@/components/helper/alertMsg";
import uploadPic from "@/api/uploadPic";

export default {
  name: "EditPage",
  data() {
    return {
      imgsrc: img, //头像预览
      showPwdBox: false,
      showPicBox: false,
      username: this.$store.state.userName,
      showMsg: false, //显示或隐藏提示消息
      warnMsg: "", //密码修改 提示消息的内容
      alertMessage: "", //弹出框的消息
      checkFlag: {
        //用于检查所有输入框是否输入及输入正确
        old: false,
        new: false,
        confirm: false
      },
      file: "", //头像文件
      timer: null,
      alerting: true
    };
  },
  components: {
    alertMsg
  },
  mounted() {
    const state = this.$store.state;
    if (state.userHead !== 'undefined') {
      this.imgsrc = state.userHead;
    }
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    pwdBox() {
      //修改密码处的隐藏、出现
      this.showPwdBox = !this.showPwdBox;
    },
    picBox() {
      //修改头像处的隐藏、出现
      this.showPicBox = !this.showPicBox;
    },
    setWarning(type, input, msg) {
      if (type == "warn") {
        input.classList.remove("green");
        input.classList.add("red");
        this.showMsg = true;
        this.warnMsg = msg;
      } else if (type == "success") {
        input.classList.add("green");
        input.classList.remove("red");
        this.showMsg = false;
      }
    },
    showAlert(msg) {
      //弹出信息框
      // if(this.alerting)return;
      this.alerting = true;
      this.alertMessage = msg;
      this.$refs.alertbox.showMsg();
      setTimeout(()=>{
        this.alerting = false;
      },1000)
    },
    checkOldPwd() {
      //检查原密码是否输入正确
      let input = this.$refs.oldPwd;
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        checkPassword({
          userName: this.$store.state.userName,
          password: input.value
        })
          .then(res => {
            console.log("检查原有密码", res);
            if (res.data.message) {
              this.setWarning("success", input);
              this.checkFlag.old = true;
            } else {
              this.setWarning("warn", input, "原密码错误");
            }
          })
          .catch(err => {
            console.log(err);
          });
      }, 500);
    },
    checkPwd(e) {
      //检查新密码格式
      let reg = /^[0-9a-zA-Z]{5,10}$/;
      let input = e.target;
      if (!reg.test(input.value)) {
        this.setWarning("warn", input, "密码应为5-10位字母、数字");
      } else {
        this.setWarning("success", input);
        this.checkFlag.new = true;
      }
    },
    confirmPwd(e) {
      //检查密码是否一致
      let pwd = this.$refs.newPwd.value;
      let input = e.target;
      if (pwd !== input.value) {
        this.setWarning("warn", input, "密码不一致");
      } else {
        this.setWarning("success", input);
        this.checkFlag.confirm = true;
      }
    },
    modifyPwd() {
      //提交修改密码的请求
      let flag = this.checkFlag;
      if (!flag.old || !flag.new || !flag.confirm) {
        this.showAlert("输入有误！");
        return;
      }
      let data = {
        userName: this.username,
        password: this.$refs.newPwd.value
      };
      modifyPassword(data)
        .then(res => {
          //提示修改成功并收起
          console.log("修改密码", res);
          if (res.data.code == 200) {
            this.showAlert("修改成功");
            this.pwdBox();
          }
        })
        .catch(err => {
          console.log(err);
          this.showAlert("发生错误，请重试");
        });
    },
    //图片预览
    previewPic() {
      let picInput = this.$refs.picInput;
      this.file = picInput.files[0];
      if (!this.file) return;
      if (this.file.size / 1024 / 1024 > 2) {
        this.showAlert("图片不能超过2MB");
        return;
      }
      this.imgsrc = window.URL.createObjectURL(this.file);
    },
    //提交修改头像请求
    modifyPic() {
      if (!this.file) return;
      uploadPic(this.file, this.username, 1)
        .then(res => {
          console.log("修改头像", res);
          this.showAlert("修改成功");
          this.picBox();
          //修改store里的头像
          this.$store.dispatch("TOUSERHEAD", res.data.filename);
        })
        .catch(err => {
          alert(err)
          console.log(err);
        });
    }
  }
};
</script>

<style scoped lang="scss">
@import "~assets/scss/_variables.scss";
@import "~assets/scss/_mixins.scss";
.edit-page {
  width: 100%;
  height: 100%;
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
  .edit-item {
    font-size: 0.8rem;
    margin: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid orange;
    position: relative;
    .revise {
      position: absolute;
      right: 0.5rem;
      color: $font-color;
    }
    .edit-box {
      display: block;
      margin-top: 0.5rem;
      input {
        border: 2px solid $border-color;
        padding: 0.2rem 0.4rem;
        margin-bottom: 0.5rem;
        &.red {
          border-color: red;
        }
        &.green {
          border-color: green;
        }
      }
      .confirm {
        color: $font-color;
        padding-left: 0.5rem;
      }
      .warn-msg {
        color: red;
      }
      .choose-file-input {
        position: absolute;
        left: 0;
        width: 0;
        opacity: 0;
      }
      .choose-file {
        background-color: $border-color;
        color: $font-color;
        font-size: 0.8rem;
        padding: 0.2rem;
        border-radius: 0.2rem;
        width: 4rem;
      }
      .user-pic {
        padding: 20px 0;
        height: 4rem;
        width: 4rem;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
    }
  }
  .alert-box {
    display: flex;
    justify-content: center;
    height: 5rem;
  }
}
</style>
