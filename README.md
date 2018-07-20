# mue-gallery

A Vue.js images gallery.

[Demo](https://murrito.github.io/mue-gallery/)

## Installation

```bash
# npm
npm install mue-gallery
```
```bash
# yarn
yarn add mue-gallery
```

## Usage

```js
import Vue from 'vue';
import MueGallery from 'mue-gallery';
 
Vue.use(MueGallery);
```

In your component:

```html
<mue-gallery
  :images="images"
/>
```

## Options

| Property | Default | Type | Description |
| --- | --- | --- | --- |
| `v-model` | `false` | `Boolean` | Controls if gallery pop-up is open or not |
| [`images`](#images) | `[]` | `Array` | Your images list |
| `index` | `undefined` | `Number` | Current displayed image |
| `embed` | `false` | `Boolean` | Set `true` to embed gallery into your page. If `true`, `v-model` is not needed |
| `thumbs` | `true` | `Boolean` | Set `true` to show thumbnails |
| `thumbs-position` | `'bottom'` | `String` | Thumbnails position. Possible values: `top`, `right`, `bottom`, `left` |
| `background` | `'#333'` | `String` | The background color. Any value, supported by CSS `background-color` |
| `blur` | `false` | `Boolean` | Set `true` to add a half-transparent blurred version of current image to the background |
| `nav` | `true` | `Boolean` | Set `true` to show navigation arrows |
| `caption` | `true` | `Boolean` | Set `true` to show current image title |
| `counter` | `true` | `Boolean` | Set `true` to show images counter |
| `zoom` | `false` | `Boolean` | Set `true` to allow images zoom |

### <a name="images"></a>images

Possible data formats:
```js
[
  'image_1.jpg',
  ...
]
```
```js
[
  {
    src: 'image_1.jpg',         // Full-size image path, required
    thumb: 'image_1_thumb.jpg', // Thumbnail path, optional
    title: 'Image 1',           // Image title, optional
  },
  ...
]
```

## License
mue-gallery is MIT licensed.