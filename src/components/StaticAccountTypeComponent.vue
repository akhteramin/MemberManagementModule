<template>
  <div class="gr-6 push-4 padding-5">
    <br>
    <h3 style="text-align: center;">Account Types</h3>
    <hr>

    <div>
      <div class="gr-4" v-if="showAddNewAccountTypeButton">
        <button class="button-search" role="button" @click="showAddNewAccountTypeModal">
          <i class="fa fa-plus"></i> Add New Account Type
        </button>
      </div>
      <br><br>
      <div>
        <input class="gr-3 push-5" v-model="accountTypeSearch" placeholder="Account type"
               style="height: 35px;"/>
      </div>
      <br>
    </div>

    <div v-if="accountTypeList.length > 0">
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
          <tr v-for="account, index in filterAccountTypeEnabledList">
            <td>{{ index + 1}}</td>
            <td>{{ account.name || 'N/A'}}</td>
            <td style="text-align: center;">{{ account.description || 'N/A' }}</td>
            <td style="text-align: center;">{{ account.status || 'N/A' }}</td>
            <td style="text-align: center;"> <a @click="showEditAccountTypeModal"> <i class="fa fa-edit"></i> </a> </td>
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
    name: 'StaticAccountTypeComponent',
    data () {
      return {
        accountTypeList: {},
        showAddNewAccountTypeButton: true,
        showLoader: false,
        accountTypeSearch: ''
      }
    },
    created () {
      this.init()
    },
    computed: {
      filterAccountTypeEnabledList () {
        if (this.accountTypeList.length > 0) {
          return this.accountTypeList.filter(account => {
            return account.name.toLowerCase().includes(this.accountTypeSearch.toLowerCase())
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
        this.showLoader = true
        Http.GET('resource', ['account', 'type'])
          .then(({data: response}) => {
            this.showLoader = false
            this.accountTypeList = response.data
          },
          error => {
            this.showLoader = false
            if (error.response && error.response.data.status === 401) {
              this.logout()
            }
          })
      },
      showEditAccountTypeModal () {
        alert('Not implemented yet.')
      },
      showAddNewAccountTypeModal () {
        alert('Not implemented yet.')
      }
    }
  }
</script>
