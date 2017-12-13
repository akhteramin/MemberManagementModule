<template>
  <div class="gr-6 push-4 padding-5">
    <br>
    <h3 style="text-align: center;">Account Classes</h3>
    <hr>

    <div v-if="showAddNewAccountClassButton">
      <button class="button-search" role="button" @click="showAddNewAccountClassModal">
        <i class="fa fa-plus"></i> Add New Account Class
      </button>
      <br>
    </div>

    <div v-if="accountClassList.length > 0">
      <table class="table table-striped">
        <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th style="text-align: center;">Description</th>
          <th style="text-align: center;">Status</th>
          <th style="text-align: center;">Edit</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="account, index in accountClassList">
          <td>{{ index + 1}}</td>
          <td>{{ account.name || 'N/A'}}</td>
          <td style="text-align: center;">{{ account.description || 'N/A' }}</td>
          <td style="text-align: center;">{{ account.status || 'N/A' }}</td>
          <td style="text-align: center;"> <a @click="showEditAccountClassModal"> <i class="fa fa-edit"></i> </a> </td>
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
    name: 'StaticAccountClassComponent',
    data () {
      return {
        accountClassList: {},
        showAddNewAccountClassButton: true,
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
        this.showLoader = true
        Http.GET('resource', ['account', 'class'])
        .then(({data: response}) => {
          this.showLoader = false
          this.accountClassList = response.data
        },
        error => {
          this.showLoader = false
          if (error.response && error.response.data.status === 401) {
            this.logout()
          }
        })
      },
      showEditAccountClassModal () {
        alert('Not implemented yet.')
      },
      showAddNewAccountClassModal () {
        alert('Not implemented yet.')
      }
    }
  }
</script>
