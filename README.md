# Taliby TOURE — Portfolio

Portfolio personnel développé en HTML5, CSS3 et JavaScript vanilla — sans framework, sans dépendance.

---

## Aperçu

Site statique single-page avec :

- **Hero** — présentation courte et accroche
- **À propos** — photo de profil et description
- **Projets** — grille de cartes avec stack technique
- **Contact** — formulaire de contact
- **Mode sombre / clair** — basculement avec persistance `localStorage`
- **Navigation responsive** — menu hamburger sur mobile

---

## Stack technique

| Technologie | Usage |
|---|---|
| HTML5 | Structure sémantique |
| CSS3 | Mise en page, custom properties, responsive |
| JavaScript vanilla | Interactions, thème, navigation |

Aucun framework, aucune dépendance, aucun bundler.

---

## Structure

```
MonPortfolio/
├── index.html          # Point d'entrée
├── css/
│   └── style.css       # Tous les styles
├── js/
│   └── main.js         # Tous les scripts
└── assets/
    ├── images/         # Photos, captures de projets
    └── icons/          # SVG, favicon
```

---

## Lancer en local

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```

Ouvrir ensuite [http://localhost:8080](http://localhost:8080).

---

*Construit avec [Claude Code](https://claude.ai/code).*
