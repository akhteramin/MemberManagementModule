<template>
  <div class="gr-5 push-4 padding-5">
    <br>
    <h3 style="text-align: center;">Districts</h3>
    <hr>

    <div>
      <div class="gr-4" v-if="showAddNewDistrictButton">
        <button class="button-search" role="button" @click="showAddNewDistrictModal">
          <i class="fa fa-plus"></i> Add New District
        </button>
      </div>
      <br><br>
      <div>
        <input class="gr-3 push-5" v-model="districtSearch" placeholder="District name"
               style="height: 35px;"/>
      </div>
      <br>
    </div>

    <div v-if="districtList.length > 0">
      <table class="table table-striped">
        <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th style="text-align: center;">Country</th>
          <th style="text-align: center;">Edit</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="district, index in filterDistrictEnabledList">
          <td>{{ index + 1}}</td>
          <td>{{ district.name || 'N/A'}}</td>
          <td style="text-align: center;">Bangladesh</td>
          <td style="text-align: center;"> <a @click="showEditDistrictModal"> <i class="fa fa-edit"></i> </a> </td>
        </tr>
        </tbody>
      </table>
      <hr>
    </div>

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

  </div>
</template>

<script>
  import Http from '../services/Http'
  import route from '../router'

  export default {
    name: 'StaticDistrictComponent',
    data () {
      return {
        districtListList: {},
        showAddNewDistrictButton: true,
        showLoader: false,
        districtSearch: ''
      }
    },
    created () {
      this.init()
    },
    computed: {
      filterDistrictEnabledList () {
        if (this.districtList.length > 0) {
          return this.districtList.filter(district => {
            return district.name.toLowerCase().includes(this.districtSearch.toLowerCase())
          })
        }
      }
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
        this.districtList = JSON.parse(localStorage.getItem('district'))
//        Http.GET('resource', ['bank'])
//          .then(({data: response}) => {
//            this.showLoader = false
//            this.districtList = response.data
//            console.log('successfully got the list of banks: ', response)
//          },
//          error => {
//            console.log('error in receiving bank list ', error)
//            this.showLoader = false
//            if (error.response && error.response.data.status === 401) {
//              this.logout()
//            }
//          })
      },
      showEditDistrictModal () {
        alert('Not implemented yet.')
      },
      showAddNewDistrictModal () {
        alert('Not implemented yet.')
      }
    }
  }
</script>
