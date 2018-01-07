<template>
  <div id="app">
    <div class="row">
      <MenuComponent v-if="$route.name !== 'Login'"
      @update="learnMenuComponentCollapsedOrNot"></MenuComponent>
      <router-view v-if="!isMenuCollapsed" class="push-2"></router-view>
      <router-view v-else class="push-1"></router-view>
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
  import MemberAclGroup from './components/MemberAclGroupComponent.vue'
  export default {
    name: 'app',
    data () {
      return {
        'isMenuCollapsed': false
      }
    },
    components: {
      'MenuComponent': MenuComponent,
      'MemberList': MemberList,
      'Home': Home,
      'WaitingForApprovalList': WaitingForApprovalList,
      'WaitingForVerificationList': WaitingForVerificationList,
      'MemberAclGroup': MemberAclGroup
    },
    methods: {
      learnMenuComponentCollapsedOrNot () {
        if (!this.isMenuCollapsed) {
          this.isMenuCollapsed = true
        } else {
          this.isMenuCollapsed = false
        }
      }
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
  min-height: 1000px;
}



</style>
