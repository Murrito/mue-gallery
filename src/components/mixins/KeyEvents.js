export default {
  mounted() {
    window.addEventListener('keydown', this.onWindowKeyDown);
  },
  destroyed() {
    window.removeEventListener('keydown', this.onWindowKeyDown);
  },
  methods: {
    onWindowKeyDown(e) {
      if (this.embed || !this.open) {
        return;
      }

      switch (e.keyCode) {
        case 13:
          // enter
          e.preventDefault();
          this.toggleZoom(true);
          break;
        case 27:
          // esc
          e.preventDefault();
          if (this.isZoomed) {
            this.toggleZoom(true);
          } else {
            this.close();
          }
          break;
        case 37:
          // arrow left
          e.preventDefault();
          if (this.isZoomed) {
            this.moveZoom(this.windowWidth / 10, 0);
          } else {
            this.prev();
          }
          break;
        case 38:
          // arrow up
          e.preventDefault();
          if (this.isZoomed) {
            this.moveZoom(0, this.windowHeight / 10);
          }
          break;
        case 39:
          // arrow right
          e.preventDefault();
          if (this.isZoomed) {
            this.moveZoom(-this.windowWidth / 10, 0);
          } else {
            this.next();
          }
          break;
        case 40:
          // arrow bottom
          e.preventDefault();
          if (this.isZoomed) {
            this.moveZoom(0, -this.windowHeight / 10);
          }
          break;
        default:
          break;
      }
    },
  },
};
