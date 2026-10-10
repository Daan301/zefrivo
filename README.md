# Zefrivo

Site de prezentare în limba română pentru conceptul de brand Zefrivo, dezvoltat pentru o lucrare de licență.

## Experiența

Caruselul prezintă Kiwi–Lime, Citrus și Mango Zero în trei cadre ovale. Numai cadrul central afișează sticla. Cele două cadre laterale păstrează conturul și ascund produsul. Săgețile, selectorul de arome și tastele stânga/dreapta schimbă produsul, descrierea, culoarea fundalului și accentele secțiunii. Navigarea este circulară. Pe dispozitive tactile funcționează și glisarea orizontală. Preferința pentru mișcare redusă este respectată.

Pagina include prezentarea brandului, formatele propuse de 500 ml și 2 L, povestea conceptului și întrebări frecvente. Imaginile din carusel prezintă sticle de 500 ml; formatele de 2 L sunt descrise separat.

## Pornire locală

Nu sunt necesare pachete externe sau un pas de build. Cu Python 3 instalat:

```sh
python3 -m http.server 8080 --directory dist
```

Deschide `http://localhost:8080`. Pentru verificări, cu Node.js instalat:

```sh
npm test
npm run check
```

## Fișiere

- `dist/index.html`: pagina și conținutul.
- `dist/styles.css`: identitatea vizuală și afișarea adaptată la ecrane mici.
- `dist/carousel.mjs`: produsele, temele și logica caruselului.
- `dist/app.mjs`: inițializarea interacțiunilor.
- `dist/assets/`: imaginile PNG cu transparență și fonturile găzduite local.
- `tests/`: verificări pentru navigare, sincronizarea informațiilor și ascunderea produselor laterale.

Directorul `dist` poate fi publicat pe orice serviciu de găzduire statică. Căile sunt relative, inclusiv pentru găzduire într-un subdirector.

## Statutul proiectului

Zefrivo este un concept de brand. Rețetele, ingredientele finale și valorile nutriționale necesită validare înaintea unei lansări comerciale. Site-ul nu include plăți, conturi, formulare cu trimitere sau distribuție comercială declarată.

Imaginile produselor au fost generate pentru proiect folosind etichetele Zefrivo dezvoltate în această conversație. Fonturile Bricolage Grotesque și DM Sans sunt distribuite sub SIL Open Font License; licențele sunt incluse în `dist/assets/fonts/`.
