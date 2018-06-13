<template>
  <div class="example">
    <h1>MUE-GALLERY</h1>
    <h2>by <a href="https://github.com/Murrito/mue-gallery">Murrito</a></h2>
    <div
      v-if="photos.length > 0"
      class="example__box"
    >
      <mue-gallery
        :images="photos"
        embed
        thumbs
        blur
        @select-image="(i) => { firstImageId = i; gallery = true; }"
      />
    </div>

    <mue-gallery
      v-model="gallery"
      :images="photos"
      :index="firstImageId"
      thumbs
      blur
    />
  </div>
</template>

<script>
const photos = [];

[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((i) => {
  photos.push({
    src: `../static/images/${i}.jpg`,
    title: `Image ${i}`,
  });
});

export default {
  data() {
    return {
      gallery: false,
      firstImageId: 0,
      photos,
    };
  },
};
</script>

<style lang="scss">
  html,
  body {
    margin: 0;
    padding: 0;

    * {
      box-sizing: border-box;
    }
  }

  .example {
    font-family: Arial, sans-serif;
    max-width: 980px;
    padding: 0 15px;
    margin: auto;

    h1 {
      text-align: center;
      font-size: 24px;
      margin: 80px 0 20px;
    }

    h2 {
      text-align: center;
      font-size: 16px;
      margin: 20px 0 80px;
      color: #888;
      font-weight: normal;

      a {
        text-decoration: none;
      }
    }

    &__box {
      width: 800px;
      height: 500px;
      max-width: 100%;
      max-height: 50vh;
      margin: 0 auto;
    }
  }
</style>
