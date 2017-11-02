<template>
  <!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">-->
  <div id="app">
    <NavBar v-if="$route.name !== 'Login'"></NavBar>

    <div class="row">
      <router-view></router-view>
    </div>
    <!--<router-view></router-view>-->
  </div>
</template>

<script>
  import NavBar from './components/NavBar.vue'
  import ListRenderer from './components/ListRenderer.vue'
  import Home from './components/Home.vue'

  export default {
    name: 'app',
    components: {'NavBar': NavBar, 'ListRenderer': ListRenderer, 'Home': Home}
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: black;
  text-align: center;
  color: #2c3e50;
}



</style>
