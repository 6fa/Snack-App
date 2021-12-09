<template>
  <div class="base-loading" :class="{ 'base-loading-inline': inline }">
    <div class="base-loading-indicator" v-if="indicator === 'on'">
      <img src="./loading.gif" alt="loading" />
    </div>
    <div class="base-loading-text" v-if="loadingText">
      {{ loadingText }}
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseLoding",
  props: {
    inline: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: "加载中..."
    },
    indicator: {
      type: String,
      default: "on",
      validator(val) {
        return ["on", "off"].indexOf(val) > -1;
      }
    }
  },
  data() {
    return {
      loadingText: "加载中"
    };
  },
  watch: {
    text(text) {
      this.loadingText = text;
    }
  },
  methods: {
    setText(str) {
      this.loadingText = str;
    }
  }
};
</script>

<style scoped lang="scss">
@import "~assets/scss/_mixins.scss";
[data-dpr="1"] .base-loading {
  font-size: 16px;
  img {
    width: 20px;
    height: 20px;
  }
}
[data-dpr="2"] .base-loading {
  font-size: 32px;
  img {
    width: 40px;
    height: 40px;
  }
}
[data-dpr="3"] .base-loading {
  font-size: 48px;
  img {
    width: 60px;
    height: 60px;
  }
}
.base-loading {
  overflow: hidden;
  width: 100%;
  height: 100%;

  @include flex-center(column);
  &.base-loading-inline {
    flex-direction: row;
    .base-loading-indicator ~ .base-loading-text {
      margin-left: 6px;
      margin-top: 0px;
    }
  }
  .base-loading-indicator ~ .base-loading-text {
    margin-top: 6px;
  }
}
</style>
