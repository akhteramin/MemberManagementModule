<template>
  <div class="gr-8 push-3 padding-5">
    <br>
    <h3 style="text-align: center;">Banks</h3>
    <hr>

    <div v-if="showAddBankButton">
      <button class="button-search" role="button" @click="showAddBankModal">
        <i class="fa fa-plus"></i> Add New Bank
      </button>
      <br>
    </div>

    <div v-if="bankList.length > 0">
      <table class="table table-striped">
        <thead>
        <tr>
          <th>#</th>
          <th style="text-align: center;">Code</th>
          <th>Name</th>
          <th style="text-align: center;">Status</th>
          <th style="text-align: center;">Edit</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="bank, index in bankList">
          <td>{{ index + 1}}</td>
          <td style="text-align: center;">{{ bank.bankCode || 'N/A'}}</td>
          <td>{{ bank.bankName || 'N/A'}}</td>
          <td style="text-align: center;">{{ bank.status || 'N/A' }}</td>
          <td style="text-align: center;"> <a @click="showEditBankModal"> <i class="fa fa-edit"></i> </a> </td>
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
    name: 'StaticBankComponent',
    data () {
      return {
        bankList: {},
        showAddBankButton: true,
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
        Http.GET('resource', ['bank'])
          .then(({data: response}) => {
            this.showLoader = false
            this.bankList = response.data
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
      showEditBankModal () {
        alert('Not implemented yet.')
      },
      showAddBankModal () {
        alert('Not implemented yet.')
      }
    }
  }
</script>
