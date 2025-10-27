import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';
import Markdown from '../shared/naturalcrit/markdown.js';
import { waterColorMasks } from '../assets/themes/assets/waterColorMasksBase64.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Configuration
const inputFile = path.join(rootDir, 'input', 'section_game.md');
const outputDir = path.join(rootDir, 'output', 'section_game');
const outputFile = path.join(outputDir, 'index.html');

// Configuration des images automatiques pour les tags custom
const CUSTOM_TAG_IMAGES = {
  darkLysander: {
    localPath: path.join(rootDir, 'assets', 'custom-tags', 'darkLysander.png'),
    fallbackUrl: 'https://i.imgur.com/Fx700PM.png',
    outputPath: 'images/darkLysander.png',
    style: 'position:absolute; top:0; left:0; width:100%; height:100%;',
    alt: 'darkLysander background'
  },
  lysanderCover: {
    localPath: path.join(rootDir, 'assets', 'custom-tags', 'lysanderCover.png'),
    fallbackUrl: 'https://i.imgur.com/leuvEXl.png',
    outputPath: 'images/lysanderCover.png',
    style: 'position:absolute; top:0; right:-20px; width:105%; height:100%;',
    alt: 'lysanderCover background'
  }
};

// Fonction pour copier un fichier
function copyFile(src, dest) {
  try {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    return true;
  } catch (error) {
    console.warn(`⚠️ Erreur lors de la copie de ${src}: ${error.message}`);
    return false;
  }
}

// Fonction pour télécharger une image depuis une URL
async function downloadImage(url, outputPath) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;

    const fullOutputPath = path.join(outputDir, outputPath);
    fs.mkdirSync(path.dirname(fullOutputPath), { recursive: true });

    protocol.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Redirection
        downloadImage(response.headers.location, outputPath).then(resolve).catch(reject);
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        fs.writeFileSync(fullOutputPath, buffer);
        resolve(outputPath);
      });
    }).on('error', (error) => {
      console.warn(`⚠️ Erreur téléchargement ${url}: ${error.message}`);
      resolve(null);
    });
  });
}

// Extraire les waterColorMasks en fichiers PNG depuis base64
function extractWaterColorMasks() {
  const masksDir = path.join(outputDir, 'waterColorMasks');
  fs.mkdirSync(masksDir, { recursive: true });

  let count = 0;

  // Edge masks
  for (const [key, dataUrl] of Object.entries(waterColorMasks.edge)) {
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(path.join(masksDir, `edge_${key}.png`), buffer);
    count++;
  }

  // Center masks
  for (const [key, dataUrl] of Object.entries(waterColorMasks.center)) {
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(path.join(masksDir, `center_${key}.png`), buffer);
    count++;
  }

  // Corner masks
  for (const [key, dataUrl] of Object.entries(waterColorMasks.corner)) {
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(path.join(masksDir, `corner_${key}.png`), buffer);
    count++;
  }

  return count;
}

// Générer les variables CSS pour les masks avec chemins relatifs
function generateMaskVariables() {
  let css = ':root {\n';

  // Edge masks
  for (let i = 1; i <= 8; i++) {
    const key = `000${i}`;
    if (waterColorMasks.edge[key]) {
      css += `  --mask-edge-${i}: url('waterColorMasks/edge_${key}.png');\n`;
    }
  }

  // Center masks
  for (let i = 1; i <= 16; i++) {
    const key = i.toString().padStart(4, '0');
    if (waterColorMasks.center[key]) {
      css += `  --mask-center-${i}: url('waterColorMasks/center_${key}.png');\n`;
    }
  }

  // Corner masks
  for (let i = 1; i <= 37; i++) {
    const key = i.toString().padStart(4, '0');
    if (waterColorMasks.corner[key]) {
      css += `  --mask-corner-${i}: url('waterColorMasks/corner_${key}.png');\n`;
    }
  }

  css += '}\n';
  return css;
}

