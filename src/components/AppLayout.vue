<template>
  <div id="appLayout">
    <vs-navbar>
      <vs-navbar-title slot="title" class="app-title">
        <vs-row vs-type="flex" vs-justify="space-between" vs-align="center">
          <vs-col vs-w="3">
            <vs-button
              v-if="navigationDrawer"
              type="flat"
              color="dark"
              :text-color="textColor"
              icon="menu"
              @click="drawer = !drawer"
            ></vs-button>
          </vs-col>
          <vs-col vs-w="9">
            <slot name="navbarTitle"></slot>
          </vs-col>
        </vs-row>
      </vs-navbar-title>

      <vs-button
        type="flat"
        color="dark"
        :text-color="textColor"
        icon="local_library"
        to="/"
      ></vs-button>
    </vs-navbar>

    <div id="main" :style="`padding-left: ${drawer ? 5 : 0}rem`">
      <vs-sidebar
        v-if="navigationDrawer"
        id="sidebar"
        parent="#main"
        default-index="0"
        reduce
        hidden-background
        v-model="drawer"
      >
        <slot name="sidebarItems"></slot>
      </vs-sidebar>

      <main>
        <vs-row vs-type="flex" vs-justify="center" vs-align="center">
          <vs-col vs-justify="center">
            <slot name="content">
              <transition :name="transitionName" mode="out-in">
                <router-view />
              </transition>
            </slot>
          </vs-col>
        </vs-row>
      </main>
    </div>

    <footer>
      <vs-row vs-type="flex" vs-justify="space-between" vs-align="center">
        <vs-col vs-w="1">
          <vs-button
            v-if="bugUrl"
            type="flat"
            color="dark"
            :text-color="textColor"
            icon="bug_report"
            size="small"
            :href="bugUrl"
            target="_blank"
          ></vs-button>
        </vs-col>
        <vs-col vs-w="1"> &copy; {{ new Date().getFullYear() }} </vs-col>
      </vs-row>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'AppLayout',
  props: {
    bugUrl: {
      type: String,
      required: false,
    },
  },
  data: () => ({
    drawer: true,
    transitionName: 'fade-transition',
  }),
  computed: {
    navigationDrawer() {
      return !!this.$slots.sidebarItems;
    },
    textColor() {
      return 'rgb(245, 235, 225)';
    },
  },
  watch: {
    $route(to, from) {
      const toDepth = to.path.split('/').length;
      const fromDepth = from.path.split('/').length;
      if (toDepth < fromDepth) {
        // moving up
        this.transitionName = 'slide-y-reverse-transition';
      } else if (toDepth > fromDepth) {
        // moving down
        this.transitionName = 'slide-y-transition';
      } else {
        // moving laterally
        this.transitionName = 'slide-x-transition';
      }
    },
  },
};
</script>

<style scoped>
#appLayout {
  background: rgb(30, 30, 30);
  color: rgb(245, 235, 225);
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

#appLayout header {
  position: fixed;
  top: 0;
}

#appLayout .app-title {
  font-size: x-large;
}

#appLayout #main {
  margin-top: 3.5rem;
  margin-bottom: 2rem;
  height: calc(100% - 5.5rem);
  position: relative;
  transition: padding 0.5s;
}

#appLayout #main main,
#appLayout #main main .vs-row {
  height: 100%;
  overflow-y: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

#appLayout #main main::-webkit-scrollbar,
#appLayout #main main .vs-row::-webkit-scrollbar {
  display: none; /* Chrome */
}

#appLayout footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  min-height: 2rem;
}

#appLayout footer .vs-row {
  min-height: 2rem;
}
</style>

<style>
#appLayout #main #sidebar .vs-sidebar {
  background: rgb(30, 30, 30);
}
</style>
