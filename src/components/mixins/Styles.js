export default {
  computed: {
    galleryClass() {
      return {
        'mue-gallery': true,
        'mue-gallery--open': this.open,
        'mue-gallery--embed': this.embed,
        zoomed: this.isZoomed,
        changing: this.isChanging,
        dragging: !!this.carouselDragStart.y,
        'after-drag': this.isDragStop,
      };
    },
    carouselWidth() {
      return this.windowWidth - (this.thumbs && this.thumbsVertical ? this.thumbWidth : 0);
    },
    carouselHeight() {
      return this.windowHeight - (this.thumbs && !this.thumbsVertical ? this.thumbHeight : 0);
    },
    galleryStyle() {
      const style = {
        backgroundColor: this.background,
      };

      if (Math.abs(this.carouselDragMoveDelta.y) > 0) {
        style.opacity = 1 - (Math.abs(this.carouselDragMoveDelta.y) / this.windowHeight);
      }

      return style;
    },
    carouselStyle() {
      const thumbsTop = this.thumbs && this.thumbsPos === 'top';
      const thumbsLeft = this.thumbs && this.thumbsPos === 'left';
      return {
        width: `${this.isZoomed ? this.windowWidth : this.carouselWidth}px`,
        height: `${this.isZoomed ? this.windowHeight : this.carouselHeight}px`,
        top: !this.isZoomed && thumbsTop ? `${this.thumbHeight}px` : 0,
        left: !this.isZoomed && thumbsLeft ? `${this.thumbWidth}px` : 0,
      };
    },
    imagesStyle() {
      const width = this.isZoomed ? this.windowWidth : this.carouselWidth;
      const height = this.isZoomed ? this.windowHeight : this.carouselHeight;
      let delta = this.active * width;

      if (this.carouselDragMoveDelta.x !== 0) {
        delta -= this.carouselDragMoveDelta.x;
      }

      const translateYDefault = this.open || this.embed
        ? 0
        : `${this.isClosingToTop ? '-' : ''}100%`;
      const translateY = this.carouselDragMoveDelta.y
        ? `${this.carouselDragMoveDelta.y}px`
        : translateYDefault;

      return {
        width: `${this.total * width}px`,
        height: `${height}px`,
        transform: `translate3d(${(-delta)}px, ${translateY}, 0)`,
      };
    },
    thumbWidth() {
      return this.isMobile ? 50 : 150;
    },
    thumbHeight() {
      return this.isMobile ? 50 : 100;
    },
  },
  methods: {
    imageItemStyle(i) {
      const width = this.isZoomed ? this.windowWidth : this.carouselWidth;
      const height = this.isZoomed ? this.windowHeight : this.carouselHeight;
      return {
        width: `${width}px`,
        height: `${height}px`,
        transform: `translateX(${(i - 1) * width}px)`,
      };
    },
    imageStyle(i) {
      const item = this.items[i - 1];
      const x = item.width / this.carouselWidth;
      const y = item.height / this.carouselHeight;
      const isZoomed = this.isZoomed && i === this.active + 1;

      let { width, height } = item;

      if (!isZoomed && (x > 1 || y > 1)) {
        const k = Math.max(x, y);

        width = item.width / k;
        height = item.height / k;
      }

      const offsetX = isZoomed && this.carouselZoomOffset
        ? this.carouselZoomOffset.x
        : (this.carouselWidth - width) / 2;
      const offsetY = isZoomed && this.carouselZoomOffset
        ? this.carouselZoomOffset.y
        : (this.carouselHeight - height) / 2;

      return {
        background: `url(${item.src}) top left no-repeat`,
        backgroundSize: '100%',
        width: `${width}px`,
        height: `${height}px`,
        transform: `translateX(${offsetX}px) translateY(${offsetY}px)`,
      };
    },
    getZoomOffset(i) {
      const item = this.items[i - 1];

      const kx = item.width / this.carouselWidth;
      const ky = item.height / this.carouselHeight;
      const k = Math.max(kx, ky) > 1 ? Math.max(kx, ky) : 1;

      const size = {
        x: item.width,
        y: item.height,
      };

      const sizeSm = {
        x: item.width / k,
        y: item.height / k,
      };

      const scale = sizeSm.x / size.x;

      const offsetSm = {
        x: (this.carouselWidth - sizeSm.x) / 2,
        y: (this.carouselHeight - sizeSm.y) / 2,
      };

      const pointSm = {
        x: this.carouselDragEnd.x - offsetSm.x,
        y: this.carouselDragEnd.y - offsetSm.y,
      };

      const point = {
        x: pointSm.x / scale,
        y: pointSm.y / scale,
      };

      return {
        x: this.carouselDragEnd.x - point.x,
        y: this.carouselDragEnd.y - point.y,
      };
    },
  },
};
