// Cut the Origin jar out of its photo: flood-fill the light/neutral background from the edges,
// keep the largest remaining object (the jar), then feather the edge.
// Run via `npm run images` (see package.json).
const sharp = require('sharp');
// Usage: node scripts/cut-jar.cjs <source.png> <output.webp> [darkness threshold=50] [edge inset px=2]
const [src, out, T = '50'] = process.argv.slice(2);
(async () => {
  const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;
  const solid = new Uint8Array(N);
  for (let i = 0; i < N; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    // jar = very dark, or saturated warm walnut / gold foil darker than the wall
    solid[i] = lum < +T || (sat > 70 && r > b + 50 && lum < 150) ? 1 : 0;
  }
  // connected components of solid pixels; keep the one covering the image centre column most
  const lab = new Int32Array(N).fill(-1); const sizes = []; const stack = new Int32Array(N);
  for (let s = 0; s < N; s++) {
    if (!solid[s] || lab[s] >= 0) continue;
    const id = sizes.length; let n = 0, sp = 0; stack[sp++] = s; lab[s] = id;
    while (sp) { const p = stack[--sp]; n++; const x = p % W, y = (p / W) | 0;
      for (const q of [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, y > 0 ? p - W : -1, y < H - 1 ? p + W : -1])
        if (q >= 0 && solid[q] && lab[q] < 0) { lab[q] = id; stack[sp++] = q; } }
    sizes.push(n);
  }
  const keep = sizes.indexOf(Math.max(...sizes));
  // The jar is convex: wrap its dark core in a convex hull. This restores the sunlit edges the
  // threshold misses and leaves out the cast shadow, which the strict threshold never picked up.
  const pts = [];
  for (let y = 0; y < H; y++) { let a = -1, b = -1;
    for (let x = 0; x < W; x++) if (lab[y * W + x] === keep) { if (a < 0) a = x; b = x; }
    if (a >= 0) { pts.push([a, y], [b, y]); } }
  pts.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [], upper = [];
  for (const p of pts) { while (lower.length > 1 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop(); lower.push(p); }
  for (const p of pts.slice().reverse()) { while (upper.length > 1 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop(); upper.push(p); }
  const hull = lower.slice(0, -1).concat(upper.slice(0, -1));
  const inset = +(process.argv[5] || 2);
  const mask = Buffer.alloc(N);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    let inside = true;
    for (let k = 0; k < hull.length && inside; k++) {
      const a = hull[k], b = hull[(k + 1) % hull.length];
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      if (cross(a, b, [x, y]) / len < inset) inside = false;
    }
    mask[y * W + x] = inside ? 255 : 0;
  }
  const soft = await sharp(mask, { raw: { width: W, height: H, channels: 1 } }).blur(1.2).extractChannel(0).raw().toBuffer();
  const rgba = Buffer.alloc(N * 4);
  for (let i = 0; i < N; i++) { rgba[i * 4] = data[i * 3]; rgba[i * 4 + 1] = data[i * 3 + 1]; rgba[i * 4 + 2] = data[i * 3 + 2]; rgba[i * 4 + 3] = soft[i]; }
  const png = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
  const info2 = await sharp(png).trim().webp({ quality: 86, alphaQuality: 100 }).toFile(out);
  console.log('jar cut-out', info2.width, 'x', info2.height, '->', out);
})();
