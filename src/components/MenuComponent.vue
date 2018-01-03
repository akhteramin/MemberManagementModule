<template>
  <div>
    <div class="MenuComponent gr-2 menu-container" v-if="!collapseMenuComponent">
      <div>
        <div class="menu-header">
          <img class="padding-5" src="/static/images/white-ipay-logo.png" alt="Pro. Pic" width="110" height="50">
          Admin
        </div>
      </div>
      <nav>
        <ul>
          <a v-on:click="goHome"><li><i class="fa fa-home fa-2x" aria-hidden="true"></i> Home</li></a>
          <a v-restrict="'MS_MM_USER_GET_ALL'" v-on:click="goToMemberList"><li><i class="fa fa-users fa-2x" aria-hidden="true"></i> Members</li></a>
          <a v-restrict="'MS_MM_USER_GET_ALL'" v-on:click="goToWaitingForVerificationMemberList"><li><i class="fa fa-user-circle fa-2x" aria-hidden="true"></i> Waiting For Verification</li></a>
          <a v-restrict="'MS_MM_USER_GET_ALL'" v-on:click="goToWaitingForApprovalMemberList"><li><i class="fa fa-user-circle-o fa-2x" aria-hidden="true"></i> Waiting For Approval</li></a>
          <a v-restrict="'MS_IPAY_ACL_GET_USER_GROUPS'" v-on:click="goToMemberAcl"><li><i class="fa fa-lock fa-2x" aria-hidden="true"></i> Ipay Member ACL</li></a>
          <a v-restrict="'MS_IPAY_ACL_SERVICES'" v-on:click="goToManageServices"><li><i class="fa fa-tasks fa-2x" aria-hidden="true"></i> Manage Services</li></a>
          <a v-restrict="'MS_USER_GET_ALL'" v-on:click="goToUserList"><li> <i class="fa fa-user fa-2x" aria-hidden="true"></i> Users</li></a>
          <a v-restrict="'Configuration|MENU'" @click="toggleConfigurationLists">
            <li> <i class="fa fa-cog fa-2x" aria-hidden="true"></i> Configuration <i class="fa fa-angle-down"></i></li>
          </a>
          <div v-if="expandList" class="gr-10 push-1 small-scrollable" style="height:120px">
            <a v-restrict="'MS_STATIC_RESOURCE_GET_OCCUPATION_LIST'" @click="goToOccupationList"><li>Occupation</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_BANK_LIST'" @click="goToBankList"><li>Bank</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_BRANCH_LIST'" @click="goToBranchList"><li>Branch</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_DISTRICT_LIST'" @click="goToDistrictList"><li>District</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_THANA_LIST'" @click="goToThanaList"><li>Thana</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_COUNTRY_LIST'" @click="goToCountryList"><li>Country</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_BUSINESS_TYPE_LIST'" @click="goToBusinessType"><li>Business Type</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_ACCOUNT_TYPE_LIST'" @click="goToAccountType"><li>Account Type</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_ACCOUNT_CLASS_LIST'" @click="goToAccountClass"><li>Account Class</li></a>
          </div>
        </ul>
        <ul class="bottom-menu">

          <li>
            <div class="dropup">
              <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown"><i class="fa fa-th fa-2x" aria-hidden="true"></i></button>
              <ul class="dropdown-menu">
                <li v-if="appList[app.appID] != 'Admin'" v-for="app in appsData"><a :href="appURL[app.appID]" target="_blank">{{appList[app.appID]}}</a></li>
              </ul>
            </div>
          </li>

          <a v-on:click="goToUserProfile"><li><i class="fa fa-user-circle" aria-hidden="true"></i> {{user.loginID}}</li></a>
          <a v-on:click="logout"><li><i class="fa fa-sign-out" aria-hidden="true"></i> Logout</li></a>
        </ul>

      </nav>
    </div>
    <div class="MenuComponent gr-1 menu-container" v-else>
      <div class="menu-header">
        <img class="padding-2" src="/static/images/iPay-short-icon.png"
             alt="Pro. Pic" width="50" height="50">
      </div>
      <nav>
        <ul>
          <a v-on:click="goHome"><li><i class="fa fa-home fa-2x" aria-hidden="true"></i></li></a>
          <a v-restrict="'MS_MM_USER_GET_ALL'" v-on:click="goToMemberList"><li><i class="fa fa-users fa-2x" aria-hidden="true"></i></li></a>
          <a v-restrict="'MS_MM_USER_GET_ALL'" v-on:click="goToWaitingForVerificationMemberList"><li><i class="fa fa-user-circle fa-2x" aria-hidden="true"></i></li></a>
          <a v-restrict="'MS_MM_USER_GET_ALL'" v-on:click="goToWaitingForApprovalMemberList"><li><i class="fa fa-user-circle-o fa-2x" aria-hidden="true"></i></li></a>
          <a v-restrict="'MS_IPAY_ACL_GET_USER_GROUPS'" v-on:click="goToMemberAcl"><li><i class="fa fa-lock fa-2x" aria-hidden="true"></i></li></a>
          <a v-restrict="'MS_IPAY_ACL_SERVICES'" v-on:click="goToManageServices"><li><i class="fa fa-tasks fa-2x" aria-hidden="true"></i></li></a>
          <a v-restrict="'MS_USER_GET_ALL'" v-on:click="goToUserList"><li> <i class="fa fa-user fa-2x" aria-hidden="true"></i></li></a>
          <a v-restrict="'Configuration|MENU'" @click="toggleConfigurationLists">
            <li> <i class="fa fa-cog fa-2x" aria-hidden="true"></i> <i class="fa fa-angle-down"></i></li>
          </a>
          <div v-if="expandList" class="gr-10 push-1 small-scrollable" style="height:120px">
            <a v-restrict="'MS_STATIC_RESOURCE_GET_OCCUPATION_LIST'" @click="goToOccupationList"><li>Occupation</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_BANK_LIST'" @click="goToBankList"><li>Bank</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_BRANCH_LIST'" @click="goToBranchList"><li>Branch</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_DISTRICT_LIST'" @click="goToDistrictList"><li>District</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_THANA_LIST'" @click="goToThanaList"><li>Thana</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_COUNTRY_LIST'" @click="goToCountryList"><li>Country</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_BUSINESS_TYPE_LIST'" @click="goToBusinessType"><li>Business Type</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_ACCOUNT_TYPE_LIST'" @click="goToAccountType"><li>Account Type</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_ACCOUNT_CLASS_LIST'" @click="goToAccountClass"><li>Account Class</li></a>
          </div>
        </ul>
        <ul class="bottom-menu">

          <li>
            <div class="dropup">
              <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown"><i class="fa fa-th fa-2x" aria-hidden="true"></i></button>
              <ul class="dropdown-menu">
                <li v-if="appList[app.appID] != 'Admin'" v-for="app in appsData"><a :href="appURL[app.appID]" target="_blank">{{appList[app.appID]}}</a></li>
              </ul>
            </div>
          </li>

          <a v-on:click="goToUserProfile"><li><i class="fa fa-user-circle" aria-hidden="true"></i></li></a>
          <a v-on:click="logout"><li><i class="fa fa-sign-out" aria-hidden="true"></i></li></a>
        </ul>

      </nav>
    </div>
    <br>
    <button v-if="!collapseMenuComponent" class="gr-0.5 push-2" @click="collapseMenuComponent = true;"
      style="background-color: #1bb1a2;">
      <i class="fa fa-arrow-left" aria-hidden="true" style="color: white;"></i>
    </button>
    <button v-else class="gr-0.5 push-1" @click="collapseMenuComponent = false;"
            style="background-color: #1bb1a2;">
      <i class="fa fa-arrow-right" aria-hidden="true" style="color: white;"></i>
    </button>
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
        appsData: [],
        showApp: false,
        expandList: false,
        collapseMenuComponent: false,
        appList: { '2': 'Auth', '3': 'CRM', '6': 'Admin' },
        accessControlList: [],
        appURL: {'2': Http.AUTH_HTTP_URI, '3': Http.CRM_URI, '6': Http.ADMIN_URI}
      }
    },
    methods: {
      containsPermission (permission) {
        return this.accessControlList.indexOf(permission) > -1
      },
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
        route.push('/member/default')
      },
      goToWaitingForVerificationMemberList () {
        route.push('/member/waiting-verification')
        // route.push('/member/waiting/verification')
      },
      goToWaitingForApprovalMemberList () {
        console.log('waiting for approval clicked in menu component')
        route.push('/member/waiting-approval')
//        route.push('/member/waiting/approval')
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
      goToManageServices () {
        route.push('/manage/services')
      },
      init () {
        console.log('here it is')
        this.user = JSON.parse(localStorage.getItem('user'))
        this.appsData = JSON.parse(localStorage.getItem('appsData'))
        this.accessControlList = localStorage.getItem('accessControlList')
        this.accessControlList = this.accessControlList.split(',')
      }
    },
    created () {
      console.log('nav bar created::::')
      this.init()
    }
  }
</script>

