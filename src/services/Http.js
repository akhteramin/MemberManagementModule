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

// DYNAMIC URL CONFIG

let apiUrl = ''
let authUrl = ''
let authHttpUrl = ''
let adminUrl = ''
let imageUrl = ''
let crmUrl = ''

const setApiUrl = () => {
  if (apiUrl.length) return apiUrl

  let ENV = 'www'
  const [domain] = window.location.hostname.split('.')
  const mapper = {
    verification: '10.200.40.206',
    adminnew: '10.15.40.10',
    localhost: '10.10.10.10',
    192: '10.10.10.10',
    10: '10.10.10.10'
  }

  if (typeof domain !== 'undefined') {
    ENV = domain.substring(0, 4) === 'test' ? domain.split('.')[0] : mapper[domain]
  }

  // console.log('ENV: ', ENV);

  if (domain === 'verification') apiUrl = `${ENV}:9001`
  else if (domain === 'adminnew') apiUrl = `${ENV}:9001`
  else if (ENV.substring(0, 3) === '10.' || ENV.substring(0, 4) === '192.' || domain === 'localhost') apiUrl = `${ENV}:9001`
  else apiUrl = `${ENV}.ipay.com.bd`

  return apiUrl
}

const setAuthUrl = () => {
  if (authUrl.length) return authUrl

  let ENV = 'www'
  const [domain] = window.location.hostname.split('.')
  const mapper = {
    verification: '10.200.40.203',
    adminnew: '10.10.40.31',
    localhost: '10.10.10.199',
    192: '10.10.10.199',
    10: '10.10.10.199'
  }

  if (typeof domain !== 'undefined') {
    ENV = domain.substring(0, 4) === 'test' ? domain.split('.')[0] : mapper[domain]
  }

  // console.log('ENV: ', ENV);
  if (domain === 'verification') authUrl = `${ENV}:7000`
  else if (domain === 'adminnew') authUrl = `${ENV}:8000`
  else if (ENV.substring(0, 3) === '10.' || ENV.substring(0, 4) === '192.' || domain === 'localhost') authUrl = `${ENV}:8000`
  else authUrl = `${ENV}.ipay.com.bd`

  return authUrl
}

const setAuthHttpUrl = () => {
  if (authHttpUrl.length) return authHttpUrl

  let ENV = 'www'
  const [domain] = window.location.hostname.split('.')
  const mapper = {
    verification: 'centralauth',
    adminnew: '10.10.40.31',
    localhost: '10.10.10.199',
    192: '10.10.10.199',
    10: '10.10.10.199'
  }

  if (typeof domain !== 'undefined') {
    ENV = domain.substring(0, 4) === 'test' ? domain.split('.')[0] : mapper[domain]
  }

  // console.log('ENV: ', ENV);
  if (domain === 'adminnew') authHttpUrl = `${ENV}:8080`
  else if (domain === 'localhost') authHttpUrl = `${ENV}:9000`
  else if (ENV.substring(0, 3) === '10.' || ENV.substring(0, 3) === '192.') authHttpUrl = `${ENV}:9000`
  else authHttpUrl = `${ENV}.ipay.com.bd`

  return authHttpUrl
}

const setAdminUrl = () => {
  if (adminUrl.length) return adminUrl

  let ENV = 'www'
  const [domain] = window.location.hostname.split('.')
  const mapper = {
    verification: 'verification',
    adminnew: 'adminnew',
    localhost: 'localhost',
    192: '10.10.10.10',
    10: '10.10.10.10'
  }

  if (typeof domain !== 'undefined') {
    ENV = domain.substring(0, 4) === 'test' ? domain.split('.')[0] : mapper[domain]
  }

  // console.log('ENV: ', ENV);
  if (domain === 'localhost') adminUrl = `${ENV}:8080`
  else if (ENV.substring(0, 3) === '10.') adminUrl = `${ENV}:9009`
  else adminUrl = `${ENV}.ipay.com.bd`

  return adminUrl
}

const setImageUrl = () => {
  if (imageUrl.length) return imageUrl

  let ENV = 'www'
  const [domain] = window.location.hostname.split('.')
  const mapper = {
    verification: 'www',
    adminnew: 'test',
    localhost: 'dev',
    192: 'dev',
    10: 'dev'
  }

  if (typeof domain !== 'undefined') {
    ENV = domain.substring(0, 4) === 'test' ? domain.split('.')[0] : mapper[domain]
  }

  // console.log('ENV: ', ENV);
  imageUrl = `${ENV}.ipay.com.bd`

  return imageUrl
}

