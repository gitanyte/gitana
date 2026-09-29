# VBE Avatarai – anglų kalba socialiniuose tinkluose

Paruošti įrašai socialiniams tinklams, kuriuose avatarai-mokytojai moko vaikus anglų kalbos
valstybinio brandos egzamino (VBE) 1 ir 2 dalies.

## Paruošti įrašai – `irasai/`

- `irasai/kvadratas/` – 32 paveikslėliai 1080×1080 (Instagram, Facebook)
- `irasai/vertikalus/` – tie patys 32 įrašai 1080×1920 (TikTok, Reels, Stories)
- `irasai/TEKSTAI.md` – kiekvieno įrašo tekstas su grotažymėmis (klausimų atsakymai – pirmajam komentarui)

## Vaizdo įrašai TikTok ir Instagram Reels – `video/`

32 MP4 vaizdo įrašai (1080×1920, 30 kadrų/s, 10–19 s). Failų vardai sutampa su paveikslėliais,
todėl įrašo tekstą imkite iš `irasai/TEKSTAI.md` (tas pats numeris).

- **Patarimai:** avataras įšoka, patarimas „rašomas“ raidė po raidės, pabaigoje – šūkis ir kvietimas sekti.
- **Klausimai:** klausimas ir atsakymų variantai, 5 sekundžių atgalinis skaičiavimas, tada parodomas
  teisingas atsakymas su paaiškinimu.

Vaizdo įrašai tylūs – **muziką pridėkite TikTok / Instagram programėlėje** (populiarūs garsai
padidina peržiūras, o platformų muzika naudojama legaliai).

Peržiūra naršyklėje: `video.html`. Sugeneruoti iš naujo (pakeitus `js/avatars.js`):

```bash
npm i playwright && pip install imageio-ffmpeg
node tools/render-videos.mjs          # visi
node tools/render-videos.mjs lina     # tik vieno avataro
```

## Avatarai ir jų stiprybės

| Avataras | Stiprybė | Moko | Dalis |
|---|---|---|---|
| 🦁 Liūtas Leo | Supergirdėjimas | Klausymas | 1 |
| 🦉 Pelėda Rūta | Greitasis skaitymas | Skaitymas | 1 |
| 🤖 Robotas Gramas | Gramatikos procesorius | Kalbos vartojimas | 1 |
| 🦊 Lapė Lina | Idėjų gudrybės | Rašymas | 2 |
| 🐉 Drakonas Dovis | Ugninga drąsa | Kalbėjimas | 2 |
| 🐻 Meška Mantas | Ramybės jėga | Egzamino strategija | 2 |

Grupavimas į 1 dalį (supratimas) ir 2 dalį (kūrimas) skirtas mokymuisi. Oficialią egzamino
struktūrą patikrinkite [NŠA](https://www.nsa.smm.lt/) puslapyje.

## Nauji įrašai

Turinys yra `js/avatars.js` (pamokos `lessons` ir klausimai `quiz`). Atidarykite
`generatorius.html` naršyklėje, pasirinkite avatarą ir turinį, atsisiųskite PNG ir nukopijuokite tekstą.
