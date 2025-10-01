import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import Markdown from './shared/naturalcrit/markdown.js';
import { waterColorMasks } from './themes/assets/waterColorMasksBase64.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration des images automatiques pour les tags custom
const CUSTOM_TAG_IMAGES = {
  darkLysander: {
    localPath: path.join(__dirname, 'assets', 'custom-tags', 'darkLysander.png'),
    fallbackUrl: 'https://i.imgur.com/Fx700PM.png',
    style: 'position:absolute; top:0; left:0; width:100%; height:100%;',
    alt: 'darkLysander background',
    mimeType: 'image/png'
  },
  lysanderCover: {
    localPath: path.join(__dirname, 'assets', 'custom-tags', 'lysanderCover.png'),
    fallbackUrl: 'https://i.imgur.com/leuvEXl.png',
    style: 'position:absolute; top:0; right:-20px; width:105%; height:100%;',
    alt: 'lysanderCover background',
    mimeType: 'image/png'
  }
};

// Fonction pour convertir un fichier en base64 avec le bon MIME type
function fileToBase64(filePath, mimeType) {
  try {
    const buffer = fs.readFileSync(filePath);
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
  } catch (error) {
    console.warn(`⚠️ Impossible de charger ${filePath}: ${error.message}`);
    return null;
  }
}

// Fonction pour télécharger une image depuis une URL et la convertir en base64
async function urlToBase64(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : require('http');

    protocol.get(url, (response) => {
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        const mimeType = response.headers['content-type'] || 'image/png';
        const base64 = `data:${mimeType};base64,${buffer.toString('base64')}`;
        resolve(base64);
      });
    }).on('error', (error) => {
      console.warn(`⚠️ Impossible de télécharger ${url}: ${error.message}`);
      resolve(url); // En cas d'erreur, garder l'URL originale
    });
  });
}

// Fonction pour remplacer toutes les images externes par leur version base64
async function embedExternalImages(html) {
  const imgRegex = /<img[^>]*src="(https?:\/\/[^"]+)"[^>]*>/g;
  const matches = [...html.matchAll(imgRegex)];

  if (matches.length > 0) {
    console.log(`📥 Téléchargement de ${matches.length} image(s) externe(s)...`);
  }

  for (const match of matches) {
    const [fullMatch, url] = match;
    const base64 = await urlToBase64(url);
    html = html.replace(url, base64);

    // Remplacer aussi dans --HB_src si présent
    html = html.replace(`--HB_src:url(${url})`, `--HB_src:url('${base64}')`);
  }

  return html;
}

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

// Charger et convertir toutes les polices en base64
function loadFontsAsBase64() {
  const fontsDir = path.join(__dirname, 'build/fonts/5e');
  const fonts = {
    'Bookinsanity.woff2': 'BookInsanityRemake',
    'Bookinsanity Bold.woff2': 'BookInsanityRemake',
    'Bookinsanity Italic.woff2': 'BookInsanityRemake',
    'Bookinsanity Bold Italic.woff2': 'BookInsanityRemake',
    'Scaly Sans.woff2': 'ScalySansRemake',
    'Scaly Sans Bold.woff2': 'ScalySansRemake',
    'Scaly Sans Italic.woff2': 'ScalySansRemake',
    'Scaly Sans Bold Italic.woff2': 'ScalySansRemake',
    'Scaly Sans Caps.woff2': 'ScalySansCapRemake',
    'Mr Eaves Small Caps.woff2': 'MrEavesRemake',
    'Solbera Imitation Tweak.woff2': 'SolberaImitationRemake',
    'Nodesto Caps Condensed.woff2': 'NodestoCapsCondensed',
    'Nodesto Caps Condensed Bold.woff2': 'NodestoCapsCondensed',
    'Nodesto Caps Wide.woff2': 'NodestoCapsWide',
    'Overpass Medium.woff2': 'Overpass',
    'WalterTurncoat-Regular.woff2': 'WalterTurncoat'
  };

  let fontCSS = '';

  for (const [filename, fontFamily] of Object.entries(fonts)) {
    const fontPath = path.join(fontsDir, filename);
    const base64Font = fileToBase64(fontPath, 'font/woff2');

    if (base64Font) {
      // Déterminer le weight et le style depuis le nom du fichier
      let fontWeight = 'normal';
      let fontStyle = 'normal';

      if (filename.includes('Bold')) fontWeight = 'bold';
      if (filename.includes('Italic')) fontStyle = 'italic';

      fontCSS += `
    @font-face {
      font-family: '${fontFamily}';
      src: url('${base64Font}') format('woff2');
      font-weight: ${fontWeight};
      font-style: ${fontStyle};
    }`;
    }
  }

  return fontCSS;
}

