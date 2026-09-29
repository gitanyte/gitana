// Įrašų socialiniams tinklams generatorius: piešia paveikslėlį drobėje ir sudaro tekstą.

const $ = (id) => document.getElementById(id);
const canvas = $("canvas");
const ctx = canvas.getContext("2d");

const HASHTAGS = ["#VBE", "#anglųkalba", "#EnglishExam", "#brandosegzaminas", "#mokomės", "#VBEAvatarai"];
const DAYS = ["Pirmadienis", "Antradienis", "Trečiadienis", "Ketvirtadienis", "Penktadienis", "Šeštadienis", "Sekmadienis"];

function currentAvatar() {
  return AVATARS.find((a) => a.id === $("avatar").value);
}

function fillAvatars() {
  $("avatar").innerHTML = AVATARS.map(
    (a) => `<option value="${a.id}">${a.name} – ${a.skill} (${a.part} dalis)</option>`
  ).join("");
}

function fillItems() {
  const a = currentAvatar();
  const list = $("type").value === "tip" ? a.lessons.map((l) => l.title) : a.quiz.map((q) => q.q);
  $("item").innerHTML = list
    .map((t, i) => `<option value="${i}">${t.length > 60 ? t.slice(0, 57) + "…" : t}</option>`)
    .join("");
}

function wrapText(text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = w;
      y += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, y);
  return y + lineHeight;
}

function roundRect(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function loadAvatarImage(a) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(avatarSVG(a, 400));
  });
}

let drawToken = 0;

async function draw() {
  const token = ++drawToken;
  const a = currentAvatar();
  const isTip = $("type").value === "tip";
  const idx = Number($("item").value) || 0;
  const story = $("format").value === "story";
  const W = 1080;
  const H = story ? 1920 : 1080;
  const img = await loadAvatarImage(a);
  if (token !== drawToken) return; // vartotojas jau pakeitė pasirinkimą

  canvas.width = W;
  canvas.height = H;

  // Fonas
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, a.color);
  g.addColorStop(1, a.accent);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "rgba(255,255,255,.12)";
  ctx.beginPath();
  ctx.arc(W - 80, 120, 220, 0, Math.PI * 2);
  ctx.fill();

  // Antraštė
  const top = story ? 140 : 60;
  ctx.fillStyle = "#fff";
  ctx.font = "800 44px system-ui, sans-serif";
  ctx.fillText(`ANGLŲ K. VBE · ${a.part} DALIS`, 70, top + 40);
  ctx.font = "600 34px system-ui, sans-serif";
  ctx.fillText(`${a.name} · ${a.skill}`, 70, top + 90);

  // Avataras
  const avSize = story ? 380 : 260;
  ctx.drawImage(img, W - avSize - 50, top + 110, avSize, avSize);

  // Kalbos burbulas
  const boxY = top + 110 + avSize + 30;
  const boxH = H - boxY - (story ? 220 : 110);
  ctx.fillStyle = "#fff";
  roundRect(60, boxY, W - 120, boxH, 40);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(W - 50 - avSize / 2 - 30, boxY);
  ctx.lineTo(W - 50 - avSize / 2, boxY - 40);
  ctx.lineTo(W - 50 - avSize / 2 + 30, boxY);
  ctx.fill();

  ctx.fillStyle = a.accent;
  let y = boxY + 80;
  const inner = W - 220;

  if (isTip) {
    const l = a.lessons[idx];
    ctx.font = "800 50px system-ui, sans-serif";
    y = wrapText("💡 " + l.title, 110, y, inner, 60);
    ctx.fillStyle = "#222";
    ctx.font = `400 ${story ? 44 : 36}px system-ui, sans-serif`;
    wrapText(l.text, 110, y + 10, inner, story ? 60 : 48);
  } else {
    const q = a.quiz[idx];
    ctx.font = "800 46px system-ui, sans-serif";
    ctx.fillText("❓ Ar žinai atsakymą?", 110, y);
    ctx.fillStyle = "#222";
    ctx.font = `600 ${story ? 42 : 34}px system-ui, sans-serif`;
    y = wrapText(q.q, 110, y + 64, inner, story ? 56 : 44);
    ctx.font = `400 ${story ? 40 : 32}px system-ui, sans-serif`;
    q.options.forEach((o, k) => {
      y = wrapText(`${"ABCD"[k]}) ${o}`, 130, y + 6, inner - 20, story ? 52 : 42);
    });
    ctx.fillStyle = a.accent;
    ctx.font = "700 30px system-ui, sans-serif";
    ctx.fillText("Atsakymas – komentaruose! 👇", 110, boxY + boxH - 40);
  }

  // Apačia
  ctx.fillStyle = "#fff";
  ctx.font = "700 36px system-ui, sans-serif";
  ctx.fillText(`„${a.motto}“`, 70, H - (story ? 140 : 45));

  $("caption").value = makeCaption(a, isTip, idx);
}

function makeCaption(a, isTip, idx) {
  const tags = [...HASHTAGS, "#" + a.skill.replace(/\s+/g, "")].join(" ");
  if (isTip) {
    const l = a.lessons[idx];
    return `${a.name} (stiprybė – ${a.strength.toLowerCase()}) moko: ${l.title}! 💡

${l.text}

Išsaugok 📌 ir pasidalink su klasiokais, kurie laikys anglų kalbos VBE (${a.part} dalis – ${a.skill.toLowerCase()}).

${tags}`;
  }
  const q = a.quiz[idx];
  return `❓ ${a.name} tikrina: ${q.q}

${q.options.map((o, k) => `${"ABCD"[k]}) ${o}`).join("\n")}

Rašyk atsakymą komentaruose! 👇

(Atsakymas pirmajam komentarui: ${"ABCD"[q.answer]} – ${q.explain})

${tags}`;
}

function renderPlan() {
  const rows = DAYS.map((day, i) => {
    const a = AVATARS[i % AVATARS.length];
    const isTip = i % 2 === 0 || i === DAYS.length - 1;
    const text = isTip ? a.lessons[0].title : a.quiz[0].q;
    return `<li style="--c:${a.color}">
      <b>${day}</b> · ${a.name} (${a.part} d.) · ${isTip ? "💡 Patarimas" : "❓ Klausimas"}
      <span>${text}</span>
    </li>`;
  });
  $("plan").innerHTML = `<ol class="plan-list">${rows.join("")}</ol>`;
}

$("avatar").addEventListener("change", () => {
  fillItems();
  draw();
});
$("type").addEventListener("change", () => {
  fillItems();
  draw();
});
$("item").addEventListener("change", draw);
$("format").addEventListener("change", draw);

$("random").addEventListener("click", () => {
  const a = AVATARS[Math.floor(Math.random() * AVATARS.length)];
  $("avatar").value = a.id;
  $("type").value = Math.random() < 0.5 ? "tip" : "quiz";
  fillItems();
  $("item").selectedIndex = Math.floor(Math.random() * $("item").options.length);
  draw();
});

$("download").addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `vbe-${$("avatar").value}-${$("type").value}-${$("item").value}-${$("format").value}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
});

$("copy").addEventListener("click", async () => {
  const btn = $("copy");
  try {
    await navigator.clipboard.writeText($("caption").value);
    btn.textContent = "✅ Nukopijuota!";
  } catch {
    $("caption").select();
    btn.textContent = "Pažymėta – spausk Ctrl+C";
  }
  setTimeout(() => (btn.textContent = "📋 Kopijuoti tekstą"), 2000);
});

fillAvatars();
fillItems();
renderPlan();
draw();
