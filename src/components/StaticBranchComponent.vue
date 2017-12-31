<template>
  <div class="gr-8 push-3 padding-5">
    <br>
    <h3 style="text-align: center;">Branches</h3>
    <hr>


    <div>
      <div class="gr-4">
        <button class="button-search" role="button" @click="showAddBranchModal">
          <i class="fa fa-plus"></i> Add Branch
        </button>
      </div>
    </div>

    <div id="UpdateBranchModal" class="modal fade" role="dialog">
      <div class="modal-dialog  modal-md">
        <!-- Modal content-->

        <div class="modal-content">
          <div class="modal-header" style="text-align: center;">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h3><i class="fa fa-user-edit" aria-hidden="true"></i>Update Branch</h3>
          </div>

          <div class="modal-body">
            <form role="form" @submit.prevent="updateBranch">

              <div class="form-group">
                <label for="name">Name</label>
                <input type="text"  id="name" value="updateRequest.name"
                       placeholder="Name" v-model="updateRequest.name" required>
              </div>




              <div class="form-group">
                <label for="status">Status</label>
                <div id = "status" class="select">
                  <select v-model="updateRequest.status" value="updateRequest.status">
                    <option value="Active">ACTIVE</option>
                    <option value="Inactive">INACTIVE</option>
                    <option value="Archived">ARCHIVED</option>
                  </select>
                </div>
              </div>


              <button type="submit" class="btn-block btn btn-lg btn-primary">Update Branch</button>

            </form>
          </div>
        </div>
      </div>
    </div>

    <div id="AddBranchModal" class="modal fade" role="dialog">
      <div class="modal-dialog  modal-md">
        <!-- Modal content-->

        <div class="modal-content">
          <div class="modal-header" style="text-align: center;">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h3>Add Branch</h3>
          </div>

          <div class="modal-body">
            <form role="form" @submit.prevent="addBranch">


              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name"
                       placeholder="Name" v-model="createRequest.name" required>
              </div>



              <div class="form-group">
                <label for="code">Code</label>
                <input type="text" id="code"
                       placeholder="Code" v-model="createRequest.code"
                       required>
              </div>

              <div class="form-group">
                <label for="code">Routing Number</label>
                <input type="text" id="code"
                       placeholder="Routing number" v-model="createRequest.routingNumber"
                       required>
              </div>

              <div class="form-group">
                <label for="bank">Bank</label>
                <div id = "bank" class="select">
                  <select v-model="createRequest.bankCode"> <!-- Bangladesh Bank -->
                    <option v-for="bank in bankList" :value="bank.bankCode">{{ bank.bankName }}</option>
                  </select>
                </div>
              </div>


              <div class="form-group">
                <label for="status">Status</label>
                <div id = "status" class="select">
                  <select v-model="createRequest.status">
                    <option value="Active" selected>ACTIVE</option>
                    <option value="Archived">ARCHIVED</option>
                    <option value="Inactive">INACTIVE</option>
                  </select>
                </div>
              </div>


              <button type="submit" class="btn-block btn btn-lg btn-primary">Add Bank</button>

            </form>
          </div>
        </div>
      </div>
    </div>



    <!-- ====================== Filter ============================= -->
    <div class="gr-12">
      <br>
      <form v-on:submit.prevent="filter" v-on:reset.prevent="init">
        <div class="row">
          <div class="gr-12">

            <div class="gr-3 push-3">
              <div class="form-group">
                <label> Branch Name: </label>
                <input  name="branchName" type="text" id="branchName"
                        v-model="query.branchNameLike" placeholder="Branch Name"
                        value="query.branchNameLike"/>
              </div>

            </div>

            <div class="gr-4 push-3">
              <div class="form-group">
                <label class="push-1">Bank Name: </label>
                <div class="push-1">
                  <div class="select select-sm">
                    <select id="personal-business-select"  v-model="query.bankCode">
                      <option disabled selected :value=null>Select a Bank</option>
                      <option v-for="bank in bankList" :value="bank.bankCode">{{ bank.bankName }}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!--<div class="gr-3">-->
            <!--<div class="form-group">-->
            <!--<label class="push-2">District: </label>-->
            <!--<div class="push-1">-->
            <!--<div class="select select-sm">-->
            <!--<select id="personal-business-select"  v-model="query.districtCode">-->
            <!--<option disabled selected>Select district</option>-->
            <!--<option v-for="district in districtList" :value="district.id">{{ district.name }}</option>-->
            <!--</select>-->
            <!--</div>-->
            <!--</div>-->
            <!--</div>-->
            <!--</div>-->


          </div>


          <div class="gr-12">
            <div class="gr-4 push-5">
              <div class="form-group">
                <button type="submit" class="button-search">
                  <i class="fa fa-search" aria-hidden="true"></i>
                  Search
                </button>
                <button type="reset" class="button-reset">
                  <i class="fa fa-undo" aria-hidden="true"></i>
                  Reset
                </button>
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
    <!-- ====================== Filter ============================= -->

    <div v-if="branchList.length > 0">
      <table class="table ui celled" cellspacing="0" width="100%">
        <thead>
        <tr>
          <th style="width: 40px;">#</th>
          <th style="width: 400px;">Branch Name</th>
          <th style="width: 300px;">Bank Name</th>
          <th style="width: 200px; text-align: center;">Routing Number</th>
          <th style="text-align: center;">Status</th>
          <th style="width: 40px; text-align: center">Edit</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="branch, index in branchList">
          <td>{{ index + 1}}</td>
          <td style="width: 400px;">{{ branch.branchName || 'N/A'}}</td>
          <td style="width: 300px;">{{ bankCodeToBankName[branch.bankCode] }}</td>
          <td style="width: 200px; text-align: center;">{{ branch.routingNumber || 'N/A' }}</td>
          <td style="text-align: center;">{{ branch.status }}</td>
          <td style="text-align: center;"> <a @click="showUpdateBranchModal(branch)"> <i class="fa fa-edit"></i> </a> </td>
        </tr>
        </tbody>
      </table>
      <hr>
      <div style="text-align: center;"
           v-if="hasNextPage">
        <a class="padding-5" role="button" @click="loadMore">
          <strong style="color: #31b0d5;"> Load More </strong>
        </a>
      </div>
      <br><br>
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
        bankList: {},
        districtList: {},
        districtIdToDistrictName: {},
        showAddBranchButton: true,
        bankCodeToBankName: {},
        showLoader: false,
        branchSearch: '',
        updateRequest: {},
        createRequest: {},
        query: {},
        hasNextPage: true,
        filterButtonClicked: false // this is useful because if a user did not click search button in prior
        // and clicks 'load more' button
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
      filter () {
        console.log('query: ', this.query)
        this.query.pageNumber = 0
        this.showLoader = true
        Http.GET('resource', ['branch'], this.query)
          .then(({data: response}) => {
            this.showLoader = false
            this.branchList = response.data.list
            this.hasNextPage = response.data.hasNextPage
            console.log('successfully got the filtered list of branches', response)
            this.filterButtonClicked = true
          },
          error => {
            this.showLoader = false
            console.log('error in getting filtered list of branches: ', error)
          })
      },
      loadMore () {
        if (this.filterButtonClicked === true) {
          this.query.pageNumber = this.query.pageNumber + 1
        }
        this.showLoader = true
        Http.GET('resource', ['branch'], this.query)
          .then(({data: response}) => {
            this.showLoader = false
            this.hasNextPage = response.data.hasNextPage
            for (let indx in response.data.list) {
              this.branchList.push(response.data.list[indx])
            }
            console.log('successfully got the filtered list of branches', response)
            this.filterButtonClicked = true
          },
          error => {
            this.showLoader = false
            console.log('error in getting filtered list of branches: ', error)
          })
      },
      init () {
        this.query = {
          'pageNumber': 0,
          'pageSize': 50,
          'branchNameLike': '',
          'bankCode': null,
          'districtCode': null
        }
        this.filterButtonClicked = false
        this.hasNextPage = true
        this.bankCodeToBankName = JSON.parse(localStorage.getItem('bankCodeToBankName'))
        this.bankList = JSON.parse(localStorage.getItem('bank'))
        this.districtList = JSON.parse(localStorage.getItem('district'))
        console.log('district list: ', this.districtList)
        this.districtIdToDistrictName = JSON.parse(localStorage.getItem('districtIdToDistrictName'))
        console.log('district id to district names: ', this.districtIdToDistrictName)
        this.showLoader = true
        Http.GET('resource', ['branch'], this.query)
          .then(({data: response}) => {
            this.showLoader = false
            this.branchList = response.data.list
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
      showUpdateBranchModal (branch) {
        console.log('branch: ', branch)
        this.updateRequest = {
          'bankCode': branch.bankCode,
          'districtCode': branch.districtCode,
          'id': branch.id,
          'name': branch.branchName,
          'routingNumber': branch.routingNumber,
          'status': branch.status
        }
        $('#UpdateBranchModal').modal({backdrop: false})
      },
      showAddBranchModal () {
        this.createRequest = {
          'bankCode': '025',
          'code': null,
          'districtCode': null,
          'name': null,
          'routingNumber': null,
          'status': 'Active'
        }
        $('#AddBranchModal').modal({backdrop: false})
      },
      addBranch () {
        Http.POST('resource', this.createRequest, ['branch'])
          .then(({data: response}) => {
            $('#AddBranchModal').modal('hide')
            console.log('branch added successfully. response: ', response)
            this.init()
            this.showLoader = false
            $.notify({
              // options
              title: '<strong>Success!</strong>',
              message: 'Branch Added.'
            }, {
              // settings
              type: 'success',
              delay: 3000
            })
          },
          error => {
            this.showLoader = false
            $('#AddBankModal').modal('hide')
            console.log('Branch addition unsuccessful, error: ', error)
            $.notify({
              // options
              title: '<strong>Failure!</strong>',
              message: error.response.data.message
            }, {
              // settings
              type: 'danger',
              delay: 3000
            })
          })
      },
      updateBranch () {
        this.showLoader = true
        Http.PUT('resource', this.updateRequest, ['branch'])
          .then(({data: response}) => {
            this.showLoader = false
            $('#UpdateBranchModal').modal('hide')
            this.init()
            $.notify({
              // options
              title: '<strong>Success!</strong>',
              message: response.message
            }, {
              // settings
              type: 'success',
              delay: 3000
            })
          },
          error => {
            this.showLoader = false
            $('#UpdateBranchModal').modal('hide')
            $.notify({
              // options
              title: '<strong>Failure!</strong>',
              message: error.response.data.message
            }, {
              // settings
              type: 'danger',
              delay: 3000
            })
          })
      }
    }
  }
</script>
