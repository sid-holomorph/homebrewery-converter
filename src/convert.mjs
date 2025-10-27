import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Markdown from '../shared/naturalcrit/markdown.js';
import { waterColorMasks } from '../assets/themes/assets/waterColorMasksBase64.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Generate CSS variables for masks
function generateMaskVariables() {
    let css = ':root {\n';

    // Edge masks
    for (let i = 1; i <= 8; i++) {
        const maskData = waterColorMasks.edge[`000${i}`];
        if (maskData) {
            css += `  --mask-edge-${i}: url('${maskData}');\n`;
        }
    }

    // Center masks
    for (let i = 1; i <= 16; i++) {
        const numStr = i.toString().padStart(4, '0');
        const maskData = waterColorMasks.center[numStr];
        if (maskData) {
            css += `  --mask-center-${i}: url('${maskData}');\n`;
        }
    }

    // Corner masks
    for (let i = 1; i <= 37; i++) {
        const numStr = i.toString().padStart(4, '0');
        const maskData = waterColorMasks.corner[numStr];
        if (maskData) {
            css += `  --mask-corner-${i}: url('${maskData}');\n`;
        }
    }

    css += '}\n';
    return css;
}

// Read imageMask CSS
const imageMaskCSS = fs.readFileSync(path.join(rootDir, 'assets/themes/assets/imageMask.css'), 'utf8');

// Déterminer le fichier d'entrée
const inputFile = process.argv[2] || 'input/test_covers.md';
const outputFile = process.argv[3] || inputFile.replace('input/', 'output/').replace('.md', '_converted.html');

console.log('🔮 Conversion Homebrewery avec gestion des covers...');

// Lire le markdown
const markdown = fs.readFileSync(inputFile, 'utf8');
console.log(`✓ Fichier chargé (${(markdown.length / 1024).toFixed(1)} KB)`);

// Lire les CSS compilés et corriger les chemins des assets
let bundleCSS = fs.readFileSync(path.join(rootDir, 'assets/css/bundle.css'), 'utf8');
let themeCSS = fs.readFileSync(path.join(rootDir, 'assets/css/themes/V3/5ePHB/style.css'), 'utf8');

