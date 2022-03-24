<template>
  <app-layout bug-url="https://github.com/jabez007/cryptotron/issues">
    <vs-button
      slot="navbarTitle"
      type="flat"
      color="dark"
      text-color="rgb(245, 235, 225)"
      :to="{ name: 'cryptotron-home' }"
      >CryptoTron
    </vs-button>
    <span slot="sidebarItems">
      <vs-sidebar-item
        index="1"
        icon="new_releases"
        :to="{ name: 'cryptotron-desideratum' }"
        >Kerckhoffs's Desideratum
      </vs-sidebar-item>
      <vs-sidebar-item index="2" icon="question_answer">
        Dashboard
      </vs-sidebar-item>
    </span>
  </app-layout>
</template>

<script>
export default {
  name: 'CryptoTron',
  components: {
    AppLayout: () => import('../components/AppLayout.vue'),
  },
};
</script>

<style>
html,
body {
  overflow-y: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

html::-webkit-scrollbar,
body::-webkit-scrollbar {
  display: none; /* Chrome */
}
</style>
