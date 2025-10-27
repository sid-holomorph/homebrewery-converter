# Homebrewery Converter

## Overview

**Homebrewery Converter** is a standalone Markdown-to-HTML conversion tool that transforms D&D 5e Homebrewery Markdown documents into fully-functional, portable HTML pages. It uses the official Homebrewery parser and complete D&D 5e styling system to create authentic-looking tabletop RPG content.

**Key Features:**
- Uses official Homebrewery markdown parser (`shared/naturalcrit/markdown.js`)
- Complete D&D 5e PHB styling with 16 authentic fonts
- Externalized resources (fonts, images, CSS) for reasonable file sizes
- Support for all Homebrewery extended syntax (variables, math, custom tags)
- Watercolor mask effects (62 masks: center, edge, corner)
- Automatic external image downloading
- Built-in PDF export via browser print
- CLI-based with optional file parameter

---

## Project Structure

```
homebrewery-converter/
├── src/
│   └── convert.mjs              # Main conversion script (1,292 lines)
├── shared/
│   ├── naturalcrit/
│   │   ├── markdown.js          # Homebrewery parser (904 lines)
│   │   └── markdownLegacy.js    # Legacy parser support
│   └── helpers.js               # Utility functions
├── assets/
│   ├── css/
│   │   ├── bundle.css           # Complete D&D 5e styling (301 KB)
│   │   └── themes/V3/5ePHB/     # PHB color theme (17.6 KB)
│   ├── fonts/5e/                # 16 D&D 5e fonts (woff2)
│   ├── images/                  # 25+ base images (borders, backgrounds)
│   ├── custom-tags/             # Custom Lysander images
│   └── themes/assets/
│       └── waterColorMasks/     # 62 watercolor effects (webp)
│           ├── center/
│           ├── edge/
│           └── corner/
├── input/                       # Source Markdown files
│   └── section_game.md
├── output/                      # Generated HTML (gitignored)
│   └── [document-name]/
│       ├── index.html           # Complete HTML document
│       ├── fonts/               # 16 fonts copied
│       └── images/              # All resources copied
├── package.json                 # Node dependencies
├── webpack.config.js            # Build configuration
├── CLAUDE.md                    # This file
├── README.md                    # User documentation
└── .gitignore
```

---

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/sid-holomorph/homebrewery-converter.git
cd homebrewery-converter

# Install dependencies
npm install
```

### Basic Usage

```bash
# Show help
node src/convert.mjs --help

# Convert default file (input/section_game.md)
node src/convert.mjs

# Convert a specific file
node src/convert.mjs input/my-document.md

# Convert with relative path
node src/convert.mjs ../another-file.md

# Convert with absolute path
node src/convert.mjs C:/docs/document.md
```

### Output

The converter creates a folder in `output/[document-name]/` containing:
- `index.html` - Complete HTML document (~676 KB)
- `fonts/` - All 16 D&D 5e fonts
- `images/` - All base images + downloaded external images

**Total output size:** ~19-50 MB depending on external images

---

## Conversion Process

### Pipeline Flow

```
1. READ MARKDOWN FILE
   ↓
2. SPLIT BY \page COMMAND
   ↓
3. FOR EACH PAGE:
   • Detect special tags ({{frontCover}}, {{imageMask}}, etc.)
   • Parse with Homebrewery markdown parser
   • Extract cover divs and imageMask divs
   • Handle absolute-positioned images
   • Wrap content in .page and .columnWrapper
   ↓
4. DETECT USED WATERCOLOR MASKS
   • Scan for imageMaskCenter[N], imageMaskEdge[N], imageMaskCorner[N]
   • Load only used masks from disk
   ↓
5. CONVERT MASKS TO BASE64
   • Convert WebP to base64 data URIs
   • Generate CSS variables (--mask-center-7, etc.)
   ↓
6. DOWNLOAD EXTERNAL IMAGES
   • Find all http(s) URLs in <img> tags
   • Download to output/images/
   • Replace URLs with local paths
   ↓
7. COPY LOCAL RESOURCES
   • Copy 16 fonts to output/fonts/
   • Copy 25+ base images to output/images/
   • Copy custom tag images if used
   ↓
