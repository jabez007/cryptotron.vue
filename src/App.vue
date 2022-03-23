<template>
  <div id="cryptotron">
    <div id="background"></div>
    <transition name="scale-transition" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
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

#background {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0px;
  top: 0px;
  background-image: url("/img/background.jpg");
  background-position: center;
  background-repeat: none;
  background-size: cover;
  z-index: -1; /* Ensure div tag stays behind content; -999 might work, too. */
}
</style>
