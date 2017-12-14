<template>
  <div class="MenuComponent gr-2 menu-container">
    <div class="menu-header">
        <img class="padding-5" src="/static/images/white-ipay-logo.png" alt="Pro. Pic" width="110" height="50">
          Member Service
    </div>
    <nav>
      <ul>
        <a v-on:click="goHome"><li>Home</li></a>
        <a v-on:click="goToMemberList"><li>Member List</li></a>
        <a v-on:click="goToUserList"><li>User List</li></a>
        <a v-on:click="goToWaitingForVerificationMemberList"><li>Waiting For Verification</li></a>
        <a v-on:click="goToWaitingForApprovalMemberList"><li>Waiting For Approval</li></a>
        <a v-on:click="goToMemberAcl"><li>Ipay Member ACL</li></a>
        <a @click="toggleConfigurationLists">
          <li>Configuration <i class="fa fa-angle-down"></i></li>
        </a>
        <div v-if="expandList" class="gr-10 push-1">
          <a @click="goToOccupationList"><li>Occupation</li></a>
          <a @click="goToBankList"><li>Bank</li></a>
          <a @click="goToBranchList"><li>Branch</li></a>
          <a @click="goToDistrictList"><li>District</li></a>
          <a @click="goToThanaList"><li>Thana</li></a>
          <a @click="goToCountryList"><li>Country</li></a>
          <a @click="goToBusinessType"><li>Business Type</li></a>
          <a @click="goToAccountType"><li>Account Type</li></a>
          <a @click="goToAccountClass"><li>Account Class</li></a>
        </div>
      </ul>
      <ul class="bottom-menu">
        <a v-on:click="goToUserProfile"><li><i class="fa fa-user-circle" aria-hidden="true"></i> {{user.loginID}}</li></a>
        <a v-on:click="logout"><li><i class="fa fa-question-circle-o" aria-hidden="true"></i> Help</li></a>
        <a v-on:click="logout"><li>Logout</li></a>
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
        expandList: false
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
      toggleConfigurationLists () {
        if (this.expandList) {
          this.expandList = false
        } else {
          this.expandList = true
        }
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
      goToUserList () {
        route.push('/user')
      },
      goToUserProfile () {
        console.log('user information:: ', this.user)
        let loginID = this.user.loginID
        route.push(`/user/${loginID}`) // `${window.location.href}/profile/${value}/${accntType}`
      },
      goToMemberAcl () {
        route.push(`/member/acl/group`)
      },
      goToOccupationList () {
        route.push('/occupation')
      },
      goToBankList () {
        route.push('/bank')
      },
      goToBranchList () {
        route.push('/branch')
      },
      goToDistrictList () {
        route.push('/district')
      },
      goToThanaList () {
        route.push('/thana')
      },
      goToCountryList () {
        route.push('/country')
      },
      goToBusinessType () {
        route.push('/business-type')
      },
      goToAccountType () {
        route.push('/account-type')
      },
      goToAccountClass () {
        route.push('/account-class')
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

