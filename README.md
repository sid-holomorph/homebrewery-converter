# Homebrewery Converter - Version Standalone

Convertisseur Markdown vers HTML utilisant le parser officiel de Homebrewery pour créer des documents D&D 5e authentiques.

## Installation

```bash
npm install
```

## Utilisation

1. Placez vos fichiers Markdown dans le dossier `input/`
2. Lancez la conversion:

```bash
npm run convert
# ou directement
node convert-homebrewery-complete.mjs
```

3. Le fichier HTML sera généré dans le dossier `output/`

## Structure du projet

```
homebrewery-converter/
├── convert-homebrewery-complete.mjs   # Script principal
├── input/                             # Dossier pour les fichiers Markdown
│   └── section_game.md                # Fichier d'exemple
├── output/                            # Dossier de sortie (créé automatiquement)
│   └── section_game_complete.html    # Fichier généré
├── shared/                            # Parser Homebrewery
├── themes/                            # Polices et assets D&D 5e
├── build/                             # CSS compilés
└── package.json                       # Dépendances
```

## Fonctionnalités

- ✅ Parser Markdown officiel de Homebrewery
- ✅ Toutes les polices D&D 5e intégrées
- ✅ Fond parchemin authentique
- ✅ Support complet de la syntaxe Homebrewery (mustache tags, styles custom, etc.)
- ✅ HTML autonome généré (pas besoin d'Internet)

## Sortie

Le fichier HTML généré contient toutes les ressources nécessaires en base64 et peut être ouvert directement dans un navigateur sans serveur web.