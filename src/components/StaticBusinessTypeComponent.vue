<template>
  <div class="gr-6 push-4 padding-5">
    <br>
    <h3 style="text-align: center;">Business Types</h3>
    <hr>

    <div v-if="showAddNewBusinessTypeButton">
      <button class="button-search" role="button" @click="showAddNewBusinessTypeModal">
        <i class="fa fa-plus"></i> Add New Business Type
      </button>
      <br>
    </div>

    <div v-if="businessTypeList.length > 0">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th style="text-align: center;">Status</th>
            <th style="text-align: center;">Edit</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="business, index in businessTypeList">
            <td>{{ index + 1}}</td>
            <td>{{ business.name || 'N/A'}}</td>
            <td style="text-align: center;">{{ business.status || 'N/A' }}</td>
            <td style="text-align: center;"> <a @click="showEditBusinessTypeModal"> <i class="fa fa-edit"></i> </a> </td>
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
    name: 'StaticBusinessTypeComponent',
    data () {
      return {
        businessTypeList: {},
        showAddNewBusinessTypeButton: true,
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
        console.log('Static Bank component created:::')
        this.showLoader = true
        Http.GET('resource', ['business', 'type'])
          .then(({data: response}) => {
            this.showLoader = false
            this.businessTypeList = response.data
            console.log('successfully got the list of banks: ', response)
          },
          error => {
            console.log('error in receiving bank list ', error)
            this.showLoader = false
            if (error.response && error.response.data.status === 401) {
              this.logout()
            }
          })
      },
      showEditBusinessTypeModal () {
        alert('Not implemented yet.')
      },
      showAddNewBusinessTypeModal () {
        alert('Not implemented yet.')
      }
    }
  }
</script>