8. GENERATE COMPLETE HTML
   • Inline <style> with all CSS (bundle + theme + imageMask)
   • All @font-face declarations
   • All pages with content
   • PDF export button + script
   ↓
9. WRITE OUTPUT FILE
   └→ output/[document-name]/index.html
```

### Performance

| Metric | Typical Value |
|--------|--------------|
| HTML file size | ~676 KB |
| Total output folder | ~19-50 MB |
| Number of fonts | 16 |
| Base images | 25+ |
| External images | Varies |
| Watercolor masks | 62 (only used ones embedded) |
| Page dimensions | 215.9mm × 279.4mm (US Letter) |
| Default columns | 2 |

---

## Supported Markdown Syntax

### Standard Markdown

```markdown
# Heading 1
## Heading 2
### Heading 3

**bold text**
*italic text*
***bold italic***
~~strikethrough~~

[link text](url)
![alt text](image-url)

- Unordered list
- Second item

1. Ordered list
2. Second item

> Blockquote

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
```

### Page & Column Control

```markdown
\page
\pagebreak
# New page starts here

Some content in left column

\column
\columnbreak

Content in right column

\page { class1 class2, color: red; }
# Styled page with custom classes and styles
```

### Special Cover Pages

```markdown
{{frontCover}}
# My Homebrew Adventure
___
## By Author Name

\page

{{insideCover}}
# Inside Cover Content

\page

{{backCover}}
# Credits
Text here appears in white on back cover

\page

{{partCover}}
# Part 1: Introduction
```

### Content Boxes

```markdown
{{note
This is a yellow note box with important information.
}}

{{descriptive
This is a tan descriptive box for flavor text.
}}

{{wide
This content spans both columns (full width).
}}

{{classTable
##### Class Features Table
| Level | Feature |
|-------|---------|
| 1st   | Feature |
}}
```

### Watercolor Effects

```markdown
{{imageMaskCenter7, --offsetX: 0%, --offsetY: 4%, --rotation: 0}}
### Content Here
Content surrounded by watercolor effect.
{{}}

{{imageMaskEdge12, --offsetX: -50%, --offsetY: 10%}}
Edge-placed watercolor mask.
{{}}

{{imageMaskCorner3}}
Corner-placed watercolor mask.
{{}}
```

**Available Masks:**
- `imageMaskCenter1` through `imageMaskCenter20+`
- `imageMaskEdge1` through `imageMaskEdge20+`
- `imageMaskCorner1` through `imageMaskCorner20+`

### Variables & Math

```markdown
[hp]: 50
[ac]: 15
[bonus]: = $[ac] - 10

Your AC is $[ac] and your bonus is $[bonus].
Your HP is [hp].

[damage]: = $[hp] * 2
Total damage: $[damage]

[roman]: = toRomans($[hp])
In Roman: [roman]

[words]: = toWords($[ac])
In words: [words]
```

**Math Functions:**
- `sign(a)` - Returns '+' or '-'
- `signed(a)` - Returns '+5' or '-3'
- `toRomans(a)` - Convert to Roman numerals (V, X, L)
- `toRomansLower(a)` - Lowercase Roman (v, x, l)
- `toChar(a)` - Convert to letters (1→A, 27→AA)
- `toWords(a)` - Convert to words (5→five)
- `toWordsCaps(a)` - Capitalize first letter (5→Five)

### Images & Positioning

```markdown
![Regular image](image-url)

![Absolute positioned](image-url){position:absolute,top:100px,left:50px,width:400px}

{{wide
![Full width image](image-url)
}}
```

### Custom Lysander Tags

```markdown
{{darkLysander}}
# Dark Themed Page
Content appears with dark background and special styling.

{{lysanderCover}}
# Cover Variant
Special layout for cover pages.
```

### Inline Styling

```markdown
{{color: red; font-size: 2em;}}
Large red text
{{}}

{{classname1 classname2}}
Content with CSS classes
{{}}

{{ =my-custom-id }}
Content with HTML ID
{{}}

{{data-custom: value, data-other: foo}}
Content with data attributes
{{}}
```

### Page Numbers & Footnotes

```markdown
{{pageNumber 1}}

{{footnote
Custom footer text here
}}

