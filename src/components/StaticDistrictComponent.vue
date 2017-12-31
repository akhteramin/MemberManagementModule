<template>
  <div class="gr-5 push-4 padding-5">
    <br>
    <h3 style="text-align: center;">Districts</h3>
    <hr>

    <div id="UpdateDistrictModal" class="modal fade" role="dialog">
      <div class="modal-dialog  modal-md">
        <!-- Modal content-->

        <div class="modal-content">
          <div class="modal-header" style="text-align: center;">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h3><i class="fa fa-user-edit" aria-hidden="true"></i>Update District</h3>
          </div>

          <div class="modal-body">
            <form role="form" @submit.prevent="updateDistrict">

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
                  </select>
                </div>
              </div>


              <button type="submit" class="btn-block btn btn-lg btn-primary">Update District</button>

            </form>
          </div>
        </div>
      </div>
    </div>

    <div id="AddDistrictModal" class="modal fade" role="dialog">
      <div class="modal-dialog  modal-md">
        <!-- Modal content-->

        <div class="modal-content">
          <div class="modal-header" style="text-align: center;">
            <button type="button" class="close" data-dismiss="modal" @click="setAddDistrictButtonToTrue">&times;</button>
            <h3>Add District</h3>
          </div>

          <div class="modal-body">
            <form role="form" @submit.prevent="addDistrict">


              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name"
                       placeholder="Name" v-model="createRequest.name" required>
              </div>



              <div class="form-group">
                <label for="status">Status</label>
                <div id = "status" class="select">
                  <select v-model="createRequest.status" value="createRequest.status">
                    <option value="Active" selected>ACTIVE</option>
                    <option value="Inactive">INACTIVE</option>
                  </select>
                </div>
              </div>


              <button type="submit" class="btn-block btn btn-lg btn-primary">Add District</button>

            </form>
          </div>
        </div>
      </div>
    </div>



    <div>
      <div class="gr-4">
        <button class="button-search" role="button" @click="showAddDistrictModal">
          <i class="fa fa-plus"></i> Add District
        </button>
      </div>
      <br><br>
      <div>
        <input class="gr-3 push-9" v-model="districtSearch" placeholder="District name"
               style="height: 35px;"/>
      </div>
      <br><br><br>
    </div>

    <div v-if="districtList.length > 0">
      <table class="table ui celled" cellspacing="0" width="100%">
        <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th style="text-align: center;">Country</th>
          <th style="text-align: center;">Status</th>
          <th style="text-align: center;">Edit</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="district, index in filterDistrictEnabledList">
          <td>{{ index + 1}}</td>
          <td>{{ district.name || 'N/A'}}</td>
          <td style="text-align: center;">Bangladesh</td>
          <td style="text-align: center;">{{ district.status }}</td>
          <td style="text-align: center;"> <a @click="showUpdateDistrictModal(district)"> <i class="fa fa-edit"></i> </a> </td>
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
    name: 'StaticDistrictComponent',
    data () {
      return {
        districtList: {},
        showAddNewDistrictButton: true,
        showLoader: false,
        districtSearch: '',
        updateRequest: {},
        createRequest: {}
      }
    },
    created () {
      this.init()
    },
    computed: {
      filterDistrictEnabledList () {
        if (this.districtList.length > 0) {
          return this.districtList.filter(district => {
            return district.name.toLowerCase().includes(this.districtSearch.toLowerCase())
          })
        }
      }
    },
    methods: {
      setAddDistrictButtonToTrue () {
        this.showAddNewDistrictButton = true
      },
      init () {
//        this.districtList = JSON.parse(localStorage.getItem('district'))
        Http.GET('resource', ['district'])
          .then(({data: response}) => {
            this.showLoader = false
            this.districtList = response.data
            console.log('successfully got the list of districts: ', response)
            localStorage.removeItem('district')
            localStorage.setItem('district', JSON.stringify(this.districtList))
          },
          error => {
            console.log('error in receiving district list ', error)
            this.showLoader = false
          })
      },
      updateDistrict () {
        this.showLoader = true
        Http.PUT('resource', this.updateRequest, ['district'])
          .then(({data: response}) => {
            this.showLoader = false
            $('#UpdateDistrictModal').modal('hide')
            this.init()
            $.notify({
              title: '<strong>Success!</strong>',
              message: response.message
            }, {
              type: 'success',
              delay: 3000
            })
          },
          error => {
            this.showLoader = false
            $('#UpdateDistrictModal').modal('hide')
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
      showUpdateDistrictModal (district) {
        this.updateRequest = {
          'id': district.id,
          'name': district.name,
          'status': district.status
        }
        console.log('updateRequest: ', this.updateRequest)
        $('#UpdateDistrictModal').modal({backdrop: false})
      },
      addDistrict () {
        Http.POST('resource', this.createRequest, ['district'])
          .then(({data: response}) => {
            console.log('district added successfully. response: ', response)
            this.showAddNewDistrictButton = true
            Http.GET('resource', ['district'])
              .then(({data: district}) => {
                $('#AddDistrictModal').modal('hide')
                this.districtList = district.data
                localStorage.removeItem('district')
                localStorage.setItem('district', JSON.stringify(this.districtList))
                console.log('got district list successfully, list: ', this.districtList)
              },
              error => {
                $('#AddDistrictModal').modal('hide')
                console.log('error in getting district list: ', error)
              })
            this.showLoader = false
            this.showAddNewDistrictButton = true
            $.notify({
              // options
              title: '<strong>Success!</strong>',
              message: 'District Added.'
            }, {
              // settings
              type: 'success',
              delay: 3000
            })
          },
          error => {
            this.showAddNewDistrictButton = true
            this.showLoader = false
            $('#AddDistrictModal').modal('hide')
            console.log('District addition unsuccessful, error: ', error)
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
      showAddDistrictModal () {
        this.showAddNewDistrictButton = false
        this.createRequest = {
          'name': null,
          'status': 'Active'
        }
        $('#AddDistrictModal').modal({backdrop: false})
      }
    }
  }
</script>
