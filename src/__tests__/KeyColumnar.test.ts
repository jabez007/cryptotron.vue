import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import KeyColumnar from '@/components/keys/KeyColumnar.vue'

describe('KeyColumnar', () => {
  // ─── rendering ─────────────────────────────────────────────────────────────

  it('renders a text input', () => {
    const wrapper = mount(KeyColumnar, {
      props: { cipherKey: { keyword: 'NIGHTCITY' } },
    })
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
  })

  it('renders the keyword label', () => {
    const wrapper = mount(KeyColumnar, {
      props: { cipherKey: { keyword: 'NIGHTCITY' } },
    })
    expect(wrapper.text()).toContain('Keyword')
  })

  it('renders the help text about column order', () => {
    const wrapper = mount(KeyColumnar, {
      props: { cipherKey: { keyword: 'NIGHTCITY' } },
    })
    expect(wrapper.text()).toContain('columns')
  })

  it('shows placeholder "e.g., CRYPTO"', () => {
    const wrapper = mount(KeyColumnar, {
      props: { cipherKey: { keyword: 'NIGHTCITY' } },
    })
    const input = wrapper.find('input[type="text"]')
    expect(input.attributes('placeholder')).toBe('e.g., CRYPTO')
  })

  it('sets spellcheck="false" on the input', () => {
    const wrapper = mount(KeyColumnar, {
      props: { cipherKey: { keyword: 'NIGHTCITY' } },
    })
    const input = wrapper.find('input[type="text"]')
    expect(input.attributes('spellcheck')).toBe('false')
  })

  // ─── default props ──────────────────────────────────────────────────────────

  it('uses "NIGHTCITY" as the default keyword when no prop is supplied', () => {
    const wrapper = mount(KeyColumnar)
    const input = wrapper.find('input[type="text"]')
    // The default keyword is 'NIGHTCITY'
    expect((input.element as HTMLInputElement).value).toBe('NIGHTCITY')
  })

  it('binds the provided cipherKey.keyword to the input', () => {
    const wrapper = mount(KeyColumnar, {
      props: { cipherKey: { keyword: 'SECRET' } },
    })
    const input = wrapper.find('input[type="text"]')
    expect((input.element as HTMLInputElement).value).toBe('SECRET')
  })

  // ─── validation – valid values ──────────────────────────────────────────────

  it('does not show errors for a valid keyword', async () => {
    const wrapper = mount(KeyColumnar, {
      props: { cipherKey: { keyword: 'CRYPTO' } },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.error-messages').exists()).toBe(false)
  })

  it('emits update:cipherKey when a valid keyword is set', async () => {
    const wrapper = mount(KeyColumnar, {
      props: { cipherKey: { keyword: 'NIGHTCITY' } },
    })
    const input = wrapper.find('input[type="text"]')
    await input.setValue('CRYPTO')
    await wrapper.vm.$nextTick()
    const emitted = wrapper.emitted('update:cipherKey')
    expect(emitted).toBeTruthy()
    expect(emitted![emitted!.length - 1]).toEqual([{ keyword: 'CRYPTO' }])
  })

  // ─── validation – invalid values ───────────────────────────────────────────

  it('shows error when keyword is empty', async () => {
    const wrapper = mount(KeyColumnar, {
      props: { cipherKey: { keyword: '' } },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.error-messages').exists()).toBe(true)
    expect(wrapper.text()).toContain('required')
  })

  it('shows error when keyword is a single character (minLength 2)', async () => {
    const wrapper = mount(KeyColumnar, {
      props: { cipherKey: { keyword: 'A' } },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.error-messages').exists()).toBe(true)
  })

  it('shows error when keyword contains digits', async () => {
    const wrapper = mount(KeyColumnar, {
      props: { cipherKey: { keyword: 'NIGHT123' } },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.error-messages').exists()).toBe(true)
    expect(wrapper.text()).toContain('only letters')
  })

  it('shows error when keyword contains special characters', async () => {
    const wrapper = mount(KeyColumnar, {
      props: { cipherKey: { keyword: 'KEY!' } },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.error-messages').exists()).toBe(true)
    expect(wrapper.text()).toContain('only letters')
  })

  it('does not emit update:cipherKey for an invalid (empty) keyword', async () => {
    const wrapper = mount(KeyColumnar, {
      props: { cipherKey: { keyword: 'VALID' } },
    })
    const input = wrapper.find('input[type="text"]')
    await input.setValue('')
    await wrapper.vm.$nextTick()
    const emitted = wrapper.emitted('update:cipherKey')
    // Should not have emitted with the empty value
    if (emitted) {
      const lastEmit = emitted[emitted.length - 1] as [{ keyword: string }][]
      expect(lastEmit[0]).not.toEqual({ keyword: '' })
    }
  })

  it('does not emit update:cipherKey for a single-char keyword', async () => {
    const wrapper = mount(KeyColumnar, {
      props: { cipherKey: { keyword: 'VALID' } },
    })
    const emitCountBefore = (wrapper.emitted('update:cipherKey') || []).length
    const input = wrapper.find('input[type="text"]')
    await input.setValue('A')
    await wrapper.vm.$nextTick()
    const emitCountAfter = (wrapper.emitted('update:cipherKey') || []).length
    expect(emitCountAfter).toBe(emitCountBefore)
  })

  // ─── accepts lowercase letters ──────────────────────────────────────────────

  it('accepts lowercase letters as a valid keyword', async () => {
    const wrapper = mount(KeyColumnar, {
      props: { cipherKey: { keyword: 'crypto' } },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.error-messages').exists()).toBe(false)
  })
})