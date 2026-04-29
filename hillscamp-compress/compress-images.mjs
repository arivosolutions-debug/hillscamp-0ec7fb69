/**
 * Hillscamp — Supabase Storage Batch Image Compressor
 * 
 * Downloads every image from your storage buckets, compresses with sharp,
 * and re-uploads in place. Originals are backed up before overwriting.
 * 
 * Usage:
 *   node compress-images.mjs              → dry run (shows what would happen, no changes)
 *   node compress-images.mjs --run        → actually compresses and re-uploads
 *   node compress-images.mjs --run --bucket property-images  → single bucket only
 * 
 * Requirements:
 *   npm install @supabase/supabase-js sharp
 * 
 * Set env vars before running (or create a .env file):
 *   SUPABASE_URL=https://amlhmlfzvqdghbbuluio.supabase.co
 *   SUPABASE_SERVICE_KEY=your_service_role_key   ← NOT the anon key
 */

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';

// ─── Config ───────────────────────────────────────────────────────────────────

const SUPABASE_URL     = process.env.SUPABASE_URL     || 'https://amlhmlfzvqdghbbuluio.supabase.co';
const SUPABASE_KEY     = process.env.SUPABASE_SERVICE_KEY; // must be service role key

// Buckets to process (in priority order — most impactful first)
const BUCKETS = ['property-images', 'room-images', 'package-images', 'blog-images'];

// Compression targets per bucket
const BUCKET_SETTINGS = {
  'property-images': { maxWidth: 1600, quality: 78 },  // listing + hero cards
  'room-images':     { maxWidth: 1400, quality: 78 },  // room slides
  'package-images':  { maxWidth: 1200, quality: 80 },  // package cards
  'blog-images':     { maxWidth: 1200, quality: 80 },  // blog thumbnails
};

const DEFAULT_SETTINGS = { maxWidth: 1400, quality: 78 };

// Files smaller than this (KB) are skipped — already small enough
const SKIP_BELOW_KB = 150;

// Back up originals to this local folder before overwriting
const BACKUP_DIR = './image-backup-originals';

// ─── Args ─────────────────────────────────────────────────────────────────────

