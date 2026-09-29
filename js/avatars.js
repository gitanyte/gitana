// Avatarai-mokytojai: kiekvienas turi savo stiprybę ir moko vieną VBE įgūdį.
// 1 dalis – supratimas (klausymas, skaitymas, kalbos vartojimas).
// 2 dalis – kūrimas (rašymas, kalbėjimas) ir egzamino strategija.

const AVATARS = [
  {
    id: "leo",
    name: "Liūtas Leo",
    shape: "lion",
    color: "#f4a938",
    accent: "#b8621b",
    part: 1,
    skill: "Klausymas",
    strength: "Supergirdėjimas",
    motto: "Listen for the key words!",
    intro:
      "Aš girdžiu kiekvieną žodį, net kai kalbama greitai. Išmokysiu tave nepasimesti klausymo užduotyse.",
    lessons: [
      {
        title: "Perskaityk klausimus prieš klausydamas",
        text:
          "Prieš įrašą turi laiko – pabrauk klausimų raktažodžius (who, when, why, how much). Taip žinosi, ko klausytis.",
      },
      {
        title: "Saugokis „spąstų“",
        text:
          "Kalbėtojai dažnai pasako vieną atsakymą, o paskui jį pakeičia: „It starts at 7… oh no, sorry, at 7:30.“ Klausyk iki galo.",
      },
      {
        title: "Sinonimai, ne tie patys žodžiai",
        text:
          "Užduotyje parašyta „expensive“, o įraše girdi „it cost a fortune“. Ieškok prasmės, ne identiškų žodžių.",
      },
    ],
    quiz: [
      {
        q: "Įraše girdi: „The train leaves at ten… no wait, it's been delayed by a quarter of an hour.“ Kada išvyksta traukinys?",
        options: ["10:00", "10:15", "9:45", "10:30"],
        answer: 1,
        explain: "„A quarter of an hour“ = 15 min. Vėlavimas → 10:15.",
      },
      {
        q: "Kuri frazė reiškia tą patį, ką „very cheap“?",
        options: ["It cost a fortune", "It was a bargain", "It was overpriced", "It was free of charge"],
        answer: 1,
        explain: "„A bargain“ – pirkinys už labai gerą (mažą) kainą.",
      },
    ],
  },
  {
    id: "ruta",
    name: "Pelėda Rūta",
    shape: "owl",
    color: "#8c6bd6",
    accent: "#4e3a8f",
    part: 1,
    skill: "Skaitymas",
    strength: "Greitasis skaitymas",
    motto: "Skim first, then scan!",
    intro:
      "Aš perskaitau tekstą per minutę ir randu tai, ko reikia. Parodysiu, kaip skaityti protingai, o ne lėtai.",
    lessons: [
      {
        title: "Skimming – bendra mintis",
        text:
          "Pirmiausia greitai perbėk tekstą akimis: antraštė, pirmi ir paskutiniai pastraipų sakiniai. Supranti, apie ką tekstas.",
      },
      {
        title: "Scanning – konkreti informacija",
        text:
          "Ieškai datos, vardo ar skaičiaus? Nebeskaityk visko – „skenuok“ tekstą akimis, kol rasi.",
      },
      {
        title: "True / False / Not Given",
        text:
          "„Not Given“ – kai tekste apie tai NIEKO nepasakyta. Nespėliok iš savo žinių – remkis tik tekstu.",
      },
    ],
    quiz: [
      {
        q: "Tekstas: „Tom has lived in London since 2015.“ Teiginys: „Tom was born in London.“",
        options: ["True", "False", "Not Given"],
        answer: 2,
        explain: "Tekste sakoma tik, kad gyvena nuo 2015 m. Apie gimimo vietą – nieko.",
      },
      {
        q: "Kokią strategiją naudoji, kai reikia rasti tik datą tekste?",
        options: ["Skimming", "Scanning", "Skaityti žodis po žodžio", "Versti viską į lietuvių k."],
        answer: 1,
        explain: "Scanning – ieškai konkrečios informacijos, neskaitydamas visko.",
      },
    ],
  },
  {
    id: "gramas",
    name: "Robotas Gramas",
    shape: "robot",
    color: "#4cb8c4",
    accent: "#1f6f78",
    part: 1,
    skill: "Kalbos vartojimas",
    strength: "Gramatikos procesorius",
    motto: "Grammar.exe loaded 100%",
    intro:
      "Mano atmintyje – visi laikai, prielinksniai ir frazeologiniai veiksmažodžiai. Sudėliosiu gramatiką į tvarkingas taisykles.",
    lessons: [
      {
        title: "Present Perfect vs Past Simple",
        text:
          "Konkretus laikas praeityje (yesterday, in 2020) → Past Simple. Patirtis ar rezultatas be laiko (ever, already, yet) → Present Perfect.",
      },
      {
        title: "Žodžių daryba",
        text:
          "Pažiūrėk, kokios kalbos dalies reikia sakinyje: the ___ (daiktavardis), very ___ (būdvardis), speak ___ (prieveiksmis). Priesagos: -tion, -ness, -ful, -ly.",
      },
      {
        title: "Kolokacijos",
        text:
          "Mokykis žodžių porų: make a decision, do homework, take a photo, pay attention. Egzamine jos tikrinamos dažnai.",
      },
    ],
    quiz: [
      {
        q: "I ___ my keys yesterday.",
        options: ["have lost", "lost", "was lose", "have been losing"],
        answer: 1,
        explain: "„Yesterday“ – konkretus laikas praeityje → Past Simple.",
      },
      {
        q: "She spoke very ___ (CONFIDENCE).",
        options: ["confident", "confidence", "confidently", "confidential"],
        answer: 2,
        explain: "Veiksmažodį „spoke“ apibūdina prieveiksmis → confidently.",
      },
      {
        q: "Kuri kolokacija teisinga?",
        options: ["do a decision", "make a decision", "take a decision homework", "have a decision"],
        answer: 1,
        explain: "Anglų kalboje sakoma „make a decision“.",
      },
    ],
  },
  {
    id: "lape",
    name: "Lapė Lina",
    shape: "fox",
    color: "#ec6b3a",
    accent: "#9a3514",
    part: 2,
    skill: "Rašymas",
    strength: "Idėjų gudrybės",
    motto: "Plan. Write. Check.",
    intro:
      "Aš gudri kaip lapė – moku sudėlioti mintis taip, kad vertintojas būtų sužavėtas. Išmokysiu rašyti laiškus ir rašinius.",
    lessons: [
      {
        title: "Planuok 5 minutes",
        text:
          "Prieš rašydamas susidaryk planą: įžanga → 2–3 pastraipos su vienu argumentu kiekvienoje → išvada. Tai sutaupo laiko.",
      },
      {
        title: "Atsakyk į VISUS užduoties punktus",
        text:
          "Užduotyje paprastai yra keli punktai (bullet points). Kiekvienas neatsakytas punktas – prarasti taškai. Pažymėk juos varnelėmis.",
      },
      {
        title: "Jungiamieji žodžiai",
        text:
          "Firstly, Moreover, However, On the other hand, As a result, To sum up – jie daro tekstą rišlų ir pakelia įvertinimą.",
      },
      {
        title: "Stilius: formalus ar neformalus?",
        text:
          "Draugui: „Hi Tom, Thanks for your letter!“ Direktoriui: „Dear Sir or Madam, I am writing to…“. Formaliame tekste – jokių sutrumpinimų (don't → do not).",
      },
    ],
    quiz: [
      {
        q: "Kuri pradžia tinka formaliam laiškui?",
        options: ["Hey guys!", "Dear Sir or Madam,", "What's up?", "Hi there, mate!"],
        answer: 1,
        explain: "Formaliame laiške, kai nežinai gavėjo vardo – „Dear Sir or Madam,“.",
      },
      {
        q: "Kuris jungiamasis žodis išreiškia priešpriešą?",
        options: ["Moreover", "However", "Firstly", "In addition"],
        answer: 1,
        explain: "„However“ = tačiau. Kiti papildo mintį.",
      },
    ],
  },
  {
    id: "drake",
    name: "Drakonas Dovis",
    shape: "dragon",
    color: "#4caf6d",
    accent: "#236b3b",
    part: 2,
    skill: "Kalbėjimas",
    strength: "Ugninga drąsa",
    motto: "Speak up, don't freeze!",
    intro:
      "Aš nebijau kalbėti – mano žodžiai liejasi kaip ugnis. Padėsiu tau įveikti jaudulį ir kalbėti sklandžiai.",
    lessons: [
      {
        title: "Frazės laikui išlošti",
        text:
          "Nežinai, ką sakyti? Naudok: „That's an interesting question…“, „Let me think…“, „Well, to be honest…“. Tyla – blogiausias variantas.",
      },
      {
        title: "Plėtok atsakymą",
        text:
          "Neatsakyk vienu žodžiu. Taisyklė A-R-E: Answer (atsakyk) → Reason (paaiškink kodėl) → Example (pateik pavyzdį).",
      },
      {
        title: "Nuotraukos aprašymas",
        text:
          "In the picture I can see… In the foreground/background… It looks like… They might be… Spėliok su might / may / probably.",
      },
    ],
    quiz: [
      {
        q: "Egzaminuotojas klausia: „Do you like travelling?“ Kuris atsakymas geriausias?",
        options: [
          "Yes.",
          "Yes, I do.",
          "Yes, I love it because I can meet new people. For example, last summer I visited Spain.",
          "No comment.",
        ],
        answer: 2,
        explain: "A-R-E: atsakymas + priežastis + pavyzdys.",
      },
      {
        q: "Kuri frazė padeda laimėti laiko pagalvoti?",
        options: ["I don't know.", "Let me think for a moment…", "Next question.", "Pass."],
        answer: 1,
        explain: "„Let me think…“ skamba natūraliai ir leidžia susikaupti.",
      },
    ],
  },
  {
    id: "meska",
    name: "Meška Mantas",
    shape: "bear",
    color: "#a8744f",
    accent: "#5c3a22",
    part: 2,
    skill: "Egzamino strategija",
    strength: "Ramybės jėga",
    motto: "Stay calm and manage time.",
    intro:
      "Aš stiprus ir ramus. Išmokysiu tave paskirstyti laiką, nepanikuoti ir neprarasti lengvų taškų.",
    lessons: [
      {
        title: "Laiko planas",
        text:
          "Prieš egzaminą žinok, kiek laiko skirsi kiekvienai daliai. Palik 10 min. pabaigoje patikrinimui.",
      },
      {
        title: "Neužstrik ties sunkiu klausimu",
        text:
          "Užstrigai? Pažymėk ir eik toliau. Grįši vėliau – lengvi taškai svarbiau.",
      },
      {
        title: "Nepalik tuščių langelių",
        text:
          "Jei nežinai atsakymo pasirenkamuose klausimuose – atmesk aiškiai neteisingus ir rinkis iš likusių.",
      },
      {
        title: "Atsakymų lapas",
        text:
          "Perkelk atsakymus į atsakymų lapą atidžiai ir laiku. Patikrink rašybą – ji svarbi!",
      },
    ],
    quiz: [
      {
        q: "Užstrigai ties sunkiu klausimu. Ką darai?",
        options: [
          "Galvoju tol, kol išsiaiškinsiu",
          "Pažymiu ir einu toliau, grįšiu vėliau",
          "Palieku tuščią visam laikui",
          "Pradedu panikuoti",
        ],
        answer: 1,
        explain: "Taip nešvaistai laiko ir surenki lengvus taškus.",
      },
    ],
  },
];

