# Vue-Stealth-Interact 🥷

A zero-dependency, lightweight utility designed to penetrate and interact with Vue.js (Vue 2 & Vue 3) component internals from the outside. 

## The Problem It Solves
When writing E2E tests (Puppeteer, Playwright) or RPA automation for complex SPAs built with UI frameworks like Element-UI, standard DOM clicks often fail due to:
1. Virtual DOM event delegation blocking raw physical clicks.
2. Elements being hidden behind transparent overlays (`pointer-events: none`).
3. Need to directly access the internal Axios/HTTP client holding dynamic auth tokens.

## Core Capabilities
- **Direct Event Injection:** Bypasses DOM overlay limitations and invokes internal component methods (e.g., forcing an `el-select` option click).
- **Instance Hijacking:** Recursively scans the DOM to extract the hidden `__vue__` / `__vue_app__` context, granting access to internal state and global HTTP clients.

## Usage
Simply inject this script into your headless browser or Tampermonkey context.
