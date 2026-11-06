// Cut the portrait out of its black background → transparent PNG.
// Background = dark pixels connected to the image border (flood fill), then a soft edge.
import fs from 'node:fs'
import zlib from 'node:zlib'
const [, , inBmp, outPng] = process.argv
const b = fs.readFileSync(inBmp)
const off = b.readUInt32LE(10), W = b.readInt32LE(18), Hraw = b.readInt32LE(22), H = Math.abs(Hraw)
const bpp = b.readUInt16LE(28) / 8, stride = Math.ceil((W * bpp) / 4) * 4
const px = (x, y) => { const row = Hraw < 0 ? y : H - 1 - y; const o = off + row * stride + x * bpp; return [b[o + 2], b[o + 1], b[o]] }
const bright = new Float32Array(W * H), rgb = new Uint8Array(W * H * 3)
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const [r, g, bl] = px(x, y); const i = y * W + x; rgb.set([r, g, bl], i * 3); bright[i] = Math.max(r, g, bl) }

const T = 30 // anything darker than this, reachable from the border, is background
const bg = new Uint8Array(W * H), stack = []
// navy suit shadows are dark but bluish; the backdrop is neutral black
const bluish = (i) => rgb[i * 3 + 2] - rgb[i * 3] > 10
const push = (x, y) => { if (x < 0 || y < 0 || x >= W || y >= H) return; const i = y * W + x; if (bg[i] || bright[i] >= T || bluish(i)) return; bg[i] = 1; stack.push(i) }
for (let x = 0; x < W; x++) push(x, 0) // not the bottom edge: the suit touches it
for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y) }
while (stack.length) { const i = stack.pop(), x = i % W, y = (i / W) | 0; push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1) }

// alpha: 0 in background, 1 in subject; near the edge, fade by brightness so hair stays soft
const alpha = new Float32Array(W * H)
for (let i = 0; i < W * H; i++) alpha[i] = bg[i] ? 0 : 1
const edge = new Float32Array(alpha)
for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
  const i = y * W + x
  let nearBg = false
  for (let dy = -2; dy <= 2 && !nearBg; dy++) for (let dx = -2; dx <= 2; dx++) { const j = (y + dy) * W + (x + dx); if (j >= 0 && j < W * H && bg[j]) { nearBg = true; break } }
  if (nearBg) edge[i] = Math.min(alpha[i] || (bright[i] - 8) / (T - 8), Math.max(0, Math.min(1, (bright[i] - 6) / 34)))
}
// a light blur on the alpha only, to anti-alias the outline
const out = new Uint8Array(W * H * 4)
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  let s = 0, n = 0
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue; s += edge[yy * W + xx]; n++ }
  const i = y * W + x, a = Math.max(0, Math.min(1, s / n))
  out.set([rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2], Math.round(a * 255)], i * 4)
}

// minimal PNG writer
const crcT = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0 })
const crc = (buf) => { let c = 0xffffffff; for (const v of buf) c = crcT[(c ^ v) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0 }
const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]) }
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 6
const raw = Buffer.alloc(H * (W * 4 + 1))
for (let y = 0; y < H; y++) { raw[y * (W * 4 + 1)] = 0; Buffer.from(out.buffer, y * W * 4, W * 4).copy(raw, y * (W * 4 + 1) + 1) }
fs.writeFileSync(outPng, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]))
const bgShare = bg.reduce((a, v) => a + v, 0) / (W * H)
console.log(`wrote ${outPng} ${W}x${H}, background ${(bgShare * 100).toFixed(1)}%`)
