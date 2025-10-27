The Homebrewery
Homebrewery

The Homebrewery is a tool for making authentic looking D&D content using Markdown. It is distributed under the terms of the MIT License.

Quick Start
The easiest way to get started using The Homebrewery is to use it on our website. The code is open source, so feel free to clone it and tinker with it. If you want to make changes to the code, you can run your own local version for testing by following the installation instructions below.

Installation
First, install three programs that The Homebrewery requires to run and retrieve updates:

install node, version v16 or higher.

install mongodb (Community version)

For the easiest installation, follow these steps:

In the installer, uncheck the option to run as a service.
You can install MongoDB Compass if you want a GUI to view your database documents.
If you install any version over 6.0, you will have to install MongoDB Shell.
Go to the C:\ drive and create a folder called "data".
Inside the "data" folder, create a new folder called "db".
Open a command prompt or other terminal and navigate to your MongoDB install folder (C:\Program Files\Mongo\Server\6.0\bin).
In the command prompt, run "mongod", which will start up your local database server.
While MongoD is running, open a second command prompt and navigate to the MongoDB install folder.
Search in Windows for "Advanced system settings" and open it.
Click "Environment variables", find the "path" variable, and double-click to open it.
Click "New" and paste in the path to the MongoDB "bin" folder.
Click "OK" three times to close all the windows.
In the second command prompt, run "mongo", which allows you to edit the database.
Type use homebrewery to create The Homebrewery database. You should see switched to db homebrewery.
Type db.brews.insertOne({"title":"test"}) to create a blank document. You should see { acknowledged: true, insertedId: ObjectId("63c2fce9e5ac5a94fe2410cf") }
install git (select the option that allows Git to run from the command prompt).

Checkout the repo (documentation):

git clone https://github.com/naturalcrit/homebrewery.git
Second, you will need to add the environment variable NODE_ENV=local to allow the project to run locally.

You can set this temporarily (until you close the terminal) in your shell of choice with admin privileges:

Windows Powershell: $env:NODE_ENV="local"
Windows CMD: set NODE_ENV=local
Linux / macOS: export NODE_ENV=local
If you want to add this variable permanently the steps are as follows: 1. Search in Windows for "Advanced system settings" and open it. 1. Click "Environment variables". 1. In System Variables, click "New" 1. Click "New" and write NODE_ENV as a name and local as the value. 1. Click "OK" three times to close all the windows. This can be undone at any time if needed.

Third, you will need to install the Node dependencies, compile the app, and run it using the two commands:

npm install
npm start
You should now be able to go to http://localhost:8000 in your browser and use The Homebrewery offline.

## Projet de conversion Markdown vers HTML

Ce projet inclut un script de conversion autonome (`convert-standalone.mjs`) qui permet de transformer des fichiers Markdown au format Homebrewery en documents HTML statiques.

### Objectif
Convertisseur MD vers HTML utilisant la codebase de Homebrewery pour :
- Utiliser le parser Markdown officiel de Homebrewery
- Intégrer les polices et styles 5e D&D
- Générer des documents HTML autonomes avec toutes les ressources embarquées en base64
- Supporter les syntaxes spéciales Homebrewery (mustache tags, styles custom, etc.)
- Support des tags custom pour Lysander (darkLysander, lysanderCover)

### Structure du projet
```
homebrewery-converter/
├── src/                       # Scripts de conversion
│   ├── convert-standalone.mjs # Conversion avec ressources base64 embarquées
│   └── convert.mjs            # Conversion avec liens relatifs vers ressources
├── assets/                    # TOUTES les ressources
│   ├── css/                   # Styles compilés (bundle.css, themes)
│   ├── fonts/                 # Polices D&D 5e (woff2)
│   ├── images/                # Images et décorations (PNG, JPG, SVG)
│   ├── themes/                # Thèmes Homebrewery
│   └── custom-tags/           # Images custom Lysander
├── shared/                    # Code partagé (parser Markdown)
├── input/                     # Fichiers Markdown sources
│   └── section_game.md
└── output/                    # Fichiers HTML générés uniquement
    └── section_game_standalone.html
```

### Utilisation
```bash
# Conversion (ressources copiées vers output/[nom]/)
node src/convert-standalone.mjs
```

Le script convertit `input/section_game.md` en `output/section_game/` avec :
- HTML ultra-léger (~455 KB au lieu de 99 MB avec base64)
- Toutes les polices D&D 5e copiées dans fonts/5e/ (16 polices)
- Toutes les images copiées dans images/ (16 images de base + images externes)
- 63 waterColorMasks copiés dans images/waterColorMasks/ (edge/center/corner)
- Les styles CSS de Homebrewery (bundle.css + theme V3 5ePHB)
- Support complet de la syntaxe Markdown étendue
- Images externes automatiquement téléchargées et sauvegardées (27 images)
- Document 100% portable (dossier autonome de 19 MB avec toutes ressources)

### Fonctionnalités
- **Conversion Markdown → HTML** avec le parser officiel Homebrewery
- **Gestion des pages** : `\page` ou `\pagebreak` pour créer des pages
- **Tags spéciaux** : `{{frontCover}}`, `{{backCover}}`, `{{partCover}}`, `{{insideCover}}`, `{{noFooter}}`
- **Tags custom Lysander** : `{{darkLysander}}`, `{{lysanderCover}}`
- **Images absolues** : Support des images avec `position: absolute` pour placements personnalisés
- **Export PDF** : Bouton intégré pour exporter via impression navigateur
- **Masques watercolor** : Support des imageMask pour effets aquarelle