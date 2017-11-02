<template>
  <div class="login">
    <form class="form-login" @submit.prevent="login" id="loginForm">
      <label for="username">Username</label>
      <input  name="username" type="text" id="username" placeholder="username" v-model="username"/>
      <!--<span v-show="errors.has('username')"><small>This field is required</small>.</span>-->
      <label for="password">Password</label>
      <input name="password" type="password" id="password" placeholder="password" v-model="password"/>
      <!--<span v-show="errors.has('password')"><small>This field is required.</small></span>-->
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
  import Http from '../services/Http'
  // nimport auth from '../services/auth'
  // import Util from '../services/Util'
  import route from '../router'

  export default{
    name: 'Login',
    data () {
      return {
        username: '',
        password: ''
      }
    },
    methods: {
      login: function () {
        const credentials = {
          loginID: this.username,
          password: this.password,
          appID: 6,
          deviceID: 'bishwa'
        }
        console.log('login id: ' + this.username + ' password: ' + this.password)
        console.log('credentials.login: ' + credentials.loginID + ' credentials.password: ' + credentials.password)

        Http.POST('login', credentials)
          .then(
            ({ data }) => {
              console.log('SUCCESS, it worked!!!!!')
              console.log('data.message: ' + data.message)
              console.log('data token: ' + data.token)
              localStorage.setItem('token', data.token)
              // Http get request for thana ids
              Http.GET('resource', ['thana'])
                .then(
                  ({data: list}) => {
                    console.log('thana list: ', list)
                    localStorage.setItem('thana', JSON.stringify(list.data))
                    // auth.setAccessControl(list)
                  },
                  error => {
                    console.log('error in getting list: ', error)
                  }
                )
              // Http get request for district ids
              Http.GET('resource', ['district'])
                .then(
                  ({data: list}) => {
                    console.log('district list: ', list)
                    localStorage.setItem('district', JSON.stringify(list.data))
                    // auth.setAccessControl(list)
                  },
                  error => {
                    console.log('error in getting district list: ', error)
                  }
                )
              // Http get request for permission list
              Http.GET('permissions')
                .then(
                  ({data: list}) => {
                    console.log(list)
                    // auth.setAccessControl(list)
                    route.push('/home')
                  },
                  error => {
                    console.log('error in getting permission list: ', error)
                  }
                )
            }
          )
      }
    }
  }
</script>
