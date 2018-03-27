import router from '../router'
import Http from '../services/Http'

export default {

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
    router.push('/login')
  },

  isAuthenticated () {
    console.log('checking auth status...')
    const authStatus = localStorage.getItem('token')
    return authStatus
  }

}
