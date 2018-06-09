<template>
  <div
    v-if="!!items.length"
    :class="galleryClass"
    :style="galleryStyle"
  >
    <div
      v-if="blur && activeItem"
      class="mue-gallery__bg"
    >
      <transition name="fade">
        <mue-blur
          :key="`blur${active}`"
          :src="activeItem.loaded ? activeItem.src : ''"
        />
      </transition>
    </div>

    <div
      :style="carouselStyle"
      class="mue-gallery__carousel"
    >
      <div
        :class="['mue-gallery__images', { 'dragging': !!carouselDragStart.x }]"
        :style="imagesStyle"
        @mousedown="onCarouselMouseDown"
        @touchstart="onCarouselTouchStart"
      >
        <template v-for="i in total">
          <div
            :key="'img' + i"
            :style="imageItemStyle(i)"
            class="mue-gallery__image"
          >
            <img
              :src="items[i - 1].src"
              :style="imageStyle(i)"
            >
          </div>
        </template>
      </div>
    </div>

    <mue-controls
      @close="close"
      @goto="goTo"
    />

    <mue-thumbs
      v-if="thumbs"
      @goto="goTo"
    />
  </div>
</template>

<script>
import MueBlur from './components/Blur.vue';
import MueControls from './components/Controls.vue';
import MueThumbs from './components/Thumbs.vue';

import StylesMixin from './components/mixins/Styles';
import KeyEventsMixin from './components/mixins/KeyEvents';
import CarouselDragMixin from './components/mixins/CarouselDrag';
import ZoomMixin from './components/mixins/Zoom';

const noPhoto = require('./../static/no-photo.png');

