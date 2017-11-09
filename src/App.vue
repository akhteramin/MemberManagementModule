<template>
  <div id="app">
    <div class="row">
      <NavBar v-if="$route.name !== 'Login'"></NavBar>      
      <router-view></router-view>
    </div>
    <!--<router-view></router-view>-->
  </div>
</template>

<script>
  import NavBar from './components/NavBar.vue'
  import ListRenderer from './components/ListRenderer.vue'
  import Home from './components/Home.vue'
  import WaitingForApprovalList from './components/WaitingForApprovalList.vue'
  import WaitingForVerificationList from './components/WaitingForVerificationList.vue'
  export default {
    name: 'app',
    components: {
      'NavBar': NavBar,
      'ListRenderer': ListRenderer,
      'Home': Home,
      'WaitingForApprovalList': WaitingForApprovalList,
      'WaitingForVerificationList': WaitingForVerificationList
    }
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: black;
  color: #2c3e50;
  background: #ffffff;
}



</style>
