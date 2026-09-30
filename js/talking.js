// Kalbantis avataras: jokio teksto, tik autorės avataras, reaguojantis į jos balsą.
// voice = { duration, volume: [0..1 kiekvienam kadrui] } – apskaičiuojama iš garso įrašo (tools/render-talking.mjs).

async function makeTalkingVideo(a, voice) {
  const img = await loadAvatar(a);
  const duration = voice.duration + 0.6;

  // Balso garsumas laiko momentu t, išlygintas tarp kadrų
  function level(t) {
    const f = t * VIDEO_FPS;
    const i = Math.floor(f);
    const v0 = voice.volume[i] || 0;
    const v1 = voice.volume[i + 1] || 0;
    return v0 + (v1 - v0) * (f - i);
  }

  function draw(ctx, t) {
    const vol = level(t);
    const talking = vol > 0.1;

    // Fonas
    const g = ctx.createLinearGradient(0, 0, VIDEO_W, VIDEO_H);
    g.addColorStop(0, a.color);
    g.addColorStop(1, a.accent);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, VIDEO_W, VIDEO_H);
    ctx.fillStyle = "rgba(255,255,255,.10)";
    for (let i = 0; i < 7; i++) {
      const bx = (i * 211 + t * 30 * (i % 2 ? 1 : -1)) % (VIDEO_W + 300);
      const by = VIDEO_H - ((i * 337 + t * 60) % (VIDEO_H + 300));
      ctx.beginPath();
      ctx.arc(bx < -150 ? bx + VIDEO_W + 300 : bx, by, 60 + i * 25, 0, Math.PI * 2);
      ctx.fill();
    }

    // Avataras per vidurį, saugioje zonoje (kairiau, nes dešinėje – programėlės mygtukai)
    const cx = 480;
    const cy = 820 + Math.sin(t * 2.2) * 12;
    const ap = easeBack(progress(t, 0.1, 0.8));
    const base = 640;
    const size = base * ap * (1 + 0.06 * vol);

    // Švytėjimo žiedai, kai kalbama
    if (ap > 0.9) {
      for (let r = 0; r < 3; r++) {
        const phase = (t * 0.9 + r / 3) % 1;
        ctx.save();
        ctx.globalAlpha = (1 - phase) * 0.35 * (talking ? 1 : 0.25);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(cx, cy + size * 0.04, size * (0.34 + phase * 0.22 + vol * 0.06), 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      ctx.save();
      ctx.globalAlpha = 0.15 + vol * 0.45;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(cx, cy + size * 0.04, size * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (size > 1) {
      // Lengvas pakrypimas į taktą
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.sin(t * 1.6) * 0.03 * (talking ? 1.6 : 1));
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
      ctx.restore();
    }

    // Garso bangos po avataru
    if (ap > 0.9) {
      ctx.save();
      ctx.fillStyle = "#fff";
      ctx.globalAlpha = 0.85;
      for (let i = -6; i <= 6; i++) {
        const h = 14 + vol * 110 * (0.45 + 0.55 * Math.abs(Math.sin(t * 12 + i * 1.3)));
        rrect(ctx, cx + i * 26 - 7, 1230 - h / 2, 14, h, 7);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  return { duration, draw };
}
