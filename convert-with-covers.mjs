import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Markdown from './shared/naturalcrit/markdown.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Déterminer le fichier d'entrée
const inputFile = process.argv[2] || 'input/test_covers.md';
const outputFile = process.argv[3] || inputFile.replace('input/', 'output/').replace('.md', '_converted.html');

console.log('🔮 Conversion Homebrewery avec gestion des covers...');

// Lire le markdown
const markdown = fs.readFileSync(inputFile, 'utf8');
console.log(`✓ Fichier chargé (${(markdown.length / 1024).toFixed(1)} KB)`);

// Lire les CSS compilés
const bundleCSS = fs.readFileSync('build/bundle.css', 'utf8');
const themeCSS = fs.readFileSync('build/themes/V3/5ePHB/style.css', 'utf8');

// Diviser en pages
const PAGEBREAK_REGEX = /^\\page(?:break)?$/m;
const pages = markdown.split(PAGEBREAK_REGEX);

// Générer le HTML pour chaque page
let pagesHTML = '';
for (let index = 0; index < pages.length; index++) {
  let pageContent = pages[index].trim();
  if (!pageContent) continue; // Skip empty pages

  // Détecter les types de covers AVANT le rendu
  // Chercher les mustache tags dans le contenu original
  const hasFrontCover = pageContent.includes('{{frontCover}}');
  const hasInsideCover = pageContent.includes('{{insideCover}}');
  const hasBackCover = pageContent.includes('{{backCover}}');
  const hasPartCover = pageContent.includes('{{partCover}}');

  const isCoverPage = hasFrontCover || hasInsideCover || hasBackCover || hasPartCover;

  // Parser les classes et styles de la page si elle commence par \page avec des tags
  let pageClasses = 'page';
  let pageStyles = {};
  let pageAttributes = {};

  if (pageContent.startsWith('\\page')) {
    // Extraire les tags mustache du \page s'il y en a
    const firstLine = pageContent.split('\n')[0];
    const match = firstLine.match(/\\page\s*{([^}]+)}/);
    if (match) {
      const tags = match[1];
      // Parser les classes
      const classMatch = tags.match(/([^:,]+(?:\s+[^:,]+)*)/g);
      if (classMatch) {
        pageClasses += ' ' + classMatch.filter(c => !c.includes(':')).join(' ');
      }
      // Parser les styles
      const styleMatch = tags.match(/(\w+):\s*([^,}]+)/g);
      if (styleMatch) {
        styleMatch.forEach(s => {
          const [key, value] = s.split(':').map(x => x.trim());
          pageStyles[key] = value;
        });
      }
    }
    // Enlever la ligne \page
    pageContent = pageContent.substring(pageContent.indexOf('\n') + 1);
  }

  // Pour les pages normales (non-cover), ajouter le column break artificiel
  if (!isCoverPage) {
    pageContent += `\n\n&nbsp;\n\\column\n&nbsp;`;
  }

  // Traiter avec le renderer Markdown officiel
  const pageHTML = Markdown.render(pageContent, index);

  // Pour les covers, traiter les images avec position absolute différemment
  let processedHTML = pageHTML;

  if (isCoverPage) {
    // Détecter et extraire les images avec position absolute
    const imgRegex = /<img[^>]*style="[^"]*position:\s*absolute[^"]*"[^>]*>/g;
    const absoluteImages = processedHTML.match(imgRegex) || [];

    // Les conserver mais s'assurer qu'elles sont bien formatées
    absoluteImages.forEach(img => {
      // Parser les styles de l'image
      const styleMatch = img.match(/style="([^"]*)"/);
      if (styleMatch) {
        let styles = styleMatch[1];
        // S'assurer que les valeurs CSS sont correctement formatées
        styles = styles.replace(/position:absolute/, 'position: absolute');
        styles = styles.replace(/top:(\d+)/, 'top: $1px');
        styles = styles.replace(/bottom:(\d+)/, 'bottom: $1px');
        styles = styles.replace(/left:(\d+)/, 'left: $1px');
        styles = styles.replace(/right:(\d+)/, 'right: $1px');
        styles = styles.replace(/width:(\d+)px/, 'width: $1px');
        styles = styles.replace(/height:(\d+)px/, 'height: $1px');

        const newImg = img.replace(/style="[^"]*"/, `style="${styles}"`);
        processedHTML = processedHTML.replace(img, newImg);
      }
    });

    // Ajouter des classes supplémentaires pour les covers
    if (hasFrontCover) pageClasses += ' has-front-cover';
    if (hasInsideCover) pageClasses += ' has-inside-cover';
    if (hasBackCover) pageClasses += ' has-back-cover';
    if (hasPartCover) pageClasses += ' has-part-cover';
  }

  // Convertir les styles en string CSS
  const stylesString = Object.entries(pageStyles)
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ');

  pagesHTML += `
    <div class="${pageClasses}" id="p${index + 1}" ${stylesString ? `style="${stylesString}"` : ''}>
      <div class="columnWrapper">
        ${processedHTML}
      </div>
    </div>
  `;
}

