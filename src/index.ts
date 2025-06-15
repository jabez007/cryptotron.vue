import type { App } from 'vue';
import type { Router } from 'vue-router';
import CryptoTronRoutes from './router/routes.ts'

interface PluginOptions {
  router: Router,
  parentRouteName?: string
}

export default {
  app: () => import('./App.vue'),
  install(_app: App, options: PluginOptions) {

    CryptoTronRoutes(options.parentRouteName).forEach((r) => {

      if (!options.router.hasRoute(r.name)) {
        console.debug(`Adding ${r.name} to router with path '${r.path}'`)

        if (options.parentRouteName) {
          console.debug(`Adding to parent ${options.parentRouteName}`)
          options.router.addRoute(options.parentRouteName, r)
        } else {
          console.debug(`Adding to root`)
          options.router.addRoute(r)
        }

      } else {
        console.warn(`Route ${r.name} already exists on router`)
      }

    })

  }
}