// Charger et convertir les images principales en base64
function loadImagesAsBase64() {
  const assetsDir = path.join(__dirname, 'build/assets');
  const images = {
    'parchmentBackground.jpg': 'image/jpeg',
    'parchmentBackgroundGrayscale.jpg': 'image/jpeg',
    'backCover.png': 'image/png',
    'partCoverHeaderPHB.png': 'image/png',
    'PHB_footerAccent.png': 'image/png',
    'DMG_footerAccent.png': 'image/png',
    'horizontalRule.svg': 'image/svg+xml',
    'noteBorder.png': 'image/png',
    'descriptiveBorder.png': 'image/png',
    'monsterBorderFancy.png': 'image/png',
    'frameBorder.png': 'image/png',
    'classTableDecoration.png': 'image/png',
    'codeBorder.png': 'image/png',
    'redTriangle.png': 'image/png',
    'coverPageBanner.svg': 'image/svg+xml',
    'scriptBorder.png': 'image/png'
  };

  const imagesBase64 = {};

  for (const [filename, mimeType] of Object.entries(images)) {
    const imagePath = path.join(assetsDir, filename);
    const base64Image = fileToBase64(imagePath, mimeType);
    if (base64Image) {
      imagesBase64[filename] = base64Image;
    }
  }

  return imagesBase64;
}

