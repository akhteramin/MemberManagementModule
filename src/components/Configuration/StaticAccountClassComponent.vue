<template>
  <div class="gr-6 padding-5">
    <br>
    <h3 style="text-align: center;">Account Classes</h3>
    <hr>

    <div id="AddAccountClassModal" class="modal fade" role="dialog">
      <div class="modal-dialog  modal-md">
        <!-- Modal content-->

        <div class="modal-content">
          <div class="modal-header" style="text-align: center;">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h3>Add Account Class</h3>
          </div>

          <div class="modal-body">
            <form role="form" @submit.prevent="addAccountClass">


              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name"
                       placeholder="Name" v-model="createRequest.name" required>
              </div>

              <div class="form-group">
                <label for="name">Code</label>
                <input type="text" id="code"
                       placeholder="code" v-model="createRequest.code" required>
              </div>



              <div class="form-group">
                <label for="status">Status</label>
                <div id = "status" class="select">
                  <select v-model="createRequest.status" value="createRequest.status">
                    <option value="Active">ACTIVE</option>
                    <option value="Inactive">INACTIVE</option>
                  </select>
                </div>
              </div>


              <button type="submit" class="btn-block btn btn-lg btn-primary">Add Account Class</button>

            </form>
          </div>
        </div>
      </div>
    </div>

    <div id="UpdateAccountClassModal" class="modal fade" role="dialog">
      <div class="modal-dialog  modal-md">
        <!-- Modal content-->

        <div class="modal-content">
          <div class="modal-header" style="text-align: center;">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h3><i class="fa fa-user-edit" aria-hidden="true"></i>Update Account Class</h3>
          </div>

          <div class="modal-body">
            <form role="form" @submit.prevent="updateAccountClass">

              <div class="form-group">
                <label for="name">Name</label>
                <input type="text"  id="name" value="updateRequest.name"
                       placeholder="Name" v-model="updateRequest.name" required>
              </div>

              <div class="form-group">
                <label for="name">Code</label>
                <input type="text"  id="code" value="updateRequest.code"
                       placeholder="code" v-model="updateRequest.code" required>
              </div>




              <div class="form-group">
                <label for="status">Status</label>
                <div id = "status" class="select">
                  <select v-model="updateRequest.status" value="updateRequest.status">
                    <option value="Active">ACTIVE</option>
                    <option value="Inactive">INACTIVE</option>
                  </select>
                </div>
              </div>


              <button type="submit" class="btn-block btn btn-lg btn-primary">Update Account Class</button>

            </form>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="gr-4">
        <button class="button-search" role="button" @click="showAddNewAccountClassModal">
          <i class="fa fa-plus"></i> Add Account Class
        </button>
      </div>
      <br><br>
      <div>
        <input class="gr-3 push-9" v-model="accountClassSearch" placeholder="Account class"
               style="height: 35px;"/>
      </div>
      <br><br><br>
    </div>

    <div v-if="accountClassList.length > 0">
      <table class="table ui celled" cellspacing="0" width="100%">
        <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th style="text-align: center;">Code</th>
          <th style="text-align: center;">Status</th>
          <th style="text-align: center;">Edit</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="account, index in filterAccountClassEnabledList">
          <td>{{ index + 1}}</td>
          <td>{{ account.name || 'N/A'}}</td>
          <td style="text-align: center;">{{ account.code || 'N/A' }}</td>
          <td style="text-align: center;">{{ account.status || 'N/A' }}</td>
          <td style="text-align: center;"> <a @click="showUpdateAccountClassModal(account)"> <i class="fa fa-edit"></i> </a> </td>
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
  import Http from '../../services/Http'

  export default {
    name: 'StaticAccountClassComponent',
    data () {
      return {
        accountClassList: {},
        showAddNewAccountClassButton: true,
        showLoader: false,
        accountClassSearch: '',
        updateRequest: {},
        createRequest: {}
      }
    },
    created () {
      this.init()
    },
    computed: {
      filterAccountClassEnabledList () {
        if (this.accountClassList.length > 0) {
          return this.accountClassList.filter(account => {
            return account.name.toLowerCase().includes(this.accountClassSearch.toLowerCase())
          })
        }
      }
    },
    methods: {
      init () {
        this.showLoader = true
        Http.GET('resource', ['account-class'])
        .then(({data: response}) => {
          this.showLoader = false
          this.accountClassList = response.data
        },
        error => {
          this.showLoader = false
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
      showUpdateAccountClassModal (account) {
        this.updateRequest = {
          'id': account.id,
          'name': account.name,
          'code': account.code,
          'status': account.status
        }
        $('#UpdateAccountClassModal').modal({backdrop: false})
      },
      showAddNewAccountClassModal () {
        this.createRequest = {
          'name': null,
          'code': null,
          'status': 'Active'
        }
        $('#AddAccountClassModal').modal({backdrop: false})
      },
      updateAccountClass () {
        this.showLoader = true
        Http.PUT('resource', this.updateRequest, ['account-class'])
          .then(({data: response}) => {
            this.showLoader = false
            $('#UpdateAccountClassModal').modal('hide')
            this.init()
            $.notify({
              title: '<strong>Success!</strong>',
              message: 'Account class updated successfully.'
            }, {
              type: 'success',
              delay: 3000
            })
          },
          error => {
            this.showLoader = false
            $('#UpdateAccountClassModal').modal('hide')
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
      addAccountClass () {
        Http.POST('resource', this.createRequest, ['account-class'])
          .then(({data: response}) => {
            console.log('account class added successfully. response: ', response)
            Http.GET('resource', ['account-class'])
              .then(({data: response}) => {
                $('#AddAccountClassModal').modal('hide')
                this.init()
              },
              error => {
                $('#AddAccountClassModal').modal('hide')
                console.log('error in getting account class list: ', error)
              })
            this.showLoader = false
            $.notify({
              // options
              title: '<strong>Success!</strong>',
              message: 'Account class Added.'
            }, {
              // settings
              type: 'success',
              delay: 3000
            })
          },
          error => {
            this.showLoader = false
            $('#AddAccountClassModal').modal('hide')
            console.log('Account class addition unsuccessful, error: ', error)
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
