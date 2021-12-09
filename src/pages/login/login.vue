<template>
  <!-- 登录框 -->
  <div class="sign-in">
    <div class="form">
      <p class="title">请登录</p>
      <p class="input-box">
        <span class="label">用户名:</span>
        <input
          type="text"
          placeholder="请输入用户名"
          name="username"
          v-model="username"
        />
      </p>
      <p class="input-box">
        <span class="label">密码:</span>
        <input
          type="password"
          placeholder="请输入密码"
          name="pwd"
          v-model="password"
        />
      </p>
      <p class="btn">
        <button @click="cancel" type="button">取消</button>
        <button type="button" @click="signInAxios">登录</button>
      </p>
    </div>
  </div>
</template>

<script>
import { userSignIn } from "@/api/user.js";
export default {
  name: "LoginBox",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    //关闭登录窗口
    cancel() {
      this.$router.push("/home");
    },
    //登录
    signInAxios() {
      if (!this.username || !this.password) {
        this.$emit("alertFromLogin", "账号和密码不能为空");
        return;
      }
      let data = { userName: this.username, password: this.password };
      if (!this.signinLoading) {
        this.signinLoading = true;
        userSignIn(data)
          .then(res => {
            if (res.data.code == 200) {
              if (res.data.message == true) {
                this.$emit("alertFromLogin", "登录成功");

                //将信息储存到localstorage
                this.$store.dispatch("TOLOGIN", res.data.token);
                this.$store.dispatch("TOUSERNAME", res.data.userName);
                this.$store.dispatch("TOUSERHEAD", res.data.userHead);

                console.log(this.$route, this.$route.query.redirect);
                let redirect = this.$route.query.redirect;
                if (redirect) {
                  setTimeout(() => {
                    this.$router.push(redirect);
                  }, 1000);
                } else {
                  setTimeout(() => {
                    this.cancel();
                  }, 1000);
                }
              } else if (res.data.message == false) {
                this.$emit("alertFromLogin", "密码错误！");
              } else {
                this.$emit("alertFromLogin", "用户名不存在！");
              }
              this.signinLoading = false;
            }
          })
          .catch(err => {
            console.log(err);
            this.$emit("alertFromLogin", "登录失败");
            this.signinLoading = false;
          });
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "~assets/scss/_variables.scss";
@import "~assets/scss/_mixins.scss";
.sign-in {
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
.sign-in {
  height: 10rem;
}
</style>
