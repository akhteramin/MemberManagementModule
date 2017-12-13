<template>
  <div class="gr-5 push-4 padding-5">
    <br>
    <h3 style="text-align: center;">Thanas</h3>
    <hr>

    <div>
      <div class="gr-4" v-if="showAddNewThanaButton">
        <button class="button-search" role="button" @click="showAddNewThanaModal">
          <i class="fa fa-plus"></i> Add New Thana
        </button>
      </div>
      <br><br>
      <div>
        <input class="gr-3 push-5" v-model="thanaSearch" placeholder="Thana name"
               style="height: 35px;"/>
      </div>
      <br>
    </div>

    <div v-if="thanaList.length > 0">
      <table class="table table-striped">
        <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>District</th>
          <th style="text-align: center;">Country</th>
          <th style="text-align: center;">Edit</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="thana, index in filterThanaEnabledList">
          <td>{{ index + 1}}</td>
          <td>{{ thana.name || 'N/A'}}</td>
          <td>{{ districtIdToDistrictName[thana.districtId] }}</td>
          <td style="text-align: center;">Bangladesh</td>
          <td style="text-align: center;"> <a @click="showEditThanaModal"> <i class="fa fa-edit"></i> </a> </td>
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
        thanaList: {},
        showAddNewThanaButton: true,
        showLoader: false,
        districtIdToDistrictName: {},
        thanaSearch: ''
      }
    },
    created () {
      this.init()
    },
    computed: {
      filterThanaEnabledList () {
        if (this.thanaList.length > 0) {
          return this.thanaList.filter(thana => {
            return thana.name.toLowerCase().includes(this.thanaSearch.toLowerCase())
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
        this.thanaList = JSON.parse(localStorage.getItem('thana'))
        this.districtIdToDistrictName = JSON.parse(localStorage.getItem('districtIdToDistrictName'))
      },
      showEditThanaModal () {
        alert('Not implemented yet.')
      },
      showAddNewThanaModal () {
        alert('Not implemented yet.')
      }
    }
  }
</script>
