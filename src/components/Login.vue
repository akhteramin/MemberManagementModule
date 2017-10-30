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
              // console.log('data list: ' + {data: list})
              // auth.login(data.token)
              Http.GET('permissions')
                .then(
                  ({data: list}) => {
                    console.log(list)
                    // auth.setAccessControl(list)
                    route.push('/home')
                  }
                )
            }
          )
      }
    }
  }
</script>