// Remplacer les URLs dans le CSS par les versions base64
function embedAssetsInCSS(css, imagesBase64, fontsAlreadyEmbedded = false) {
  let processedCSS = css;

  // Remplacer les références aux images
  for (const [filename, base64Data] of Object.entries(imagesBase64)) {
    // Patterns pour trouver les références aux images
    // Gestion spéciale pour parchmentBackground.jpg qui pourrait être référencé comme parchment.jpg
    const baseFilename = filename.replace('Background', '');
    const patterns = [
      new RegExp(`url\\(['"]?\\.\\./build/assets/${filename}['"]?\\)`, 'g'),
      new RegExp(`url\\(['"]?/assets/${filename}['"]?\\)`, 'g'),
      new RegExp(`url\\(['"]?assets/${filename}['"]?\\)`, 'g'),
      new RegExp(`url\\(['"]?\\.\\./assets/${filename}['"]?\\)`, 'g'),
      // Patterns additionnels pour les noms simplifiés
      new RegExp(`url\\(['"]?\\.\\./build/assets/${baseFilename}['"]?\\)`, 'g'),
      new RegExp(`url\\(['"]?/assets/${baseFilename}['"]?\\)`, 'g'),
      new RegExp(`url\\(['"]?assets/${baseFilename}['"]?\\)`, 'g'),
      new RegExp(`url\\(['"]?\\.\\./assets/${baseFilename}['"]?\\)`, 'g')
    ];

    patterns.forEach(pattern => {
      processedCSS = processedCSS.replace(pattern, `url('${base64Data}')`);
    });
  }

  // Si les polices ne sont pas déjà embarquées, supprimer les références aux polices externes
  if (!fontsAlreadyEmbedded) {
    // Supprimer les références aux polices (elles seront dans une section séparée)
    processedCSS = processedCSS.replace(/url\(['"]?\.\.\/build\/fonts\/[^)]+['"]?\)/g, 'url("")');
    processedCSS = processedCSS.replace(/url\(['"]?\/fonts\/[^)]+['"]?\)/g, 'url("")');
    processedCSS = processedCSS.replace(/url\(['"]?fonts\/[^)]+['"]?\)/g, 'url("")');
  }

  return processedCSS;
}

// Déterminer le fichier d'entrée
const inputFile = path.join(__dirname, 'input', 'section_game_v2.md');
const outputFile = path.join(__dirname, 'output', 'section_game_v2_standalone.html');

console.log('🔮 Conversion Homebrewery STANDALONE (tout en base64)...');

// Lire le markdown
const markdown = fs.readFileSync(inputFile, 'utf8');
console.log(`✓ Fichier chargé (${(markdown.length / 1024).toFixed(1)} KB)`);

// Charger toutes les ressources en base64
console.log('📦 Chargement des ressources...');
const fontsBase64CSS = loadFontsAsBase64();
console.log(`✓ ${fontsBase64CSS.split('@font-face').length - 1} polices chargées`);

const imagesBase64 = loadImagesAsBase64();
console.log(`✓ ${Object.keys(imagesBase64).length} images chargées`);

// Lire les CSS et les traiter
console.log('🎨 Traitement des styles...');
let bundleCSS = fs.readFileSync(path.join(__dirname, 'build/bundle.css'), 'utf8');
let themeCSS = fs.readFileSync(path.join(__dirname, 'build/themes/V3/5ePHB/style.css'), 'utf8');
const imageMaskCSS = fs.readFileSync(path.join(__dirname, 'themes/assets/imageMask.css'), 'utf8');

// Embarquer les assets dans les CSS
bundleCSS = embedAssetsInCSS(bundleCSS, imagesBase64);
themeCSS = embedAssetsInCSS(themeCSS, imagesBase64);

console.log('✓ Styles traités et assets embarqués');

// Diviser en pages
const PAGEBREAK_REGEX = /^\\page(?:break)?$/m;
const pages = markdown.split(PAGEBREAK_REGEX);

// Générer le HTML pour chaque page
let pagesHTML = '';
for (let index = 0; index < pages.length; index++) {
  let pageContent = pages[index].trim();
  if (!pageContent) continue;

  // Détecter les types de covers et tags spéciaux
  const hasFrontCover = pageContent.includes('{{frontCover}}');
  const hasInsideCover = pageContent.includes('{{insideCover}}');
  const hasBackCover = pageContent.includes('{{backCover}}');
  const hasPartCover = pageContent.includes('{{partCover}}');
  const hasNoFooter = pageContent.includes('{{noFooter}}');
  const hasDarkLysander = pageContent.includes('{{darkLysander}}');
  const hasLysanderCover = pageContent.includes('{{lysanderCover}}');
  const isCoverPage = hasFrontCover || hasInsideCover || hasBackCover || hasPartCover;

  // Traiter les séparateurs
  pageContent = pageContent.replace(/^___$/gm, '\n<hr class="horizontalRule">\n');

  // Parser les classes et styles de la page
  let pageClasses = 'page';
  let pageStyles = {};

  if (pageContent.startsWith('\\page')) {
    const firstLine = pageContent.split('\n')[0];
    const match = firstLine.match(/\\page\s*{([^}]+)}/);
    if (match) {
      const tags = match[1];
      const classMatch = tags.match(/([^:,]+(?:\s+[^:,]+)*)/g);
      if (classMatch) {
        pageClasses += ' ' + classMatch.filter(c => !c.includes(':')).join(' ');
      }
      const styleMatch = tags.match(/(\w+):\s*([^,}]+)/g);
      if (styleMatch) {
        styleMatch.forEach(s => {
          const [key, value] = s.split(':').map(x => x.trim());
          pageStyles[key] = value;
        });
      }
    }
    pageContent = pageContent.substring(pageContent.indexOf('\n') + 1);
  }

  // Pour les pages normales, ajouter le column break
  if (!isCoverPage) {
    pageContent += `\n\n&nbsp;\n\\column\n&nbsp;`;
  }

  // Traiter avec le renderer Markdown
  const pageHTML = Markdown.render(pageContent, index);

  // Traiter les tags cover et images
  let processedHTML = pageHTML;

  // Extraire les divs cover pour les placer en dehors du columnWrapper
  let coverDiv = '';
  const coverMatch = processedHTML.match(/<span class="inline-block (frontCover|insideCover|backCover|partCover)"><\/span>/);
  if (coverMatch) {
    coverDiv = `<div class="${coverMatch[1]}"></div>`;
    processedHTML = processedHTML.replace(coverMatch[0], '');
  }

  // Pour backCover, extraire les images avec position absolute pour les placer en dehors du columnWrapper
  let backCoverImages = '';
  if (hasBackCover) {
    const imgRegex = /<p>\s*<img[^>]*style="[^"]*position:\s*absolute[^"]*"[^>]*>\s*<\/p>/g;
    const matches = processedHTML.match(imgRegex) || [];
    matches.forEach(imgBlock => {
      // Extraire juste l'img sans le <p>
      const imgMatch = imgBlock.match(/<img[^>]*>/);
      if (imgMatch) {
        let img = imgMatch[0];

        // Traiter les styles: ajouter z-index: -2 pour que l'image soit derrière la bande noire
        const styleMatch = img.match(/style="([^"]*)"/);
        if (styleMatch) {
          let styles = styleMatch[1];

          // Normaliser et ajouter z-index
          if (styles.includes('z-index')) {
            styles = styles.replace(/z-index\s*:\s*[^;]+/g, 'z-index: -2');
          } else {
            styles = styles.replace(/;\s*$/, '') + '; z-index: -2';
          }

          img = img.replace(/style="[^"]*"/, `style="${styles}"`);
        }

        backCoverImages += img + '\n';
        processedHTML = processedHTML.replace(imgBlock, '');
      }
    });
  }

  // Supprimer les tags custom du HTML (ils ont déjà ajouté leurs classes)
  processedHTML = processedHTML.replace(/<span class="inline-block noFooter"><\/span>/g, '');
  processedHTML = processedHTML.replace(/<span class="inline-block darkLysander"><\/span>/g, '');
  processedHTML = processedHTML.replace(/<span class="inline-block lysanderCover"><\/span>/g, '');

  // Pour darkLysander, ajouter automatiquement l'image de fond
  let darkLysanderImages = '';
  if (hasDarkLysander) {
    // Supprimer toute image manuelle avec position absolute pour éviter les doublons
    const urlPattern = CUSTOM_TAG_IMAGES.darkLysander.fallbackUrl.split('/').pop().split('.')[0];
    const imgRegex = new RegExp(`<p>\\s*<img[^>]*(?:${urlPattern}\\.png|position\\s*:\\s*absolute)[^>]*>\\s*</p>`, 'gi');
    processedHTML = processedHTML.replace(imgRegex, '');

    // Charger l'image depuis le fichier local
    const config = CUSTOM_TAG_IMAGES.darkLysander;
    const base64Image = fileToBase64(config.localPath, config.mimeType) || config.fallbackUrl;
    darkLysanderImages = `<img style="${config.style}" src="${base64Image}" alt="${config.alt}">\n`;
  }

  // Pour lysanderCover, ajouter automatiquement l'image de couverture
  let lysanderCoverImages = '';
  if (hasLysanderCover) {
    // Supprimer toute image manuelle avec position absolute pour éviter les doublons
    const urlPattern = CUSTOM_TAG_IMAGES.lysanderCover.fallbackUrl.split('/').pop().split('.')[0];
    const imgRegex = new RegExp(`<p>\\s*<img[^>]*(?:${urlPattern}\\.png|position\\s*:\\s*absolute)[^>]*>\\s*</p>`, 'gi');
    processedHTML = processedHTML.replace(imgRegex, '');

    // Charger l'image depuis le fichier local
    const config = CUSTOM_TAG_IMAGES.lysanderCover;
    const base64Image = fileToBase64(config.localPath, config.mimeType) || config.fallbackUrl;
    lysanderCoverImages = `<img style="${config.style}" src="${base64Image}" alt="${config.alt}">\n`;
  }

  // Ajouter les classes pour le fallback
  if (hasFrontCover) pageClasses += ' has-frontCover';
  if (hasInsideCover) pageClasses += ' has-insideCover';
  if (hasBackCover) pageClasses += ' has-backCover';
  if (hasPartCover) pageClasses += ' has-partCover';
  if (hasNoFooter) pageClasses += ' has-noFooter';
  if (hasDarkLysander) {
    pageClasses += ' darkLysander';
    // darkLysander masque automatiquement le footer
    pageClasses += ' has-noFooter';
  }
  if (hasLysanderCover) {
    pageClasses += ' lysanderCover';
    // lysanderCover masque automatiquement le footer
    pageClasses += ' has-noFooter';
  }

  // Traiter les images avec position absolute SEULEMENT pour les pages non-darkLysander, non-lysanderCover, et non-backCover
  // (darkLysander, lysanderCover et backCover ont leur propre gestion au-dessus)
  if (!hasDarkLysander && !hasLysanderCover && !hasBackCover) {
    const imgRegex = /<img[^>]*style="[^"]*position:\s*absolute[^"]*"[^>]*>/g;
    const absoluteImages = processedHTML.match(imgRegex) || [];

    absoluteImages.forEach(img => {
      const styleMatch = img.match(/style="([^"]*)"/);
      if (styleMatch) {
        let styles = styleMatch[1];

        styles = styles.replace(/position:\s*absolute/, 'position: absolute');
        styles = styles.replace(/\btop:\s*(-?\d+)(?!px|\d|%)/g, 'top: $1px');
        styles = styles.replace(/\bbottom:\s*(-?\d+)(?!px|\d|%)/g, 'bottom: $1px');
        styles = styles.replace(/\bleft:\s*(-?\d+)(?!px|\d|%)/g, 'left: $1px');
        styles = styles.replace(/\bright:\s*(-?\d+)(?!px|\d|%)/g, 'right: $1px');
        styles = styles.replace(/\bwidth:\s*(\d+)(?!px|\d|%)/g, 'width: $1px');
        styles = styles.replace(/\bheight:\s*(\d+)(?!px|\d|%)/g, 'height: $1px');

        if (isCoverPage) {
          // Pour backCover, l'image doit TOUJOURS être à z-index: -2 (derrière la bande noire qui est à -1)
          const zIndex = hasBackCover ? '-2' : '-1';
          if (styles.includes('z-index')) {
            // Remplacer le z-index existant
            styles = styles.replace(/z-index\s*:\s*[^;]+/g, `z-index: ${zIndex}`);
          } else {
            // Ajouter le z-index
            styles = styles.replace(/;\s*$/, '') + `; z-index: ${zIndex}`;
          }
        } else {
          if (!styles.includes('z-index')) {
            styles = styles.replace(/;\s*$/, '') + '; z-index: 1';
          }
        }

        const newImg = img.replace(/style="[^"]*"/, `style="${styles}"`);
        processedHTML = processedHTML.replace(img, newImg);
      }
    });
  }

  const stylesString = Object.entries(pageStyles)
    .map(([k, v]) => `${k}: ${v}`)
    .join('; ');

  pagesHTML += `
    <div class="${pageClasses}" id="p${index + 1}" ${stylesString ? `style="${stylesString}"` : ''}>
      ${coverDiv}
      ${hasDarkLysander ? darkLysanderImages : ''}
      ${hasLysanderCover ? lysanderCoverImages : ''}
      ${hasBackCover ? backCoverImages : ''}
      <div class="columnWrapper">
        ${processedHTML}
      </div>
    </div>
  `;
}

// HTML complet STANDALONE
const fullHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1000">
  <title>Homebrewery Document</title>

  <!-- Google Fonts -->
  <link href="//fonts.googleapis.com/css?family=Open+Sans:400,300,600,700" rel="stylesheet" type="text/css" />

  <style>
    /* Mask Variables */
    ${generateMaskVariables()}

    /* Fonts embarquées en base64 */
    ${fontsBase64CSS}

    /* Bundle CSS avec assets embarqués */
    ${bundleCSS}

    /* Theme CSS avec assets embarqués */
    ${themeCSS}

    /* ImageMask CSS */
    ${imageMaskCSS}

    /* Styles additionnels pour le standalone */
    body {
      margin: 0;
      padding: 0;
      overflow: auto;
      background: #EEE5CE;
      counter-reset: page-numbers 0;
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

    .page {
      position: relative;
      width: 215.9mm;
      height: 279.4mm;
      padding: 1.4cm 1.9cm 1.7cm;
      box-sizing: border-box;
      overflow: clip;
    }

    /* columnWrapper pour gérer les colonnes */
    .columnWrapper {
      column-gap: inherit;
      max-height: 100%;
      min-height: calc(100% + 0.5cm);
      column-span: all;
      columns: inherit;
      column-fill: inherit;
      column-count: 2;
      column-fill: auto;
      column-gap: .9cm;
      column-width: 8cm;
      -webkit-column-count: 2;
      -moz-column-count: 2;
      -webkit-column-width: 8cm;
      -moz-column-width: 8cm;
      -webkit-column-gap: .9cm;
      -moz-column-gap: .9cm;
    }

    /* Pages avec une seule colonne */
    .page:has(.frontCover) .columnWrapper,
    .page:has(.insideCover) .columnWrapper,
    .page:has(.backCover) .columnWrapper,
    .page:has(.partCover) .columnWrapper {
      column-count: 1;
      -webkit-column-count: 1;
      -moz-column-count: 1;
    }

    /* Fallback pour navigateurs sans :has() */
    .page.has-frontCover .columnWrapper,
    .page.has-insideCover .columnWrapper,
    .page.has-backCover .columnWrapper,
    .page.has-partCover .columnWrapper {
      column-count: 1;
      -webkit-column-count: 1;
      -moz-column-count: 1;
    }

    /* Styles ImageMask */
    .page [class*='imageMask'] {
      position: absolute;
      z-index: -1;
      --rotation: 0;
      --scaleX: 1;
      --scaleY: 1;
    }

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
      display: block;
    }

    /* Headers */
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

    /* BackCover styling - comme Homebrewery officiel */
    .page:has(.backCover) {
      padding: 2.25cm 1.3cm 2cm 1.3cm;
      line-height: 1.4em;
      color: #FFFFFF;
      columns: 1;
      /* Retirer le fond parchemin sur la backCover */
      background-image: none !important;
      background-color: transparent;
      position: relative;
    }

    .page:has(.backCover)::after {
      display: none;
    }

    .page:has(.backCover) .columnWrapper {
      width: 7.6cm;
      position: relative;
    }

    .page:has(.backCover) .backCover {
      position: absolute;
      inset: 0;
      z-index: -1;
      background-image: url('${imagesBase64['backCover.png'] || ''}');
      background-repeat: no-repeat;
      background-size: contain;
    }

    .page:has(.backCover) img[style*="position"] {
      z-index: -2 !important;
    }

    /* Fallbacks pour navigateurs sans :has() */
    .page.has-backCover {
      padding: 2.25cm 1.3cm 2cm 1.3cm;
      line-height: 1.4em;
      color: #FFFFFF;
      columns: 1;
      /* Retirer le fond parchemin sur la backCover */
      background-image: none !important;
      background-color: transparent;
      position: relative;
    }

    .page.has-backCover::after {
      display: none;
    }

    .page.has-backCover .columnWrapper {
      width: 7.6cm;
      position: relative;
    }

    .page.has-backCover .backCover {
      position: absolute;
      inset: 0;
      z-index: -1;
      background-image: url('${imagesBase64['backCover.png'] || ''}');
      background-repeat: no-repeat;
      background-size: contain;
    }

    .page.has-backCover img[style*="position"] {
      z-index: -2 !important;
    }

    .page.has-partCover .partCover {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 6cm;
      background-image: url('${imagesBase64['partCoverHeaderPHB.png'] || ''}');
      background-repeat: no-repeat;
      background-size: 100%;
    }

    .page.has-frontCover .frontCover,
    .page.has-insideCover .insideCover {
      position: absolute;
      inset: 0;
      z-index: -1;
    }

    /* Images sur covers */
    .page:has(.frontCover) img[style*="position"],
    .page:has(.insideCover) img[style*="position"],
    .page:has(.partCover) img[style*="position"] {
      z-index: 0 !important;
    }

    /* Masquer le pied de page sur les pages avec noFooter */
    .page.has-noFooter::after {
      display: none !important;
    }

    /* Style LysanderCover pour pages de couverture */
    .page.lysanderCover {
      position: relative;
      overflow: clip;
      width: 215.9mm;
      height: 279.4mm;
    }

    /* Supprimer le background parchemin pour lysanderCover */
    .page.lysanderCover::before {
      display: none !important;
    }

    /* Image lysanderCover placée directement dans la page */
    .page.lysanderCover > img {
      position: absolute;
      top: 0;
      right: -20px;
      z-index: 0;
      width: 105%;
      height: 100%;
      object-fit: cover;
    }

    /* Contenu au-dessus de l'image lysanderCover */
    .page.lysanderCover .columnWrapper {
      position: relative;
      z-index: 10;
    }

    /* Style DarkLysander pour pages sombres */
    .page.darkLysander {
      position: relative;
      background: #0a0a0a !important; /* Fond noir de secours */
      overflow: clip;
      width: 215.9mm;
      height: 279.4mm;
    }

    /* Supprimer le background parchemin pour darkLysander */
    .page.darkLysander::before {
      display: none !important;
    }

    .page.darkLysander * {
      color: #E8E6E3;
      line-height: 1.4;
      font-size: 1.02em;
    }

    /* Assurer que tout le contenu texte est VRAIMENT au-dessus */
    .page.darkLysander .columnWrapper {
      position: relative;
      z-index: 100 !important;
    }

    /* Images darkLysander placées directement dans la page (en dehors de columnWrapper) */
    .page.darkLysander > img {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .page.darkLysander h1 {
      color: #6B0F1A;  /* Rouge sang de Strahd */
      line-height: 1.10;
      font-size: 2.3em;
      width: calc(100% + 60px);
      margin-left: -30px;
      text-align: center;
      text-shadow:
        1px 1px 1px rgba(0, 0, 0, 0.95),
        2px 2px 4px rgba(0, 0, 0, 0.8),
        0 0 1px rgba(139, 0, 0, 0.3);
      font-weight: 500;
      letter-spacing: 2px;
      position: relative;
      z-index: 200 !important;
    }

    .page.darkLysander h2 {
      color: #8B1A1A;
      font-size: 1.8em;
      line-height: 1.15;
      position: relative;
      z-index: 200 !important;
    }

    .page.darkLysander h3 {
      color: #A52A2A;
      font-size: 1.4em;
      line-height: 1.2;
      position: relative;
      z-index: 200 !important;
    }

    .page.darkLysander strong {
      color: #F0E6E3;
      font-weight: bold;
    }

    .page.darkLysander em {
      color: #D8D0CD;
    }

    /* S'assurer que les paragraphes et listes sont au-dessus */
    .page.darkLysander p,
    .page.darkLysander ul,
    .page.darkLysander ol,
    .page.darkLysander dl,
    .page.darkLysander blockquote,
    .page.darkLysander .note,
    .page.darkLysander .descriptive,
    .page.darkLysander .blank,
    .page.darkLysander .columnSplit {
      position: relative;
      z-index: 150 !important;
    }

    /* Forcer le contenu des colonnes au-dessus des images */
    .page.darkLysander .columnWrapper > * {
      position: relative;
      z-index: 150 !important;
    }

    /* Exception : les paragraphes contenant des images restent neutres */
    .page.darkLysander p:has(img) {
      z-index: auto !important;
      position: static !important;
    }

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

    /* Wide blocks */
    .page .wide,
    .page .block.wide {
      column-span: all !important;
      -webkit-column-span: all !important;
      -moz-column-span: all !important;
      display: block;
      width: 100%;
      margin-bottom: 1em;
    }

    /* Numéros de page */
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

    /* Footnotes */
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

    /* Horizontal rules */
    .page hr:not(.horizontalRule) {
      visibility: hidden;
      margin: 0px;
    }

    .page hr.horizontalRule {
      visibility: visible !important;
      position: relative;
      display: block;
      width: 12cm;
      height: 0.5cm;
      margin: 0.5cm auto;
      background-image: url('${imagesBase64['horizontalRule.svg'] || ''}');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      border: none;
    }

    /* Print styles */
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

    @page {
      margin: 0;
      size: 215.9mm 279.4mm;
    }

    /* Bouton export PDF */
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

NOTE: Document 100% autonome - toutes les ressources sont embarquées

Appuyez sur OK pour ouvrir la fenêtre d'impression.
      \`;

      if (confirm(message)) {
        window.print();
      }
    }

    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        exportToPDF();
      }
    });
  </script>
</body>
</html>`;

// Fonction principale asynchrone
async function main() {
  // Embarquer toutes les images externes en base64
  const finalHTML = await embedExternalImages(fullHTML);

  // Écrire le fichier
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, finalHTML);

  const outputSizeMB = (finalHTML.length / 1024 / 1024).toFixed(2);
  console.log(`✅ Conversion STANDALONE terminée !`);
  console.log(`📄 Fichier créé : ${outputFile}`);
  console.log(`📏 Taille : ${outputSizeMB} MB (100% autonome)`);
  console.log(`✨ Toutes les ressources embarquées en base64`);
  console.log(`🎯 Aucune dépendance externe requise !`);
}

// Lancer la conversion
main().catch(console.error);