<template>
  <div class="MenuComponent gr-2 menu-container">
    <div class="menu-header">
        <img class="padding-5" src="/static/images/white-ipay-logo.png" alt="Pro. Pic" width="110" height="50">
          Member Service
    </div>
    <nav>
      <ul>
        <li>
          <a v-on:click="goHome">Home</a>
        </li>
        <li>
          <a  v-on:click="goToMemberList">Member List</a>
        </li>
        <li>
          <a  v-on:click="goToWaitingForVerificationMemberList">Waiting For Verification</a>
        </li>
        <li>
          <a  v-on:click="goToWaitingForApprovalMemberList">Waiting For Approval</a>
        </li>
      </ul>
      <ul class="bottom-menu">
        <li>
          <i class="fa fa-folder-o" aria-hidden="true"></i>
          <a @click="toggleShowApp()">Applications</a>
        </li>
        <li v-if="showApp"  v-for="app in appsData">
            <var v-if="app.appID === 2">
              <a href="http://localhost:8000/admin-auth" target="_blank">Auth</a>
            </var>
            <var v-if="app.appID === 3">
              <a href="#">CRM</a>
            </var>            
        </li>
        <li>
          <i class="fa fa-user-circle" aria-hidden="true"></i>
          <a v-on:click="logout">{{user.loginID}}</a>
        </li>
        <li>
          <i class="fa fa-question-circle-o" aria-hidden="true"></i>
          <a v-on:click="logout">Help</a>
        </li>
        <li>
          <a v-on:click="logout">Logout</a>
        </li>
      </ul>

    </nav>
  </div>
</template>



<script>
  import route from '../router'
  import Http from '../services/Http'

  export default {
    name: 'MenuComponent',
    data () {
      return {
        user: {},
        appsData: {},
        showApp: false
      }
    },
    methods: {
      logout () {
        Http.GET('logout')
          .then(
            ({data: list}) => {
              console.log(list)
              console.log('hey')
              // auth.setAccessControl(list)
              localStorage.removeItem('token')
              let authUri = Http.AUTH_HTTP_URI + 'accountslogout/?appID=6'
              window.location.href = authUri
              // route.push('/')
            }
          )
      },
      goHome () {
        route.push('/home')
      },
      goToMemberList () {
        route.push('/member')
      },
      goToWaitingForVerificationMemberList () {
        route.push('/member/waiting/verification')
      },
      goToWaitingForApprovalMemberList () {
        route.push('/member/waiting/approval')
      },
      toggleShowApp () {
        if (this.showApp) {
          this.showApp = false
        } else {
          this.showApp = true
        }
      },
      init () {
        console.log('here it is')
        this.user = JSON.parse(localStorage.getItem('user'))
        this.appsData = JSON.parse(localStorage.getItem('appsData'))
      }
    },
    created () {
      console.log('nav bar created::::')
      this.init()
    }
  }
</script>

