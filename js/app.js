// Mokymosi puslapis: avatarų kortelės, pamokos ir mini testai.

const SCORE_KEY = "vbe-avatar-scores";

function loadScores() {
  try {
    return JSON.parse(localStorage.getItem(SCORE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveScore(id, score) {
  const scores = loadScores();
  scores[id] = Math.max(scores[id] || 0, score);
  try {
    localStorage.setItem(SCORE_KEY, JSON.stringify(scores));
  } catch {
    // Naršyklė neleidžia saugoti – rezultatas tiesiog nebus prisimintas.
  }
}

function renderParts() {
  const main = document.getElementById("parts");
  const scores = loadScores();
  main.innerHTML = "";

  for (const part of [1, 2]) {
    const section = document.createElement("section");
    section.className = "part";
    section.innerHTML = `<h2>${PARTS[part].title}</h2><p class="part-desc">${PARTS[part].desc}</p>`;
    const grid = document.createElement("div");
    grid.className = "grid";

    for (const a of AVATARS.filter((x) => x.part === part)) {
      const best = scores[a.id];
      const card = document.createElement("button");
      card.className = "card";
      card.style.setProperty("--c", a.color);
      card.style.setProperty("--d", a.accent);
      card.innerHTML = `
        <div class="avatar">${avatarSVG(a, 120)}</div>
        <h3>${a.name}</h3>
        <span class="badge">${a.skill}</span>
        <p class="strength">Stiprybė: <b>${a.strength}</b></p>
        <p class="motto">„${a.motto}“</p>
        ${best !== undefined ? `<p class="best">Geriausias rezultatas: ${best}/${a.quiz.length}</p>` : ""}`;
      card.addEventListener("click", () => openLesson(a));
      grid.appendChild(card);
    }
    section.appendChild(grid);
    main.appendChild(section);
  }
}

function openLesson(a) {
  const dlg = document.getElementById("lesson");
  const body = document.getElementById("lesson-body");
  dlg.style.setProperty("--c", a.color);
  dlg.style.setProperty("--d", a.accent);

  body.innerHTML = `
    <div class="lesson-head">
      <div class="avatar">${avatarSVG(a, 110)}</div>
      <div>
        <h2>${a.name}</h2>
        <span class="badge">${PARTS[a.part].title} · ${a.skill}</span>
        <p class="speech">${a.intro}</p>
      </div>
    </div>
    <h3>Pamokos</h3>
    <ol class="lessons">
      ${a.lessons.map((l) => `<li><b>${l.title}</b><p>${l.text}</p></li>`).join("")}
    </ol>
    <h3>Mini testas</h3>
    <div id="quiz"></div>`;

  renderQuiz(a, document.getElementById("quiz"));
  dlg.showModal();
}

function renderQuiz(a, el) {
  let i = 0;
  let correct = 0;

  const show = () => {
    if (i >= a.quiz.length) {
      saveScore(a.id, correct);
      const msg =
        correct === a.quiz.length
          ? "Puiku! Tu tikras čempionas!"
          : "Gerai padirbėta! Pabandyk dar kartą ir pagerink rezultatą.";
      el.innerHTML = `<p class="result">${correct}/${a.quiz.length} – ${msg}</p>
        <button class="btn" id="retry">Bandyti dar kartą</button>`;
      el.querySelector("#retry").addEventListener("click", () => renderQuiz(a, el));
      renderParts();
      return;
    }
    const item = a.quiz[i];
    el.innerHTML = `<p class="q"><span class="qn">${i + 1}/${a.quiz.length}</span> ${item.q}</p>
      <div class="options">${item.options
        .map((o, k) => `<button class="opt" data-k="${k}">${o}</button>`)
        .join("")}</div>
      <p class="explain" hidden></p>`;

    el.querySelectorAll(".opt").forEach((btn) =>
      btn.addEventListener("click", () => {
        const k = Number(btn.dataset.k);
        el.querySelectorAll(".opt").forEach((b) => (b.disabled = true));
        el.querySelector(`.opt[data-k="${item.answer}"]`).classList.add("right");
        if (k === item.answer) correct++;
        else btn.classList.add("wrong");
        const ex = el.querySelector(".explain");
        ex.hidden = false;
        ex.innerHTML = `${k === item.answer ? "✅ Teisingai!" : "❌ Ne visai."} ${item.explain}
          <br><button class="btn next">Toliau →</button>`;
        ex.querySelector(".next").addEventListener("click", () => {
          i++;
          show();
        });
      })
    );
  };
  show();
}

const dlg = document.getElementById("lesson");
dlg.querySelector(".close").addEventListener("click", () => dlg.close());
dlg.addEventListener("click", (e) => {
  if (e.target === dlg) dlg.close();
});

renderParts();
