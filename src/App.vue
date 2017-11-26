<template>
  <div id="app">
    <div class="row">
      <MenuComponent v-if="$route.name !== 'Login'"></MenuComponent>
      <router-view></router-view>
    </div>
    <!--<router-view></router-view>-->
  </div>
</template>

<script>
  import MenuComponent from './components/MenuComponent.vue'
  import MemberList from './components/MemberListComponent.vue'
  import Home from './components/Home.vue'
  import WaitingForApprovalList from './components/WaitingForApprovalListComponent.vue'
  import WaitingForVerificationList from './components/WaitingForVerificationListComponent.vue'
  import CreateNewMemberComponent from './components/CreateNewMemberComponent.vue'

  export default {
    name: 'app',
    components: {
      'MenuComponent': MenuComponent,
      'MemberList': MemberList,
      'CreateNewMemberComponent': CreateNewMemberComponent,
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
