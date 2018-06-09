export default {
  data() {
    return {
      carouselDragStart: { x: 0, y: 0 },
      carouselDragEnd: { x: 0, y: 0 },
      carouselZoomOffset: { x: 0, y: 0 },
      carouselZoomCenter: null,
      carouselZoomSize: null,
      carouselZoomSizeTo: null,
    };
  },
  computed: {
    carouselDragDelta() {
      if (!this.isDragging) {
        return {
          x: 0,
          y: 0,
        };
      }

      const deltaX = this.carouselDragEnd.x - this.carouselDragStart.x;
      let deltaY = 0;

      if (this.isTouch && !this.embed) {
        deltaY = this.carouselDragEnd.y - this.carouselDragStart.y;
      }

      this.dragType = Math.abs(deltaY) > 10 && !this.dragType ? 'v' : this.dragType;
      this.dragType = Math.abs(deltaX) > 10 && !this.dragType ? 'h' : this.dragType;

      if (this.dragType === 'v') {
        return {
          x: 0,
          y: deltaY,
        };
      } else if (this.dragType === 'h') {
        return {
          x: deltaX,
          y: 0,
        };
      }

      return {
        x: 0,
        y: 0,
      };
    },
    carouselDragMoveDelta() {
      return !this.isZoomed ? this.carouselDragDelta : {
        x: 0,
        y: 0,
      };
    },
  },
  methods: {
    onCarouselMouseDown(e) {
      if (e.which && e.which !== 1) {
        return;
      }
      this.isDragging = true;
      clearTimeout(this.dragStopTimeout);
      this.isDragStop = false;
      this.carouselDragEnd.x = e.clientX;
      this.carouselDragStart.x = this.carouselDragEnd.x;
      this.carouselDragEnd.y = e.clientY;
      this.carouselDragStart.y = this.carouselDragEnd.y;

      this.dragStartTime = new Date().getTime();
    },
    onCarouselMouseMove(e, e1) {
      const delta = {
        x: e.clientX - this.carouselDragEnd.x,
        y: e.clientY - this.carouselDragEnd.y,
      };

      this.carouselDragEnd.x = e.clientX;
      this.carouselDragEnd.y = e.clientY;

      if (e1) {
        if (!this.carouselZoomCenter) {
          this.carouselZoomCenter = {
            x: (e.clientX + e1.clientX) / 2,
            y: (e.clientY + e1.clientY) / 2,
          };

          this.carouselZoomSize = {
            x: Math.abs(e1.clientX - e.clientX),
            y: Math.abs(e1.clientY - e.clientY),
          };
        }

        this.carouselZoomSizeTo = {
          x: Math.abs(e1.clientX - e.clientX),
          y: Math.abs(e1.clientY - e.clientY),
        };
      } else {
        this.carouselZoomCenter = null;
      }

      if (this.isZoomed && this.carouselZoomOffset) {
        this.carouselZoomOffset.x += delta.x;
        this.carouselZoomOffset.y += delta.y;
      }
    },
    onCarouselMouseUp() {
      const isFast = new Date().getTime() - this.dragStartTime <= 200;
      const isClick = isFast
        && Math.abs(this.carouselDragStart.x - this.carouselDragEnd.x) <= 5
        && Math.abs(this.carouselDragStart.y - this.carouselDragEnd.y) <= 5;
      const minDelta = !isFast ? this.carouselWidth / 4 : 30;

      if (isClick) {
        if (this.embed) {
          this.$emit('select-image', this.active);
        } else {
          this.toggleZoom();
        }
      } else if (Math.abs(this.carouselDragMoveDelta.x) > minDelta) {
        if (this.carouselDragMoveDelta.x > 0) {
          this.prev();
        } else {
          this.next();
        }
      } else if (Math.abs(this.carouselDragMoveDelta.y) > (!isFast ? this.windowHeight / 3 : 10)) {
        if (Math.abs(this.carouselDragMoveDelta.y) > 0) {
          this.isClosingToTop = this.carouselDragMoveDelta.y < 0;
          this.close();
        }
      }

      if (!isClick) {
        this.onAfterDragStop();
        clearTimeout(this.dragStopTimeout);
        this.isDragStop = true;
        this.dragStopTimeout = setTimeout(this.onAfterDragStop, 500);

        if (isFast && this.isZoomed) {
          this.carouselZoomOffset.x += this.carouselDragEnd.x - this.carouselDragStart.x;
          this.carouselZoomOffset.y += this.carouselDragEnd.y - this.carouselDragStart.y;
        }
      } else {
        this.change();
      }

      this.isDragging = false;
      this.isTouch = false;
      this.carouselDragStart.x = 0;
      this.carouselDragStart.y = 0;
      if (this.isZoomed) {
        this.correctZoomedImageOffset();
      }
      this.dragType = '';
    },
    onCarouselTouchStart(e) {
      e.preventDefault();

      this.isTouch = true;

      this.dragStartTime = new Date().getTime();
      this.onCarouselMouseDown(e.touches[0], e.touches[1]);
    },
    onCarouselTouchMove(e) {
      this.onCarouselMouseMove(e.touches[0], e.touches[1]);
    },
    onCarouselTouchEnd(e) {
      this.onCarouselMouseUp(e.touches[0], e.touches[1]);
    },
    onAfterDragStop() {
      this.isDragStop = false;
    },
  },
};
