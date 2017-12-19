<template>
  <div class="gr-8 push-3 padding-5">
    <br>
    <h3 style="text-align: center;">Branches</h3>
    <hr>


    <div>
      <div class="gr-4">
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
          <td style="text-align: center;"> <a @click="showUpdateBranchModal(branch)"> <i class="fa fa-edit"></i> </a> </td>
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

  export default {
    name: 'StaticBranchComponent',
    data () {
      return {
        branchList: {},
        showAddBranchButton: true,
        bankCodeToBankName: {},
        showLoader: false,
        branchSearch: '',
        updateRequest: {}
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
          })
      },
      showUpdateBranchModal (branch) {
        this.updateRequest = {
          'id': branch.id,
          'name': branch.branchName,
          'status': branch.status
        }
        $('#UpdateBranchModal').modal({backdrop: false})
      },
      showAddBranchModal () {
        alert('Not implemented yet.')
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
