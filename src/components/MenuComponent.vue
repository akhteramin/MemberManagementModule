<template>
  <div>
    <div class="MenuComponent gr-2 menu-container" v-if="!collapseMenuComponent">
      <div>
        <div class="menu-header">
          <img class="padding-5" src="/static/images/white-ipay-logo.png" alt="Pro. Pic" width="110" height="50">
          Admin
          <button v-if="!collapseMenuComponent" @click="toggleCollapse"
            style="background-color: #1bb1a2; border:0px; position:relative">
            <i class="fa fa-arrow-left" aria-hidden="true" style="color: white;"></i>
          </button>
        </div>
      </div>
      <nav>
        <ul>
          <a v-on:click="goHome"><li :class="{'btn-active-til': showHome}" @click="setMenu('home')"><i class="fa fa-home fa-1x" aria-hidden="true"></i> Home</li></a>
          <a v-restrict="'MS_MM_USER_GET_ALL'" v-on:click="goToMemberList"><li :class="{'btn-active-til': showMembers}" @click="setMenu('member')"><i class="fa fa-users fa-1x" aria-hidden="true"></i> Members</li></a>
          <a v-restrict="'MS_MM_USER_GET_ALL'" v-on:click="goToWaitingForVerificationMemberList"><li :class="{'btn-active-til': showWaitingVerification}" @click="setMenu('memberVerification')"><i class="fa fa-user-circle fa-1x" aria-hidden="true"></i> Waiting For Verification</li></a>
          <a v-restrict="'MS_MM_USER_GET_ALL'" v-on:click="goToWaitingForApprovalMemberList"><li :class="{'btn-active-til': showWaitingApproval}" @click="setMenu('memberApproval')"><i class="fa fa-user-circle-o fa-1x" aria-hidden="true"></i> Waiting For Approval</li></a>
          <a v-restrict="'MS_IPAY_ACL_GET_USER_GROUPS'" v-on:click="goToMemberAcl"><li :class="{'btn-active-til': showACL}" @click="setMenu('acl')"><i class="fa fa-lock fa-1x" aria-hidden="true"></i> Ipay Member ACL</li></a>
          <a v-restrict="'MS_IPAY_ACL_SERVICES'" v-on:click="goToManageServices"><li :class="{'btn-active-til': showManageService}" @click="setMenu('manageService')"><i class="fa fa-tasks fa-1x" aria-hidden="true"></i> Manage Services</li></a>
          <a v-restrict="'MS_USER_GET_ALL'" v-on:click="goToUserList"><li :class="{'btn-active-til': showUsers}" @click="setMenu('user')"> <i class="fa fa-user fa-1x" aria-hidden="true"></i> Users</li></a>
          <!--a v-restrict="'Configuration|MENU'" @click="toggleConfigurationLists">
            <li :class="{'btn-active-til': showConfiguration}" @click="setMenu('configuration')"> <i class="fa fa-cog fa-1x" aria-hidden="true"></i> Configuration <i class="fa fa-angle-down"></i></li>
          </a>
          <div id="subMenu" v-if="expandList" class="gr-10 small-scrollable" style="height:120px">
            <a v-restrict="'MS_STATIC_RESOURCE_GET_OCCUPATION_LIST'" @click="highlightMenu(); goToOccupationList();"><li>Occupation</li></a>
            <a @click="highlightMenu(); goTo2faList();"><li>2FA</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_BANK_LIST'" @click="highlightMenu();goToBankList()"><li>Bank</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_BRANCH_LIST'" @click="highlightMenu();goToBranchList();"><li>Branch</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_DISTRICT_LIST'" @click="highlightMenu();goToDistrictList();"><li>District</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_THANA_LIST'" @click="highlightMenu();goToThanaList();"><li>Thana</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_COUNTRY_LIST'" @click="highlightMenu();goToCountryList();"><li>Country</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_BUSINESS_TYPE_LIST'" @click="highlightMenu();goToBusinessType();"><li>Business Type</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_ACCOUNT_TYPE_LIST'" @click="highlightMenu();goToAccountType();"><li>Account Type</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_ACCOUNT_CLASS_LIST'" @click="highlightMenu();goToAccountClass();"><li>Account Class</li></a>
          </div-->
        </ul>
        <ul class="bottom-menu">

          <li :class="{'btn-active-til': showModule}" @click="setMenu('module')">
            <div class="dropup">
              <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown"><i class="fa fa-th fa-1x" aria-hidden="true"></i></button>
              <ul class="dropdown-menu">
                <li v-if="appList[app.appID] != 'Admin'" v-for="app in appsData"><a :href="appURL[app.appID]" target="_blank">{{appList[app.appID]}}</a></li>
              </ul>
            </div>
          </li>

          <a v-on:click="goToUserProfile"><li  :class="{'btn-active-til': showProfile}" @click="setMenu('profile')" ><i class="fa fa-user-circle" aria-hidden="true"></i> {{user.loginID}}</li></a>
          <a v-on:click="logout"><li :class="{'btn-active-til': showLogout}" @click="setMenu('logout')"><i class="fa fa-sign-out" aria-hidden="true"></i> Logout</li></a>
        </ul>

      </nav>
      
    </div>
    <div class="MenuComponent gr-1 menu-container" v-else>
      <div class="menu-header">
        <img class="padding-2" src="/static/images/iPay-short-icon.png"
             alt="Pro. Pic" width="50" height="50">
        <button v-if="collapseMenuComponent" @click="toggleCollapse"
                style="background-color: #1bb1a2; border:0px; position:relative">
          <i class="fa fa-arrow-right" aria-hidden="true" style="color: white;"></i>
        </button>
      </div>
      <nav>
        <ul>
          <a v-on:click="goHome"><li  :class="{'btn-active-til': showHome}" @click="setMenu('home')"><i class="fa fa-home fa-2x" aria-hidden="true"></i></li></a>
          <a v-restrict="'MS_MM_USER_GET_ALL'" v-on:click="goToMemberList"><li :class="{'btn-active-til': showMembers}" @click="setMenu('member')"><i class="fa fa-users fa-2x" aria-hidden="true"></i></li></a>
          <a v-restrict="'MS_MM_USER_GET_ALL'" v-on:click="goToWaitingForVerificationMemberList"><li :class="{'btn-active-til': showWaitingVerification}" @click="setMenu('memberVerification')"><i class="fa fa-user-circle fa-2x" aria-hidden="true"></i></li></a>
          <a v-restrict="'MS_MM_USER_GET_ALL'" v-on:click="goToWaitingForApprovalMemberList"><li :class="{'btn-active-til': showWaitingApproval}" @click="setMenu('memberApproval')"><i class="fa fa-user-circle-o fa-2x" aria-hidden="true"></i></li></a>
          <a v-restrict="'MS_IPAY_ACL_GET_USER_GROUPS'" v-on:click="goToMemberAcl"><li  :class="{'btn-active-til': showACL}" @click="setMenu('acl')"><i class="fa fa-lock fa-2x" aria-hidden="true"></i></li></a>
          <a v-restrict="'MS_IPAY_ACL_SERVICES'" v-on:click="goToManageServices"><li  :class="{'btn-active-til': showManageService}" @click="setMenu('manageService')"><i class="fa fa-tasks fa-2x" aria-hidden="true"></i></li></a>
          <a v-restrict="'MS_USER_GET_ALL'" v-on:click="goToUserList"><li  :class="{'btn-active-til': showUsers}" @click="setMenu('user')"> <i class="fa fa-user fa-2x" aria-hidden="true"></i></li></a>
          <!--a v-restrict="'Configuration|MENU'" @click="toggleConfigurationLists">
            <li :class="{'btn-active-til': showConfiguration}" @click="setMenu('configuration')"> <i class="fa fa-cog fa-2x" aria-hidden="true"></i> <i class="fa fa-angle-down"></i></li>
          </a>
          <div id="subMenu" v-if="expandList" class="gr-10 small-scrollable" style="height:120px">
            <a v-restrict="'MS_STATIC_RESOURCE_GET_OCCUPATION_LIST'" @click="highlightMenu(); goToOccupationList();"><li>Occupation</li></a>
            <a v-restrict="'MS_2FA_GET_PREFERENCES'" @click="highlightMenu(); goTo2faList();"><li>2FA</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_BANK_LIST'" @click="highlightMenu();goToBankList()"><li>Bank</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_BRANCH_LIST'" @click="highlightMenu();goToBranchList();"><li>Branch</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_DISTRICT_LIST'" @click="highlightMenu();goToDistrictList();"><li>District</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_THANA_LIST'" @click="highlightMenu();goToThanaList();"><li>Thana</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_COUNTRY_LIST'" @click="highlightMenu();goToCountryList();"><li>Country</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_BUSINESS_TYPE_LIST'" @click="highlightMenu();goToBusinessType();"><li>Business Type</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_ACCOUNT_TYPE_LIST'" @click="highlightMenu();goToAccountType();"><li>Account Type</li></a>
            <a v-restrict="'MS_STATIC_RESOURCE_GET_ACCOUNT_CLASS_LIST'" @click="highlightMenu();goToAccountClass();"><li>Account Class</li></a>
          </div-->
        </ul>
        <ul class="bottom-menu">

          <li :class="{'btn-active-til': showModule}" @click="setMenu('module')">
            <div class="dropup">
              <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown"><i class="fa fa-th fa-2x" aria-hidden="true"></i></button>
              <ul class="dropdown-menu">
                <li v-if="appList[app.appID] != 'Admin'" v-for="app in appsData"><a :href="appURL[app.appID]" target="_blank">{{appList[app.appID]}}</a></li>
              </ul>
            </div>
          </li>

          <a v-on:click="goToUserProfile"><li :class="{'btn-active-til': showProfile}" @click="setMenu('profile')"><i class="fa fa-user-circle" aria-hidden="true"></i></li></a>
          <a v-on:click="logout"><li :class="{'btn-active-til': showLogout}" @click="setMenu('logout')"><i class="fa fa-sign-out" aria-hidden="true"></i></li></a>
        </ul>

      </nav>
    </div>
    <br>
    
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
        appURL: {'2': Http.AUTH_HTTP_URI, '3': Http.CRM_URI, '6': Http.ADMIN_URI},
        showHome: false,
        showMembers: false,
        showWaitingVerification: false,
        showWaitingApproval: false,
        showACL: false,
        showManageService: false,
        showUsers: false,
        showConfiguration: false,
        showLogout: false,
        showProfile: false,
        showModule: false
      }
    },
    methods: {
      toggleCollapse () {
        if (this.collapseMenuComponent === false) {
          this.collapseMenuComponent = true
          this.$emit('update', 'true')
        } else {
          this.collapseMenuComponent = false
          this.$emit('update', 'false')
        }
      },
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
        this.expandList = false
        route.push('/home')
      },
      goToMemberList () {
        this.expandList = false
        route.push('/member/default')
      },
      goToWaitingForVerificationMemberList () {
        this.expandList = false
        route.push('/member/waiting-verification')
        // route.push('/member/waiting/verification')
      },
      goToWaitingForApprovalMemberList () {
        this.expandList = false
        console.log('waiting for approval clicked in menu component')
        route.push('/member/waiting-approval')
//        route.push('/member/waiting/approval')
      },
      goToUserList () {
        this.expandList = false
        route.push('/user')
      },
      goToUserProfile () {
        this.expandList = false
        console.log('user information:: ', this.user.loginID)
        let loginID = this.user.loginID
        route.push(`/user/${loginID}`) // `${window.location.href}/profile/${value}/${accntType}`
      },
      goToMemberAcl () {
        this.expandList = false
        route.push(`/member/acl/group`)
      },
      goToOccupationList () {
        route.push('/occupation')
      },
      goTo2faList () {
        route.push('/2fa')
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
        this.expandList = false
        route.push('/manage/services')
      },
      setMenu (menuName) {
        this.showHome = false
        this.showMembers = false
        this.showWaitingVerification = false
        this.showWaitingApproval = false
        this.showACL = false
        this.showManageService = false
        this.showUsers = false
        this.showConfiguration = false
        this.showLogout = false
        this.showProfile = false
        this.showModule = false
        if (menuName === 'home') {
          this.showHome = true
        } else if (menuName === 'member') {
          this.showMembers = true
        } else if (menuName === 'memberVerification') {
          this.showWaitingVerification = true
        } else if (menuName === 'memberApproval') {
          this.showWaitingApproval = true
        } else if (menuName === 'acl') {
          this.showACL = true
        } else if (menuName === 'manageService') {
          this.showManageService = true
        } else if (menuName === 'user') {
          this.showUsers = true
        } else if (menuName === 'configuration') {
          this.showConfiguration = true
        } else if (menuName === 'profile') {
          this.showProfile = true
        } else if (menuName === 'logout') {
          this.showLogout = true
        } else if (menuName === 'module') {
          this.showModule = true
        }
      },
      highlightMenu () {
        $('#subMenu').on('click', 'li', function () {
          console.log('clicked dude')
          $('#subMenu > a li').removeClass('btn-active-til')
          $(this).addClass('btn-active-til')
        })
      },
      init () {
        console.log('here it is')
        this.user = JSON.parse(localStorage.getItem('user'))
        this.appsData = JSON.parse(localStorage.getItem('appsData'))
        this.accessControlList = localStorage.getItem('accessControlList')
        this.accessControlList = this.accessControlList.split(',')
        // if (localStorage.getItem('user-profile') === null) {
        Http.GET('user', ['login'])
        .then(
          ({data: profile}) => {
            console.log(profile)
            console.log('hey')
            localStorage.setItem('user-profile', JSON.stringify(profile.data))
          }
          )
        // }
      }
    },
    created () {
      console.log('nav bar created::::')
      this.init()
    }
  }
</script>

