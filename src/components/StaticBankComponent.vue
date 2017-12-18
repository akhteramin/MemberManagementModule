<template>
  <div class="gr-8 push-3 padding-5">
    <br>
    <h3 style="text-align: center;">Banks</h3>
    <hr>

    <div id="UpdateBankModal" class="modal fade" role="dialog">
      <div class="modal-dialog  modal-md">
        <!-- Modal content-->

        <div class="modal-content">
          <div class="modal-header" style="text-align: center;">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h3><i class="fa fa-user-edit" aria-hidden="true"></i>Update Bank</h3>
          </div>

          <div class="modal-body">
            <form role="form" @submit.prevent="updateBank">

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


              <button type="submit" class="btn-block btn btn-lg btn-primary">Update Bank</button>

            </form>
          </div>
        </div>
      </div>
    </div>

    <div id="AddBankModal" class="modal fade" role="dialog">
      <div class="modal-dialog  modal-md">
        <!-- Modal content-->

        <div class="modal-content">
          <div class="modal-header" style="text-align: center;">
            <button type="button" class="close" data-dismiss="modal" @click="setCreateNewBankButtonToTrue">&times;</button>
            <h3>Add New Bank</h3>
          </div>

          <div class="modal-body">
            <form role="form" @submit.prevent="addBank">


              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name"
                       placeholder="Name" v-model="createRequest.name" required>
              </div>



              <div class="form-group">
                <label for="code">Code</label>
                <input type="text" id="code"
                       placeholder="code" v-model="createRequest.code"
                       required>
              </div>


              <div class="form-group">
                <label for="status">Status</label>
                <div id = "status" class="select">
                  <select v-model="createRequest.status" value="createRequest.status">
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

    <div>
      <div class="gr-4">
        <button class="button-search" role="button" @click="showAddBankModal">
          <i class="fa fa-plus"></i> Add New Bank
        </button>
      </div>
      <br><br>
      <div>
        <input class="gr-3 push-5" v-model="bankSearch" placeholder="Bank name"
               style="height: 35px;"/>
      </div>
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
        <tr v-for="bank, index in filterBankEnabledList">
          <td>{{ index + 1}}</td>
          <td style="text-align: center;">{{ bank.bankCode || 'N/A'}}</td>
          <td>{{ bank.bankName || 'N/A'}}</td>
          <td style="text-align: center;">{{ bank.status || 'N/A' }}</td>
          <td style="text-align: center;"> <a @click="showUpdateBankModal(bank)"> <i class="fa fa-edit"></i> </a> </td>
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
        createNewBankButtonToTrue: false,
        showLoader: false,
        bankSearch: '',
        updateRequest: {},
        createRequest: {}
      }
    },
    created () {
      this.init()
    },
    computed: {
      filterBankEnabledList () {
        if (this.bankList.length > 0) {
          return this.bankList.filter(bank => {
            return bank.bankName.toLowerCase().includes(this.bankSearch.toLowerCase())
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
      setCreateNewBankButtonToTrue () {
        this.showAddBankButton = true
        this.createRequest = {
          'name': null,
          'code': null,
          'status': 'Active'
        }
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
      showUpdateBankModal (bank) {
        this.updateRequest = {
          'id': bank.id,
          'name': bank.bankName,
          'status': bank.status
        }
        $('#UpdateBankModal').modal({backdrop: false})
      },
      addBank () {
        Http.POST('resource', this.createRequest, ['bank'])
          .then(({data: response}) => {
            console.log('bank added successfully. response: ', response)
            this.showAddBankButton = true
            Http.GET('resource', ['bank'])
              .then(({data: bank}) => {
                $('#AddBankModal').modal('hide')
                this.bankList = bank.data
                console.log('got bank list successfully, list: ', bank)
              },
              error => {
                $('#AddBankModal').modal('hide')
                console.log('error in getting bank list: ', error)
              })
            this.showLoader = false
            this.showAddBankButton = true
            $.notify({
              // options
              title: '<strong>Success!</strong>',
              message: 'Bank Added.'
            }, {
              // settings
              type: 'success',
              delay: 3000
            })
          },
          error => {
            this.showCreateNewOccupationButton = true
            this.showLoader = false
            if (error.response && error.response.data.status === 401) {
              this.logout()
            }
            $('#AddBankModal').modal('hide')
            console.log('Bank addition unsuccessful, error: ', error)
            $.notify({
              // options
              title: '<strong>Failure!</strong>',
              message: error.response.data.message
            }, {
              // settings
              type: 'danger',
              delay: 3000
            })
            this.showAddBankButton = true
          })
      },
      showAddBankModal () {
        this.createRequest = {
          'name': null,
          'code': null,
          'status': 'Active'
        }
        this.showAddBankButton = false
        $('#AddBankModal').modal({backdrop: false})
      },
      updateBank () {
        this.showLoader = true
        Http.PUT('resource', this.updateRequest, ['bank'])
          .then(({data: response}) => {
            this.showLoader = false
            $('#UpdateBankModal').modal('hide')
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
            $('#UpdateBankModal').modal('hide')
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