// HTML complet avec structure exacte de Homebrewery
const fullHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Homebrewery Document</title>

  <!-- Google Fonts comme Homebrewery -->
  <link href="//fonts.googleapis.com/css?family=Open+Sans:400,300,600,700" rel="stylesheet" type="text/css" />

  <style>
    /* Bundle CSS (contient les styles de base de Homebrewery) */
    ${bundleCSS}

    /* Theme CSS (5ePHB) */
    ${themeCSS}

    /* Ajustements pour standalone */
    body {
      margin: 0;
      padding: 0;
      overflow: auto;
      background: #EEE5CE;
    }

    .brewRenderer {
      padding: 20px;
    }

    .pages {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    /* Position relative sur .page pour les images absolues */
    .page {
      position: relative;
      padding: 1.4cm 1.9cm 1.7cm;
      box-sizing: border-box;
    }

    /* Correction des headers pour correspondre exactement au thème 5ePHB */
    .page h1, .page h2, .page h3, .page h4 {
      font-family: 'MrEavesRemake';
      color: var(--HB_Color_HeaderText);
      font-weight: normal;
    }

    .page h1 {
      margin-bottom: 0.18cm;
      column-span: all;
      font-size: 0.89cm;
      line-height: 1em;
      -webkit-column-span: all;
      -moz-column-span: all;
    }

    .page h2 {
      font-size: 0.75cm;
      line-height: 0.988em;
    }

    .page h3 {
      font-size: 0.575cm;
      line-height: 0.995em;
      border-bottom: 2px solid var(--HB_Color_HeaderUnderline);
    }

    .page h4 {
      font-size: 0.458cm;
      line-height: 0.971em;
    }

    .page h5 {
      font-family: 'ScalySansCapRemake';
      font-size: 0.423cm;
      line-height: 0.951em;
      font-weight: normal;
    }

    /* Émulation des sélecteurs :has() avec des classes */
    .page.has-front-cover,
    .page.has-inside-cover {
      columns: 1 !important;
      text-align: center;
    }

    .page.has-part-cover {
      padding-top: 0;
      text-align: center;
      columns: 1 !important;
    }

    .page.has-back-cover {
      padding: 2.25cm 1.3cm 2cm 1.3cm;
      line-height: 1.4em;
      color: #FFFFFF;
      columns: 1 !important;
    }

    /* Cacher le footer pour les covers */
    .page.has-front-cover::after,
    .page.has-inside-cover::after,
    .page.has-back-cover::after,
    .page.has-part-cover::after {
      display: none !important;
    }

    /* Position absolue pour les divs de covers */
    .page.has-front-cover .frontCover,
    .page.has-inside-cover .insideCover {
      position: absolute;
      inset: 0;
      z-index: -1;
    }

    .page.has-part-cover .partCover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 6cm;
      z-index: -1;
    }

    .page.has-back-cover .backCover {
      position: absolute;
      inset: 0;
      z-index: -1;
    }

    .page.has-back-cover .columnWrapper {
      width: 7.6cm;
    }

    /* Images de fond pour les covers - seulement celles qui existent */
    /* frontCover et insideCover n'ont pas d'images de fond par défaut */
    .frontCover {
      /* Pas d'image de fond par défaut - l'utilisateur l'ajoute dans le markdown */
    }

    .insideCover {
      /* Pas d'image de fond par défaut - l'utilisateur peut l'ajouter */
    }

    .partCover {
      height: 6cm;
      background-image: url('./build/assets/partCoverHeaderPHB.png');
      background-repeat: no-repeat;
      background-size: 100%;
      background-position: top;
    }

    .backCover {
      background-image: url('./build/assets/backCover.png');
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
    }

    /* Polices locales */
    @font-face {
      font-family: 'BookInsanityRemake';
      src: url('../build/fonts/5e/Bookinsanity.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
    }

    @font-face {
      font-family: 'BookInsanityRemake';
      src: url('../build/fonts/5e/Bookinsanity Bold.woff2') format('woff2');
      font-weight: bold;
      font-style: normal;
    }

    @font-face {
      font-family: 'BookInsanityRemake';
      src: url('../build/fonts/5e/Bookinsanity Italic.woff2') format('woff2');
      font-weight: normal;
      font-style: italic;
    }

    @font-face {
      font-family: 'BookInsanityRemake';
      src: url('../build/fonts/5e/Bookinsanity Bold Italic.woff2') format('woff2');
      font-weight: bold;
      font-style: italic;
    }

    @font-face {
      font-family: 'ScalySansRemake';
      src: url('../build/fonts/5e/Scaly Sans.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
    }

    @font-face {
      font-family: 'ScalySansRemake';
      src: url('../build/fonts/5e/Scaly Sans Bold.woff2') format('woff2');
      font-weight: bold;
      font-style: normal;
    }

    @font-face {
      font-family: 'ScalySansRemake';
      src: url('../build/fonts/5e/Scaly Sans Italic.woff2') format('woff2');
      font-weight: normal;
      font-style: italic;
    }

    @font-face {
      font-family: 'ScalySansRemake';
      src: url('../build/fonts/5e/Scaly Sans Bold Italic.woff2') format('woff2');
      font-weight: bold;
      font-style: italic;
    }

    @font-face {
      font-family: 'ScalySansCapRemake';
      src: url('../build/fonts/5e/Scaly Sans Caps.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
    }

    @font-face {
      font-family: 'MrEavesRemake';
      src: url('../build/fonts/5e/Mr Eaves Small Caps.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
    }

    @font-face {
      font-family: 'SolberaImitationRemake';
      src: url('../build/fonts/5e/Solbera Imitation Tweak.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
    }

    @font-face {
      font-family: 'NodestoCapsCondensed';
      src: url('../build/fonts/5e/Nodesto Caps Condensed.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
    }

    @font-face {
      font-family: 'NodestoCapsCondensed';
      src: url('../build/fonts/5e/Nodesto Caps Condensed Bold.woff2') format('woff2');
      font-weight: bold;
      font-style: normal;
    }

    @font-face {
      font-family: 'NodestoCapsWide';
      src: url('../build/fonts/5e/Nodesto Caps Wide.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
    }

    @font-face {
      font-family: 'Overpass';
      src: url('../build/fonts/5e/Overpass Medium.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
    }

    @font-face {
      font-family: 'WalterTurncoat';
      src: url('../build/fonts/5e/WalterTurncoat-Regular.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
    }

    @media print {
      .pages {
        gap: 0;
      }
      .page {
        margin: 0 !important;
        box-shadow: none !important;
        page-break-after: always;
      }
    }
  </style>
</head>
<body>
  <div class="brewRenderer">
    <div class="pages">
      ${pagesHTML}
    </div>
  </div>
</body>
</html>`;

// Écrire le fichier
fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, fullHTML);

console.log(`✅ Conversion terminée avec gestion des covers !`);
console.log(`📄 Fichier créé : ${outputFile}`);
console.log(`📏 Taille : ${(fullHTML.length / 1024).toFixed(1)} KB`);
console.log(`✨ Covers (front, inside, back, part) correctement gérés`);