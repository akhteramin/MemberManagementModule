import axios from 'axios'
import Http from '../services/Http'
import route from '../router'

axios.interceptors.request.use(
 (config) => {
   config.headers.common.token = localStorage.getItem('token')
   return config
 },
 (error) => Promise.reject(error)
)

axios.interceptors.response.use(
 (response) => {
   // console.log('intercepted http success...')
   return response
 },
 (error) => {
   console.log('intercepted http failure..., error is: ', error)
   if (error.response.status === 401 || error.response.status === 403) {
     console.log('401 or 403')
     console.log('console interceptor')
     $.notify({
       // options
       title: '<strong>Access denied!</strong>',
       message: 'You don\'t have permission to proceed.'
     }, {
       // settings
       type: 'danger',
       delay: 3000
     })
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
     route.push('/')
   }
   return Promise.reject(error)
 }
)

// const API_URL = 'http://192.168.1.134:8085/member-service/api/v1' // nafisa
// const API_URL = 'http://192.168.1.95:8085//member-service/api/v1' // muhit

// const API_URL = 'http://192.168.1.95:8085/member-service/api/v1'
// const API_URL = 'http://10.10.10.199:8085/member-service/api/v1'
// const AUTH_URL = 'http://localhost:9000/auth/api/v1'
// const AUTH_HTTP_URI = 'http://localhost:8000/'
// const AUTH_ACCOUNTS_URI = 'http://localhost:8000/accounts'
// const ADMIN_URI = 'http://localhost:8080'

// const API_URL = 'http://10.10.10.169:8085/member-service/api/v1'
const API_URL = 'http://10.10.10.199:8085/member-service/api/v1'
const AUTH_URL = 'http://10.10.40.31:8000/auth/api/v1'
const AUTH_HTTP_URI = 'http://10.10.40.31:8080/'
const AUTH_ACCOUNTS_URI = 'http://10.10.40.31:8080/accounts'
const ADMIN_URI = 'http://10.15.40.11:80/'

// const AUTH_URL = 'http://10.10.10.199:8000/auth/api/v1'
const IMAGE_URL = 'https://dev.ipay.com.bd'
const CRM_URI = 'http://10.10.10.169/login'

const routes = {
  apps: `${AUTH_URL}/user/get`,
  login: `${AUTH_URL}/login/`,
  permissions: `${AUTH_URL}/permissions/`,
  logout: `${AUTH_URL}/logout/`,
  resource: `${API_URL}/resource/`,
  member: `${API_URL}/member/`,
  verification: `${API_URL}/verify/member/`,
  user: `${API_URL}/user/`,
  offer: `${API_URL}/offer/business/member/`,
  aclUserGroup: `${API_URL}/member/acl/user-group/`,
  memberAclUpdate: `${API_URL}/member/acl/member/`,
  memberAclGet: `${API_URL}/member/acl/`
}

const encodeQueryData = (data) => {
  const ret = []
  let temp
  for (const d in data) {
    if (Object.prototype.hasOwnProperty.call(data, d)) {
     temp = data[d]
     if (temp !== '' && temp !== null) {
       ret.push(`${encodeURIComponent(d)}=${encodeURIComponent(temp)}`)
     }
   }
  }
  return ret.join('&')
}

const isEmpty = (obj) => Object.keys(obj).length === 0 && obj.constructor === Object

export default {
  GET (key, props = {}, params = {}) {
   let parameters = ''
   if (Object.prototype.toString.call(props) === '[object Array]') {
     parameters = props.length > 0 ? `/${props.join('/')}` : ''
   } else {
     parameters = !isEmpty(props) ? `?${encodeQueryData(props)}` : ''
   }

   // console.log('Http.js 54, parameters: ', parameters, ' I have shown the parameters')

   let additionalParams = ''
   if (Object.prototype.toString.call(params) === '[object Array]') {
     additionalParams = params.length > 0 ? `/${params.join('/')}` : ''
   } else {
     additionalParams = !isEmpty(params) ? `?${encodeQueryData(params)}` : ''
   }
   console.log('Line 60, http.js, key: ', key)
   const route = routes[key]
   console.log('Line 62, http.js parameters: ' + parameters)
   return axios.get(route.concat(parameters).concat(additionalParams))
 },
  POST (key, data, props = {}) {
   let parameters = ''
   if (Object.prototype.toString.call(props) === '[object Array]') {
     parameters = props.length > 0 ? `${props.join('/')}` : ''
   } else {
     parameters = !isEmpty(props) ? `?${encodeQueryData(props)}` : ''
   }

   const route = routes[key]
   console.log('Http POST, parameters:: ', route.concat(parameters), '\tdata: ', data)
   return axios.post(route.concat(parameters), data)
 },
 PUT (key, data, props = {}) {
   let parameters = ''
   if (Object.prototype.toString.call(props) === '[object Array]') {
     parameters = props.length > 0 ? `${props.join('/')}` : ''
   } else {
     parameters = !isEmpty(props) ? `?${encodeQueryData(props)}` : ''
   }

   const route = routes[key]
   return axios.put(route.concat(parameters), data)
 },
 DELETE (key, props = {}, data) {
   let parameters = ''
   if (Object.prototype.toString.call(props) === '[object Array]') {
     parameters = props.length > 0 ? `${props.join('/')}` : ''
   } else {
     parameters = !isEmpty(props) ? `?${encodeQueryData(props)}` : ''
   }

   const route = routes[key]
   return axios.delete(route.concat(parameters), data)
 },
 IMAGE_URL,
 AUTH_ACCOUNTS_URI,
 AUTH_HTTP_URI,
 ADMIN_URI,
 CRM_URI
}


