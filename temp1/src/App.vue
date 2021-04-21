<template>
  <div id="app">
    <img src="./assets/logo.png">
    <div>
      <router-link to="/">hello</router-link>
      <router-link to="/async">async</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app{
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
/* Used to test postcss-loader autoprefixer */
::placeholder {
  color: gray;
}
</style>
