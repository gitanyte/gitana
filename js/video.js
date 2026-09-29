// Vertikalių vaizdo įrašų (TikTok, Instagram Reels) animacija.
// Kiekvienas kadras piešiamas pagal laiką t, todėl įrašą galima ir peržiūrėti naršyklėje,
// ir sugeneruoti kadras po kadro (žr. tools/render-videos.mjs).

const VIDEO_W = 1080;
const VIDEO_H = 1920;
const VIDEO_FPS = 30;
const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

const avatarImages = {};

function loadAvatar(a) {
  if (avatarImages[a.id]) return avatarImages[a.id];
  avatarImages[a.id] = new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(avatarSVG(a, 600));
  });
  return avatarImages[a.id];
}

const clamp = (x, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
const progress = (t, start, len) => clamp((t - start) / len);
const easeOut = (x) => 1 - Math.pow(1 - x, 3);
const easeBack = (x) => {
  const c = 1.7;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
};

function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Suskaido tekstą į eilutes, kurios telpa į plotį.
function wrapLines(ctx, text, font, maxWidth) {
  ctx.font = font;
  const lines = [];
  let line = "";
  for (const w of text.split(" ")) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Teksto blokas, kuris „rašomas“ raidė po raidės nuo start per len sekundžių.
function typedBlock(ctx, lines, font, color, x, y, lh, t, start, len) {
  const total = lines.reduce((s, l) => s + l.length, 0);
  let shown = Math.floor(total * progress(t, start, len));
  ctx.font = font;
  ctx.fillStyle = color;
  for (const l of lines) {
    if (shown <= 0) break;
    ctx.fillText(l.slice(0, shown), x, y);
    shown -= l.length;
    y += lh;
  }
}

// Sudaro vaizdo įrašo planą: trukmę ir kadro piešimo funkciją.
async function makeVideo(a, type, idx) {
  const img = await loadAvatar(a);
  const isTip = type === "tip";
  const lesson = isTip ? a.lessons[idx] : null;
  const quiz = isTip ? null : a.quiz[idx];

  const measure = document.createElement("canvas").getContext("2d");
  // Saugi zona: dešinėje ~150 px uždengia programėlės mygtukai, apačioje ~480 px – aprašymas.
  const SAFE_RIGHT = 920;
  const SAFE_BOTTOM = 1440;
  const inner = SAFE_RIGHT - 60 - 120;
  const titleFont = `800 58px ${FONT}`;
  const bodyFont = `400 46px ${FONT}`;
  const qFont = `700 44px ${FONT}`;
  const optFont = `500 40px ${FONT}`;
  const explainFont = `600 38px ${FONT}`;
  const Q_LH = 54;
  const OPT_LH = 50;

  const T = { header: 0, avatar: 0.3, bubble: 1.2, text: 1.8 };
  let layout;
  let duration;

  if (isTip) {
    const title = wrapLines(measure, "💡 " + lesson.title, titleFont, inner);
    const body = wrapLines(measure, lesson.text, bodyFont, inner);
    const titleLen = Math.max(0.8, lesson.title.length / 30);
    const bodyLen = Math.max(3, lesson.text.length / 28);
    T.body = T.text + titleLen + 0.3;
    T.outro = T.body + bodyLen + 1.5;
    duration = T.outro + 2.5;
    layout = { title, titleLen, body, bodyLen, boxY: 700, avatarSize: 330, avatarY: 490 };
    layout.boxH = 100 + title.length * 70 + 30 + body.length * 60 + 30;
  } else {
    const q = wrapLines(measure, quiz.q, qFont, inner);
    const opts = quiz.options.map((o, k) => wrapLines(measure, `${"ABCD"[k]}) ${o}`, optFont, inner - 60));
    const qLen = Math.max(2, quiz.q.length / 30);
    T.opts = T.text + 0.9 + qLen + 0.2;
    T.count = T.opts + opts.length * 0.45 + 0.5;
    T.reveal = T.count + 5;
    T.outro = T.reveal + 3.5;
    duration = T.outro + 2.5;
    // Paaiškinimas rodomas viršuje, kairėje nuo avataro, kad burbulas neišlįstų už saugios zonos.
    const explain = wrapLines(measure, "✅ " + quiz.explain, explainFont, 600);
    layout = { q, qLen, opts, explain, boxY: 590, avatarSize: 240, avatarY: 420 };
    const optsH = opts.reduce((s, l) => s + l.length * OPT_LH + 26 + 12, 0);
    layout.boxH = 170 + q.length * Q_LH + 10 + optsH + 10;
  }

  function draw(ctx, t) {
    // Fonas su lėtai judančiais burbulais
    const g = ctx.createLinearGradient(0, 0, VIDEO_W, VIDEO_H);
    g.addColorStop(0, a.color);
    g.addColorStop(1, a.accent);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);
    ctx.fillStyle = "rgba(255,255,255,.10)";
    for (let i = 0; i < 6; i++) {
      const bx = (i * 211 + t * 30 * (i % 2 ? 1 : -1)) % (VIDEO_W + 300);
      const by = VIDEO_H - ((i * 337 + t * 60) % (VIDEO_H + 300));
      ctx.beginPath();
      ctx.arc(bx < -150 ? bx + VIDEO_W + 300 : bx, by, 60 + i * 25, 0, Math.PI * 2);
      ctx.fill();
    }

    // Antraštė (TikTok viršuje palieka vietos, todėl pradedame nuo 170 px)
    const hp = easeOut(progress(t, T.header, 0.6));
    ctx.save();
    ctx.globalAlpha = hp;
    ctx.translate(0, (1 - hp) * -80);
    ctx.fillStyle = "#fff";
    ctx.font = `800 58px ${FONT}`;
    ctx.fillText(`ANGLŲ K. VBE · ${a.part} DALIS`, 80, 230);
    ctx.font = `600 44px ${FONT}`;
    ctx.fillText(`${a.name} · ${a.skill}`, 80, 295);
    ctx.restore();

    // Avataras: įšoka, tada linguoja; kol „kalba“ – linguoja greičiau
    const talking = isTip ? t > T.text && t < T.outro - 1.5 : t > T.text && t < T.opts;
    const ap = easeBack(progress(t, T.avatar, 0.8));
    const bob = Math.sin(t * (talking ? 9 : 3)) * (talking ? 10 : 14);
    const size = layout.avatarSize * ap;
    const ax = SAFE_RIGHT - 20 - layout.avatarSize / 2;
    const ay = layout.avatarY + bob;
    if (size > 1) ctx.drawImage(img, ax - size / 2, ay - size / 2, size, size);

    // Burbulas
    const bp = easeBack(progress(t, T.bubble, 0.5));
    const boxX = 60;
    const boxY = layout.boxY;
    const boxW = SAFE_RIGHT - 60;
    const boxH = layout.boxH;
    if (bp > 0) {
      ctx.save();
      ctx.translate(ax, boxY);
      ctx.scale(bp, bp);
      ctx.translate(-ax, -boxY);
      ctx.fillStyle = "#fff";
      rrect(ctx, boxX, boxY, boxW, boxH, 48);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(ax - 40, boxY + 2);
      ctx.lineTo(ax, boxY - 50);
      ctx.lineTo(ax + 40, boxY + 2);
      ctx.fill();
      ctx.restore();
    }

    const tx = 120;
    if (isTip) {
      typedBlock(ctx, layout.title, titleFont, a.accent, tx, boxY + 100, 70, t, T.text, layout.titleLen);
      const by = boxY + 100 + layout.title.length * 70 + 30;
      typedBlock(ctx, layout.body, bodyFont, "#222", tx, by, 60, t, T.body, layout.bodyLen);
    } else {
      const qa = progress(t, T.text, 0.4);
      ctx.globalAlpha = qa;
      ctx.fillStyle = a.accent;
      ctx.font = `800 52px ${FONT}`;
      ctx.fillText("❓ Ar žinai atsakymą?", tx, boxY + 90);
      ctx.globalAlpha = 1;
      typedBlock(ctx, layout.q, qFont, "#222", tx, boxY + 170, Q_LH, t, T.text + 0.9, layout.qLen);

      let oy = boxY + 170 + layout.q.length * Q_LH + 10;
      const revealed = t >= T.reveal;
      layout.opts.forEach((lines, k) => {
        const op = easeOut(progress(t, T.opts + k * 0.45, 0.35));
        const h = lines.length * OPT_LH + 26;
        if (op > 0) {
          ctx.save();
          ctx.globalAlpha = op;
          ctx.translate((1 - op) * 60, 0);
          const right = k === quiz.answer;
          const dim = revealed && !right;
          ctx.fillStyle = revealed && right ? "#d9f5e3" : "#f3f1ec";
          rrect(ctx, tx - 20, oy - 46, inner + 40, h, 20);
          ctx.fill();
          if (revealed && right) {
            ctx.strokeStyle = "#2e9e5b";
            ctx.lineWidth = 6;
            ctx.stroke();
          }
          ctx.globalAlpha = op * (dim ? 0.4 : 1);
          ctx.font = optFont;
          ctx.fillStyle = "#222";
          lines.forEach((l, j) => ctx.fillText(l, tx + (j ? 50 : 0), oy + j * OPT_LH));
          if (revealed && right) {
            ctx.font = `800 46px ${FONT}`;
            ctx.fillText("✅", tx + inner - 40, oy);
          }
          ctx.restore();
        }
        oy += h + 12;
      });

      // Atgalinis skaičiavimas
      if (t >= T.count && t < T.reveal) {
        const left = Math.ceil(T.reveal - t);
        const frac = T.reveal - t - Math.floor(T.reveal - t);
        const cx = 170;
        const cy = 420;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(cx, cy, 80, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = a.accent;
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.arc(cx, cy, 80, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac);
        ctx.stroke();
        ctx.fillStyle = a.accent;
        ctx.font = `800 80px ${FONT}`;
        ctx.textAlign = "center";
        ctx.fillText(String(left), cx, cy + 30);
        ctx.fillStyle = "#fff";
        ctx.font = `700 48px ${FONT}`;
        ctx.textAlign = "left";
        ctx.fillText("Pagalvok!", cx + 110, cy + 16);
        ctx.textAlign = "left";
      }

      // Paaiškinimas po atsakymo – kortelė viršuje, kairėje nuo avataro
      if (revealed) {
        const ep = easeOut(progress(t, T.reveal + 0.4, 0.5));
        const eh = layout.explain.length * 48 + 44;
        ctx.save();
        ctx.globalAlpha = ep;
        ctx.translate(0, (1 - ep) * 30);
        ctx.fillStyle = "#fff";
        rrect(ctx, 60, 330, 660, eh, 28);
        ctx.fill();
        ctx.fillStyle = "#1f6b3b";
        ctx.font = explainFont;
        layout.explain.forEach((l, j) => ctx.fillText(l, 90, 330 + 58 + j * 48));
        ctx.restore();
      }
    }

    // Pabaiga: atskiras ekranas su dideliu avataru, šūkiu ir kvietimu sekti
    const op = easeOut(progress(t, T.outro, 0.6));
    if (op > 0) {
      ctx.save();
      ctx.globalAlpha = op;
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);
      const CX = SAFE_RIGHT / 2 + 30;
      const big = 500 * easeBack(progress(t, T.outro + 0.2, 0.7));
      if (big > 1) ctx.drawImage(img, CX - big / 2, 640 - big / 2 + Math.sin(t * 3) * 14, big, big);
      ctx.textAlign = "center";
      ctx.fillStyle = "#fff";
      ctx.font = `800 58px ${FONT}`;
      ctx.fillText(`„${a.motto}“`, CX, 1030, SAFE_RIGHT - 40);
      ctx.font = `600 46px ${FONT}`;
      ctx.fillText(`— ${a.name}`, CX, 1100);
      ctx.font = `700 52px ${FONT}`;
      ctx.fillText("Išsaugok 📌 ir sek –", CX, 1230);
      ctx.fillText("kitas patarimas rytoj!", CX, 1295);
      ctx.textAlign = "left";
      ctx.restore();
    }
  }

  return { duration, draw };
}
