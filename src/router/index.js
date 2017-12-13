import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import MemberList from '@/components/MemberListComponent'
import WaitingForVerificationList from '@/components/WaitingForVerificationListComponent'
import WaitingForApprovalList from '@/components/WaitingForApprovalListComponent'
import Home from '@/components/Home'
import MemberIndividualComponent from '@/components/MemberIndividualComponent'
import UserListComponent from '@/components/UserListComponent'
import UserIndividualComponent from '@/components/UserIndividualComponent'
import StaticOccupationComponent from '@/components/StaticOccupationComponent'
import StaticBankComponent from '@/components/StaticBankComponent'
import StaticBranchComponent from '@/components/StaticBranchComponent'
import StaticDistrictComponent from '@/components/StaticDistrictComponent'
import StaticThanaComponent from '@/components/StaticThanaComponent'
import StaticCountryComponent from '@/components/StaticCountryComponent'
import StaticBusinessTypeComponent from '@/components/StaticBusinessTypeComponent'
import StaticAccountTypeComponent from '@/components/StaticAccountTypeComponent'
import StaticAccountClassComponent from '@/components/StaticAccountClassComponent'

Vue.use(Router)

// router.beforeEach((to, from, next) => {
//   console.log('before route change...', from.name, '->', to.name);
//   const authRequired = to.matched.some(route => route.meta.requiresAuth);
//   if (authRequired && !auth.isAuthenticated()) {
//     console.log('unauthorized. redirecting to login...');
//     next('/login');
//   } else if (authRequired && auth.isAuthenticated()) {
//     const menuList = localStorage.getItem('menu');
//     if (menuList.indexOf(to.name) === -1) {
//       console.log('access denied to:', to.name);
//       // this case is added due to UnsolvedTicketList being set as home
//       // change it when home/dashboard gets a standard revision
//       if (to.name === 'UnsolvedTicketList') auth.logout();
//       else next('/');
//     } else {
//       // default route
//       console.log('going with provided route...');
//       next();
//     }
//   } else {
//     // default route
//     console.log('going with provided route...');
//     next();
//   }
// })

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/member',
      name: 'MemberList',
      component: MemberList
    },
    {
      path: '/member/waiting/verification',
      name: 'WaitingForVerificationList',
      component: WaitingForVerificationList
    },
    {
      path: '/member/waiting/approval',
      name: 'WaitingForApprovalList',
      component: WaitingForApprovalList
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/member/profile/:id/:accountType',
      name: 'MemberIndividualComponent',
      component: MemberIndividualComponent,
      props: true
    },
    {
      path: '/user',
      name: 'UserListComponent',
      component: UserListComponent
    },
    {
      path: '/user/:loginID',
      name: 'UserIndividualComponent',
      component: UserIndividualComponent,
      props: true
    },
    {
      path: '/occupation',
      name: 'StaticOccupationComponent',
      component: StaticOccupationComponent
    },
    {
      path: '/bank',
      name: 'StaticBankComponent',
      component: StaticBankComponent
    },
    {
      path: '/branch',
      name: 'StaticBranchComponent',
      component: StaticBranchComponent
    },
    {
      path: '/district',
      name: 'StaticDistrictComponent',
      component: StaticDistrictComponent
    },
    {
      path: '/thana',
      name: 'StaticThanaComponent',
      component: StaticThanaComponent
    },
    {
      path: '/country',
      name: 'StaticCountryComponent',
      component: StaticCountryComponent
    },
    {
      path: '/business-type',
      name: 'StaticBusinessTypeComponent',
      component: StaticBusinessTypeComponent
    },
    {
      path: '/account-type',
      name: 'StaticAccountTypeComponent',
      component: StaticAccountTypeComponent
    },
    {
      path: '/account-class',
      name: 'StaticAccountClassComponent',
      component: StaticAccountClassComponent
    }
  ]
})
