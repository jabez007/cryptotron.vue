import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KeyPlayfair from '@/components/keys/KeyPlayfair.vue'

describe('KeyPlayfair', () => {
  // ─── rendering ─────────────────────────────────────────────────────────────

  it('renders a text input', () => {
    const wrapper = mount(KeyPlayfair, {
      props: { cipherKey: { keyword: 'MONARCHY' } },
    })
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
  })

  it('renders the keyword label', () => {
    const wrapper = mount(KeyPlayfair, {
      props: { cipherKey: { keyword: 'MONARCHY' } },
    })
    expect(wrapper.text()).toContain('Keyword')
  })

  it('shows placeholder "e.g. MONARCHY"', () => {
    const wrapper = mount(KeyPlayfair, {
      props: { cipherKey: { keyword: 'MONARCHY' } },
    })
    const input = wrapper.find('input[type="text"]')
    expect(input.attributes('placeholder')).toBe('e.g. MONARCHY')
  })

  // ─── default props ──────────────────────────────────────────────────────────

  it('uses "PLAYFAIR" as the default keyword when no prop is supplied', () => {
    const wrapper = mount(KeyPlayfair)
    const input = wrapper.find('input[type="text"]')
    expect((input.element as HTMLInputElement).value).toBe('PLAYFAIR')
  })

  it('binds the provided cipherKey.keyword to the input', () => {
    const wrapper = mount(KeyPlayfair, {
      props: { cipherKey: { keyword: 'MONARCHY' } },
    })
    const input = wrapper.find('input[type="text"]')
    expect((input.element as HTMLInputElement).value).toBe('MONARCHY')
  })

  // ─── validation – valid values ──────────────────────────────────────────────

  it('does not show errors for a valid keyword', async () => {
    const wrapper = mount(KeyPlayfair, {
      props: { cipherKey: { keyword: 'MONARCHY' } },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.error-messages').exists()).toBe(false)
  })

  it('accepts lowercase letters as a valid keyword', async () => {
    const wrapper = mount(KeyPlayfair, {
      props: { cipherKey: { keyword: 'monarchy' } },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.error-messages').exists()).toBe(false)
  })

  it('accepts a single letter as a valid keyword (no minLength restriction)', async () => {
    // KeyPlayfair only has required + pattern, no minLength
    const wrapper = mount(KeyPlayfair, {
      props: { cipherKey: { keyword: 'A' } },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.error-messages').exists()).toBe(false)
  })

  it('emits update:cipherKey when a valid keyword is set', async () => {
    const wrapper = mount(KeyPlayfair, {
      props: { cipherKey: { keyword: 'MONARCHY' } },
    })
    const input = wrapper.find('input[type="text"]')
    await input.setValue('PLAYFAIR')
    await wrapper.vm.$nextTick()
    const emitted = wrapper.emitted('update:cipherKey')
    expect(emitted).toBeTruthy()
    expect(emitted![emitted!.length - 1]).toEqual([{ keyword: 'PLAYFAIR' }])
  })

  // ─── validation – invalid values ───────────────────────────────────────────

  it('shows error when keyword is empty', async () => {
    const wrapper = mount(KeyPlayfair, {
      props: { cipherKey: { keyword: '' } },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.error-messages').exists()).toBe(true)
    expect(wrapper.text()).toContain('required')
  })

  it('shows error when keyword contains digits', async () => {
    const wrapper = mount(KeyPlayfair, {
      props: { cipherKey: { keyword: 'KEY123' } },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.error-messages').exists()).toBe(true)
    expect(wrapper.text()).toContain('only letters')
  })

  it('shows error when keyword contains special characters', async () => {
    const wrapper = mount(KeyPlayfair, {
      props: { cipherKey: { keyword: 'MON@RCHY' } },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.error-messages').exists()).toBe(true)
    expect(wrapper.text()).toContain('only letters')
  })

  it('does not emit update:cipherKey for an empty keyword', async () => {
    const wrapper = mount(KeyPlayfair, {
      props: { cipherKey: { keyword: 'MONARCHY' } },
    })
    const emitCountBefore = (wrapper.emitted('update:cipherKey') || []).length
    const input = wrapper.find('input[type="text"]')
    await input.setValue('')
    await wrapper.vm.$nextTick()
    const emitCountAfter = (wrapper.emitted('update:cipherKey') || []).length
    expect(emitCountAfter).toBe(emitCountBefore)
  })

  it('does not emit update:cipherKey for a keyword with digits', async () => {
    const wrapper = mount(KeyPlayfair, {
      props: { cipherKey: { keyword: 'MONARCHY' } },
    })
    const emitCountBefore = (wrapper.emitted('update:cipherKey') || []).length
    const input = wrapper.find('input[type="text"]')
    await input.setValue('KEY123')
    await wrapper.vm.$nextTick()
    const emitCountAfter = (wrapper.emitted('update:cipherKey') || []).length
    expect(emitCountAfter).toBe(emitCountBefore)
  })

  // ─── error display ──────────────────────────────────────────────────────────

  it('hides error container when there are no errors', async () => {
    const wrapper = mount(KeyPlayfair, {
      props: { cipherKey: { keyword: 'VALID' } },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.error-messages').exists()).toBe(false)
  })

  it('shows individual error messages as <p> elements', async () => {
    const wrapper = mount(KeyPlayfair, {
      props: { cipherKey: { keyword: '' } },
    })
    await wrapper.vm.$nextTick()
    const errors = wrapper.findAll('.error-messages p')
    expect(errors.length).toBeGreaterThan(0)
  })
})