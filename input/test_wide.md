# Test de la balise wide

Ce texte est en colonnes normales (2 colonnes).

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Section en colonnes normales

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

{{wide
## Section qui s'étend sur toute la largeur

Ce texte devrait s'étendre sur toute la largeur de la page, sans colonnes.

| Classe | Niveau | DV | Bonus de maîtrise |
|--------|--------|----|--------------------|
| Barbare | 1 | d12 | +2 |
| Barde | 1 | d8 | +2 |
| Clerc | 1 | d8 | +2 |
| Druide | 1 | d8 | +2 |
| Ensorceleur | 1 | d6 | +2 |
| Guerrier | 1 | d10 | +2 |
| Magicien | 1 | d6 | +2 |
| Moine | 1 | d8 | +2 |
| Paladin | 1 | d10 | +2 |
| Rôdeur | 1 | d10 | +2 |
| Roublard | 1 | d8 | +2 |
| Sorcier | 1 | d8 | +2 |
}}

## Retour aux colonnes normales

Après la section wide, on revient aux colonnes normales. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

### Test avec une note wide

{{wide
{{note
#### Note importante sur toute la largeur

Cette note devrait s'étendre sur toute la largeur de la page. C'est utile pour les informations importantes qui nécessitent plus d'espace horizontal.

- Point important 1
- Point important 2
- Point important 3
}}
}}

### Test avec un stat block wide

{{wide
{{monster,frame
## Dragon Rouge Ancien
*Dragon de taille Gigantesque, chaotique mauvais*
___
**Classe d'armure** 22 (armure naturelle)
**Points de vie** 546 (28d20 + 252)
**Vitesse** 12 m, escalade 12 m, vol 24 m

___
|FOR|DEX|CON|INT|SAG|CHA|
|:---:|:---:|:---:|:---:|:---:|:---:|
|30 (+10)|10 (+0)|29 (+9)|18 (+4)|15 (+2)|23 (+6)|
___
**Sauvegardes** Dex +7, Con +16, Sag +9, Cha +13
**Compétences** Discrétion +7, Perception +16
**Immunités** feu
**Sens** vision aveugle 18 m, vision dans le noir 36 m, Perception passive 26
**Langues** commun, draconique
**Facteur de puissance** 24 (62,000 XP)
___
***Résistance légendaire (3/jour).*** Si le dragon rate un jet de sauvegarde, il peut choisir de le réussir à la place.
}}
}}

Texte normal en deux colonnes après les sections wide.