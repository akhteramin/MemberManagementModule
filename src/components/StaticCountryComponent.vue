<template>
  <div class="gr-5 push-4 padding-5">
    <br>
    <h3 style="text-align: center;">Countries</h3>
    <hr>

    <div>
      <div class="gr-4" v-if="showAddNewCountryButton">
        <button class="button-search" role="button" @click="showAddNewCountryModal">
          <i class="fa fa-plus"></i> Add New Country
        </button>
      </div>
      <br><br>
      <div>
        <input class="gr-3 push-5" v-model="countrySearch" placeholder="Country name"
               style="height: 35px;"/>
      </div>
      <br>
    </div>

    <div v-if="countryList.length > 0">
      <table class="table table-striped">
        <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Code</th>
          <th style="text-align: center;">Edit</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="country, index in filterCountryEnabledList">
          <td>{{ index + 1}}</td>
          <td>{{ country.name || 'N/A'}}</td>
          <td>{{ country.code }}</td>
          <td style="text-align: center;"> <a @click="showEditCountryModal"> <i class="fa fa-edit"></i> </a> </td>
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
    name: 'StaticCountryComponent',
    data () {
      return {
        countryList: {},
        showAddNewCountryButton: true,
        showLoader: false,
        countrySearch: ''
      }
    },
    created () {
      this.init()
    },
    computed: {
      filterCountryEnabledList () {
        if (this.countryList.length > 0) {
          return this.countryList.filter(country => {
            return country.name.toLowerCase().includes(this.countrySearch.toLowerCase())
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
        this.countryList = JSON.parse(localStorage.getItem('country'))
      },
      showEditCountryModal () {
        alert('Not implemented yet.')
      },
      showAddNewCountryModal () {
        alert('Not implemented yet.')
      }
    }
  }
</script>
