<template>
  <main>
    <div class="about-hero">
      <h1 class="page-title">About CryptoTron</h1>
      <p class="hero-subtitle">Decrypt the Past • Encrypt the Future</p>
      <p class="hero-description">
        Welcome to CryptoTron, a cyberpunk-themed digital laboratory where the ancient art of cryptography meets
        cutting-edge web technology. Journey through the shadows of history's most ingenious codes and ciphers, from
        Caesar's battlefield communications to the sophisticated polyalphabetic puzzles that stumped codebreakers for
        centuries.
      </p>
    </div>

    <div class="about-grid">
      <div class="about-card">
        <h2 class="card-title">Mission Statement</h2>
        <div class="card-content">
          <p>CryptoTron exists to bridge the gap between <span class="highlight">historical cryptography</span> and
            modern digital literacy. Because understanding the evolution of secret communication is crucial to
            comprehending today's cybersecurity landscape.</p>

          <p>The mission is to make classical cryptography <span class="highlight">accessible, interactive, and
              engaging</span> for students, educators, security enthusiasts, and anyone curious about the hidden
            language of codes.</p>
        </div>
      </div>

      <div class="about-card">
        <h2 class="card-title">What You'll Find</h2>
        <div class="card-content">
          <ul class="feature-list">
            <li>Interactive cipher implementations with real-time encoding/decoding</li>
            <li>Comprehensive historical context and mathematical foundations</li>
            <li>Visual demonstrations of cryptanalysis techniques</li>
            <li>Detailed explanations of cipher strengths and vulnerabilities</li>
          </ul>
        </div>
      </div>

      <div class="about-card">
        <h2 class="card-title">Why Classical Ciphers Matter</h2>
        <div class="card-content">
          <p>While modern encryption relies on complex mathematical algorithms, classical ciphers provide the <span
              class="highlight">fundamental building blocks</span> of cryptographic thinking. They teach us about:</p>

          <p>Pattern recognition, frequency analysis, key management, and the eternal arms race between codemakers and
            codebreakers. Understanding these principles is essential for anyone working in cybersecurity, digital
            privacy, or information systems.</p>

          <div class="quote-box">
            The best way to understand modern cryptography is to first master its ancient ancestors.
          </div>
        </div>
      </div>

      <div class="about-card">
        <h2 class="card-title">Design Philosophy</h2>
        <div class="card-content">
          <p>CryptoTron embraces a <span class="highlight">cyberpunk aesthetic</span> that reflects the underground
            nature of cryptography throughout history. The neon-soaked interface pays homage to the digital
            revolutionaries and cypherpunks who fought for encryption rights.</p>

          <p>The retro-futuristic design language symbolizes the timeless nature of cryptographic principles - ancient
            wisdom presented through a lens of technological advancement.</p>
        </div>
      </div>

      <div class="about-card full-width-card">
        <h2 class="card-title">Technology Stack</h2>
        <div class="card-content">
          <p>CryptoTron is built using cutting-edge web technologies to ensure a smooth, responsive experience across
            all devices:</p>
          <div class="tech-grid">
            <div class="tech-badge">Vue.js 3</div>
            <div class="tech-badge">Modern CSS</div>
            <div class="tech-badge">JavaScript ES6+</div>
            <div class="tech-badge">Responsive Design</div>
            <div class="tech-badge">Web Animations</div>
            <div class="tech-badge">Progressive Enhancement</div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
}

.page-title {
  font-family: 'Orbitron', monospace;
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(45deg, var(--neon-green), var(--neon-cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(0, 255, 65, 0.3);
}

.about-hero {
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-top: 1rem;
  font-style: italic;
}

.hero-description {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-top: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.8;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.about-card {
  background: var(--cryptotron-card-bg);
  border: 1px solid var(--cryptotron-border-glow);
  border-radius: 12px;
  padding: 2rem;
  backdrop-filter: blur(5px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.about-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--neon-cyan), var(--neon-magenta), var(--neon-green));
  animation: borderFlow 3s linear infinite;
}

@keyframes borderFlow {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

.card-title {
  font-family: 'Orbitron', monospace;
  font-size: 1.5rem;
  color: var(--neon-cyan);
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.card-content {
  line-height: 1.8;
  color: var(--cryptotron-text-secondary);
}

.card-content p {
  margin-bottom: 1rem;
}

.highlight {
  color: var(--neon-green);
  font-weight: 700;
}

.feature-list {
  list-style: none;
  padding: 0;
}

.feature-list li {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 0.8rem;
  color: var(--cryptotron-text-secondary);
}

.feature-list li::before {
  content: '▶';
  position: absolute;
  left: 0;
  color: var(--neon-green);
  font-size: 0.8rem;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.tech-badge {
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  font-family: 'Orbitron', monospace;
  color: var(--neon-cyan);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.tech-badge:hover {
  background: rgba(0, 255, 255, 0.2);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
}

.full-width-card {
  grid-column: 1 / -1;
}

.quote-box {
  background: rgba(0, 255, 65, 0.05);
  border-left: 4px solid var(--neon-green);
  padding: 1.5rem;
  margin: 2rem 0;
  border-radius: 0 8px 8px 0;
  font-style: italic;
  color: var(--text-primary);
  position: relative;
}

.quote-box::before {
  content: '"';
  position: absolute;
  top: -0.5rem;
  left: 1rem;
  font-size: 3rem;
  color: var(--neon-green);
  font-family: 'Orbitron', monospace;
}
</style>
