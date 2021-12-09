<template>
  <swiper :options="swiperOption" ref="mySwiper">
    <!-- 下拉 -->
    <div class="pull-down" v-if="pullDown">
      <base-loading ref="pullDownLoading" />
    </div>

    <swiper-slide>
      <slot></slot>
    </swiper-slide>

    <!-- 上拉 -->
    <div class="pull-up" v-if="pullUp">
      <base-loading ref="pullUpLoading" />
    </div>

    <!-- 滚动条 -->
    <div class="swiper-scrollbar" v-if="scrollbar" slot="scrollbar"></div>
  </swiper>
</template>

<script>
// import { swiper, swiperSlide } from "vue-awesome-swiper";
import { Swiper, SwiperSlide} from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

import BaseLoading from "base/loading";
import {
  PULL_DOWN_HEIGHT,
  PULL_DOWN_TEXT_START,
  PULL_DOWN_TEXT_ING,
  PULL_UP_HEIGHT,
  PULL_UP_TEXT_START,
  PULL_UP_TEXT_ING,
  PULL_DOWN_TEXT_END,
  PULL_UP_TEXT_END
} from "./config.js";

export default {
  name: "BaseScroll",
  components: {
    swiper: Swiper,
    swiperSlide: SwiperSlide,
    BaseLoading
  },
  props: {
    scrollbar: {
      type: Boolean,
      default: true
    },
    updateFlag: {
      type: [Array, Object]
    },
    pullDown: {
      type: Boolean,
      default: false
    },
    pullUp: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.init();
  },
  watch: {
    updateFlag() {
      this.updateScroll();
    }
  },
  methods: {
    translateTo(translate,speed){
      this.$refs.mySwiper.swiperInstance.translateTo(translate,speed);
    },
    scrollToTop(speed, runcallbacks) {
      this.$refs.mySwiper &&
        this.$refs.mySwiper.swiperInstance.slideTo(0, speed, runcallbacks);
    },
    updateScroll() {
      this.$nextTick(() => {
        this.$refs.mySwiper && this.$refs.mySwiper.swiperInstance.update();
      });
    },
    init() {
      this.pulling = false;
      this.swiperOption = {
        direction: "vertical",
        slidesPerView: "auto",
        freeMode: true,
        setWrapperSize: true,
        scrollbar: {
          el: ".swiper-scrollbar",
          hide: true
        },
        on: {
          sliderMove: this.scroll, //拖动
          touchEnd: this.touchEnd, //松手
          transitionEnd: this.scrollEnd // 由于自由滑动模式下可能会滑动很远 // 用于提示返回顶部按钮是否显示隐藏
        }
      };
    },
    scroll() {
      //console.log(this.$refs.mySwiper.swiper.translate);
      //const swiper = this.$refs.mySwiper.swiper;
      const swiper = this.$refs.mySwiper.swiperInstance;
      if (this.pulling) return;
      if (swiper.translate > 0) {
        //下拉
        if (!this.pullDown) return;
        this.$refs.pullDownLoading.setText(PULL_DOWN_TEXT_START);
      }
      if (swiper.translate < 0) {
        //上拉
        if (!this.pullUp) return;
        this.$refs.pullUpLoading.setText(PULL_UP_TEXT_START);
      }
    },
    touchEnd() {
      //const swiper = this.$refs.mySwiper.swiper;
      const swiper = this.$refs.mySwiper.swiperInstance;
      if (swiper.translate > PULL_DOWN_HEIGHT) {
        //可以刷新
        if (!this.pullDown) return;
        this.pulling = true;
        swiper.allowTouchMove = false; //禁止触摸
        swiper.setTransition(swiper.params.speed); //设置过渡时间
        swiper.setTranslate(PULL_DOWN_HEIGHT); //停在这个位置
        swiper.params.virtualTranslate = true; //定住不给回弹
        this.$refs.pullDownLoading.setText(PULL_DOWN_TEXT_ING);
        this.$emit("pull-down", this.pullDownEnd);
      } else if (swiper.isEnd) {
        const totalHeight = parseInt(swiper.$wrapperEl.css("height"));
        const isPullUp =
          Math.abs(swiper.translate) + swiper.height - PULL_UP_HEIGHT >
          totalHeight;
        if (isPullUp) {
          if (!this.pullUp) return;
          this.pulling = true;
          swiper.allowTouchMove = false; //禁止触摸
          swiper.setTransition(swiper.params.speed); //设置过渡时间
          swiper.setTranslate(-(totalHeight + PULL_UP_HEIGHT - swiper.height)); //停在这个位置
          swiper.params.virtualTranslate = true; //定住不给回弹
          this.$refs.pullUpLoading.setText(PULL_UP_TEXT_ING);
          this.$emit("pull-up", this.pullUpEnd);
        }
      }
    },
    pullDownEnd() {
      const swiper = this.$refs.mySwiper.swiperInstance;
      this.pulling = false;
      this.$refs.pullDownLoading.setText(PULL_DOWN_TEXT_END);
      swiper.params.virtualTranslate = false;
      swiper.allowTouchMove = true;
      swiper.setTransition(swiper.params.speed);
      swiper.setTranslate(0);
    },
    pullUpEnd() {
      const swiper = this.$refs.mySwiper.swiperInstance;
      this.pulling = false;
      this.$refs.pullUpLoading.setText(PULL_UP_TEXT_END);
      swiper.params.virtualTranslate = false;
      swiper.allowTouchMove = true;
    },
    scrollEnd() {
      this.$emit(
        "scroll-end",
        this.$refs.mySwiper.swiperInstance.translate,
        this.$refs.mySwiper.swiperInstance
      );
    }
  }
};
</script>

<style scoped lang="scss">
.swiper-container {
  overflow: hidden;
  height: 100%;
  width: 100%;
}
.swiper-slide {
  height: auto;
}
.pull-down,
.pull-up {
  position: absolute;
  left: 0;
  width: 100%;
  height: 200px;
}
.pull-down {
  bottom: 100%;
}
.pull-up {
  top: 100%;
}
</style>
