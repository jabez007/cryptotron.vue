# 🔐 CryptoTron Vue

> **Decrypt the Past • Encrypt the Future**

CryptoTron is an interactive, cyberpunk-themed digital laboratory for exploring and visualizing classical cryptography. Built with Vue 3 and powered by the `@jabez007/cryptotron.js` library, it offers a hands-on experience with history's most famous codes and ciphers.

---

## ✨ Features

*   **Interactive Cipher Suite:** Explore detailed implementations of Caesar, Vigenère, Polybius, Rail-Fence, and more.
*   **Visual Cipher Chain Builder:** Design complex encryption pipelines visually using a node-based graph interface.
*   **Cryptanalysis Tools:** Integrated "Crack" functionality for most ciphers using frequency analysis and brute-force techniques.
*   **Cyber-Terminal Interface:** Immersive UI with CRT screen effects, scanlines, and a Vim-style modal navigation system.
*   **Educational Content:** Comprehensive "Theory & History" mini-lessons for every cryptographic method.

---

## ⌨️ Keyboard-Driven Navigation (Terminal Mode)

CryptoTron is designed to be operated like a high-tech terminal. Use the following shortcuts to navigate efficiently:

### 🏠 Global Shortcuts
*   `Alt + H` or `Esc`: Return to Home
*   `Alt + B`: Open Visual Builder
*   `Alt + M`: Toggle Sidebar Menu
*   `Alt + T`: Toggle CRT Effects (Cyber/Clean Mode)

### 📟 Sidebar Menu (When Open)
*   `Arrow Up / Down`: Navigate list
*   `Enter`: Select Page

### 🔒 Cipher Pages (Vim Mode)
*   `Normal Mode` (Default):
    *   `i`: Enter **Insert Mode** (type message)
    *   `k`: Enter **Key Mode** (edit cipher settings)
    *   `1, 2, 3`: Switch between Theory, Encrypt, and Decrypt tabs
    *   `e`: Trigger Encrypt
    *   `d`: Trigger Decrypt
    *   `c`: Trigger Crack (Cryptanalysis)
    *   `y`: Yank (Copy) output to clipboard
    *   `x`: Clear active tab
*   `Insert / Key Mode`:
    *   `Esc`: Return to **Normal Mode**

---

## 🛠️ Supported Ciphers

| Category | Ciphers |
| :--- | :--- |
| **Substitution** | Caesar, Affine, Simple Substitution |
| **Polyalphabetic** | Vigenère, Autokey, Beaufort |
| **Grid & Fractionation** | Polybius Square |
| **Transposition** | Rail-Fence |

---

## 🚀 Tech Stack

*   **Framework:** Vue 3 (Composition API) + TypeScript
*   **Build Tool:** Vite
*   **Graph Engine:** @vue-flow/core
*   **Logic Engine:** @jabez007/cryptotron.js
*   **Styling:** Modern Vanilla CSS (Cyberpunk Theme)

---

## 📦 Project Setup

### Installation
```sh
npm install
```

### Development (Hot-Reload)
```sh
npm run dev
```

### Build (Production)
```sh
npm run build
```

### Linting
```sh
npm run lint
```

---

## ⚠️ Disclaimer

This application is for **educational and demonstration purposes only**. The ciphers implemented here are classical and insecure by modern standards. Do not use this software for protecting sensitive or private information.
