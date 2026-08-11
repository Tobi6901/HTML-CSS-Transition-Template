# HTML/CSS Transition Template

A lightweight, self-contained scene transition for OBS, built with pure HTML and CSS — no external dependencies, no third-party overlay services. Runs as a Browser Source and can optionally be exported as a `.webm` video with alpha channel for use as a native OBS Stinger Transition.

## How it works

The animation itself is pure CSS — `@keyframes`, `clip-path`, and optionally SVG filters for organic distortion effects. No JavaScript is required to play the animation; it starts automatically when the page loads.

## Using it as a Browser Source (hotkey trigger)

1. Place `transition.html` in a folder, along with any image assets it references
2. In OBS: **Sources → Browser Source → Local File**, set the size to your full canvas resolution
3. **Settings → Hotkeys** → assign a hotkey to **"Refresh Browser Source"** for this source
4. Press the hotkey to play the animation once

## Using it as a real Stinger (recommended, no stuttering)

The animation can be rendered to a `.webm` file with an alpha channel, so it runs as a native OBS Stinger Transition without live-computing any effects during your stream.

**Requirements:** Node.js, ffmpeg

```bash
npm install puppeteer
node capture.js       # renders a frame-accurate PNG sequence to ./frames
ffmpeg -framerate 30 -i frames/%05d.png -c:v libvpx-vp9 -pix_fmt yuva420p -auto-alt-ref 0 -b:v 6M transition.webm
```

`capture.js` pauses all CSS animations and advances them frame by frame using the Web Animations API (`document.getAnimations()`), so the output timing stays accurate regardless of how long each screenshot takes to render.

In OBS: **Scene Transitions → +  → Stinger** → select `transition.webm`, check **"Video has alpha channel"**.

## Customizing

- Edit the HTML/CSS directly to change colors, shapes, timing, and any image content
- If you change the total animation length, update `durationSeconds` in `capture.js` to match
- The included example uses an SVG filter (`feTurbulence` + `feDisplacementMap`) for an organic, wobbling edge — adjust `scale` and `baseFrequency` to control the distortion strength

## License

MIT — free to use, modify, and distribute.