const PARTS = {
  1: {
    title: "1 dalis – Supratimas",
    desc: "Klausymas, skaitymas ir kalbos vartojimas (gramatika, žodynas).",
  },
  2: {
    title: "2 dalis – Kūrimas",
    desc: "Rašymas, kalbėjimas ir egzamino strategija.",
  },
};

// Piešia avataro SVG pagal jo formą. Grąžina SVG eilutę.
function avatarSVG(a, size = 160) {
  const c = a.color;
  const d = a.accent;
  let back = "";
  let head = `<circle cx="100" cy="108" r="58" fill="${c}"/>`;
  let extra = "";

  switch (a.shape) {
    case "lion":
      for (let i = 0; i < 14; i++) {
        const ang = (i / 14) * Math.PI * 2;
        const x = 100 + Math.cos(ang) * 64;
        const y = 108 + Math.sin(ang) * 64;
        back += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="20" fill="${d}"/>`;
      }
      break;
    case "owl":
      back = `<polygon points="52,70 62,28 86,60" fill="${d}"/><polygon points="148,70 138,28 114,60" fill="${d}"/>`;
      extra = `<ellipse cx="100" cy="140" rx="30" ry="20" fill="#ffffff" opacity=".35"/>`;
      break;
    case "robot":
      head = `<rect x="44" y="54" width="112" height="104" rx="18" fill="${c}"/>`;
      back = `<line x1="100" y1="54" x2="100" y2="24" stroke="${d}" stroke-width="6"/><circle cx="100" cy="22" r="9" fill="#ffd23f"/>
        <rect x="30" y="92" width="14" height="30" rx="5" fill="${d}"/><rect x="156" y="92" width="14" height="30" rx="5" fill="${d}"/>`;
      break;
    case "fox":
      back = `<polygon points="46,90 56,26 96,62" fill="${c}"/><polygon points="154,90 144,26 104,62" fill="${c}"/>
        <polygon points="58,74 62,42 82,62" fill="${d}"/><polygon points="142,74 138,42 118,62" fill="${d}"/>`;
      extra = `<path d="M58 124 Q100 176 142 124 Q100 150 58 124Z" fill="#fff"/>`;
      break;
    case "dragon":
      back = `<polygon points="60,66 50,20 82,56" fill="#ffd23f"/><polygon points="140,66 150,20 118,56" fill="#ffd23f"/>
        <polygon points="100,50 92,34 108,34" fill="${d}"/>`;
      extra = `<circle cx="88" cy="136" r="3" fill="${d}"/><circle cx="112" cy="136" r="3" fill="${d}"/>`;
      break;
    case "bear":
      back = `<circle cx="56" cy="62" r="22" fill="${c}"/><circle cx="144" cy="62" r="22" fill="${c}"/>
        <circle cx="56" cy="62" r="11" fill="${d}"/><circle cx="144" cy="62" r="11" fill="${d}"/>`;
      extra = `<ellipse cx="100" cy="136" rx="26" ry="18" fill="#e8c9a8"/>`;
      break;
  }

  const eyes =
    a.shape === "owl"
      ? `<circle cx="78" cy="100" r="20" fill="#fff"/><circle cx="122" cy="100" r="20" fill="#fff"/>
         <circle cx="80" cy="102" r="9" fill="#222"/><circle cx="124" cy="102" r="9" fill="#222"/>
         <polygon points="100,112 92,124 108,124" fill="#ffb13b"/>`
      : a.shape === "robot"
      ? `<rect x="64" y="84" width="26" height="22" rx="5" fill="#fff"/><rect x="110" y="84" width="26" height="22" rx="5" fill="#fff"/>
         <rect x="72" y="90" width="10" height="10" fill="#222"/><rect x="118" y="90" width="10" height="10" fill="#222"/>
         <rect x="70" y="126" width="60" height="12" rx="4" fill="${d}"/>`
      : `<circle cx="80" cy="100" r="8" fill="#222"/><circle cx="120" cy="100" r="8" fill="#222"/>
         <circle cx="83" cy="97" r="3" fill="#fff"/><circle cx="123" cy="97" r="3" fill="#fff"/>
         <ellipse cx="100" cy="122" rx="8" ry="6" fill="#2b2b2b"/>
         <path d="M86 134 Q100 146 114 134" stroke="#2b2b2b" stroke-width="4" fill="none" stroke-linecap="round"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="${size}" height="${size}" role="img" aria-label="${a.name}">
    ${back}${head}${extra}${eyes}
    <circle cx="66" cy="124" r="8" fill="#ff7a9a" opacity=".45"/><circle cx="134" cy="124" r="8" fill="#ff7a9a" opacity=".45"/>
  </svg>`;
}