{{noFooter}}
Page without footer
```

### Definition Lists

```markdown
Term 1
: Definition of term 1
: Additional definition

Term 2
: Definition of term 2
```

### Text Formatting Extras

```markdown
Text^superscript^ and Text~subscript~

"Smart quotes" and 'smart apostrophes'

Em dashes — and en dashes –

Non-breaking&nbsp;spaces
```

---

## Technical Architecture

### Main Components

#### 1. Conversion Script (`src/convert.mjs`)

**Key Functions:**

| Function | Purpose |
|----------|---------|
| `copyFonts()` | Copy 16 D&D 5e fonts to output |
| `copyImages()` | Copy 25+ base images to output |
| `copyFile()` | Safe file copy with error handling |
| `downloadImage()` | Download external images with redirect support |
| `downloadExternalImages()` | Find and download all external images |
| `detectUsedMasks()` | Scan HTML for watercolor mask usage |
| `getMasksAsBase64()` | Convert used masks to base64 data URIs |
| `generateMaskVariables()` | Create CSS variables for masks |
| `generateFontFaces()` | Create @font-face declarations |
| `fixCSSPaths()` | Convert absolute to relative CSS paths |
| `main()` | Orchestrate entire conversion process |

**CLI Features:**
- Accepts optional file path parameter
- Validates .md extension
- Auto-generates output folder based on filename
- Shows help with `--help` or `-h`
- Default behavior when no parameter provided

#### 2. Markdown Parser (`shared/naturalcrit/markdown.js`)

**Extensions:**
- **Mustache Spans:** `{{ class }}...{{}}`
- **Mustache Divs:** Block-level custom containers
- **Variables:** `[var]: value` and `$[var]` substitution
- **Math:** Expression evaluation with custom functions
- **Column Breaks:** `\column` support
- **Image Styling:** Expose image URLs as CSS variables
- **Custom Renderers:** Paragraph, image, link handlers

**Parser Stack:**
- Base: `marked` (v15.0.12)
- Extensions:
  - `marked-extended-tables`
  - `marked-definition-lists`
  - `marked-alignment-paragraphs`
  - `marked-nonbreaking-spaces`
  - `marked-subsuper-text`
  - `marked-smartypants-lite`
  - `marked-gfm-heading-id`
  - `marked-emoji`
- Template Engine: `mustache`
- Math Engine: `expr-eval` + custom functions

### Asset Management

#### Fonts (`assets/fonts/5e/`)

| Font Family | Variants | Usage |
|-------------|----------|-------|
| **BookInsanity** | 4 (normal, bold, italic, bold-italic) | Body text |
| **Scaly Sans** | 4 (normal, bold, italic, bold-italic) | Headers, UI |
| **Scaly Sans Caps** | 1 | Small capitals |
| **Mr Eaves** | 1 | Section headers (serif) |
| **Solbera Imitation** | 1 | Decorative text |
| **Nodesto Caps** | 3 (condensed, condensed bold, wide) | Display text |
| **Overpass** | 1 | Alternative body text |
| **WalterTurncoat** | 1 | Script/signature style |

**Total:** 16 fonts in woff2 format

#### Images (`assets/images/`)

**Base UI Images (25+):**
- `parchmentBackground.jpg` - Main page background (174 KB)
- `parchmentBackgroundGrayscale.jpg` - B&W variant (164 KB)
- `backCover.png` - Back cover template (96 KB)
- `partCoverHeaderPHB.png` - Part cover header (168 KB)
- `PHB_footerAccent.png` - Footer decoration (7.6 KB)
- `horizontalRule.svg` - Divider lines (335 B)
- `monsterBorderFancy.png` - Stat block border (19 KB)
- `frameBorder.png`, `noteBorder.png`, `descriptiveBorder.png`
- `classTableDecoration.png`, `codeBorder.png`, `scriptBorder.png`
- And more...

**Custom Tags:**
- `darkLysander.png` - Dark background theme
- `lysanderCover.png` - Cover variant

#### Watercolor Masks

**Location:** `themes/assets/waterColorMasks/`

**Organization:**
```
waterColorMasks/
├── center/
│   ├── 0001.webp
│   ├── 0002.webp
│   └── ... (20+ masks)
├── edge/
│   ├── 0001.webp
│   ├── 0002.webp
│   └── ... (20+ masks)
└── corner/
    ├── 0001.webp
    ├── 0002.webp
    └── ... (20+ masks)
