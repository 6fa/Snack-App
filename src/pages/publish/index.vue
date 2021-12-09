<template>
<div class="wrapper" ref="wrapper">
  <base-scroll ref="scrollbar">
    <div class="publish-page">
      <h3>零食分享</h3>

      <form name="publish-product">
        <div class="snack-name">
          <p class="title">*零食名</p>
          <input
            type="text"
            required
            ref="snackName"
            @input="checkName"
            @blur="test"
            placeholder="限10字内"
          />
        </div>

        <div class="snack-desc">
          <p class="title">*我的描述/想法</p>
          <textarea
            maxlength="120"
            placeholder="最多输入120个字符"
            rows="10"
            required
            ref="snackDesc"
            @input="checkDesc"
            @blur="test"
          />
        </div>

        <div class="upload-pic">
          <p class="title">零食图片</p>
          <input
            type="file"
            accept="image/gif,image/jpg,image/png,image/jpeg"
            @change="previewPic"
            name="snackPic"
            class="file-input"
            id="fileInput"
            ref="fileInput"
          />
          <label for="fileInput" class="choose-file">选择图片</label>
          <div class="img-box" v-show="file">
            <img ref="preview" v-show="showPic" />
          </div>
        </div>

        <div class="snack-price">
          <p class="title">价格</p>
          <span>￥</span
          ><input
            ref="snackPrice"
            placeholder="请输数字"
            @input="checkPrice"
            @blur="ifreset"
          />
        </div>

        <button type="button" class="submit-btn" @click="formValidation">
          <i class="iconfont">&#xe6a9;</i>
        </button>
      </form>
    </div>
    <!-- 消息提示框 -->
    <div class="alert-box">
      <alert-msg :msg="message" ref="alertBox" />
    </div>
  </base-scroll>
</div>
</template>