// Copier les polices
function copyFonts() {
  const fontsSourceDir = path.join(rootDir, 'assets/fonts/5e');
  const fontsDestDir = path.join(outputDir, 'fonts');
  fs.mkdirSync(fontsDestDir, { recursive: true });

  const fonts = [
    'Bookinsanity.woff2',
    'Bookinsanity Bold.woff2',
    'Bookinsanity Italic.woff2',
    'Bookinsanity Bold Italic.woff2',
    'Scaly Sans.woff2',
    'Scaly Sans Bold.woff2',
    'Scaly Sans Italic.woff2',
    'Scaly Sans Bold Italic.woff2',
    'Scaly Sans Caps.woff2',
    'Mr Eaves Small Caps.woff2',
    'Solbera Imitation Tweak.woff2',
    'Nodesto Caps Condensed.woff2',
    'Nodesto Caps Condensed Bold.woff2',
    'Nodesto Caps Wide.woff2',
    'Overpass Medium.woff2',
    'WalterTurncoat-Regular.woff2'
  ];

  let count = 0;
  for (const font of fonts) {
    const src = path.join(fontsSourceDir, font);
    const dest = path.join(fontsDestDir, font);
    if (copyFile(src, dest)) count++;
  }

  return count;
}

// Générer le CSS @font-face avec chemins relatifs
function generateFontFaces() {
  const fonts = {
    'Bookinsanity.woff2': { family: 'BookInsanityRemake', weight: 'normal', style: 'normal' },
    'Bookinsanity Bold.woff2': { family: 'BookInsanityRemake', weight: 'bold', style: 'normal' },
    'Bookinsanity Italic.woff2': { family: 'BookInsanityRemake', weight: 'normal', style: 'italic' },
    'Bookinsanity Bold Italic.woff2': { family: 'BookInsanityRemake', weight: 'bold', style: 'italic' },
    'Scaly Sans.woff2': { family: 'ScalySansRemake', weight: 'normal', style: 'normal' },
    'Scaly Sans Bold.woff2': { family: 'ScalySansRemake', weight: 'bold', style: 'normal' },
    'Scaly Sans Italic.woff2': { family: 'ScalySansRemake', weight: 'normal', style: 'italic' },
    'Scaly Sans Bold Italic.woff2': { family: 'ScalySansRemake', weight: 'bold', style: 'italic' },
    'Scaly Sans Caps.woff2': { family: 'ScalySansCapRemake', weight: 'normal', style: 'normal' },
    'Mr Eaves Small Caps.woff2': { family: 'MrEavesRemake', weight: 'normal', style: 'normal' },
    'Solbera Imitation Tweak.woff2': { family: 'SolberaImitationRemake', weight: 'normal', style: 'normal' },
    'Nodesto Caps Condensed.woff2': { family: 'NodestoCapsCondensed', weight: 'normal', style: 'normal' },
    'Nodesto Caps Condensed Bold.woff2': { family: 'NodestoCapsCondensed', weight: 'bold', style: 'normal' },
    'Nodesto Caps Wide.woff2': { family: 'NodestoCapsWide', weight: 'normal', style: 'normal' },
    'Overpass Medium.woff2': { family: 'Overpass', weight: 'normal', style: 'normal' },
    'WalterTurncoat-Regular.woff2': { family: 'WalterTurncoat', weight: 'normal', style: 'normal' }
  };

  let css = '';
  for (const [filename, props] of Object.entries(fonts)) {
    css += `
    @font-face {
      font-family: '${props.family}';
      src: url('fonts/${filename}') format('woff2');
      font-weight: ${props.weight};
      font-style: ${props.style};
    }`;
  }

  return css;
}

