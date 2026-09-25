# Resources

Find or create the resources needed to build the widget.

## Media Assets

Keep SVG, image, and audio resources as files inside the widget project directory. When a view needs an SVG or image, pass the file path to the component's `url` prop.

Place media assets inside the widget directory so the archived widget is self-contained.

Use SVG or image files for content that would require many TSX nodes. Keep simple fills and basic shapes in TSX when they stay readable.

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
