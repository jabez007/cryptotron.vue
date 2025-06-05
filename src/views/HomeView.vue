<script setup lang="ts">

</script>

<template>
  <div class="cipher-grid">
    <div class="cipher-card">
      <h3>Caesar Cipher</h3>
      <p>The simplest substitution cipher, used by Julius Caesar himself. Shift each letter by a fixed number of
        positions in the alphabet.</p>
    </div>
    <div class="cipher-card">
      <h3>Vigenère Cipher</h3>
      <p>A polyalphabetic substitution cipher that uses a keyword to create multiple Caesar shifts, making it much
        harder to crack.</p>
    </div>
    <div class="cipher-card">
      <h3>Polybius Square</h3>
      <p>A digraph substitution cipher that encrypts pairs of letters using a 5×5 grid of letters based on a
        keyword.</p>
    </div>
  </div>
</template>

<style scoped>
.cipher-grid {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
}

.cipher-card {
  flex: 1 0 29%;
  margin: 2rem;
  background: var(--cryptotron-card-bg);
  border: 1px solid var(--cryptotron-border-glow);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.cipher-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 255, 255, 0.2);
}

.cipher-card h3 {
  font-family: 'Orbitron', monospace;
  color: var(--neon-cyan);
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.cipher-card p {
  color: var(--text-secondary);
  line-height: 1.6;
}
</style>
