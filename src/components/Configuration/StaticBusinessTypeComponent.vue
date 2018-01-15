<template>
  <div class="gr-6 padding-5">
    <br>
    <h3 style="text-align: center;">Business Types</h3>
    <hr>

  <div id="AddBusinessTypeModal" class="modal fade" role="dialog">
      <div class="modal-dialog  modal-md">
        <!-- Modal content-->

        <div class="modal-content">
          <div class="modal-header" style="text-align: center;">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h3>Add Business Type</h3>
          </div>

          <div class="modal-body">
            <form role="form" @submit.prevent="addBusinessType">


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


              <button type="submit" class="btn-block btn btn-lg btn-primary">Add Business Type</button>

            </form>
          </div>
        </div>
      </div>
    </div>


  <div id="UpdateBusinessTypeModal" class="modal fade" role="dialog">
      <div class="modal-dialog  modal-md">
        <!-- Modal content-->

        <div class="modal-content">
          <div class="modal-header" style="text-align: center;">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h3><i class="fa fa-user-edit" aria-hidden="true"></i>Update Business Type</h3>
          </div>

          <div class="modal-body">
            <form role="form" @submit.prevent="updateBusinessType">

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


              <button type="submit" class="btn-block btn btn-lg btn-primary">Update Account Type</button>

            </form>
          </div>
        </div>
      </div>
    </div>


  <div>
    <div class="gr-4">
      <button class="button-search" role="button" @click="showAddNewBusinessTypeModal">
        <i class="fa fa-plus"></i> Add Business Type
      </button>
    </div>
    <br><br>
    <div>
      <input class="gr-3 push-9" v-model="businessTypeSearch" placeholder="Business type"
      style="height: 35px;"/>
    </div>
    <br><br><br>
  </div>


    <div v-if="businessTypeList.length > 0">
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
          <tr v-for="business, index in filterBusinessTypeList">
            <td>{{ index + 1}}</td>
            <td>{{ business.name || 'N/A'}}</td>
            <td style="text-align: center;">{{ business.code || 'N/A' }}</td>
            <td style="text-align: center;">{{ business.status || 'N/A' }}</td>
            <td style="text-align: center;"> <a @click="showUpdateBusinessTypeModal(business)"> <i class="fa fa-edit"></i> </a> </td>
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
    name: 'StaticBusinessTypeComponent',
    data () {
      return {
        businessTypeList: {},
        businessTypeSearch: '',
        showAddNewBusinessTypeButton: true,
        showLoader: false,
        updateRequest: {},
        createRequest: {}
      }
    },
    computed: {
      filterBusinessTypeList () {
        if (this.businessTypeList.length > 0) {
          return this.businessTypeList.filter(business => {
            return business.name.toLowerCase().includes(this.businessTypeSearch.toLowerCase())
          })
        }
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        console.log('Static Bank component created:::')
        this.showLoader = true
        Http.GET('resource', ['business-type'])
          .then(({data: response}) => {
            this.showLoader = false
            this.businessTypeList = response.data
            console.log('successfully got the list of banks: ', response)
          },
          error => {
            console.log('error in receiving bank list ', error)
            this.showLoader = false
          })
      },
      showUpdateBusinessTypeModal (business) {
        this.updateRequest = {
          'id': business.id,
          'name': business.name,
          'code': business.code,
          'status': business.status
        }
        $('#UpdateBusinessTypeModal').modal({backdrop: false})
      },
      showAddNewBusinessTypeModal () {
        this.createRequest = {
          'name': null,
          'code': null,
          'status': 'Active'
        }
        $('#AddBusinessTypeModal').modal({backdrop: false})
      },
      updateBusinessType () {
        this.showLoader = true
        Http.PUT('resource', this.updateRequest, ['business-type'])
          .then(({data: response}) => {
            this.showLoader = false
            $('#UpdateBusinessTypeModal').modal('hide')
            this.init()
            $.notify({
              title: '<strong>Success!</strong>',
              message: 'Business type updated successfully.'
            }, {
              type: 'success',
              delay: 3000
            })
          },
          error => {
            this.showLoader = false
            $('#UpdateBusinessTypeModal').modal('hide')
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
      addBusinessType () {
        Http.POST('resource', this.createRequest, ['business-type'])
          .then(({data: response}) => {
            console.log('business type added successfully. response: ', response)
            this.init()
            this.showLoader = false
            $.notify({
              // options
              title: '<strong>Success!</strong>',
              message: 'Business type Added.'
            }, {
              // settings
              type: 'success',
              delay: 3000
            })
            $('#AddBusinessTypeModal').modal('hide')
          },
          error => {
            this.showLoader = false
            $('#AddBusinessTypeModal').modal('hide')
            console.log('Business type addition unsuccessful, error: ', error)
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
