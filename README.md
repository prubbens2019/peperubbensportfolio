# peperubbens.nl

Portfolio-website van Pep Rubbens. De content komt volledig uit de `/content`-mappenstructuur (Markdown + JSON + afbeeldingen) en wordt bij elke build ingelezen — geen database.

## Lokaal draaien

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content beheren

- Nieuwe projecten: maak een map aan in `content/projects/<slug>/` met `project.json`, `content.md`, een `banner/`-map en optioneel een `bijfoto/`-map (2+ foto's = automatische carousel).
- Categorieën: `content/categories/<slug>/meta.json`.
- Algemene site-info: `content/config/site.json`, `content/config/categories.json`, `content/config/subportfolios.json`.

## Pepbackend

`/pepbackend` is een lokale, wachtwoord-beveiligde beheeromgeving om projecten/categorieën te tonen of verbergen, sub-portfolio's samen te stellen en content te vertalen naar het Engels. Kopieer `.env.local.example` naar `.env.local` en vul de waarden in om 'm te gebruiken. Alleen lokaal bedoeld (`npm run dev`) — wijzigingen schrijven direct naar `/content`; commit en push zelf om ze live te zetten.

## Deployen

Gekoppeld aan Vercel: elke push naar `main` triggert een nieuwe deploy.
