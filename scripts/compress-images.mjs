#!/usr/bin/env node
// Compress and resize images > 300 kB in src/assets/ and public/.
// - Resize to max width 1600px (preserve ratio).
// - Recompress JPG/PNG to JPG quality 82 (mozjpeg) — overwrites originals.
// - Generate sibling .webp at quality 80.
// - Backup originals to scripts/backup-images-original/ (mirroring source path).
// - Skip files already present in backup (idempotent re-runs replay from source).
//
// PNG with transparency (logos) is preserved as PNG (no JPG conversion, no resize
// past existing width).

import { mkdir, readdir, readFile, stat, writeFile, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = dirname(__dirname);
const ROOTS = [join(PROJECT_ROOT, "src", "assets"), join(PROJECT_ROOT, "public")];
const BACKUP_ROOT = join(__dirname, "backup-images-original");

const MIN_BYTES_FOR_RECOMPRESSION = 300 * 1024; // 300 kB threshold
const MAX_WIDTH = 1600;
const JPG_QUALITY = 82;
const WEBP_QUALITY = 80;

// PNG files we keep as PNG (transparency / logos).
const KEEP_AS_PNG_PATTERNS = [/logo/i, /signature/i, /certifications/i, /favicon/i, /banner-equation/i];

function fmt(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} kB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function shouldKeepAsPng(file) {
  return KEEP_AS_PNG_PATTERNS.some((re) => re.test(file));
}

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

async function ensureBackup(file) {
  const rel = relative(PROJECT_ROOT, file);
  const backupPath = join(BACKUP_ROOT, rel);
  if (existsSync(backupPath)) return backupPath;
  await mkdir(dirname(backupPath), { recursive: true });
  await copyFile(file, backupPath);
  return backupPath;
}

async function processImage(file) {
  const ext = extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) return null;

  const sizeBefore = (await stat(file)).size;
  if (sizeBefore < MIN_BYTES_FOR_RECOMPRESSION) {
    return { file, skipped: true, reason: "below threshold", before: sizeBefore };
  }

  await ensureBackup(file);
  const input = await readFile(file);
  const meta = await sharp(input).metadata();
  const isPng = ext === ".png";
  const keepPng = isPng && (shouldKeepAsPng(file) || meta.hasAlpha);

  const needsResize = (meta.width ?? 0) > MAX_WIDTH;

  let pipeline = sharp(input).rotate();
  if (needsResize) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true, fit: "inside" });
  }

  let outBuf;
  if (keepPng) {
    outBuf = await pipeline.png({ compressionLevel: 9 }).toBuffer();
  } else {
    outBuf = await pipeline.jpeg({ quality: JPG_QUALITY, mozjpeg: true }).toBuffer();
  }

  // Don't replace the original if recompression made it bigger.
  if (outBuf.length >= sizeBefore) {
    return { file, skipped: true, reason: "recompression would grow file", before: sizeBefore };
  }
  await writeFile(file, outBuf);

  // .webp sibling (skip for PNG-with-alpha logos that we keep as PNG)
  let webpSize = 0;
  if (!keepPng) {
    const webpPath = file.replace(/\.(jpe?g|png)$/i, ".webp");
    const webpBuf = await sharp(input)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true, fit: "inside" })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();
    await writeFile(webpPath, webpBuf);
    webpSize = webpBuf.length;
  }

  const sizeAfter = outBuf.length;
  const meta2 = await sharp(outBuf).metadata();
  return {
    file,
    before: sizeBefore,
    after: sizeAfter,
    webp: webpSize,
    width: meta2.width,
    height: meta2.height,
    skipped: false,
  };
}

async function main() {
  console.log(`[compress] threshold: > ${fmt(MIN_BYTES_FOR_RECOMPRESSION)}`);
  console.log(`[compress] max width: ${MAX_WIDTH}px, JPG q${JPG_QUALITY}, WebP q${WEBP_QUALITY}`);
  console.log(`[compress] backup root: ${relative(PROJECT_ROOT, BACKUP_ROOT)}\n`);

  const results = [];
  for (const root of ROOTS) {
    for await (const file of walk(root)) {
      try {
        const r = await processImage(file);
        if (r) results.push(r);
      } catch (err) {
        console.error(`[compress] FAILED ${file}: ${err.message}`);
      }
    }
  }

  const processed = results.filter((r) => !r.skipped);
  const totalBefore = processed.reduce((s, r) => s + r.before, 0);
  const totalAfter = processed.reduce((s, r) => s + r.after, 0);
  const totalWebp = processed.reduce((s, r) => s + r.webp, 0);

  console.log("\n--- Compression report ---");
  for (const r of processed) {
    const rel = relative(PROJECT_ROOT, r.file);
    const pct = (((r.before - r.after) / r.before) * 100).toFixed(1);
    console.log(`  ${rel}  ${fmt(r.before)} → ${fmt(r.after)} (-${pct}%)  webp=${fmt(r.webp)}  [${r.width}x${r.height}]`);
  }
  console.log(`\n  Files processed   : ${processed.length}`);
  console.log(`  Total before      : ${fmt(totalBefore)}`);
  console.log(`  Total after (orig): ${fmt(totalAfter)}`);
  console.log(`  Total .webp       : ${fmt(totalWebp)}`);
  console.log(`  Saved (originals) : ${fmt(totalBefore - totalAfter)}  (${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}%)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
