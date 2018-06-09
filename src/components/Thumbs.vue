<template>
  <div
    :style="style"
    class="mue-gallery__thumbs"
    @mousedown="onMouseDown"
    @touchstart="onTouchStart"
  >
    <div
      :style="innerStyle"
      :class="['mue-gallery__thumbnails', {'after-drag': isDragStop}]"
    >
      <template v-for="i in items.length">
        <div
          :key="`thumb${i}`"
          :style="itemStyle(i - 1)"
          class="mue-gallery__thumbnail"
        />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isClosingToTop: false,
      isDragStop: false,
      isTouch: false,
      isDragging: false,
      x: 0,
      y: 0,
      dragStart: { x: 0, y: 0 },
      dragEnd: { x: 0, y: 0 },
    };
  },
  computed: {
    active() {
      return this.$parent.active;
    },
    windowWidth() {
      return this.$parent.windowWidth;
    },
    windowHeight() {
      return this.$parent.windowHeight;
    },
    vertical() {
      return this.$parent.thumbsVertical;
    },
    pos() {
      return this.$parent.thumbsPos;
    },
    thumbWidth() {
      return this.$parent.thumbWidth;
    },
    thumbHeight() {
      return this.$parent.thumbHeight;
    },
    items() {
      return this.$parent.items;
    },
    dragDelta() {
      return {
        x: this.vertical ? 0 : this.dragEnd.x - this.dragStart.x,
        y: this.vertical ? this.dragEnd.y - this.dragStart.y : 0,
      };
    },
    fullWidth() {
      return this.vertical ? this.thumbWidth : this.thumbWidth * this.items.length;
    },
    fullHeight() {
      return !this.vertical ? this.thumbHeight : this.thumbHeight * this.items.length;
    },
    minX() {
      if (this.vertical || this.fullWidth >= this.windowWidth) {
        return 0;
      }
      return -(this.windowWidth - this.fullWidth) / 2;
    },
    minY() {
      if (!this.vertical || this.fullHeight >= this.windowHeight) {
        return 0;
      }
      return -(this.windowHeight - this.fullHeight) / 2;
    },
    style() {
      const translateX = this.pos === 'left' ? '-100%' : '100%';
      const translateY = this.pos === 'top' ? '-100%' : '100%';
      return {
        backgroundColor: this.$parent.background,
        width: this.vertical ? `${this.thumbWidth}px` : '100%',
        height: !this.vertical ? `${this.thumbHeight}px` : '100%',
        top: this.pos !== 'bottom' ? 0 : 'auto',
        left: this.pos !== 'right' ? 0 : 'auto',
        bottom: this.pos !== 'top' ? 0 : 'auto',
        right: this.pos !== 'left' ? 0 : 'auto',
        transform: `translate3d(${!this.$parent.isZoomed ? 0 : translateX}, ${!this.$parent.isZoomed ? 0 : translateY}, 0)`,
      };
    },
    innerStyle() {
      const width = this.vertical
        ? this.thumbWidth
        : this.items.length * this.thumbWidth;
      const height = !this.vertical
        ? this.thumbHeight
        : this.items.length * this.thumbHeight;

      return {
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate3d(${-this.x}px, ${-this.y}px, 0)`,
      };
    },
  },
  watch: {
    active(i) {
      if (this.vertical) {
        this.x = 0;
        this.y = (this.thumbHeight * (i + 0.5)) - (this.windowHeight / 2);
      } else {
        this.x = (this.thumbWidth * (i + 0.5)) - (this.windowWidth / 2);
        this.y = 0;
      }
      this.correctPos();
    },
    windowWidth() {
      this.correctPos();
    },
    windowHeight() {
      this.correctPos();
    },
  },
  mounted() {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('touchmove', this.onTouchMove);
    window.addEventListener('touchend', this.onTouchEnd);
    this.correctPos();
  },
  destroyed() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
  },
  methods: {
    onMouseDown(e) {
      if (e.which && e.which !== 1) {
        return;
      }
      this.isDragging = true;
      clearTimeout(this.dragStopTimeout);
      this.isDragStop = false;
      this.dragEnd.x = e.clientX;
      this.dragStart.x = this.dragEnd.x;
      this.dragEnd.y = e.clientY;
      this.dragStart.y = this.dragEnd.y;

      this.dragStartTime = new Date().getTime();
    },
    onMouseMove(e) {
      if (!this.isDragging) {
        return;
      }
      this.x -= this.vertical ? 0 : e.clientX - this.dragEnd.x;
      this.y -= !this.vertical ? 0 : e.clientY - this.dragEnd.y;
      this.dragEnd.x = e.clientX;
      this.dragEnd.y = e.clientY;
    },
    onMouseUp() {
      if (!this.isDragging) {
        return;
      }
      const isFast = new Date().getTime() - this.dragStartTime <= 200;
      const isClick = isFast
        && Math.abs(this.dragStart.x - this.dragEnd.x) <= 5
        && Math.abs(this.dragStart.y - this.dragEnd.y) <= 5;

      if (isClick) {
        const offset = this.$el.getBoundingClientRect();
        const i = this.vertical
          ? Math.floor((this.y + (this.dragEnd.y - offset.top)) / this.thumbHeight)
          : Math.floor((this.x + (this.dragEnd.x - offset.left)) / this.thumbWidth);
        this.$emit('goto', i);
      } else if (isFast) {
        this.x += this.vertical ? 0 : this.dragStart.x - this.dragEnd.x;
        this.y += !this.vertical ? 0 : this.dragStart.y - this.dragEnd.y;
      }

      this.onAfterDragStop();
      this.correctPos();

      this.isDragging = false;
      this.isTouch = false;
      this.dragStart.x = 0;
      this.dragStart.y = 0;
    },
    onTouchStart(e) {
      e.preventDefault();

      this.isTouch = true;

      this.dragStartTime = new Date().getTime();
      this.onMouseDown(e.touches[0]);
    },
    onTouchMove(e) {
      this.onMouseMove(e.touches[0]);
    },
    onTouchEnd(e) {
      this.onMouseUp(e.touches[0]);
    },
    onAfterDragStop() {
      this.isDragStop = false;
    },
    correctPos() {
      clearTimeout(this.dragStopTimeout);
      this.isDragStop = true;
      this.x = this.vertical ? 0 : Math.max(this.minX, Math.min(
        this.x || 0,
        this.fullWidth - this.windowWidth,
      ));
      this.y = !this.vertical ? 0 : Math.max(this.minY, Math.min(
        this.y || 0,
        this.fullHeight - this.windowHeight,
      ));
      this.dragStopTimeout = setTimeout(this.onAfterDragStop, 500);
    },
    itemStyle(i) {
      const item = this.items[i];
      const style = {
        width: `${this.thumbWidth}px`,
        height: `${this.thumbHeight}px`,
        backgroundImage: `url(${item.thumb || item.src})`,
        opacity: i === this.active ? 1 : 0.5,
      };

      if (this.vertical) {
        style.top = `${i * this.thumbHeight}px`;
        style.left = 0;
      } else {
        style.top = 0;
        style.left = `${i * this.thumbWidth}px`;
      }

      return style;
    },
  },
};
</script>

<style lang="scss" scoped>
  .mue-gallery__thumbs {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    overflow: hidden;

    &--vertical {
      width: 150px;
      height: 100%;
    }

    .mue-gallery__thumbnails {
      position: absolute;

      &.after-drag {
        transition: transform .5s ease;
      }
    }

    .mue-gallery__thumbnail {
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
      position: absolute;
      top: 0;
      left: 0;
      width: 150px;
      height: 100px;
    }
  }

  .mue-gallery.zoomed {
    .mue-gallery__thumbs {
      transition: none !important;
    }
  }
</style>
