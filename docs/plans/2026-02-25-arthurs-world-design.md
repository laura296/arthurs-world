# Arthur's World — Design Document

## Overview
A React PWA built for Arthur (age 2.5) to use on an iPad. Comic-book maximalist aesthetic with dark starfield backgrounds, bold colours, bouncy animations, and zero reading required.

## Stack
Vite + React 18 + Tailwind CSS + React Router v6 (hash) + vite-plugin-pwa + gh-pages

## Architecture
- Single-page app, hash routing (GitHub Pages compatible)
- Lazy-loaded game routes
- No backend, no external APIs, no audio files
- Web Audio API for all sounds, Web Speech API for narration
- Shared `useCanvas` hook for canvas-based games

## Screens
1. **ModePicker** — Two giant tiles: Quiet (navy) and Noisy (ember red)
2. **GameGrid** — 2-column card grid filtered by mode
3. **Games** — 8 unique games (BubblePop, FeedAnimals, PopCritters, Colouring, Music, MemoryGame, FarmBook) + YouTube Kids link

## Toddler UX
- All tap targets >= 80px
- No text instructions — emoji + motion + size only
- Zoom/selection/tap-highlight disabled
- Fonts: Fredoka One (headings), Baloo 2 (body)

## PWA
- generateSW strategy, standalone display
- Offline caching for all game routes

## Deploy
- GitHub Pages at /arthurs-world/
- Auto-deploy via GitHub Actions on push to main