// Remplacer les chemins absolus par des chemins relatifs
// IMPORTANT: préserver le type de quote utilisé
bundleCSS = bundleCSS.replace(/url\('\/assets\//g, "url('../assets/images/");
bundleCSS = bundleCSS.replace(/url\("\/assets\//g, 'url("../assets/images/');
themeCSS = themeCSS.replace(/url\('\/assets\//g, "url('../assets/images/");
themeCSS = themeCSS.replace(/url\("\/assets\//g, 'url("../assets/images/');

bundleCSS = bundleCSS.replace(/url\('\/fonts\//g, "url('../assets/fonts/");
bundleCSS = bundleCSS.replace(/url\("\/fonts\//g, 'url("../assets/fonts/');
themeCSS = themeCSS.replace(/url\('\/fonts\//g, "url('../assets/fonts/");
themeCSS = themeCSS.replace(/url\("\/fonts\//g, 'url("../assets/fonts/');

// Corriger aussi les chemins relatifs existants qui sont incorrects
bundleCSS = bundleCSS.replace(/url\('\.\.\/\.\.\/\.\.\/fonts\//g, "url('../assets/fonts/");
bundleCSS = bundleCSS.replace(/url\('\.\.\/icons\//g, "url('../assets/icons/");

// Diviser en pages d'abord
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

  // Traiter les séparateurs ___ en préservant les sauts de ligne pour que le markdown suivant soit traité
  // Ajouter un double saut de ligne après le hr pour que le markdown continue à fonctionner
  pageContent = pageContent.replace(/^___$/gm, '\n<hr class="horizontalRule">\n');

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

  // Corriger les tags cover pour qu'ils fonctionnent avec le CSS du thème
  // Remplacer <span class="inline-block frontCover"></span> par <div class="frontCover"></div>
  processedHTML = processedHTML.replace(
    /<span class="inline-block (frontCover|insideCover|backCover|partCover)"><\/span>/g,
    '<div class="$1"></div>'
  );

  // Ajouter des classes supplémentaires sur la page pour les navigateurs qui ne supportent pas :has()
  if (hasFrontCover) pageClasses += ' has-frontCover';
  if (hasInsideCover) pageClasses += ' has-insideCover';
  if (hasBackCover) pageClasses += ' has-backCover';
  if (hasPartCover) pageClasses += ' has-partCover';

  // Traiter les images avec position absolute sur toutes les pages (pas seulement les covers)
  const imgRegex = /<img[^>]*style="[^"]*position:\s*absolute[^"]*"[^>]*>/g;
  const absoluteImages = processedHTML.match(imgRegex) || [];

  // Les conserver mais s'assurer qu'elles sont bien formatées
  absoluteImages.forEach(img => {
    // Parser les styles de l'image
    const styleMatch = img.match(/style="([^"]*)"/);
    if (styleMatch) {
      let styles = styleMatch[1];

      // Ne pas toucher aux URLs dans les styles (comme --HB_src)
      // On traite seulement les propriétés CSS standard

      // S'assurer que position: absolute a un espace
      styles = styles.replace(/position:\s*absolute/, 'position: absolute');

      // Gérer les valeurs négatives et positives pour top, bottom, left, right
      // Ajouter px seulement si ce n'est pas déjà présent
      styles = styles.replace(/\btop:\s*(-?\d+)(?!px|\d|%)/g, 'top: $1px');
      styles = styles.replace(/\bbottom:\s*(-?\d+)(?!px|\d|%)/g, 'bottom: $1px');
      styles = styles.replace(/\bleft:\s*(-?\d+)(?!px|\d|%)/g, 'left: $1px');
      styles = styles.replace(/\bright:\s*(-?\d+)(?!px|\d|%)/g, 'right: $1px');

      // Gérer width et height (toujours positifs)
      styles = styles.replace(/\bwidth:\s*(\d+)(?!px|\d|%)/g, 'width: $1px');
      styles = styles.replace(/\bheight:\s*(\d+)(?!px|\d|%)/g, 'height: $1px');

      // Gestion du z-index selon le type de page
      if (isCoverPage) {
        // Les images de fond sur les covers ont z-index: -1 pour être derrière le texte
        if (!styles.includes('z-index')) {
          styles = styles.replace(/;\s*$/, '') + '; z-index: -1';
        }
      } else {
        // Sur les pages normales, les images doivent être au-dessus du contenu
        if (!styles.includes('z-index')) {
          styles = styles.replace(/;\s*$/, '') + '; z-index: 1';
        }
      }

      const newImg = img.replace(/style="[^"]*"/, `style="${styles}"`);
      processedHTML = processedHTML.replace(img, newImg);
    }
  });

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
  <meta name="viewport" content="width=1000">
  <title>Homebrewery Document</title>

  <!-- Google Fonts comme Homebrewery -->
  <link href="//fonts.googleapis.com/css?family=Open+Sans:400,300,600,700" rel="stylesheet" type="text/css" />

  <style>
    /* Mask Variables */
    ${generateMaskVariables()}

    /* Bundle CSS (contient les styles de base de Homebrewery) */
    ${bundleCSS}

    /* Theme CSS (5ePHB) */
    ${themeCSS}

    /* ImageMask CSS */
    ${imageMaskCSS}

    /* Styles ImageMask pour les masques d'images watercolor */
    /* Important: on applique le masque uniquement sur l'élément img, pas sur le conteneur */
    .page [class*='imageMask'] {
      position: absolute;
      z-index: -1;
      --rotation: 0;
      --scaleX: 1;
      --scaleY: 1;
    }

    /* SOLUTION : Corrige la visibilité des images sur les "inside covers" */
    .page:has(.insideCover) [class*='imageMask'] {
      z-index: 0;
    }

    .page [class*='imageMaskCenter'] {
      bottom: calc(var(--offsetY, 0%));
      left: calc(var(--offsetX, 0%));
      width: 100%;
      height: 100%;
      transform: rotate(calc(1deg * var(--rotation, 0))) scaleX(var(--scaleX, 1)) scaleY(var(--scaleY, 1));
    }

    .page [class*='imageMaskCenter'] > p:has(img) {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform: scaleX(calc(1 / var(--scaleX, 1))) scaleY(calc(1 / var(--scaleY, 1))) rotate(calc(-1deg * var(--rotation, 0))) translateX(calc(-1 * var(--offsetX, 0%))) translateY(calc(1 * var(--offsetY, 0%)));
    }

    .page [class*='imageMaskCenter'] img {
      /* Ne pas forcer les propriétés de position car elles sont définies inline */
      display: block;
    }


    /* Reset des marges de page pour l'impression */
    @page {
      margin: 0;
      size: 215.9mm 279.4mm; /* Format Letter US */
    }

    /* Ajustements pour standalone */
    body {
      margin: 0;
      padding: 0;
      overflow: auto;
      background: #EEE5CE;
      counter-reset: page-numbers 0;
    }

    /* Fix pour les images sur les covers - elles doivent être visibles mais derrière le texte */
    /* Le sélecteur cherche position avec : ou avec espace après pour gérer les deux cas */
    .page:has(.frontCover) img[style*="position"],
    .page:has(.insideCover) img[style*="position"],
    .page:has(.partCover) img[style*="position"] {
      z-index: 0 !important;
    }

    /* Les titres et HR doivent être au-dessus des images */
    .page:has(.frontCover) h1,
    .page:has(.frontCover) h2,
    .page:has(.frontCover) hr,
    .page:has(.insideCover) h1,
    .page:has(.insideCover) h2,
    .page:has(.insideCover) hr,
    .page:has(.partCover) h1,
    .page:has(.partCover) h2 {
      position: relative;
      z-index: 1;
    }

    * {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
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
    /* IMPORTANT: Ne pas écraser le background-image défini dans le thème ! */
    .page {
      position: relative;
      /* IMPORTANT: Les dimensions doivent correspondre exactement au format Letter US */
      width: 215.9mm;
      height: 279.4mm;
      padding: 1.4cm 1.9cm 1.7cm;
      box-sizing: border-box;
      overflow: clip;
      /* background-color est déjà défini dans le thème avec background-image */
    }

    /* Correction des headers pour correspondre exactement au thème 5ePHB */
    .page h1, .page h2, .page h3, .page h4, .page h5, .page h6 {
      font-weight: bold;
      line-height: 1.2em;
    }

    .page h1, .page h2, .page h3, .page h4 {
      font-family: 'MrEavesRemake';
      color: var(--HB_Color_HeaderText);
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
    }

    /* Fallback pour les navigateurs qui ne supportent pas :has() */
    /* Les styles principaux sont dans le thème, mais on ajoute des fallbacks */

    /* BackCover styling amélioré */
    .page.has-backCover {
      padding: 2.25cm 1.3cm 2cm 1.3cm;
      line-height: 1.4em;
      color: #FFFFFF;
      columns: 1;
      position: relative;
      /* Image de fond parchemin */
      background-image: url('../assets/images/parchmentBackground.jpg');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    .page.has-backCover::before {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.7); /* Overlay sombre pour améliorer la lisibilité */
      z-index: 1;
      pointer-events: none;
    }

    .page.has-backCover .backCover {
      position: absolute;
      inset: 0;
      z-index: 2;
      background-image: url('../assets/images/backCover.png');
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      pointer-events: none;
    }

    .page.has-backCover .columnWrapper {
      width: 7.6cm;
      position: relative;
      z-index: 3;
    }

    .page.has-backCover img[style*="position"] {
      position: absolute !important;
      top: 0px;
      z-index: 1;
      height: 100%;
      width: auto;
      object-fit: cover;
    }

    /* PartCover fallback */
    .page.has-partCover .partCover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 6cm;
      background-image: url('../assets/images/partCoverHeaderPHB.png');
      background-repeat: no-repeat;
      background-size: 100%;
    }

    /* FrontCover et InsideCover positionnement */
    .page.has-frontCover .frontCover,
    .page.has-insideCover .insideCover {
      position: absolute;
      inset: 0;
      z-index: -1;
    }

    /* Polices locales */
    @font-face {
      font-family: 'BookInsanityRemake';
      src: url('../assets/fonts/5e/Bookinsanity.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
    }

    @font-face {
      font-family: 'BookInsanityRemake';
      src: url('../assets/fonts/5e/Bookinsanity Bold.woff2') format('woff2');
      font-weight: bold;
      font-style: normal;
    }

    @font-face {
      font-family: 'BookInsanityRemake';
      src: url('../assets/fonts/5e/Bookinsanity Italic.woff2') format('woff2');
      font-weight: normal;
      font-style: italic;
    }

    @font-face {
      font-family: 'BookInsanityRemake';
      src: url('../assets/fonts/5e/Bookinsanity Bold Italic.woff2') format('woff2');
      font-weight: bold;
      font-style: italic;
    }

    @font-face {
      font-family: 'ScalySansRemake';
      src: url('../assets/fonts/5e/Scaly Sans.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
    }

    @font-face {
      font-family: 'ScalySansRemake';
      src: url('../assets/fonts/5e/Scaly Sans Bold.woff2') format('woff2');
      font-weight: bold;
      font-style: normal;
    }

    @font-face {
      font-family: 'ScalySansRemake';
      src: url('../assets/fonts/5e/Scaly Sans Italic.woff2') format('woff2');
      font-weight: normal;
      font-style: italic;
    }

    @font-face {
      font-family: 'ScalySansRemake';
      src: url('../assets/fonts/5e/Scaly Sans Bold Italic.woff2') format('woff2');
      font-weight: bold;
      font-style: italic;
    }

    @font-face {
      font-family: 'ScalySansCapRemake';
      src: url('../assets/fonts/5e/Scaly Sans Caps.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
    }

    @font-face {
      font-family: 'MrEavesRemake';
      src: url('../assets/fonts/5e/Mr Eaves Small Caps.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
    }

    @font-face {
      font-family: 'SolberaImitationRemake';
      src: url('../assets/fonts/5e/Solbera Imitation Tweak.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
    }

    @font-face {
      font-family: 'NodestoCapsCondensed';
      src: url('../assets/fonts/5e/Nodesto Caps Condensed.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
    }

    @font-face {
      font-family: 'NodestoCapsCondensed';
      src: url('../assets/fonts/5e/Nodesto Caps Condensed Bold.woff2') format('woff2');
      font-weight: bold;
      font-style: normal;
    }

    @font-face {
      font-family: 'NodestoCapsWide';
      src: url('../assets/fonts/5e/Nodesto Caps Wide.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
    }

    @font-face {
      font-family: 'Overpass';
      src: url('../assets/fonts/5e/Overpass Medium.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
    }

    @font-face {
      font-family: 'WalterTurncoat';
      src: url('../assets/fonts/5e/WalterTurncoat-Regular.woff2') format('woff2');
      font-weight: normal;
      font-style: normal;
    }

    /* Support pour les blocs wide */
    .page .wide,
    .page .block.wide {
      column-span: all !important;
      -webkit-column-span: all !important;
      -moz-column-span: all !important;
      display: block;
      width: 100%;
      margin-bottom: 1em;
    }

    /* Fix pour les numéros de page */
    .page .pageNumber {
      position: absolute;
      right: 2px;
      bottom: 22px;
      width: 50px;
      font-size: .8em;
      color: var(--HB_Color_Footnotes);
      text-align: center;
    }

    .page:nth-child(even) .pageNumber {
      left: 2px;
      right: auto;
    }

    /* Fix pour les footnotes */
    .page .footnote {
      position: absolute;
      right: 80px;
      bottom: 32px;
      z-index: 150;
      width: 200px;
      font-size: .8em;
      color: var(--HB_Color_Footnotes);
      text-align: right;
    }

    .page:nth-child(even) .footnote {
      left: 80px;
      right: auto;
      text-align: left;
    }

    .page .wide + *,
    .page .block.wide + * {
      margin-top: 0;
    }

    /* Fix pour les éléments enfants dans wide */
    .page .block.wide > * {
      width: 100%;
      max-width: 100%;
    }

    .page .block.wide table {
      width: 100%;
    }

    .page .block.wide .monster.frame {
      width: calc(100% + .32cm);
    }

    /* Cacher les hr normaux (comportement par défaut) */
    .page hr:not(.horizontalRule) {
      visibility: hidden;
      margin: 0px;
    }

    /* Séparateurs horizontaux décoratifs (___) */
    .page hr.horizontalRule {
      visibility: visible !important;
      position: relative;
      display: block;
      width: 12cm;
      height: 0.5cm;
      margin: 0.5cm auto;
      background-image: url('../assets/images/horizontalRule.svg');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      border: none;
    }

    @media print {
      .brewRenderer {
        padding: 0;
      }
      .pages {
        display: block;
      }
      .page {
        margin: 0 !important;
        box-shadow: none !important;
        page-break-after: always;
      }
      .pdf-export-button {
        display: none !important;
      }
    }

    /* Bouton d'export PDF */
    .pdf-export-button {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      padding: 12px 24px;
      background: linear-gradient(135deg, #58180D 0%, #8B2500 100%);
      color: white;
      border: 2px solid var(--HB_Color_HeaderUnderline, #C0AD6A);
      border-radius: 5px;
      font-family: 'MrEavesRemake', 'BookInsanityRemake', serif;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
    }

    .pdf-export-button:hover {
      background: linear-gradient(135deg, #8B2500 0%, #58180D 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.4);
    }

    .pdf-export-button:active {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .pdf-export-button svg {
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-right: 8px;
      vertical-align: middle;
      fill: currentColor;
    }
  </style>
</head>
<body>
  <button class="pdf-export-button" onclick="exportToPDF()">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10,17L8,13H10V10H14V13H16L12,17"/>
    </svg>
    Exporter en PDF
  </button>

  <div class="brewRenderer">
    <div class="pages">
      ${pagesHTML}
    </div>
  </div>

  <script>
    function exportToPDF() {
      // Instructions pour l'utilisateur
      const message = \`
Pour exporter en PDF :

1. La fenêtre d'impression va s'ouvrir
2. Sélectionnez "Enregistrer en PDF" ou "Microsoft Print to PDF"
3. Paramètres IMPORTANTS :
   • Format : Letter (8.5" × 11") ou US Letter
   • Marges : Aucune
   • Mise à l'échelle : Ajuster à la page (ou 100%)
   • Arrière-plan graphique : Activé
4. Cliquez sur Enregistrer

NOTE: Ce document utilise le format Letter US (215.9mm × 279.4mm)
Si vous préférez A4, utilisez "Ajuster à la page"

Appuyez sur OK pour ouvrir la fenêtre d'impression.
      \`;

      if (confirm(message)) {
        window.print();
      }
    }

    // Raccourci clavier Ctrl+P ou Cmd+P
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        exportToPDF();
      }
    });
  </script>
</body>
</html>`;

// Écrire le fichier
fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, fullHTML);

console.log(`✅ Conversion terminée avec gestion des covers !`);
console.log(`📄 Fichier créé : ${outputFile}`);
console.log(`📏 Taille : ${(fullHTML.length / 1024).toFixed(1)} KB`);
console.log(`✨ Covers (front, inside, back, part) correctement gérés`);
console.log(`🎨 ImageMask support intégré (62 masques aquarelle)`);