<script>
import BaseScroll from "base/scroll";
import alertMsg from "components/helper/alertMsg";
import { publishPd } from "@/api/product.js";
import uploadPic from "@/api/uploadPic.js";
export default {
  name: "publishPage",
  components: {
    BaseScroll,
    alertMsg
  },
  data() {
    return {
      showPic: false, //显示图片预览
      message: "", //提示信息
      file: "", //图片文件
      validation: {
        name: false,
        desc: false,
        price: true
      },
      loading: false, //防重复提交
      isPublishSuccess: false, //是否成功发布
      productId: "", //提交请求后返回的商品id
      pageHeight: '',
      timer:null
    };
  },
  mounted(){
    this.pageHeight =window.getComputedStyle(this.$refs.wrapper).height;
  },
  methods: {
    //图片预览
    previewPic(e) {
      // console.log(e.target.files);
      let files = e.target.files;
      if (files && files.length > 0) {
        this.file = files[0];
        if (this.file.size > 1024 * 1024 * 2) {
          this.message = "图片不能超过2MB";
          this.file = "";
          this.$refs.alertBox.showMsg();
          e.target.value = "";
          return false;
        }
        const URL = window.URL || window.webkitURL;
        let imgUrl = URL.createObjectURL(this.file);
        this.$refs.preview.onload = function(){
          console.log('--')
          URL.revokeObjectURL(imgUrl)
        }
        this.$refs.preview.setAttribute("src", imgUrl);
        this.showPic = true;
        this.$refs.scrollbar.updateScroll();
      }
    },
    checkInfo(el, reg, op) {
      if (!reg.test(el.value)) {
        el.classList.add("warn");
        this.validation[op] = false;
      } else {
        el.classList.remove("warn");
        this.validation[op] = true;
      }
    },
    //检查零食名称
    checkName() {
      let reg = /^.{0,10}$/;
      this.checkInfo(this.$refs.snackName, reg, "name");
    },
    //检查零食描述
    checkDesc() {
      let reg = /^.{0,120}$/;
      this.checkInfo(this.$refs.snackDesc, reg, "desc");
    },
    //检查零食价格
    checkPrice() {
      let reg = /^\d+.?\d{0,2}$/;
      this.checkInfo(this.$refs.snackPrice, reg, "price");
    },
    //价格检查
    ifreset() {
      let el = this.$refs.snackPrice;
      if (!el.value) {
        this.validation.price = true;
        el.classList.remove("warn");
      }

      this.test();
    },
    test(){
      window.scrollTo(0,0);
    },
    //提交请求
    formValidation() {
      let { name, desc, price } = this.validation;

      if (!name || !desc || !price) {
        this.message = "填写信息有误";
        this.$refs.alertBox.showMsg();
        return;
      }
      //发送提交请求---防重复提交
      if (!this.loading) {
        this.loading = true;
        let data = {
          publisher: this.$store.state.userName,
          content: this.$refs.snackDesc.value,
          price: this.$refs.snackPrice.value,
          productName: this.$refs.snackName.value
        };

        publishPd(data)
          .then(res => {
            console.log("发布商品成功", res);
            this.message = res.data.message;
            this.$refs.alertBox.showMsg();
            this.loading = false;
            this.isPublishSuccess = true;

            this.productId = res.data.productId; //商品id
            //发布成功后上传图片
            this.upload();
            //重置表达，设置1000ms是因为要在发布成功提示框消失后再重置
            setTimeout(() => {
              this.resetAll();
            }, 1000);
          })
          .catch(err => {
            this.message = "发生错误，请重试";
            this.$refs.alertBox.showMsg();
            this.isPublishSuccess = false;
            console.log(err);
          })
          
      }
    },
    // 发布后把图片上传到服务器
    upload() {
      if (!this.file || !this.isPublishSuccess) return; //无头像或者发布失败都不往下执行
      uploadPic(this.file, this.productId, 2)
        .then(res => {
          console.log("上传图片成功",res);
        })
        .catch(err => {
          console.log("上传图片失败",err);
        });
    },

    // 发布成功后重置所有
    resetAll() {
      this.file = "";
      this.productId = "";
      this.$refs.snackName.value = "";
      this.$refs.snackPrice.value = "";
      this.$refs.snackDesc.value = "";
      this.showPic = false;
      this.$refs.fileInput.value = "";

      this.$refs.scrollbar.scrollToTop();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/_variables.scss";
.wrapper {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.publish-page {
  width: 100%;
  height: 100%;
  padding: 2rem;
  font-size: 0.8rem;
  h3 {
    font-size: 0.9rem;
    height: 1.5rem;
    line-height: 1.5rem;
    text-align: center;
    background-color: #f5dcc0;
    border-radius: 10px;
  }
  input,
  textarea {
    border: 2px solid rgb(243, 186, 81);
    padding: 0.2rem;
    border-radius: 10px;
  }
  input.warn {
    border: 3px solid red;
  }
  .title {
    color: $font-color;
    margin: 0.5rem 0;
  }
  .snack-desc {
    width: 100%;
    textarea {
      width: 100%;
    }
  }
  .upload-pic {
    display: flex;
    flex-direction: column;
    .file-input {
      display: none;
    }
    .choose-file {
      text-align: center;
      padding: 0.2rem;
      width: 5rem;
      border-radius: 0.2rem;
      color: $font-color;
      background-color: #f5dcc0;
    }
    .img-box {
      width: 100%;
      height: 10rem;
      overflow: hidden;
      padding-top: 0.5rem;
    }
    img {
      height: 100%;
    }
  }
  .submit-btn {
    position: relative;
    margin-top: 2rem;
    margin-bottom: 4rem;
    left: 50%;
    margin-left: -2rem;
    width: 4rem;
    height: 2rem;
    font-size: 1.5rem;
    background-color: #f5dcc0;
    border-radius: 10px;
    .iconfont {
      color: $icon-color;
    }
  }
}
.alert-box {
  display: flex;
  justify-content: center;
}
</style>