// Copier les images principales
function copyImages() {
  const imagesSourceDir = path.join(rootDir, 'assets/images');
  const imagesDestDir = path.join(outputDir, 'images');
  fs.mkdirSync(imagesDestDir, { recursive: true });

  const images = [
    'parchmentBackground.jpg',
    'parchmentBackgroundGrayscale.jpg',
    'backCover.png',
    'partCoverHeaderPHB.png',
    'PHB_footerAccent.png',
    'DMG_footerAccent.png',
    'horizontalRule.svg',
    'noteBorder.png',
    'descriptiveBorder.png',
    'monsterBorderFancy.png',
    'frameBorder.png',
    'classTableDecoration.png',
    'codeBorder.png',
    'redTriangle.png',
    'coverPageBanner.svg',
    'scriptBorder.png'
  ];

  let count = 0;
  for (const image of images) {
    const src = path.join(imagesSourceDir, image);
    const dest = path.join(imagesDestDir, image);
    if (copyFile(src, dest)) count++;
  }

  // Copier aussi les images custom tags
  for (const tag of Object.values(CUSTOM_TAG_IMAGES)) {
    const dest = path.join(outputDir, tag.outputPath);
    if (fs.existsSync(tag.localPath)) {
      if (copyFile(tag.localPath, dest)) count++;
    }
  }

  return count;
}

// Remplacer les URLs dans le CSS par des chemins relatifs
function fixCSSPaths(css) {
  let processedCSS = css;

  // Remplacer les chemins absolus par des chemins relatifs
  processedCSS = processedCSS.replace(/url\(['"]?\/assets\/([^'"]+)['"]?\)/g, "url('images/$1')");
  processedCSS = processedCSS.replace(/url\(['"]?\.\.\/build\/assets\/([^'"]+)['"]?\)/g, "url('images/$1')");
  processedCSS = processedCSS.replace(/url\(['"]?assets\/([^'"]+)['"]?\)/g, "url('images/$1')");
  processedCSS = processedCSS.replace(/url\(['"]?\.\.\/assets\/([^'"]+)['"]?\)/g, "url('images/$1')");

  // Remplacer les chemins de fonts
  processedCSS = processedCSS.replace(/url\(['"]?\/fonts\/([^'"]+)['"]?\)/g, "url('fonts/$1')");
  processedCSS = processedCSS.replace(/url\(['"]?\.\.\/build\/fonts\/([^'"]+)['"]?\)/g, "url('fonts/$1')");
  processedCSS = processedCSS.replace(/url\(['"]?\.\.\/\.\.\/\.\.\/fonts\/([^'"]+)['"]?\)/g, "url('fonts/$1')");

  return processedCSS;
}

// Télécharger toutes les images externes du HTML
async function downloadExternalImages(html) {
  const imgRegex = /<img[^>]*src="(https?:\/\/[^"]+)"[^>]*>/g;
  const matches = [...html.matchAll(imgRegex)];

  if (matches.length === 0) return html;

  console.log(`📥 Téléchargement de ${matches.length} image(s) externe(s)...`);

  let processedHTML = html;
  let downloadedCount = 0;

  for (const match of matches) {
    const [fullMatch, url] = match;

    // Générer un nom de fichier depuis l'URL
    const urlObj = new URL(url);
    const filename = path.basename(urlObj.pathname) || `external_${downloadedCount}.png`;
    const outputPath = `images/${filename}`;

    const result = await downloadImage(url, outputPath);
    if (result) {
      processedHTML = processedHTML.replace(url, outputPath);
      // Remplacer aussi dans --HB_src si présent
      processedHTML = processedHTML.replace(`--HB_src:url(${url})`, `--HB_src:url('${outputPath}')`);
      downloadedCount++;
    }
  }

  console.log(`✓ ${downloadedCount} image(s) téléchargée(s)`);
  return processedHTML;
}

console.log('🔮 Conversion Homebrewery avec ressources externalisées...');

// Créer la structure de dossiers
fs.mkdirSync(outputDir, { recursive: true });

// Lire le markdown
const markdown = fs.readFileSync(inputFile, 'utf8');
console.log(`✓ Fichier chargé (${(markdown.length / 1024).toFixed(1)} KB)`);

// Copier toutes les ressources
console.log('📦 Copie des ressources...');
const fontsCount = copyFonts();
console.log(`✓ ${fontsCount} polices copiées`);

const imagesCount = copyImages();
console.log(`✓ ${imagesCount} images copiées`);

const masksCount = extractWaterColorMasks();
console.log(`✓ ${masksCount} waterColorMasks extraits`);

