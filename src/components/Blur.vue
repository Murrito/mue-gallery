<template>
  <div
    :style="style"
    class="mue-gallery__blur"
  />
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: '',
    },
  },
  computed: {
    style() {
      return {
        backgroundImage: `url(${this.src})`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
  .mue-gallery__blur {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: center center no-repeat;
    background-size: cover;
    filter: blur(10px);
    opacity: .5;
    transform: scale(1.05);
    z-index: 0;

    &.fade-enter,
    &.fade-leave-to {
      opacity: 0;
    }
    &.fade-enter-active,
    &.fade-leave-active {
      transition: opacity .5s ease;
    }
  }
</style>
