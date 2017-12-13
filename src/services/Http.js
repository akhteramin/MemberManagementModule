import axios from 'axios'

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
    return Promise.reject(error)
  }
)

// let apiUrl = 'http://10.10.10.199:8085/member-service/api/v1'
// const API_URL = 'http://192.168.1.134:8085/member-service/api/v1' // nafisa
// const API_URL = 'http://192.168.1.95:8085//member-service/api/v1' // muhit
const API_URL = 'http://10.10.10.199:8085/member-service/api/v1'
const AUTH_URL = 'http://10.10.10.199:8000/auth/api/v1'
const IMAGE_URL = 'https://dev.ipay.com.bd'

const routes = {
  member: `${API_URL}/member/`,
  login: `${AUTH_URL}/login/`,
  permissions: `${AUTH_URL}/permissions/`,
  resource: `${API_URL}/resource/`,
  logout: `${AUTH_URL}/logout/`,
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
  IMAGE_URL
}