// Charger et traiter les CSS
console.log('🎨 Traitement des styles...');
let bundleCSS = fs.readFileSync(path.join(rootDir, 'assets/css/bundle.css'), 'utf8');
let themeCSS = fs.readFileSync(path.join(rootDir, 'assets/css/themes/V3/5ePHB/style.css'), 'utf8');
const imageMaskCSS = fs.readFileSync(path.join(rootDir, 'assets/themes/assets/imageMask.css'), 'utf8');

bundleCSS = fixCSSPaths(bundleCSS);
themeCSS = fixCSSPaths(themeCSS);

console.log('✓ Styles traités');

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

  // Extraire TOUS les imageMask (watercolor masks) pour les placer en dehors du columnWrapper
  // Ceci est CRITIQUE car les imageMask doivent être positionnés par rapport à .page, pas .columnWrapper
  let imageMaskBlocks = '';
  const imageMaskRegex = /<div class="block imageMask[^"]*"[^>]*>[\s\S]*?<\/div>/g;
  const imageMaskMatches = processedHTML.match(imageMaskRegex) || [];
  imageMaskMatches.forEach(block => {
    imageMaskBlocks += block + '\n';
    processedHTML = processedHTML.replace(block, '');
  });

  // Pour backCover, extraire les images avec position absolute pour les placer en dehors du columnWrapper
  let backCoverImages = '';
  if (hasBackCover) {
    const imgRegex = /<p>\s*<img[^>]*style="[^"]*position:\s*absolute[^"]*"[^>]*>\s*<\/p>/g;
    const matches = processedHTML.match(imgRegex) || [];
    matches.forEach(imgBlock => {
      const imgMatch = imgBlock.match(/<img[^>]*>/);
      if (imgMatch) {
        let img = imgMatch[0];
        const styleMatch = img.match(/style="([^"]*)"/);
        if (styleMatch) {
          let styles = styleMatch[1];
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

  // Supprimer les tags custom du HTML
  processedHTML = processedHTML.replace(/<span class="inline-block noFooter"><\/span>/g, '');
  processedHTML = processedHTML.replace(/<span class="inline-block darkLysander"><\/span>/g, '');
  processedHTML = processedHTML.replace(/<span class="inline-block lysanderCover"><\/span>/g, '');

  // Pour darkLysander, ajouter automatiquement l'image de fond
  let darkLysanderImages = '';
  if (hasDarkLysander) {
    const config = CUSTOM_TAG_IMAGES.darkLysander;
    darkLysanderImages = `<img style="${config.style}" src="${config.outputPath}" alt="${config.alt}">\n`;
  }

  // Pour lysanderCover, ajouter automatiquement l'image de couverture
  let lysanderCoverImages = '';
  if (hasLysanderCover) {
    const config = CUSTOM_TAG_IMAGES.lysanderCover;
    lysanderCoverImages = `<img style="${config.style}" src="${config.outputPath}" alt="${config.alt}">\n`;
  }

  // Ajouter les classes pour le fallback
  if (hasFrontCover) pageClasses += ' has-frontCover';
  if (hasInsideCover) pageClasses += ' has-insideCover';
  if (hasBackCover) pageClasses += ' has-backCover';
  if (hasPartCover) pageClasses += ' has-partCover';
  if (hasNoFooter) pageClasses += ' has-noFooter';
  if (hasDarkLysander) {
    pageClasses += ' darkLysander has-noFooter';
  }
  if (hasLysanderCover) {
    pageClasses += ' lysanderCover has-noFooter';
  }

  // Traiter les images avec position absolute
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
          const zIndex = hasBackCover ? '-2' : '-1';
          if (styles.includes('z-index')) {
            styles = styles.replace(/z-index\s*:\s*[^;]+/g, `z-index: ${zIndex}`);
          } else {
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
      ${imageMaskBlocks}
      <div class="columnWrapper">
        ${processedHTML}
      </div>
    </div>
  `;
}

// HTML complet
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

    /* Fonts */
    ${generateFontFaces()}

    /* Bundle CSS */
    ${bundleCSS}

    /* Theme CSS */
    ${themeCSS}

    /* ImageMask CSS */
    ${imageMaskCSS}

    /* Styles additionnels */
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

    .page:has(.frontCover) .columnWrapper,
    .page:has(.insideCover) .columnWrapper,
    .page:has(.backCover) .columnWrapper,
    .page:has(.partCover) .columnWrapper {
      column-count: 1;
      -webkit-column-count: 1;
      -moz-column-count: 1;
    }

    .page.has-frontCover .columnWrapper,
    .page.has-insideCover .columnWrapper,
    .page.has-backCover .columnWrapper,
    .page.has-partCover .columnWrapper {
      column-count: 1;
      -webkit-column-count: 1;
      -moz-column-count: 1;
    }

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

    .page:has(.backCover) {
      padding: 2.25cm 1.3cm 2cm 1.3cm;
      line-height: 1.4em;
      color: #FFFFFF;
      columns: 1;
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
      background-image: url('images/backCover.png');
      background-repeat: no-repeat;
      background-size: contain;
    }

    .page:has(.backCover) img[style*="position"] {
      z-index: -2 !important;
    }

    .page.has-backCover {
      padding: 2.25cm 1.3cm 2cm 1.3cm;
      line-height: 1.4em;
      color: #FFFFFF;
      columns: 1;
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
      background-image: url('images/backCover.png');
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
      background-image: url('images/partCoverHeaderPHB.png');
      background-repeat: no-repeat;
      background-size: 100%;
    }

    .page.has-frontCover .frontCover,
    .page.has-insideCover .insideCover {
      position: absolute;
      inset: 0;
      z-index: -1;
    }

    .page:has(.frontCover) img[style*="position"],
    .page:has(.insideCover) img[style*="position"],
    .page:has(.partCover) img[style*="position"] {
      z-index: 0 !important;
    }

    .page.has-noFooter::after {
      display: none !important;
    }

    .page.lysanderCover {
      position: relative;
      overflow: clip;
      width: 215.9mm;
      height: 279.4mm;
    }

    .page.lysanderCover::before {
      display: none !important;
    }

    .page.lysanderCover > img {
      position: absolute;
      top: 0;
      right: -20px;
      z-index: 0;
      width: 105%;
      height: 100%;
      object-fit: cover;
    }

    .page.lysanderCover .columnWrapper {
      position: relative;
      z-index: 10;
    }

    .page.darkLysander {
      position: relative;
      background: #0a0a0a !important;
      overflow: clip;
      width: 215.9mm;
      height: 279.4mm;
    }

    .page.darkLysander::before {
      display: none !important;
    }

    .page.darkLysander * {
      color: #E8E6E3;
      line-height: 1.4;
      font-size: 1.02em;
    }

    .page.darkLysander .columnWrapper {
      position: relative;
      z-index: 100 !important;
    }

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
      color: #6B0F1A;
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

    .page.darkLysander .columnWrapper > * {
      position: relative;
      z-index: 150 !important;
    }

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

    .page .wide,
    .page .block.wide {
      column-span: all !important;
      -webkit-column-span: all !important;
      -moz-column-span: all !important;
      display: block;
      width: 100%;
      margin-bottom: 1em;
    }

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
      background-image: url('images/horizontalRule.svg');
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

    @page {
      margin: 0;
      size: 215.9mm 279.4mm;
    }

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
  // Télécharger les images externes
  const finalHTML = await downloadExternalImages(fullHTML);

  // Écrire le fichier HTML
  fs.writeFileSync(outputFile, finalHTML);

  const outputSizeKB = (finalHTML.length / 1024).toFixed(1);
  console.log(`✅ Conversion terminée !`);
  console.log(`📄 Fichier créé : ${outputFile}`);
  console.log(`📏 Taille HTML : ${outputSizeKB} KB`);
  console.log(`📁 Ressources dans : ${outputDir}`);

  // Calculer la taille totale du dossier
  let totalSize = 0;
  const calcSize = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        calcSize(filePath);
      } else {
        totalSize += stats.size;
      }
    });
  };
  calcSize(outputDir);

  console.log(`📦 Taille totale : ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
}

// Lancer la conversion
main().catch(console.error);
