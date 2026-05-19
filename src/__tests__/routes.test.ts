import { describe, it, expect } from 'vitest'
import getRoutes from '@/router/routes'

describe('getRoutes – new routes added in PR', () => {
  describe('without parentRouteName (standalone mode, rootPath = "/")', () => {
    const routes = getRoutes()

    it('includes the cryptotron-columnar route', () => {
      const route = routes.find((r) => r.name === 'cryptotron-columnar')
      expect(route).toBeDefined()
    })

    it('cryptotron-columnar has path "/columnar"', () => {
      const route = routes.find((r) => r.name === 'cryptotron-columnar')
      expect(route?.path).toBe('/columnar')
    })

    it('cryptotron-columnar has a component loader', () => {
      const route = routes.find((r) => r.name === 'cryptotron-columnar')
      expect(typeof route?.component).toBe('function')
    })

    it('includes the cryptotron-playfair route', () => {
      const route = routes.find((r) => r.name === 'cryptotron-playfair')
      expect(route).toBeDefined()
    })

    it('cryptotron-playfair has path "/playfair"', () => {
      const route = routes.find((r) => r.name === 'cryptotron-playfair')
      expect(route?.path).toBe('/playfair')
    })

    it('cryptotron-playfair has a component loader', () => {
      const route = routes.find((r) => r.name === 'cryptotron-playfair')
      expect(typeof route?.component).toBe('function')
    })

    it('includes the cryptotron-bacon route', () => {
      const route = routes.find((r) => r.name === 'cryptotron-bacon')
      expect(route).toBeDefined()
    })

    it('cryptotron-bacon has path "/bacon"', () => {
      const route = routes.find((r) => r.name === 'cryptotron-bacon')
      expect(route?.path).toBe('/bacon')
    })

    it('cryptotron-bacon has a component loader', () => {
      const route = routes.find((r) => r.name === 'cryptotron-bacon')
      expect(typeof route?.component).toBe('function')
    })
  })

  describe('with parentRouteName (child mode, rootPath = "")', () => {
    const routes = getRoutes('parent')

    it('cryptotron-columnar has path "columnar" (no leading slash)', () => {
      const route = routes.find((r) => r.name === 'cryptotron-columnar')
      expect(route?.path).toBe('columnar')
    })

    it('cryptotron-playfair has path "playfair" (no leading slash)', () => {
      const route = routes.find((r) => r.name === 'cryptotron-playfair')
      expect(route?.path).toBe('playfair')
    })

    it('cryptotron-bacon has path "bacon" (no leading slash)', () => {
      const route = routes.find((r) => r.name === 'cryptotron-bacon')
      expect(route?.path).toBe('bacon')
    })
  })

  describe('route list integrity', () => {
    it('returns an array', () => {
      expect(Array.isArray(getRoutes())).toBe(true)
    })

    it('all route names are unique', () => {
      const routes = getRoutes()
      const names = routes.map((r) => r.name).filter(Boolean)
      expect(new Set(names).size).toBe(names.length)
    })

    it('all routes have a path and a component', () => {
      for (const route of getRoutes()) {
        expect(typeof route.path).toBe('string')
        expect(typeof route.component).toBe('function')
      }
    })
  })
})