<script setup lang="ts">
import { useRouter } from 'vue-router'
import ScanLine from '@/components/ScanLine.vue'

const router = useRouter()
</script>

<template>
  <div class="cipher-grid">
    <div class="cipher-card" role="link" @click="router.push({ name: 'cryptotron-caesar' })">
      <ScanLine delay="-1s" />
      <h3>Caesar Cipher</h3>
      <p>
        One of the oldest known ciphers and simplest substitution cipher, used by Julius Caesar
        himself! Shift each letter by a fixed number of positions in the alphabet (e.g., ROT13).
      </p>
    </div>
    <div class="cipher-card">
      <h3>Rail-Fence Cipher</h3>
      <p>
        A transposition cipher from the 19th-century that writes the message in a zigzag pattern
        across multiple "rails", then reads off the ciphertext row by row. Simple yet effective!
      </p>
    </div>
    <div class="cipher-card" role="link" @click="router.push({ name: 'cryptotron-vigenere' })">
      <ScanLine delay="-3s" />
      <h3>Vigenère Cipher</h3>
      <p>
        A 16th-century polyalphabetic substitution cipher that resisted cracking for centuries! Uses
        a keyword to create multiple shifting alphabets, making it much harder to crack.
      </p>
    </div>
    <div class="cipher-card">
      <h3>Polybius Square</h3>
      <p>
        Invented by the ancient Greeks! A digraph substitution cipher that turn letters into
        coordinates using a 5×5 grid of letters (I and J share a cell) based on a keyword.
      </p>
    </div>
    <div class="cipher-card" role="link" @click="router.push({ name: 'cryptotron-builder' })">
      <ScanLine delay="-5s" />
      <h3>Interactive Cipher Chain Builder</h3>
      <p>
        Create visual encryption pipelines by connecting cipher blocks. Build complex multi-step
        sequences with Caesar, Vigenère, and other classical ciphers. Discover how combining
        different encryption methods strengthens security through hands-on experimentation.
      </p>
    </div>
  </div>
</template>

<style scoped>
.cipher-grid {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  place-content: center;
}

.cipher-card {
  flex: 1 0 29%;
  max-width: 600px;
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