```

**Total:** 62 watercolor effect masks in WebP format

**Usage:**
```markdown
{{imageMaskCenter7, --offsetX: 0%, --offsetY: 4%}}
Content here
{{}}
```

**Optimization:** Only masks actually used in the document are embedded as base64 in the output HTML.

#### CSS Resources

| File | Size | Purpose |
|------|------|---------|
| `bundle.css` | 301 KB | Complete D&D 5e styling |
| `themes/V3/5ePHB/style.css` | 17.6 KB | PHB color theme variables |
| `themes/assets/imageMask.css` | - | Watercolor mask styling |

**Theme Variables:**
```css
--HB_Color_HeaderText: #58180D;
--HB_Color_HeaderUnderline: #C0AD6A;
--HB_Color_Footnotes: #996633;
--HB_Color_Accent1: #E69A28;
--HB_Color_Accent2: #FEFEFE;
```

### HTML Output Structure

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1000">
  <title>Homebrewery Document</title>

  <style>
    /* Mask Variables - only used masks */
    :root {
      --mask-center-7: url('data:image/webp;base64,...');
      --mask-edge-3: url('data:image/webp;base64,...');
    }

    /* Mask Classes */
    .page .imageMaskCenter7 { --wc: var(--mask-center-7); }
    .page .imageMaskEdge3 { --wc: var(--mask-edge-3); }

    /* Fonts - @font-face for all 16 fonts */
    @font-face {
      font-family: 'BookInsanityRemake';
      src: url('fonts/Bookinsanity.woff2') format('woff2');
    }
    /* ... 15 more fonts ... */

    /* bundle.css - 301 KB */
    /* theme CSS - 17.6 KB */
    /* imageMask CSS */

    /* Page layout */
    .page {
      position: relative;
      width: 215.9mm;
      height: 279.4mm;
      padding: 1.4cm 1.9cm 1.7cm;
      overflow: clip;
    }

    .columnWrapper {
      column-count: 2;
      column-width: 8cm;
      column-gap: .9cm;
      column-fill: auto;
    }

    /* Print styles */
    @media print {
      .page { page-break-after: always; }
      .columnWrapper { max-height: 24.5cm !important; }
    }
  </style>
</head>
<body>
  <button class="pdf-export-button" onclick="exportToPDF()">
    Exporter en PDF
  </button>

  <div class="brewRenderer">
    <div class="pages">
      <div class="page" id="p1">
        <div class="frontCover"></div>
        <div class="columnWrapper">
          <!-- Page 1 content -->
        </div>
      </div>

      <div class="page" id="p2">
        <div class="imageMaskCenter7"></div>
        <div class="columnWrapper">
          <!-- Page 2 content -->
        </div>
      </div>

      <!-- More pages... -->
    </div>
  </div>

  <script>
    function exportToPDF() {
      if (confirm('Instructions PDF...')) {
        window.print();
      }
    }
  </script>
</body>
</html>
```

---

## PDF Export

### Browser Print

The generated HTML includes a **"Exporter en PDF"** button that opens the browser print dialog.

**Recommended Settings:**
- **Destination:** Save as PDF / Microsoft Print to PDF
- **Paper size:** Letter (8.5" × 11")
- **Margins:** None
- **Scale:** Fit to page (or 100%)
- **Background graphics:** Enabled ✓
- **Headers/Footers:** Disabled

### Print CSS

The converter includes optimized `@media print` styles:
```css
@media print {
  .page {
    margin: 0 !important;
    page-break-after: always;
    overflow: hidden !important;
  }

  .columnWrapper {
    column-fill: auto !important;
    max-height: 24.5cm !important;
    overflow: hidden !important;
  }

  .page p, .page table, .page blockquote {
    page-break-inside: avoid;
  }

  /* Preserve colors */
  .page, .page * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}

@page {
  margin: 0;
  size: 215.9mm 279.4mm;
}
```

---

## Development

### Dependencies

