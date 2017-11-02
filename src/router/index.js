import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import ListRenderer from '@/components/ListRenderer'
import Home from '@/components/Home'
import MemberBasicInfo from '@/components/MemberBasicInfo'

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
      name: 'ListRenderer',
      component: ListRenderer
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/member/:id',
      name: 'MemberBasicInformation',
      component: MemberBasicInfo,
      props: true
    }
  ]
})