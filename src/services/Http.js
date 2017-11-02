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
    console.log('intercepted http success...')
    return response
  },
  (error) => {
    console.log('intercepted http failure...')
    return Promise.reject(error)
  }
)

// let apiUrl = 'http://10.10.10.199:8085/member-service/api/v1'
const API_URL = 'http://10.10.10.199:8085/member-service/api/v1'
const AUTH_URL = 'http://10.10.10.199:8000/auth/api/v1'

const routes = {
  member: `${API_URL}/member/`,
  login: `${AUTH_URL}/login/`,
  permissions: `${AUTH_URL}/permissions/`,
  resource: `${API_URL}/resource/`,
  logout: `${AUTH_URL}/logout/`
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

    console.log('Http.js 54, parameters: ', parameters, ' I have shown the parameters')

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
      parameters = props.length > 0 ? `/${props.join('/')}` : ''
    } else {
      parameters = !isEmpty(props) ? `?${encodeQueryData(props)}` : ''
    }

    const route = routes[key]
    return axios.post(route.concat(parameters), data)
  }
}