**Core:**
- `marked` (v15.0.12) - Markdown parser
- `mustache` (v4.2.0) - Template engine
- `expr-eval` (v2.0.2) - Math evaluation
- `lodash` (v4.17.21) - Utilities

**Marked Extensions:**
- `marked-extended-tables`
- `marked-definition-lists`
- `marked-alignment-paragraphs`
- `marked-nonbreaking-spaces`
- `marked-subsuper-text`
- `marked-smartypants-lite`
- `marked-gfm-heading-id`
- `marked-emoji`

**Utilities:**
- `romans` - Roman numeral conversion
- `written-number` - Number to word conversion
- `dompurify` - HTML sanitization
- `jsdom` - DOM manipulation

**Build Tools:**
- `webpack` - Module bundler
- `@babel/core` - JavaScript transpiler
- `less` - CSS preprocessor

### Scripts

```json
{
  "main": "convert.mjs",
  "type": "module",
  "scripts": {
    "convert": "node convert.mjs"
  }
}
```

### Git Workflow

**Branches:**
- `master` - Main branch

**Recent Commits:**
```
80582c8 - Rename converter script and add CLI parameter support
86147a1 - Add column break for better layout formatting
0d335dc - Improve backcover style
6fa163c - Improve PDF export: fix column overflow, empty pages
3033649 - Add CSS support for \column Markdown command
e414f25 - Update .gitignore to ignore entire output/ folder
```

---

## Extending the Converter

### Adding New Fonts

1. Place font file in `assets/fonts/5e/`
2. Update `copyFonts()` function in `convert.mjs`:
   ```javascript
   const fonts = [
     'Bookinsanity.woff2',
     // ... existing fonts ...
     'NewFont.woff2'  // Add here
   ];
   ```
3. Add @font-face in `generateFontFaces()`:
   ```javascript
   'NewFont.woff2': {
     family: 'NewFontFamily',
     weight: 'normal',
     style: 'normal'
   }
   ```

### Adding New Custom Tags

1. Add image to `assets/custom-tags/`
2. Define in `CUSTOM_TAG_IMAGES` object:
   ```javascript
   newTag: {
     localPath: path.join(rootDir, 'assets', 'custom-tags', 'newTag.png'),
     outputPath: 'images/newTag.png',
     style: 'position:absolute; top:0; left:0;',
     alt: 'newTag background'
   }
   ```
3. Handle in page rendering loop (line ~390):
   ```javascript
   const hasNewTag = pageContent.includes('{{newTag}}');
   ```

### Adding New Themes

1. Create theme folder: `assets/css/themes/[name]/`
2. Add `style.css` with theme variables
3. Load in `convert.mjs`:
   ```javascript
   let themeCSS = fs.readFileSync(
     path.join(rootDir, 'assets/css/themes/[name]/style.css'),
     'utf8'
   );
   ```

### Extending Markdown Syntax

1. Edit `shared/naturalcrit/markdown.js`
2. Add custom tokenizer or renderer:
   ```javascript
   const customExtension = {
     name: 'customSyntax',
     level: 'inline',
     start(src) { /* ... */ },
     tokenizer(src, tokens) { /* ... */ },
     renderer(token) { /* ... */ }
   };

   Marked.use({ extensions: [customExtension] });
   ```

---

## Troubleshooting

### Issue: External images not loading

**Cause:** CORS restrictions or network issues

**Solution:** The converter automatically downloads external images during conversion. Ensure internet connectivity when running.

### Issue: Fonts not displaying correctly

**Cause:** Missing font files or incorrect paths

**Solution:**
1. Check `assets/fonts/5e/` contains all 16 fonts
2. Verify output folder has `fonts/` subdirectory
3. Check browser console for 404 errors

### Issue: Watercolor masks not showing

**Cause:** Missing mask files or incorrect class names

**Solution:**
1. Verify `themes/assets/waterColorMasks/` exists
2. Use correct syntax: `{{imageMaskCenter7}}` (with number)
3. Check console for mask detection logs

### Issue: PDF export has incorrect scaling

**Cause:** Browser print settings

**Solution:**
1. Set margins to "None"
2. Use "Fit to page" or 100% scale
3. Enable "Background graphics"
4. Select Letter (8.5" × 11") paper size

