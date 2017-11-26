<!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">-->

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
          <a v-on:click="goToCreateMember">Create New User</a>
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
        user: {}
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
              route.push('/')
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
      goToCreateMember () {
        route.push('/create')
      },
      init () {
        console.log('here it is')
        this.user = JSON.parse(localStorage.getItem('user'))
      }
    },
    created () {
      console.log('nav bar created::::')
      this.init()
    }
  }
</script>

