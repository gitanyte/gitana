// Sugeneruoja kalbančio avataro vaizdo įrašą iš autorės garso įrašo.
// Paleidimas: node tools/render-talking.mjs <avataro id> <garso failas> [išvesties mp4]
//   pvz. node tools/render-talking.mjs leo garsas/01-leo.m4a video-balsas/01-leo.mp4
// Avatarų id: leo, ruta, gramas, lape, drake, meska.
// Reikia: npm i playwright  ir  pip install imageio-ffmpeg (arba ffmpeg sistemoje).
import { chromium } from "playwright";
import { spawn, execSync, execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [avatarId, audioPath, outArg] = process.argv.slice(2);
if (!avatarId || !audioPath) {
  console.error("Naudojimas: node tools/render-talking.mjs <avataro id> <garso failas> [išvestis.mp4]");
  process.exit(1);
}
const outPath = outArg || path.join(root, "video-balsas", path.basename(audioPath).replace(/\.\w+$/, "") + ".mp4");
fs.mkdirSync(path.dirname(outPath), { recursive: true });

let ffmpeg = "ffmpeg";
try {
  execSync("ffmpeg -version", { stdio: "ignore" });
} catch {
  ffmpeg = execSync(`python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"`).toString().trim();
}

// Garsumas kiekvienam kadrui: dekoduojame į 16 bit mono PCM ir skaičiuojame RMS per 1/30 s
const FPS = 30;
const RATE = 16000;
const pcm = execFileSync(ffmpeg, ["-loglevel", "error", "-i", audioPath, "-ac", "1", "-ar", String(RATE), "-f", "s16le", "-"], {
  maxBuffer: 1 << 30,
});
const samples = new Int16Array(pcm.buffer, pcm.byteOffset, pcm.length / 2);
const perFrame = RATE / FPS;
const frames = Math.ceil(samples.length / perFrame);
const rms = [];
for (let f = 0; f < frames; f++) {
  let sum = 0;
  const start = Math.floor(f * perFrame);
  const end = Math.min(samples.length, Math.floor((f + 1) * perFrame));
  for (let i = start; i < end; i++) sum += (samples[i] / 32768) ** 2;
  rms.push(Math.sqrt(sum / Math.max(1, end - start)));
}
// Normalizuojame pagal 95-ą procentilį ir išlyginame, kad avataras nedrebėtų
const sorted = [...rms].sort((x, y) => x - y);
const peak = sorted[Math.floor(sorted.length * 0.95)] || 1;
let smooth = 0;
const volume = rms.map((v) => {
  const target = Math.min(1, v / peak);
  smooth = target > smooth ? smooth + (target - smooth) * 0.6 : smooth + (target - smooth) * 0.25;
  return Number(smooth.toFixed(3));
});
const voice = { duration: samples.length / RATE, volume };

const browser = await chromium.launch(
  fs.existsSync("/opt/pw-browsers/chromium") ? { executablePath: "/opt/pw-browsers/chromium" } : {}
);
const page = await browser.newPage();
await page.goto(pathToFileURL(path.join(root, "video.html")).href);
await page.addScriptTag({ path: path.join(root, "js/talking.js") });

const totalFrames = await page.evaluate(async ({ avatarId, voice }) => {
  const a = AVATARS.find((x) => x.id === avatarId);
  if (!a) throw new Error("Nėra avataro " + avatarId);
  window.__video = await makeTalkingVideo(a, voice);
  window.__canvas = Object.assign(document.createElement("canvas"), { width: VIDEO_W, height: VIDEO_H });
  return Math.ceil(window.__video.duration * VIDEO_FPS);
}, { avatarId, voice });

const enc = spawn(ffmpeg, [
  "-y", "-loglevel", "error",
  "-f", "image2pipe", "-framerate", String(FPS), "-i", "-",
  "-i", audioPath,
  // garsas pratęsiamas tyla iki vaizdo pabaigos
  "-filter_complex", "[1:a]apad[a]", "-map", "0:v", "-map", "[a]", "-shortest",
  "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "medium", "-crf", "20",
  "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart",
  outPath,
], { stdio: ["pipe", "inherit", "inherit"] });
const done = new Promise((res, rej) => enc.on("close", (c) => (c ? rej(new Error("ffmpeg " + c)) : res())));

for (let f = 0; f < totalFrames; f += 15) {
  const batch = await page.evaluate(({ f, totalFrames }) => {
    const ctx = window.__canvas.getContext("2d");
    const res = [];
    for (let k = f; k < Math.min(f + 15, totalFrames); k++) {
      window.__video.draw(ctx, k / VIDEO_FPS);
      res.push(window.__canvas.toDataURL("image/jpeg", 0.92).split(",")[1]);
    }
    return res;
  }, { f, totalFrames });
  for (const b64 of batch) {
    if (!enc.stdin.write(Buffer.from(b64, "base64"))) await new Promise((r) => enc.stdin.once("drain", r));
  }
}
enc.stdin.end();
await done;
await browser.close();
console.log(`✔ ${path.relative(root, outPath)} (${voice.duration.toFixed(1)} s)`);
