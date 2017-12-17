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
    methods: {
      login: function () {
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
//              console.log('SUCCESS, it worked!!!!!')
//              console.log('data.message: ' + data.message)
//              console.log('data token: ' + data.token)
              localStorage.setItem('token', data.token)
              // Http get request for permission list
              Http.GET('permissions')
                .then(
                  ({data: list}) => {
                    console.log(list)
                    // auth.setAccessControl(list)
                    localStorage.setItem('accessControlList', list.map(x => x.serviceID))
                    console.log(localStorage.getItem('accessControlList'))
                    Util.getAccessibleMenu()
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
                  this.hashBankCodeToBankNameAndStore(bank.data)
                  this.hashDistrictIdToDistrictNameAndStore(district.data)
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
      },
      hashBankCodeToBankNameAndStore (bankData) {
        console.log('bankData: ', bankData)
        let bankCodeToBankName = {}
        for (let indx in bankData) {
          let bank = bankData[indx]
          bankCodeToBankName[bank.bankCode] = bank.bankName
        }
        bankCodeToBankName = JSON.stringify(bankCodeToBankName)
        console.log('bankCodeToBankName: ', bankCodeToBankName)
        localStorage.setItem('bankCodeToBankName', bankCodeToBankName)
      },
      hashDistrictIdToDistrictNameAndStore (districtData) {
        let districtIdToDistrictName = {}
        for (let indx in districtData) {
          let district = districtData[indx]
          districtIdToDistrictName[district.id] = district.name
        }
        districtIdToDistrictName = JSON.stringify(districtIdToDistrictName)
        localStorage.setItem('districtIdToDistrictName', districtIdToDistrictName)
      }
    }
  }
</script>
