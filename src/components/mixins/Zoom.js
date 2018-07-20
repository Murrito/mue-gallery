export default {
  methods: {
    toggleZoom(center) {
      if (this.noActivePhoto || !this.zoom) {
        return;
      }

      this.isZoomed = !this.isZoomed && this.isImageZoomable(this.active);

      if (!this.isZoomed) {
        return;
      }

      this.carouselZoomOffset = this.getZoomedImageOffset(this.active, center);
      this.correctZoomedImageOffset();
    },
    moveZoom(x, y) {
      if (this.isZoomed && this.carouselZoomOffset) {
        this.carouselZoomOffset.x += x;
        this.carouselZoomOffset.y += y;
        this.correctZoomedImageOffset();
      }
    },
    isImageZoomable(i) {
      return this.items[i].width >= this.windowWidth || this.items[i].height >= this.windowHeight;
    },
    setZoomedImageOffset() {
      this.carouselZoomOffset = this.isZoomed ? this.getZoomedImageOffset(this.active) : null;
    },
    correctZoomedImageOffset() {
      const item = this.items[this.active];
      const offset = this.carouselZoomOffset;

      const minOffsetX = item.width >= this.windowWidth
        ? this.windowWidth - item.width
        : (this.windowWidth - item.width) / 2;

      const minOffsetY = item.height >= this.windowHeight
        ? this.windowHeight - item.height
        : (this.windowHeight - item.height) / 2;

      this.carouselZoomOffset = {
        x: Math.max(Math.min(0, offset.x), minOffsetX),
        y: Math.max(Math.min(0, offset.y), minOffsetY),
      };
    },
    getZoomedImageOffset(i, center) {
      const item = this.items[i];

      const kx = item.width / this.carouselWidth;
      const ky = item.height / this.carouselHeight;
      const k = Math.max(kx, ky) > 1 ? Math.max(kx, ky) : 1;

      let zoom = 1;

      if (this.carouselZoomSize) {
        const zoomX = this.carouselZoomSizeTo.x / this.carouselZoomSize.x;
        const zoomY = this.carouselZoomSizeTo.y / this.carouselZoomSize.y;

        zoom = zoomX * zoomY;
      }

      const size = {
        x: zoom === 1 ? item.width : (item.width / k) * zoom,
        y: zoom === 1 ? item.height : (item.height / k) * zoom,
      };

      if (center) {
        return {
          x: (this.carouselWidth - size.x) / 2,
          y: (this.carouselHeight - size.y) / 2,
        };
      }

      const sizeSm = {
        x: item.width / k,
        y: item.height / k,
      };

      const scale = sizeSm.x / size.x;

      const offsetSm = {
        x: (this.carouselWidth - sizeSm.x) / 2,
        y: (this.carouselHeight - sizeSm.y) / 2,
      };

      const touch = this.carouselZoomCenter || this.carouselDragEnd;

      const pointSm = {
        x: touch.x - offsetSm.x,
        y: touch.y - offsetSm.y,
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
