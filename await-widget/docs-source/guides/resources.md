# Resources

## Media Assets

Keep SVG, image, and audio resources as files inside the widget project directory. When a view needs an SVG or image, pass the file path to the component's `url` prop.

Place media assets inside the widget directory so the archived widget is self-contained.

Use SVG or image assets for complex backgrounds, especially when the design needs gradients, glow, texture, repeated marks, or many decorative paths. Keep simple fills, gradients, and basic shapes in TSX when they stay readable.

For example:

```tsx
<Image url='images/background.jpg' resizable aspectRatio='fill'/>
```

```tsx
<Svg url='assets/icon.svg' sides={24}/>
```

For audio assets, pass the local file path to the audio API that uses it.

You can use `.sf2` files to build MIDI instrument widgets. Keep each `.sf2` file under 20 MB when possible.

```tsx
AwaitAudio.playNote(note, {soundFont: '/assets/sounds/909.sf2'});
```

For SVGs, this keeps `index.tsx` small. Static SVG content usually does not need to be built into the index file, so keep it as a separate `.svg` file by default.

## Downloading or Generating Assets

When the chosen visual direction needs an image, texture, illustration, or other media asset, first inspect the widget project for a suitable local asset. If none exists, actively search for and download a suitably licensed asset when web access is available, or generate one when image generation is available. Do not replace a needed material or image asset with a complex approximation made from basic TSX shapes.

Save downloaded or generated assets inside the widget project directory, then reference them by local path through `Image`, `Svg`, or the relevant audio API. Do not embed the asset data in `index.tsx`.

Use [Design](design.md) to decide whether a visual metaphor should use real assets or simple flat shapes.

Useful sources for permissive, public-domain, or openly licensed assets include:

- [Unsplash](https://unsplash.com): photos under the Unsplash license.
- [Pexels](https://www.pexels.com): photos under the Pexels license.
- [Pixabay](https://pixabay.com): photos, illustrations, vectors, music, and sound effects under the Pixabay Content License or CC0, depending on the asset.
- [Openverse](https://openverse.org): search for Creative Commons and public-domain images and audio.
- [Wikimedia Commons](https://commons.wikimedia.org): freely usable media with per-file license requirements.
- [NASA Images](https://www.nasa.gov/nasa-brand-center/images-and-media/): NASA images, subject to NASA usage guidelines.
- [ambientCG](https://ambientcg.com): CC0 textures, HDRIs, and models.
- [Poly Haven](https://polyhaven.com): CC0 textures, HDRIs, and models.
- [Openclipart](https://openclipart.org): CC0 public-domain clipart.
- [SVG Repo](https://www.svgrepo.com): open-licensed SVG icons and vectors with per-file license requirements.
- [Heroicons](https://heroicons.com): MIT-licensed SVG interface icons.

Check the license on the specific asset page before using it. Some sources require attribution, restrict trademark or personality-right use, or use different licenses for different assets.