### Issue: Column breaks not working

**Cause:** Using `\page` instead of `\column`

**Solution:** Use `\column` or `\columnbreak` for column breaks (not page breaks)

---

## License

This project uses code from **The Homebrewery**, which is distributed under the MIT License.

---

## Credits

- **The Homebrewery Team** - Original markdown parser and styling system
- **Natural Critical** - Homebrewery web application
- **D&D Fonts** - Community-created authentic D&D typography
- **Watercolor Masks** - Community-contributed artistic effects

---

## Additional Resources

### Homebrewery Resources

- **Official Website:** https://homebrewery.naturalcrit.com
- **GitHub Repository:** https://github.com/naturalcrit/homebrewery
- **Documentation:** Homebrewery built-in documentation
- **Community:** r/UnearthedArcana (Reddit)

### D&D Resources

- **SRD Content:** https://dnd.wizards.com/resources/systems-reference-document
- **5e OGL:** Open Game License content

### Development

- **Node.js:** https://nodejs.org
- **Marked.js:** https://marked.js.org
- **Webpack:** https://webpack.js.org

---

## Changelog

### v2.0.0 (2025-01-27)
- Renamed `convert-standalone.mjs` to `convert.mjs`
- Added CLI parameter support for input file path
- Added `--help` / `-h` flag with usage instructions
- Auto-generate output directory based on input filename
- Validate input file exists and has .md extension
- Keep default behavior when no parameter provided

### v1.5.0
- Add column break support with `\column` command
- Improve backcover styling
- Fix PDF export: column overflow, empty pages, footer position
- Update .gitignore to ignore entire output/ folder

### v1.4.0
- Fix watercolor masks: use base64 for CORS, numbered masks only
- Refactor: externalize all resources (images/fonts/masks)
- Restructure project for better organization

### v1.3.0
- Add custom Lysander tags (darkLysander, lysanderCover)
- Add noFooter tag support
- Improve page number handling
- Add complete imageMask support with 62 watercolor masks

### v1.2.0
- Add wide content support
- Fix image positioning on insideCovers
- Improve nominal image handling

### v1.0.0
- Initial release
- Complete Homebrewery markdown parser integration
- D&D 5e PHB styling
- External resource management
- PDF export functionality

---

## Contact & Support

For issues, feature requests, or contributions:
- **GitHub Issues:** https://github.com/sid-holomorph/homebrewery-converter/issues
- **Pull Requests:** Welcome!

---

## Example Markdown

```markdown
{{frontCover}}
# The Dark Prophecy
## A D&D 5e Adventure
___
*For characters of 5th to 10th level*

By Your Name Here

\page

{{insideCover}}

# Credits

**Writing and Design:** Your Name
**Cover Art:** Artist Name
**Interior Art:** Various Artists

**Playtesting:** Playtest Group

\page

# Chapter 1: Introduction

{{note
##### DM Note
This adventure is designed for a party of 4-6 characters of 5th to 10th level.
}}

{{wide
## Adventure Background
Long ago, a powerful wizard named Valdrik...
}}

___

## Getting Started

The adventure begins when the characters arrive in the town of...

{{descriptive
You see a bustling marketplace filled with merchants selling exotic wares...
}}

\column

## Adventure Hooks

Choose one of the following hooks:

1. **The Missing Merchant**
2. **Strange Dreams**
3. **A Royal Summons**

\page

{{imageMaskCenter7, --offsetX: 0%, --offsetY: 4%}}
### The Ancient Temple

As you approach the temple ruins, you notice strange symbols...

{{note
##### Investigation Check
A character who succeeds on a DC 15 Intelligence (Investigation) check recognizes these symbols as ancient draconic runes.
}}
{{}}

\page

{{backCover}}

# The Dark Prophecy

*An adventure of mystery and danger for characters of 5th to 10th level*

___

![Decorative image](https://example.com/image.png){position:absolute,bottom:0,left:0,width:100%}

Visit our website for more adventures!
www.example.com
```

This markdown would generate a professional-looking D&D adventure with:
- Front cover page
- Inside cover with credits
- Multiple content pages with two-column layout
- Note boxes and descriptive text
- Watercolor effects
- Back cover with custom styling
