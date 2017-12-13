<template>
  <div>
    <div class="loaders loading" v-if="showLoader">
      <div class="loader">
        <div class="loader-inner ball-grid-pulse">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>

    <div v-if="nameList.length > 0" class="gr-4 push-3">
      <br>
      <table class="table table-striped">
        <thead>
          <tr>
            <th style="text-align: center;">Name</th>
            <th style="text-align: center;">Frequency</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in nameList">

            <td style="text-align: left;">{{ entry.name }}</td>

            <td style="text-align: center">{{ entry.frequency }}</td>

          </tr>
        </tbody>
      </table>
    </div>
    <div v-else style="text-align: center;">
      <h3><strong>NO LIKELY NAMES</strong> </h3>
    </div>

  </div>
</template>

<script>
  import Http from '../services/Http'
  import route from '../router'
  export default {
    name: 'MemberLikelyNamesComponent',
    props: [
      'mobileNumber'
    ],
    data () {
      return {
        nameList: {},
        showLoader: false
      }
    },
    created () {
      console.log('member likely names component created with mobileNumber: ', this.mobileNumber)
      this.init()
    },
    methods: {
      logout () {
        Http.GET('logout')
          .then(
            ({data: list}) => {
              console.log(list)
              console.log('hey')
              // auth.setAccessControl(list)
              localStorage.removeItem('token')
              route.push('/')
            }
          )
      },
      init () {
        console.log('Hello')
        this.showLoader = true
        let parameter = {
          'mobileNumber': this.mobileNumber
        }
        // parameter.mobileNumber = '+8801930236786'
        console.log('calling with mobileNumber: ', parameter)
        Http.GET('member', ['likely-names'], parameter)
          .then(({data: likely_names}) => {
            this.showLoader = false
            this.nameList = likely_names.data.likelyNameList
            console.log('Success, got likely names: ', this.nameList)
          }, error => {
            this.showLoader = false
            if (error.response) {
              if (error.response.status === 401) { // unauthorized, logging out.
                this.logout()
              }
            }
            console.error('Error in getting likely names: ', error)
          })
      }
    }
  }
</script>