const setCrmUrl = () => {
  if (crmUrl.length) return crmUrl

  let ENV = 'www'
  const [domain] = window.location.hostname.split('.')
  const mapper = {
    verification: 'crmnew',
    adminnew: '10.10.10.169/login',
    localhost: '10.10.10.169/login',
    192: '10.10.10.169/login',
    10: '10.10.10.169/login'
  }

  if (typeof domain !== 'undefined') {
    ENV = domain.substring(0, 4) === 'test' ? domain.split('.')[0] : mapper[domain]
  }

  if (domain === 'verification') crmUrl = `${ENV}.ipay.com.bd`
  else crmUrl = `${ENV}`

  return crmUrl
}

setApiUrl()
setAuthUrl()
setAuthHttpUrl()
setAdminUrl()
setImageUrl()
setCrmUrl()

const MM_ADMIN_URL = `http://${setApiUrl()}/api/v1`
const AUTH_URL = `http://${setAuthUrl()}/auth/api/v1`
const AUTH_HTTP_URI = `http://${setAuthHttpUrl()}/`
const AUTH_ACCOUNTS_URI = `http://${setAuthHttpUrl()}/accounts`
const ADMIN_URI = `http://${setAdminUrl()}/`
const IMAGE_URL = `http://${setImageUrl()}/`
const CRM_URI = `http://${setCrmUrl()}/`

/// //dev/test configuration///////
// const MM_ADMIN_URL = 'http://192.168.1.184:9001/api/v1'
// const API_URL = 'http://10.10.10.169:8085/member-service/api/v1'
// const API_URL = 'http://10.10.10.199:8085/member-service/api/v1'
// const MM_ADMIN_URL = 'http://192.168.1.221:9001/api/v1' // dev
// const MM_ADMIN_URL = 'http://10.15.40.10:9001/api/v1' // test
// const AUTH_URL = 'http://10.10.40.31:8000/auth/api/v1' // test
// // const AUTH_URL = 'http://10.10.10.199:8000/auth/api/v1' // dev
// const AUTH_HTTP_URI = 'http://10.10.40.31:8080/' // test
// const AUTH_ACCOUNTS_URI = 'http://10.10.40.31:8080/accounts' // test
// // const AUTH_HTTP_URI = 'http://10.10.10.199:9000/' //dev
// // const AUTH_ACCOUNTS_URI = 'http://10.10.10.199:9000/accounts' //dev
// const ADMIN_URI = 'http://10.15.40.11:80/'
// const ADMIN_URI = 'http://localhost:8081/'

// /// /live////
// const MM_ADMIN_URL = 'http://10.200.40.206:9001/api/v1'
// const AUTH_URL = 'http://10.200.40.203:7000/auth/api/v1'
// const AUTH_HTTP_URI = 'http://centralauth.ipay.com.bd/'
// const AUTH_ACCOUNTS_URI = 'http://centralauth.ipay.com.bd/accounts'
// const ADMIN_URI = 'http://verification.ipay.com.bd'

// const AUTH_URL = 'http://10.10.10.199:8000/auth/api/v1'
// const IMAGE_URL = 'https://dev.ipay.com.bd'
// const IMAGE_URL = 'https://www.ipay.com.bd'
// const IMAGE_URL = 'https://test.ipay.com.bd'

// const CRM_URI = 'http://10.10.10.169/login'
// const CRM_URI = 'http://crmnew.ipay.com.bd'

const routes = {
  apps: `${AUTH_URL}/user/get`,
  login: `${AUTH_URL}/login/`,
  permissions: `${AUTH_URL}/permissions/`,
  logout: `${AUTH_URL}/logout/`,
  changePassword: `${AUTH_URL}/password/change/`,
  resource: `${MM_ADMIN_URL}/ms/resource/`,
  // twofactor: `${API_URL}/configuration/2fa/`,
  member: `${MM_ADMIN_URL}/ms/member/`,
  mmAdminMember: `${MM_ADMIN_URL}/admin/internal/user/`,
  mmAdminBusiness: `${MM_ADMIN_URL}/admin/internal/business/`,
  verification: `${MM_ADMIN_URL}/ms/verify/member/`,
  // user: `${API_URL}/user/`,
  mmAdminUser: `${MM_ADMIN_URL}/ms/admin/user/`,
  // offer: `${API_URL}/offer/business/member/`,
  aclUserGroup: `${MM_ADMIN_URL}/acl/groups/`,
  memberAclUpdate: `${MM_ADMIN_URL}/acl/users/`,
  memberAclGet: `${MM_ADMIN_URL}/acl/`,
  memberVerificationMetrics: `${MM_ADMIN_URL}/ms/metrics/`
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
  GET (key, props = {}, params = {}, requestConfig = {}) {
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
    return axios.get(route.concat(parameters).concat(additionalParams), requestConfig)
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
