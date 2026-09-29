// Sugeneruoja MP4 vaizdo įrašus (1080×1920, 30 kadrų/s) visiems patarimams ir klausimams.
// Reikia: npm i playwright  ir  pip install imageio-ffmpeg (arba ffmpeg sistemoje).
// Paleidimas: node tools/render-videos.mjs [filtras]   pvz. node tools/render-videos.mjs leo
import { chromium } from "playwright";
import { spawn, execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "video");
const filter = process.argv[2] || "";
fs.mkdirSync(out, { recursive: true });

let ffmpeg = "ffmpeg";
try {
  execSync("ffmpeg -version", { stdio: "ignore" });
} catch {
  ffmpeg = execSync(`python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"`).toString().trim();
}

const browser = await chromium.launch(
  fs.existsSync("/opt/pw-browsers/chromium") ? { executablePath: "/opt/pw-browsers/chromium" } : {}
);
const page = await browser.newPage();
await page.goto(pathToFileURL(path.join(root, "video.html")).href);

const jobs = await page.evaluate(() =>
  AVATARS.flatMap((a) => [
    ...a.lessons.map((_, i) => ({ id: a.id, type: "tip", i })),
    ...a.quiz.map((_, i) => ({ id: a.id, type: "quiz", i })),
  ])
);

// Failų vardai sutampa su paveikslėlių vardais aplanke irasai/
const FILE_IDS = { leo: "leo", ruta: "ruta", gramas: "gramas", lape: "lina", drake: "dovis", meska: "mantas" };

let n = 0;
for (const job of jobs) {
  n++;
  const name = `${String(n).padStart(2, "0")}-${FILE_IDS[job.id]}-${job.type === "tip" ? "patarimas" : "klausimas"}.mp4`;
  if (filter && !name.includes(filter)) continue;

  const frames = await page.evaluate(async ({ id, type, i }) => {
    const a = AVATARS.find((x) => x.id === id);
    window.__video = await makeVideo(a, type, i);
    window.__canvas = Object.assign(document.createElement("canvas"), { width: VIDEO_W, height: VIDEO_H });
    return Math.ceil(window.__video.duration * VIDEO_FPS);
  }, job);

  const enc = spawn(ffmpeg, [
    "-y", "-loglevel", "error",
    "-f", "image2pipe", "-framerate", "30", "-i", "-",
    // tylus garso takelis – kai kurios platformos geriau priima įrašus su garsu
    "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo", "-shortest",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "medium", "-crf", "20",
    "-c:a", "aac", "-movflags", "+faststart",
    path.join(out, name),
  ], { stdio: ["pipe", "inherit", "inherit"] });
  const done = new Promise((res, rej) => enc.on("close", (c) => (c ? rej(new Error("ffmpeg " + c)) : res())));

  for (let f = 0; f < frames; f += 15) {
    const batch = await page.evaluate(({ f, frames }) => {
      const ctx = window.__canvas.getContext("2d");
      const res = [];
      for (let k = f; k < Math.min(f + 15, frames); k++) {
        window.__video.draw(ctx, k / VIDEO_FPS);
        res.push(window.__canvas.toDataURL("image/jpeg", 0.92).split(",")[1]);
      }
      return res;
    }, { f, frames });
    for (const b64 of batch) {
      if (!enc.stdin.write(Buffer.from(b64, "base64"))) await new Promise((r) => enc.stdin.once("drain", r));
    }
  }
  enc.stdin.end();
  await done;
  console.log(`✔ ${name} (${(frames / 30).toFixed(1)} s)`);
}

await browser.close();
