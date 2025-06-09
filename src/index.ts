import type { App } from 'vue';
import type { Router, RouteRecord } from 'vue-router';
import CryptoTronRoutes from './router/routes.ts'

interface PluginOptions {
  router: Router,
  parentRoute?: RouteRecord
}

export default {
  app: () => import('./App.vue'),
  install(_app: App, options: PluginOptions) {

    if (options.parentRoute) {
      options.parentRoute.children = options.parentRoute.children ?? []
    }

    CryptoTronRoutes(options.parentRoute).forEach((r) => {

      if (!options.router.hasRoute(r.name)) {
        console.debug(`Adding ${r.name} to router with path '${r.path}'`)

        if (options.parentRoute) {
          console.debug(`Adding to parent ${options.parentRoute.name as string}`)
          options.parentRoute.children.push(r)
        } else {
          console.debug(`Adding to root`)
          options.router.addRoute(r)
        }

      } else {
        console.warn(`Route ${r.name} already exists on router`)
      }

    })

    if (options.parentRoute) {
      options.router.addRoute(options.parentRoute)
    }
  }
}
