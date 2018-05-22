<template>
  <nav id="sidebar" style="height:1000px !important; position:absolute; ">
    <!-- Close Sidebar Button -->
    <div id="dismiss" class="text-center">
        <img id="icon" class="padding-5" src="/static/images/white-ipay-logo.png" alt="Pro. Pic" width="90">
        <button type="button" id="sidebarCollapse" class="btn btn-info navbar-btn" v-on:click="sideBarCollapse">
            <i class="ti-align-justify"></i>
        </button>
    </div>

    <!-- Sidebar Header -->
    <div class="sidebar-header text-center">
        <h3>Member Service</h3>
        
    </div>

    <!-- Sidebar Links -->
    <ul class="list-unstyled components">
        <li :class="{'active': showHome}" @click="setMenu('home')"><a href="" v-on:click="goHome">Home</a></li>
        <li :class="{'active': showSearch}" @click="setMenu('search')"><a href="" v-on:click="goToSearch">Member Search</a></li>
        <li :class="{'active': showMembers}" @click="setMenu('member')"><a href="" v-restrict="'MS_MM_USER_GET_ALL'" v-on:click="goToMemberList">Recent Members</a></li>
        <li :class="{'active': showWaitingVerification}" @click="setMenu('memberVerification')"><a href="" v-restrict="'MS_MM_USER_GET_ALL'" v-on:click="goToWaitingForVerificationMemberList">Waiting for Verification</a></li>
        <li :class="{'active': showWaitingApproval}" @click="setMenu('memberApproval')"><a href="" v-restrict="'MS_MM_USER_GET_ALL'" v-on:click="goToWaitingForApprovalMemberList">Waiting for Approval</a></li>
        <li :class="{'active': showRejectedMembers}" @click="setMenu('memberRejected')"><a href="" v-restrict="'MS_MM_USER_GET_ALL'" v-on:click="goToRejectedMemberList">Rejected Members</a></li>
        <li :class="{'active': showACL}" @click="setMenu('acl')"><a href="" v-restrict="'MS_IPAY_ACL_GET_USER_GROUPS'" v-on:click="goToMemberAcl">iPay Member ACL</a></li>
        <li :class="{'active': showManageService}" @click="setMenu('manageService')"><a href="" v-restrict="'MS_IPAY_ACL_SERVICES'" v-on:click="goToManageServices">Manage Services</a></li>
        <hr>
        <li :class="{'active': showModule}" @click="setMenu('module')"><!-- Link with dropdown items -->
            <a href="#homeSubmenu" v-if="appsData.length > 1" data-toggle="collapse" aria-expanded="false">Apps</a>
            <ul class="collapse list-unstyled" id="homeSubmenu">
                <li v-if="appList[app.appID] != 'Admin'" v-for="app in appsData"><a :href="appURL[app.appID]" target="_blank">{{appList[app.appID]}}</a></li>
            </ul>
        </li>
        <li class="break-word" :class="{'active': showProfile}"><a href="" v-on:click="goToUserProfile">{{user.loginID ? user.loginID:"User"}}</a></li>
        <li><a href="#" v-on:click="logout">Logout</a></li>
        
    </ul>
  </nav>
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
        showSearch: false,
        showWaitingVerification: false,
        showWaitingApproval: false,
        showRejectedMembers: false,
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
      goToSearch () {
        this.expandList = false
        route.push('/member/search')
      },
      goToMemberList () {
        this.expandList = false
        route.push('/member/default')
      },
      goToWaitingForVerificationMemberList () {
        this.expandList = false
        $('#memberlist-table').removeClass('background-nonclickable')
        $('#seachFilter').removeClass('background-nonclickable')
        route.push('/member/waiting-verification')
        // route.push('/member/waiting/verification')
      },
      goToWaitingForApprovalMemberList () {
        this.expandList = false
        $('#memberlist-table').removeClass('background-nonclickable')
        $('#seachFilter').removeClass('background-nonclickable')
        console.log('waiting for approval clicked in menu component')
        route.push('/member/waiting-approval')
//        route.push('/member/waiting/approval')
      },
      goToRejectedMemberList () {
        this.expandList = false
        $('#memberlist-table').removeClass('background-nonclickable')
        $('#seachFilter').removeClass('background-nonclickable')
        route.push('/member/rejected')
//        route.push('/member/waiting/approval')
      },
      goToUserList () {
        this.expandList = false
        route.push('/user')
      },
      goToUserProfile () {
        this.expandList = false
        route.push('/user/change-password')
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
        this.showSearch = false
        this.showWaitingVerification = false
        this.showWaitingApproval = false
        this.showRejectedMembers = false
        this.showACL = false
        this.showManageService = false
        this.showUsers = false
        this.showConfiguration = false
        this.showLogout = false
        this.showProfile = false
        this.showModule = false
        if (menuName === 'home') {
          this.showHome = true
        } else if (menuName === 'search') {
          this.showSearch = true
        } else if (menuName === 'member') {
          this.showMembers = true
        } else if (menuName === 'memberVerification') {
          this.showWaitingVerification = true
        } else if (menuName === 'memberApproval') {
          this.showWaitingApproval = true
        } else if (menuName === 'memberRejected') {
          this.showRejectedMembers = true
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
        // Http.GET('user', ['login'])
        // .then(
        //   ({data: profile}) => {
        //     console.log(profile)
        //     console.log('hey')
        //     localStorage.setItem('user-profile', JSON.stringify(profile.data))
        //   }
        //   )
        const firstKey = this.$route.path.split('/')[1]
        const secondKey = this.$route.path.split('/')[2]
        console.log(firstKey, secondKey)
        if (firstKey === 'member') {
          if (secondKey === 'default') this.showMembers = true
          else if (secondKey === 'search') this.showSearch = true
          else if (secondKey === 'waiting-verification') this.showWaitingVerification = true
          else if (secondKey === 'waiting-approval') this.showWaitingApproval = true
          else if (secondKey === 'rejected') this.showRejectedMembers = true
          else if (secondKey === 'acl') this.showACL = true
        } else if (firstKey === 'manage') {
          if (secondKey === 'services') this.showManageService = true
        } else if (firstKey === 'home') {
          this.showHome = true
        }
      },
      sideBarCollapse () {
        $('#sidebar').toggleClass('active')
        this.$emit('update', 'false')
      }
    },
    created () {
      console.log('nav bar created::::')
      this.init()
    }
  }
</script>

<style>
  #sidebar a, a:hover, a:focus{
    color: #ffffff
  }
</style>