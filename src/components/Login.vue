<template>
 <div class="col-md-4 col-md-offset-4 ">
			<div class="box">
        <h1>iPay Member Service</h1>
				<form role="form" @submit.prevent="login" id="loginForm">

					<div class="divider-form"></div>

					<div class="form-group">
						<label for="username">Username</label>
						<input type="email" class="form-control" id="exampleInputEmail1" placeholder="Enter Username" v-model="username">
					</div>

					<div class="divider-form"></div>

					<div class="form-group">
						<label for="password">Password</label>
						<input type="password" class="form-control" id="password" placeholder="Password" v-model="password">
					</div>

					<div class="divider-form"></div>


					<button type="submit" class="btn-block btn btn-lg btn-primary">Login</button>

				</form>
			</div>
	</div>
</template>

<script>
  import Http from '../services/Http'
  // nimport auth from '../services/auth'
  import Util from '../services/Util'
  import route from '../router'

  export default{
    name: 'Login',
    data () {
      return {
        username: '',
        password: ''
      }
    },
    created () {
      console.log('login created::::')
      // if (this.$route.query.token) {
      //   console.log(this.$route.query.token)
      // }
      if (this.$route.query.token_status === 'false') {
        console.log(this.$route.query.token_status)
        this.init()
      } else if (this.$route.query.token) {
        localStorage.setItem('token', this.$route.query.token)
        // Http get request for permission list
        let paramData = '?login_id=' + this.$route.query.loginID + '&app_id=&limit=100&offset=0'
        Http.GET('apps', [paramData])
          .then(
            ({data: appsData}) => {
              console.log(appsData)
              localStorage.setItem('appsData', JSON.stringify(appsData.results))
            },
            error => {
              console.log('error in getting permission list: ', error)
            }
          )

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
        /**
          * Http requests for all the resources
          */
        Promise.all([
          Http.GET('resource', ['thana']),
          Http.GET('resource', ['district']),
          Http.GET('resource', ['branch']),
          Http.GET('resource', ['country']),
          Http.GET('resource', ['occupation']),
          Http.GET('resource', ['bank'])])
          .then(([
            {data: thana},
            {data: district},
            {data: branch},
            {data: country},
            {data: occupation},
            {data: bank}]) => {
            console.log('Success in retrieving all the resources.')
            localStorage.setItem('thana', JSON.stringify(thana.data))
            localStorage.setItem('district', JSON.stringify(district.data))
            localStorage.setItem('branch', JSON.stringify(branch.data))
            localStorage.setItem('country', JSON.stringify(country.data))
            localStorage.setItem('occupation', JSON.stringify(occupation.data))
            localStorage.setItem('bank', JSON.stringify(bank.data))
          },
          error => {
            console.log('Error in getting thana list, ', error)
          },
          error => {
            console.log('Error in getting district list, ', error)
          },
          error => {
            console.log('Error in getting branch list, ', error)
          },
          error => {
            console.log('Error in getting country list, ', error)
          },
          error => {
            console.log('Error in getting occupation list, ', error)
          },
          error => {
            console.log('Error in getting bank list, ', error)
          })
        // save login id
        let user = {'loginID': this.$route.query.loginID}
        localStorage.setItem('user', JSON.stringify(user))
      } else if (localStorage.getItem('token')) {
        route.push('/home')
      } else if (!localStorage.getItem('token')) {
        console.log('no token available in localstorage.')
        let authUri = Http.AUTH_HTTP_URI + 'accounts/?appID=6'
        window.location.href = authUri
      }
    },
    methods: {
      init () {
        console.log('here it is')
      },
      login: function (token = '') {
        const credentials = {
          loginID: this.username,
          password: this.password,
          appID: 6,
          deviceID: Util.getDeviceID() // 'bishwa'
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
              /**
               * Http requests for all the resources
               */
              Promise.all([
                Http.GET('resource', ['thana']),
                Http.GET('resource', ['district']),
                Http.GET('resource', ['branch']),
                Http.GET('resource', ['country']),
                Http.GET('resource', ['occupation']),
                Http.GET('resource', ['bank'])])
                .then(([
                  {data: thana},
                  {data: district},
                  {data: branch},
                  {data: country},
                  {data: occupation},
                  {data: bank}]) => {
                  console.log('Success in retrieving all the resources.')
                  localStorage.setItem('thana', JSON.stringify(thana.data))
                  localStorage.setItem('district', JSON.stringify(district.data))
                  localStorage.setItem('branch', JSON.stringify(branch.data))
                  localStorage.setItem('country', JSON.stringify(country.data))
                  localStorage.setItem('occupation', JSON.stringify(occupation.data))
                  localStorage.setItem('bank', JSON.stringify(bank.data))
                  let authUri = 'http://localhost:8000/admin-auth/accounts/?appID=2&token=' + data.token
                  // auth URI problem
                  if (this.username && this.password) {
                    window.location.href = authUri
                  }
                },
                error => {
                  console.log('Error in getting thana list, ', error)
                },
                error => {
                  console.log('Error in getting district list, ', error)
                },
                error => {
                  console.log('Error in getting branch list, ', error)
                },
                error => {
                  console.log('Error in getting country list, ', error)
                },
                error => {
                  console.log('Error in getting occupation list, ', error)
                },
                error => {
                  console.log('Error in getting bank list, ', error)
                })
              // save login id
              let user = {'loginID': this.username}
              localStorage.setItem('user', JSON.stringify(user))
            }
          )
      }
    }
  }
</script>
