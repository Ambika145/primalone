// Cut the Restore jar out of "PrimalOne Restore Powder in Evening Light-2.png".
// The jar stands upright and face-on, so it is modelled as a cylinder: its left/right edges are
// read from the cream body, the top from the walnut lid, the bottom from where the cream ends;
// the mask is that box with an elliptical base. The scoop in front is masked out by colour.
// Usage: node scripts/cut-restore.cjs <source.png> <output.webp>
const sharp = require('sharp');
const [src, out] = process.argv.slice(2);
(async () => {
  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const px = (x, y) => { const i = (y * W + x) * 3; return [data[i], data[i + 1], data[i + 2]]; };
  const lum = ([r, g, b]) => 0.299 * r + 0.587 * g + 0.114 * b;
  const cream = (p) => lum(p) > 105 && p[0] - p[2] < 70 && p[1] <= p[0] + 4;
  // widest cream run on the row through the label (≈ 55% down)
  const runOf = (y) => { let best = [0, 0], a = -1;
    for (let x = 0; x <= W; x++) { const c = x < W && cream(px(x, y));
      if (c && a < 0) a = x; if (!c && a >= 0) { if (x - a > best[1] - best[0]) best = [a, x]; a = -1; } }
    return best; };
  // gold artwork breaks the cream into pieces, so join pieces separated by small gaps,
  // and take the median edges over the upper body (above the scoop)
  const span = (yy) => { let a = -1, b = -1, gap = 0, best = [0, 0];
    for (let x = 0; x <= W; x++) { const c = x < W && cream(px(x, yy));
      if (c) { if (a < 0) a = x; b = x; gap = 0; } else if (a >= 0 && ++gap > 45) { if (b - a > best[1] - best[0]) best = [a, b + 1]; a = -1; gap = 0; } }
    if (a >= 0 && b - a > best[1] - best[0]) best = [a, b + 1];
    return best; };
  const Ls = [], Rs = [];
  for (let yy = Math.round(H * 0.36); yy < H * 0.66; yy += 5) { const [a, b] = span(yy); if (b - a > W * 0.3) { Ls.push(a); Rs.push(b); } }
  const med = (v) => v.sort((p, q) => p - q)[v.length >> 1];
  const L = med(Ls), R = med(Rs);
  // Several columns across the jar; walk up to the green wall (top of lid) and down to the
  // wooden table. Gold artwork and text are neither, so they don't stop the walk.
  const wall = (p) => p[1] > p[0] + 2;
  const wood = (p) => p[0] > p[2] + 40 && lum(p) < 105;
  const tops = [], bottoms = [];
  for (let k = 0.25; k <= 0.75; k += 0.1) {
    const x = Math.round(L + (R - L) * k);
    let y = Math.round(H * 0.5); while (y > 0 && !wall(px(x, y))) y--; tops.push(y + 1);
    y = Math.round(H * 0.5); let run = 0;
    for (; y < H - 1; y++) { run = wood(px(x, y)) ? run + 1 : 0; if (run > 12) break; }
    bottoms.push(y - 12);
  }
  const top = med(tops), bottom = med(bottoms), bodyTop = top;
  const cx = (L + R) >> 1;
  const rx = (R - L) / 2, ey = rx * 0.12;                             // elliptical base, slight perspective
  const rgba = Buffer.alloc(W * H * 4);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, p = px(x, y);
    let inside = x >= L && x < R && y >= top && y <= bottom;
    if (inside && y > bottom - ey) { const dy = (y - (bottom - ey)) / ey, dx = (x - cx) / rx; inside = dx * dx + dy * dy <= 1; }
    if (inside && y < top + ey) { const dy = ((top + ey) - y) / ey, dx = (x - cx) / rx; inside = dx * dx + dy * dy <= 1; }
    // background wall that the box catches at the lid's rounded corners
    if (inside && wall(p)) inside = false;
    rgba[i * 4] = p[0]; rgba[i * 4 + 1] = p[1]; rgba[i * 4 + 2] = p[2]; rgba[i * 4 + 3] = inside ? 255 : 0;
  }
  // The scoop and powder sit in front of the jar's lower-left. Those pixels are much warmer than
  // the jar's cream, so replace each one with the nearest clean jar pixel above it in the same column.
  const zoneX = L + (R - L) * 0.34, zoneY = top + (bottom - top) * 0.86;
  const foreign = (p) => p[0] - p[2] > 70 || lum(p) < 150;
  const fixed = new Uint8Array(W * H);
  for (let x = L; x < zoneX; x++) {
    // running average of the last clean pixels above, so single noisy pixels don't streak down
    const recent = [];
    for (let y = Math.round(zoneY) - 30; y <= bottom; y++) {
      const i = y * W + x; if (!rgba[i * 4 + 3]) continue;
      const p = [rgba[i * 4], rgba[i * 4 + 1], rgba[i * 4 + 2]];
      if (y < zoneY || !foreign(p)) { if (!foreign(p)) { recent.push(p); if (recent.length > 14) recent.shift(); } continue; }
      if (!recent.length) continue;
      for (let c = 0; c < 3; c++) rgba[i * 4 + c] = recent.reduce((t, q) => t + q[c], 0) / recent.length;
      fixed[i] = 1;
    }
  }
  // blend repaired pixels sideways so neighbouring columns match
  for (let pass = 0; pass < 3; pass++) for (let y = 0; y < H; y++) for (let x = 6; x < W - 6; x++) {
    const i = y * W + x; if (!fixed[i]) continue;
    for (let c = 0; c < 3; c++) { let t = 0, n = 0; for (let d = -6; d <= 6; d++) { const j = i + d; if (rgba[j * 4 + 3]) { t += rgba[j * 4 + c]; n++; } } rgba[i * 4 + c] = t / n; }
  }
  const png = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
  // soften the edge a touch
  const a = await sharp(png).extractChannel(3).blur(1).raw().toBuffer();
  for (let i = 0; i < W * H; i++) rgba[i * 4 + 3] = a[i];
  const o = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).trim().webp({ quality: 86, alphaQuality: 100 }).toFile(out);
  console.log('restore cut-out', o.width, 'x', o.height, { L, R, top, bodyTop, bottom });
})();
