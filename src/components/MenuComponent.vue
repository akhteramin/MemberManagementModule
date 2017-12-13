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
          <a v-on:click="goToUserList">User List</a>
        </li>
        <li>
          <a  v-on:click="goToWaitingForVerificationMemberList">Waiting For Verification</a>
        </li>
        <li>
          <a  v-on:click="goToWaitingForApprovalMemberList">Waiting For Approval</a>
        </li>
        <li>
          <a  v-on:click="goToMemberAcl">Ipay Member ACL</a>
        </li>
        <li>
          <a @click="toggleConfigurationLists">
            Configuration <i class="fa fa-angle-down"></i>
          </a>
        </li>
        <div v-if="expandList" class="gr-10 push-1">
          <li>
            <a @click="goToOccupationList">Occupation</a>
          </li>
          <li>
            <a @click="goToBankList">Bank</a>
          </li>
          <li>
            <a @click="goToBranchList">Branch</a>
          </li>
          <li>
            <a @click="goToDistrictList">District</a>
          </li>
          <li>
            <a @click="goToThanaList">Thana</a>
          </li>
          <li>
            <a @click="goToCountryList">Country</a>
          </li>
          <li>
            <a @click="goToBusinessType">Business Type</a>
          </li>
          <li>
            <a @click="goToAccountType">Account Type</a>
          </li>
          <li>
            <a @click="goToAccountClass">Account Class</a>
          </li>
        </div>

      </ul>
      <ul class="bottom-menu">
        <li>
          <i class="fa fa-user-circle" aria-hidden="true"></i>
          <a v-on:click="goToUserProfile">{{user.loginID}}</a>
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

