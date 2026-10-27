# Forest background

Asset: `dist/assets/forest-panorama.png`. Generated with built-in ImageGen; no reference image.

Final prompt:

Create a photorealistic seamless 360 degree equirectangular environment panorama, 2:1 aspect ratio, for a first person 3D educational bee farm. View from the center of an open grassy meadow surrounded by a lush subtropical woodland edge. Dense natural broadleaf trees across the middle horizon, irregular layered canopies with soft atmospheric perspective, warm clear morning sunlight from upper left. Pale blue sky fills the upper half, distant forest occupies the horizon band, simple grass meadow fills the lower half. Camera eye height 1.7 metres, level horizon. Realistic forest photography, calm rural research station atmosphere. No people, buildings, hives, bees, fences, text, logos or foreground branches. Left and right edges seamlessly join. Provide an unobstructed distant landscape backdrop, not a framed picture.

Used as a Three.js spherical background; existing nearby trees remain 3D. Background is loaded once, with the original sky color retained as a load-failure fallback.