const args        = process.argv.slice(2);
const DRY_RUN     = !args.includes('--run');
const bucketArg   = args.includes('--bucket') ? args[args.indexOf('--bucket') + 1] : null;
const bucketsToRun = bucketArg ? [bucketArg] : BUCKETS;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes) {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatPct(before, after) {
  const pct = ((before - after) / before * 100).toFixed(1);
  return `${pct}% smaller`;
}

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function saveBackup(bucket, filePath, data) {
  const dest = join(BACKUP_DIR, bucket, filePath);
  ensureDir(dirname(dest));
  writeFileSync(dest, data);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!SUPABASE_KEY) {
    console.error('\n❌  SUPABASE_SERVICE_KEY is not set.');
    console.error('   Get it from: Supabase Dashboard → Project Settings → API → service_role key');
    console.error('   Run: SUPABASE_SERVICE_KEY=your_key node compress-images.mjs --run\n');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false }
  });

  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║   Hillscamp — Supabase Image Compressor          ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(DRY_RUN
    ? '\n🔍  DRY RUN — no files will be changed. Add --run to apply.\n'
    : '\n🚀  LIVE RUN — images will be compressed and re-uploaded.\n');

  let totalFiles       = 0;
  let totalSkipped     = 0;
  let totalProcessed   = 0;
  let totalErrors      = 0;
  let totalBytesBefore = 0;
  let totalBytesAfter  = 0;

  const errorLog = [];

  for (const bucket of bucketsToRun) {
    console.log(`\n📁  Bucket: ${bucket}`);
    console.log('    ' + '─'.repeat(50));

    // List all files in bucket (handles pagination)
    let allFiles = [];
    let offset   = 0;
    const limit  = 100;

    while (true) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list('', { limit, offset, sortBy: { column: 'name', order: 'asc' } });

      if (error) {
        console.error(`    ❌  Could not list bucket: ${error.message}`);
        break;
      }
      if (!data || data.length === 0) break;

      // Recursively list subfolders
      for (const item of data) {
        if (item.id === null) {
          // It's a folder — list it
          const { data: subFiles, error: subErr } = await supabase.storage
            .from(bucket)
            .list(item.name, { limit: 1000 });

          if (!subErr && subFiles) {
            subFiles.forEach(f => {
              if (f.id) allFiles.push({ ...f, fullPath: `${item.name}/${f.name}` });
            });
          }
        } else {
          allFiles.push({ ...item, fullPath: item.name });
        }
      }

      offset += limit;
      if (data.length < limit) break;
    }

    // Filter to images only
    const imageFiles = allFiles.filter(f =>
      /\.(jpg|jpeg|png|webp|gif)$/i.test(f.fullPath)
    );

    console.log(`    Found ${imageFiles.length} image(s)`);
    totalFiles += imageFiles.length;

    const settings = BUCKET_SETTINGS[bucket] || DEFAULT_SETTINGS;

    for (const file of imageFiles) {
      const sizeKB = file.metadata?.size ? file.metadata.size / 1024 : null;
      const sizeLabel = sizeKB ? `${sizeKB.toFixed(0)} KB` : 'unknown size';

      // Skip tiny files
      if (sizeKB && sizeKB < SKIP_BELOW_KB) {
        console.log(`    ⏭   ${file.fullPath} (${sizeLabel}) — already small, skipped`);
        totalSkipped++;
        continue;
      }

      process.stdout.write(`    ⏳  ${file.fullPath} (${sizeLabel}) → `);

      try {
        // Download original
        const { data: blob, error: dlErr } = await supabase.storage
          .from(bucket)
          .download(file.fullPath);

        if (dlErr) throw new Error(`Download failed: ${dlErr.message}`);

        const originalBuffer = Buffer.from(await blob.arrayBuffer());
        const originalSize   = originalBuffer.length;
        totalBytesBefore    += originalSize;

        if (DRY_RUN) {
          // Estimate compression without actually re-uploading
          const compressed = await sharp(originalBuffer)
            .resize({ width: settings.maxWidth, withoutEnlargement: true })
            .jpeg({ quality: settings.quality, progressive: true, mozjpeg: true })
            .toBuffer();

          const saving = formatPct(originalSize, compressed.length);
          totalBytesAfter += compressed.length;
          console.log(`${formatBytes(compressed.length)} (${saving}) ← estimated`);
        } else {
          // Back up original locally
          saveBackup(bucket, file.fullPath, originalBuffer);

          // Detect output format — keep PNG as PNG, everything else → JPEG
          const isPng = /\.png$/i.test(file.fullPath);

          let compressedBuffer;
          let contentType;

          if (isPng) {
            compressedBuffer = await sharp(originalBuffer)
              .resize({ width: settings.maxWidth, withoutEnlargement: true })
              .png({ compressionLevel: 9, palette: true })
              .toBuffer();
            contentType = 'image/png';
          } else {
            compressedBuffer = await sharp(originalBuffer)
              .resize({ width: settings.maxWidth, withoutEnlargement: true })
              .jpeg({ quality: settings.quality, progressive: true, mozjpeg: true })
              .toBuffer();
            contentType = 'image/jpeg';
          }

          const compressedSize = compressedBuffer.length;
          totalBytesAfter     += compressedSize;

          // Re-upload (overwrite in place)
          const { error: upErr } = await supabase.storage
            .from(bucket)
            .upload(file.fullPath, compressedBuffer, {
              contentType,
              upsert: true,
              cacheControl: '31536000',
            });

          if (upErr) throw new Error(`Upload failed: ${upErr.message}`);

          const saving = formatPct(originalSize, compressedSize);
          console.log(`${formatBytes(compressedSize)} (${saving}) ✓`);
          totalProcessed++;
        }

      } catch (err) {
        console.log(`❌  ERROR`);
        const msg = `${bucket}/${file.fullPath}: ${err.message}`;
        errorLog.push(msg);
        totalErrors++;
      }
    }
  }

  // ─── Summary ─────────────────────────────────────────────────────────────

  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║   Summary                                        ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`  Total images found : ${totalFiles}`);
  console.log(`  Skipped (too small): ${totalSkipped}`);
  console.log(`  Processed          : ${DRY_RUN ? totalFiles - totalSkipped + ' (estimated)' : totalProcessed}`);
  console.log(`  Errors             : ${totalErrors}`);
  console.log(`  Size before        : ${formatBytes(totalBytesBefore)}`);
  console.log(`  Size after         : ${formatBytes(totalBytesAfter)}`);

  if (totalBytesBefore > 0) {
    const saved    = totalBytesBefore - totalBytesAfter;
    const savedPct = (saved / totalBytesBefore * 100).toFixed(1);
    console.log(`  Total saved        : ${formatBytes(saved)} (${savedPct}%)`);
  }

  if (!DRY_RUN && totalProcessed > 0) {
    console.log(`\n  📦  Originals backed up to: ${BACKUP_DIR}/`);
    console.log('      Keep this folder until you\'ve verified the site looks good.');
  }

  if (errorLog.length > 0) {
    console.log('\n  ⚠️   Errors encountered:');
    errorLog.forEach(e => console.log(`       • ${e}`));
  }

  if (DRY_RUN) {
    console.log('\n  👆  This was a dry run. Run with --run to apply changes.\n');
  } else {
    console.log('\n  ✅  Done. Refresh your site and check images look correct.');
    console.log('      If anything looks wrong, originals are in ' + BACKUP_DIR + '\n');
  }
}

main().catch(err => {
  console.error('\n💥  Unexpected error:', err.message);
  process.exit(1);
});