export default {
  components: {
    MueBlur,
    MueControls,
    MueThumbs,
  },
  mixins: [
    StylesMixin,
    KeyEventsMixin,
    CarouselDragMixin,
    ZoomMixin,
  ],

  model: {
    prop: 'open',
    event: 'toggle',
  },

  props: {
    open: {
      type: Boolean,
      default: false,
    },
    images: {
      type: Array,
      default: () => [],
    },
    index: {
      type: Number,
      default: undefined,
    },
    embed: {
      type: Boolean,
      default: false,
    },
    thumbs: {
      type: Boolean,
      default: false,
    },
    thumbsPosition: {
      type: String,
      default: 'bottom',
    },
    blur: {
      type: Boolean,
      default: false,
    },
    background: {
      type: String,
      default: '#333',
    },
    nav: {
      type: Boolean,
      default: true,
    },
    caption: {
      type: Boolean,
      default: true,
    },
    counter: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      active: this.index || 0,
      positions: ['top', 'left', 'bottom', 'right'],

      items: [],

      windowWidth: 0,
      windowHeight: 0,

      isTouch: false,
      dragStartTime: 0,
      dragType: '',
      thumbsDragX: 0,
      thumbsDragDelta: 0,

      isChanging: false,
      isZoomed: false,
      isDragging: false,
      isDragStop: false,
      dragStopTimeout: null,
    };
  },

  computed: {
    activeItem() {
      return this.items[this.active] || null;
    },
    noActivePhoto() {
      return !this.activeItem.loaded;
    },
    isMobile() {
      return this.windowWidth < 600;
    },
    thumbsPos() {
      return this.positions.indexOf(this.thumbsPosition) >= 0 && !this.isMobile
        ? this.thumbsPosition
        : 'bottom';
    },
    thumbsVertical() {
      return ['left', 'right'].indexOf(this.thumbsPos) >= 0;
    },
    total() {
      return this.items.length;
    },
  },

  watch: {
    open() {
      if (this.open && this.index !== undefined) {
        this.change();
        this.active = this.index;
      }
      document.documentElement.style.overflow = this.open && !this.embed ? 'hidden' : 'auto';
    },
    index(i) {
      if (i !== undefined) {
        this.change();
        this.goTo(i);
      }
    },
    images: {
      deep: true,
      handler() {
        this.setItems();
      },
    },
    total(v) {
      if (v === this.images.length) {
        this.$set(this, 'items', JSON.parse(JSON.stringify(this.items)));
      }
    },
  },

  mounted() {
    this.setItems();
    document.documentElement.style.overflow = this.open && !this.embed ? 'hidden' : 'auto';

    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('touchmove', this.onTouchMove);
    window.addEventListener('touchend', this.onTouchEnd);

    this.onWindowResize();
  },

  destroyed() {
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
  },

  methods: {
    toggle() {
      this.$emit('toggle', !this.open);
      this.isZoomed = false;
    },
    close() {
      this.$emit('toggle', false);
      this.isZoomed = false;
    },
    change() {
      this.isChanging = true;

      const onAfterTimeout = () => {
        this.isChanging = false;
      };

      setTimeout(onAfterTimeout, 10);
    },
    setItems() {
      this.items = [];

      this.images.forEach((image, i) => {
        this.items[i] = {
          src: image.src || image,
          thumb: image.thumb || null,
          title: image.title || '',
          width: 0,
          height: 0,
          loaded: false,
        };

        const img = new Image();

        img.src = image.src || image;

        img.onload = () => {
          this.omImageLoad(i, img);
          this.$set(this.items[i], 'loaded', true);
        };

        img.onerror = () => {
          const noImg = new Image();
          noImg.src = noPhoto;
          noImg.onload = () => {
            this.omImageLoad(i, noImg, true);
          };
        };
      });
    },
    omImageLoad(i, img, isNoImg) {
      if (isNoImg) {
        this.$set(this.items[i], 'src', img.src);
        this.$set(this.items[i], 'thumb', img.src);
      }
      this.$set(this.items[i], 'width', img.width);
      this.$set(this.items[i], 'height', img.height);
      this.onWindowResize();
    },
    goTo(i) {
      this.active = Math.max(0, Math.min(this.total - 1, i));
      this.isZoomed = false;
    },
    prev() {
      this.goTo(this.active - 1);
    },
    next() {
      this.goTo(this.active + 1);
    },

    onWindowResize() {
      this.windowWidth = this.embed ? this.$el.clientWidth : window.innerWidth;
      this.windowHeight = this.embed ? this.$el.clientHeight : window.innerHeight;
    },
    onMouseMove(e) {
      if (this.carouselDragStart.x) {
        this.onCarouselMouseMove(e);
      }
    },
    onMouseUp(e) {
      if (this.carouselDragStart.x) {
        this.onCarouselMouseUp(e);
      }
      this.dragStartTime = 0;
    },
    onTouchMove(e) {
      if (this.carouselDragStart.x) {
        this.onCarouselTouchMove(e);
      }
    },
    onTouchEnd(e) {
      if (this.carouselDragStart.x) {
        this.onCarouselTouchEnd(e);
      }
      this.dragStartTime = 0;
    },
  },
};
</script>

<style lang="scss" scoped>
  @mixin fulfill {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  html {
    touch-action: manipulation;

    &,
    body {
      margin: 0;
      padding: 0;
    }
  }

  .mue-gallery {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 10000;

    &:not(.dragging) {
      transition: all .5s ease;
    }

    &:not(.mue-gallery--open):not(.mue-gallery--embed) {
      opacity: 0;
      pointer-events: none;

      .mue-gallery__images {
        transform: translateY(100%);
      }
    }

    .mue-gallery__bg {
      @include fulfill;
      background: #333;
    }

    &--embed {
      position: relative;
    }

    &.changing,
    &.zoomed {
      .mue-gallery__images {
        transition: none !important;
      }
    }

    .mue-gallery__carousel {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: calc(100% - 100px);
      overflow: hidden;

      .mue-gallery__images {
        &:not(.dragging) {
          transition: transform .4s ease;
        }

        will-change: transform;
      }

      .mue-gallery__image {
        @include fulfill;
        overflow: hidden;

        *:not(img) {
          @include fulfill;
          background-position: center center;
          background-repeat: no-repeat;
        }

        &:after {
          content: '';
          @include fulfill;
        }

        img {
          display: block;
          pointer-events: none;
          user-select: none;
        }

        &__view {
          background-size: contain;
          z-index: 1;
        }
      }
    }

    &.after-drag {
      .mue-gallery__image img {
        transition: transform .5s ease;
      }
    }
  }
</style>
