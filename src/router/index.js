import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import MemberList from '@/components/MemberList/MemberListComponent'
import DeepSearch from '@/components/MemberList/DeepSearchComponent'
import Home from '@/components/Home'
import MemberIndividualComponent from '@/components/MemberProfile/MemberIndividualComponent'
import UserListComponent from '@/components/User/UserListComponent'
import UserIndividualComponent from '@/components/User/UserOwnIndividualComponent'
import UserIndividualProfileComponent from '@/components/User/UserIndividualProfileComponent'
import UserPasswordChangeComponent from '@/components/User/UserPasswordChangeComponent'

import MemberAclGroup from '@/components/ACL/MemberAclGroupComponent'
import StaticOccupationComponent from '@/components/Configuration/StaticOccupationComponent'
import StaticTwoFactorAuthenticationComponent from '@/components/Configuration/StaticTwoFactorAuthenticationComponent'
import StaticBankComponent from '@/components/Configuration/StaticBankComponent'
import StaticBranchComponent from '@/components/Configuration/StaticBranchComponent'
import StaticDistrictComponent from '@/components/Configuration/StaticDistrictComponent'
import StaticThanaComponent from '@/components/Configuration/StaticThanaComponent'
import StaticCountryComponent from '@/components/Configuration/StaticCountryComponent'
import StaticBusinessTypeComponent from '@/components/Configuration/StaticBusinessTypeComponent'
import StaticAccountTypeComponent from '@/components/Configuration/StaticAccountTypeComponent'
import StaticAccountClassComponent from '@/components/Configuration/StaticAccountClassComponent'
import ManageServicesComponent from '@/components/ACL/ManageServicesComponent'
import auth from '../services/auth'

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

// const waiting_approval = 'waiting-approval'
// const waiting_verification = 'waiting-verification'

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/member/search',
      name: 'DeepSearch',
      component: DeepSearch,
      // props: true,
      // auth check
      meta: { requiresAuth: true }
    },
    {
      path: '/member/:listType',
      name: 'MemberList',
      component: MemberList,
      props: true,
      // auth check
      meta: { requiresAuth: true }
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      // redirect: '/member/default',
      // auth check
      meta: { requiresAuth: true }
    },
    {
      path: '/member/profile/:id/:accountType',
      name: 'MemberIndividualComponent',
      component: MemberIndividualComponent,
      props: true,
      // auth check
      meta: { requiresAuth: true }
    },
    {
      path: '/user',
      name: 'UserListComponent',
      component: UserListComponent,
      // auth check
      meta: { requiresAuth: true }
    },
    // {
    //   path: '/user/:loginID',
    //   name: 'UserIndividualComponent',
    //   component: UserIndividualComponent,
    //   props: true
    //   // auth check
    //   // meta: { requiresAuth: true }
    // },
    {
      path: '/user/change-password',
      name: 'UserPasswordChangeComponent',
      component: UserPasswordChangeComponent
      // props: true
      // auth check
      // meta: { requiresAuth: true }
    },
    {
      path: '/user/profile/:id',
      name: 'UserIndividualProfileComponent',
      component: UserIndividualProfileComponent,
      props: true
    },
    {
      path: '/member/acl/group',
      name: 'MemberAclGroup',
      component: MemberAclGroup,
      // auth check
      meta: { requiresAuth: true }
    },
    {
      path: '/occupation',
      name: 'StaticOccupationComponent',
      component: StaticOccupationComponent,
      // auth check
      meta: { requiresAuth: true }
    },
    {
      path: '/2fa',
      name: 'StaticTwoFactorAuthenticationComponent',
      component: StaticTwoFactorAuthenticationComponent,
      // auth check
      meta: { requiresAuth: true }
    },
    {
      path: '/bank',
      name: 'StaticBankComponent',
      component: StaticBankComponent,
      // auth check
      meta: { requiresAuth: true }
    },
    {
      path: '/branch',
      name: 'StaticBranchComponent',
      component: StaticBranchComponent,
      // auth check
      meta: { requiresAuth: true }
    },
    {
      path: '/district',
      name: 'StaticDistrictComponent',
      component: StaticDistrictComponent,
      // auth check
      meta: { requiresAuth: true }
    },
    {
      path: '/thana',
      name: 'StaticThanaComponent',
      component: StaticThanaComponent,
      // auth check
      meta: { requiresAuth: true }
    },
    {
      path: '/country',
      name: 'StaticCountryComponent',
      component: StaticCountryComponent,
      // auth check
      meta: { requiresAuth: true }
    },
    {
      path: '/business-type',
      name: 'StaticBusinessTypeComponent',
      component: StaticBusinessTypeComponent,
      // auth check
      meta: { requiresAuth: true }
    },
    {
      path: '/account-type',
      name: 'StaticAccountTypeComponent',
      component: StaticAccountTypeComponent,
      // auth check
      meta: { requiresAuth: true }
    },
    {
      path: '/account-class',
      name: 'StaticAccountClassComponent',
      component: StaticAccountClassComponent,
      // auth check
      meta: { requiresAuth: true }
    },
    {
      path: '/manage/services',
      name: 'ManageServicesComponent',
      component: ManageServicesComponent,
      // auth check
      meta: { requiresAuth: true }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log('before route change...', from.name, '->', to.name)
  const authRequired = to.matched.some(route => route.meta.requiresAuth)
  if (authRequired && !auth.isAuthenticated()) {
    console.log('unauthorized. redirecting to login...')
    next('/login')
  } else if (authRequired && auth.isAuthenticated()) {
    const menuList = localStorage.getItem('menu')
    if (menuList.indexOf(to.name) === -1) {
      console.log('access denied to:', to.name)
      auth.logout()
    } else {
      // default route
      console.log('going with provided route...')
      next()
    }
  } else {
    // default route
    console.log('going with provided route...')
    next()
  }
})

export default router
