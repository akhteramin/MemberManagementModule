<template>
 <div class="col-md-4 col-md-offset-4 ">
   <div v-if="showComponent">
     <div class="box">
       <h1>iPay Admin</h1>
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
        password: '',
        showComponent: false
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
        let paramData = '?login_id=' + this.$route.query.loginID + '&is_active=True&app_id=&limit=100&offset=0'
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
              localStorage.setItem('accessControlList', list.map(x => x.serviceID))
              console.log(localStorage.getItem('accessControlList'))
              Util.getAccessibleMenu()
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
          // Http.GET('resource', ['branch']),
          Http.GET('resource', ['country']),
          Http.GET('resource', ['occupation']),
          Http.GET('resource', ['bank']),
          Http.GET('resource', ['business-type'])])
          .then(([
            {data: thana},
            {data: district},
            // {data: branch},
            {data: country},
            {data: occupation},
            {data: bank},
            {data: businessType}]) => {
            console.log('Success in retrieving all the resources.')
            localStorage.setItem('thana', JSON.stringify(thana.data))
            localStorage.setItem('district', JSON.stringify(district.data))
            // localStorage.setItem('branch', JSON.stringify(branch.data))
            localStorage.setItem('country', JSON.stringify(country.data))
            localStorage.setItem('occupation', JSON.stringify(occupation.data))
            localStorage.setItem('bank', JSON.stringify(bank.data))
            localStorage.setItem('businessType', JSON.stringify(businessType.data))
            this.hashBankCodeToBankNameAndStore(bank.data)
            this.hashDistrictIdToDistrictNameAndStore(district.data)
          },
          error => {
            console.log('Error in getting thana list, ', error)
          },
          error => {
            console.log('Error in getting district list, ', error)
          },
          // error => {
          //   console.log('Error in getting branch list, ', error)
          // },
          error => {
            console.log('Error in getting country list, ', error)
          },
          error => {
            console.log('Error in getting occupation list, ', error)
          },
          error => {
            console.log('Error in getting bank list, ', error)
          },
          error => {
            console.log('Error in getting business-type list, ', error)
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
      hashBankCodeToBankNameAndStore (bankData) {
        console.log('hashing bank data in login: ', bankData)
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
        console.log('hashing district id to district name::: ', districtData)
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
