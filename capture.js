const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const CONFIG = {
  htmlFile: 'transition.html',
  outputDir: 'frames',
  width: 1920,
  height: 1080,
  fps: 30,
  durationSeconds: 3.0   // match this to your total animation length
};

async function captureFrames() {
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir);
  } else {
    fs.readdirSync(CONFIG.outputDir).forEach(f => fs.unlinkSync(path.join(CONFIG.outputDir, f)));
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--enable-gpu', '--force-color-profile=srgb']
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: CONFIG.width,
    height: CONFIG.height,
    deviceScaleFactor: 1
  });

  await page.evaluateOnNewDocument(() => {
    document.addEventListener('DOMContentLoaded', () => {
      document.documentElement.style.background = 'transparent';
      document.body.style.background = 'transparent';
    });
  });

  const htmlPath = 'file://' + path.resolve(CONFIG.htmlFile);
  await page.goto(htmlPath, { waitUntil: 'load' });

  await page.evaluate(() => {
    document.getAnimations().forEach(anim => anim.pause());
  });

  const totalFrames = Math.ceil(CONFIG.durationSeconds * CONFIG.fps);
  const frameDurationMs = 1000 / CONFIG.fps;

  console.log(`Capturing ${totalFrames} frames at ${CONFIG.fps} FPS (frame-accurate)...`);

  for (let i = 0; i < totalFrames; i++) {
    const targetTimeMs = i * frameDurationMs;

    await page.evaluate((t) => {
      document.getAnimations().forEach(anim => {
        anim.currentTime = t;
      });
    }, targetTimeMs);

    const frameName = String(i).padStart(5, '0') + '.png';
    await page.screenshot({
      path: path.join(CONFIG.outputDir, frameName),
      omitBackground: true
    });

    if (i % 10 === 0) {
      console.log(`Frame ${i}/${totalFrames}`);
    }
  }

  await browser.close();
  console.log('Done! Frames are in ./' + CONFIG.outputDir);
}

captureFrames();
