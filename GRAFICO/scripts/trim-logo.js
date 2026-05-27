const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const inputPath = process.argv[2];
const outputPath = process.argv[3];
const padding = parseInt(process.argv[4] || '8', 10);

if (!inputPath || !outputPath) {
  console.error('Usage: node trim-logo.js <input.png> <output.png> [padding_px]');
  process.exit(1);
}

(async () => {
  const buf = fs.readFileSync(inputPath);
  const dataUrl = `data:image/png;base64,${buf.toString('base64')}`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(`<!DOCTYPE html><html><body style="margin:0;padding:0;background:#000">
    <img id="img" src="${dataUrl}" style="display:block">
  </body></html>`);

  await page.waitForFunction(() => {
    const img = document.getElementById('img');
    return img && img.complete && img.naturalWidth > 0;
  });

  // Detect bounding box of non-background pixels.
  // Background is auto-detected: the corner pixel color (top-left) defines the bg.
  const result = await page.evaluate((pad) => {
    const img = document.getElementById('img');
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, w, h).data;

    // Sample corners to determine bg color (median of 4 corners)
    const corners = [
      [0, 0],
      [w - 1, 0],
      [0, h - 1],
      [w - 1, h - 1]
    ].map(([x, y]) => {
      const i = (y * w + x) * 4;
      return [data[i], data[i + 1], data[i + 2]];
    });
    // Use top-left as bg reference
    const [bgR, bgG, bgB] = corners[0];

    const tol = 12; // tolerance
    const isBg = (r, g, b) => Math.abs(r - bgR) <= tol && Math.abs(g - bgG) <= tol && Math.abs(b - bgB) <= tol;

    let minX = w, minY = h, maxX = -1, maxY = -1;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        if (!isBg(data[i], data[i + 1], data[i + 2])) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (maxX < 0) return { error: 'no content detected (image looks all background)' };

    // Apply padding, clamp to image
    const cx = Math.max(0, minX - pad);
    const cy = Math.max(0, minY - pad);
    const cw = Math.min(w, maxX + 1 + pad) - cx;
    const ch = Math.min(h, maxY + 1 + pad) - cy;

    // Crop into a new canvas and return base64
    const out = document.createElement('canvas');
    out.width = cw;
    out.height = ch;
    out.getContext('2d').drawImage(canvas, cx, cy, cw, ch, 0, 0, cw, ch);
    return {
      bg: { r: bgR, g: bgG, b: bgB },
      bounds: { minX, minY, maxX, maxY },
      out: { x: cx, y: cy, w: cw, h: ch },
      originalSize: { w, h },
      dataUrl: out.toDataURL('image/png')
    };
  }, padding);

  await browser.close();

  if (result.error) {
    console.error('Error:', result.error);
    process.exit(1);
  }

  const base64 = result.dataUrl.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync(outputPath, Buffer.from(base64, 'base64'));

  console.log(`Background detected: rgb(${result.bg.r}, ${result.bg.g}, ${result.bg.b})`);
  console.log(`Content bounds: x=${result.bounds.minX}-${result.bounds.maxX}, y=${result.bounds.minY}-${result.bounds.maxY}`);
  console.log(`Original: ${result.originalSize.w}x${result.originalSize.h}`);
  console.log(`Cropped:  ${result.out.w}x${result.out.h} (padding ${padding}px)`);
  console.log(`Saved:    ${outputPath}`);
})();
