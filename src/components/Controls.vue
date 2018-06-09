<template>
  <div
    :style="style"
    class="mue-gallery__controls"
  >
    <div
      v-if="close"
      class="mue-gallery__close"
      @click="$emit('close')"
    />

    <template v-if="nav">
      <div
        v-if="i > 0"
        class="mue-gallery__nav prev"
        @click="$emit('goto', i - 1)"
      />
      <div
        v-if="i < total - 1"
        class="mue-gallery__nav next"
        @click="$emit('goto', i + 1)"
      />
    </template>

    <div
      v-if="title"
      class="mue-gallery__title"
    >{{ text || '' }}</div>

    <div
      v-if="counter"
      class="mue-gallery__cnt"
    >{{ i + 1 }} / {{ total }}</div>
  </div>
</template>

<script>
export default {
  computed: {
    close() {
      return !this.$parent.embed;
    },
    nav() {
      return !this.$parent.isZoomed
        && this.$parent.nav
        && (!this.$parent.isMobile || this.$parent.embed);
    },
    title() {
      return !this.$parent.isZoomed && this.$parent.caption;
    },
    counter() {
      return !this.$parent.isZoomed && this.$parent.counter;
    },
    i() {
      return this.$parent.active;
    },
    total() {
      return this.$parent.total;
    },
    text() {
      return this.$parent.activeItem ? this.$parent.activeItem.title : '';
    },
    style() {
      return {
        width: this.$parent.carouselStyle.width,
        height: this.$parent.carouselStyle.height,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
  .mue-gallery__controls {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;

    * {
      pointer-events: auto;
    }

    .mue-gallery__nav {
      position: absolute;
      display: block;
      width: 80px;
      height: 80px;
      top: calc(50% - 40px);
      z-index: 100;
      cursor: pointer;

      &:before {
        content: '';
        display: block;
        position: absolute;
        width: 20px;
        height: 20px;
        top: calc(50% - 10px);
        left: calc(50% - 10px);
        border-top: 4px solid #fff;
        border-left: 4px solid #fff;
      }

      &.prev {
        left: 0;

        &:before {
          transform: rotateZ(-45deg);
        }
      }

      &.next {
        right: 0;

        &:before {
          transform: rotateZ(135deg);
        }
      }
    }

    .mue-gallery__close {
      position: absolute;
      top: 15px;
      right: 15px;
      height: 30px;
      width: 30px;
      transform: rotateZ(45deg);
      cursor: pointer;
      z-index: 100;

      &:before,
      &:after {
        content: '';
        background: #fff;
        position: absolute;
        display: block;
      }

      &:before {
        top: 0;
        height: 100%;
        left: calc(50% - 2px);
        width: 4px;
      }

      &:after {
        left: 0;
        width: 100%;
        top: calc(50% - 2px);
        height: 4px;
      }
    }

    .mue-gallery__title {
      position: absolute;
      bottom: 15px;
      left: 0;
      right: 0;
      line-height: 30px;
      font-size: 16px;
      color: #fff;
      text-align: center;
      text-shadow: 1px 1px 2px transparentize(#000, .2);
    }

    .mue-gallery__cnt {
      position: absolute;
      top: 15px;
      left: 15px;
      line-height: 30px;
      font-size: 14px;
      color: #fff;
      text-shadow: 1px 1px 2px transparentize(#000, .2);

      &.mobile {
        right: 15px;
        text-align: center;
      }
    }
  }
</style>
