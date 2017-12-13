<template>
  <div class="gr-8 push-3 padding-5">
    <br>
    <h3 style="text-align: center;">Branches</h3>
    <hr>


    <div>
      <div class="gr-4" v-if="showAddBranchButton">
        <button class="button-search" role="button" @click="showAddBranchModal">
          <i class="fa fa-plus"></i> Add New Branch
        </button>
      </div>
      <br><br>
      <div>
        <input class="gr-3 push-5" v-model="branchSearch" placeholder="Branch name"
               style="height: 35px;"/>
      </div>
      <br>
    </div>

    <div v-if="branchList.length > 0">
      <table class="table table-striped">
        <thead>
        <tr>
          <th style="width: 40px;">#</th>
          <th style="width: 400px;">Branch Name</th>
          <th style="width: 300px;">Bank Name</th>
          <th style="width: 200px;">Routing Number</th>
          <th style="width: 200px;">District</th>
          <th style="width: 40px;">Edit</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="branch, index in filterBranchEnabledList">
          <td>{{ index + 1}}</td>
          <td style="width: 400px;">{{ branch.branchName || 'N/A'}}</td>
          <td style="width: 300px;">{{ bankCodeToBankName[branch.bankCode] }}</td>
          <td style="width: 200px;">{{ branch.routingNumber || 'N/A' }}</td>
          <td style="width: 200px;"> {{ branch.districtName }}</td>
          <td style="text-align: center;"> <a @click="showEditBranchModal"> <i class="fa fa-edit"></i> </a> </td>
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
    name: 'StaticBranchComponent',
    data () {
      return {
        branchList: {},
        showAddBranchButton: true,
        bankCodeToBankName: {},
        showLoader: false,
        branchSearch: ''
      }
    },
    created () {
      this.init()
    },
    computed: {
      filterBranchEnabledList () {
        if (this.branchList.length > 0) {
          return this.branchList.filter(branch => {
            return branch.branchName.toLowerCase().includes(this.branchSearch.toLowerCase())
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
        this.bankCodeToBankName = JSON.parse(localStorage.getItem('bankCodeToBankName'))
        this.showLoader = true
        Http.GET('resource', ['branch'])
          .then(({data: response}) => {
            this.showLoader = false
            this.branchList = response.data
            console.log('successfully got the list of branches: ', response)
          },
          error => {
            console.log('error in receiving branch list ', error)
            this.showLoader = false
            if (error.response && error.response.data.status === 401) {
              this.logout()
            }
          })
      },
      showEditBranchModal () {
        alert('Not implemented yet.')
      },
      showAddBranchModal () {
        alert('Not implemented yet.')
      }
    }
  }
</script>
