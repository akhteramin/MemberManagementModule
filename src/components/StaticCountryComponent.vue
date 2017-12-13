<template>
  <div class="gr-5 push-4 padding-5">
    <br>
    <h3 style="text-align: center;">Countries</h3>
    <hr>

    <div v-if="showAddNewCountryButton">
      <button class="button-search" role="button" @click="showAddNewCountryModal">
        <i class="fa fa-plus"></i> Add New Country
      </button>
      <br>
    </div>

    <div v-if="countryList.length > 0">
      <table class="table table-striped">
        <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>code</th>
          <th style="text-align: center;">Edit</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="country, index in countryList">
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
        showLoader: false
      }
    },
    created () {
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
