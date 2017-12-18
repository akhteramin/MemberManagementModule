<template>
  <div class="gr-5 push-4 padding-5">
    <br>
    <h3 style="text-align: center;">Thanas</h3>
    <hr>

    <div id="UpdateThanaModal" class="modal fade" role="dialog">
      <div class="modal-dialog  modal-md">
        <!-- Modal content-->

        <div class="modal-content">
          <div class="modal-header" style="text-align: center;">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h3><i class="fa fa-user-edit" aria-hidden="true"></i>Update Thana</h3>
          </div>

          <div class="modal-body">
            <form role="form" @submit.prevent="updateThana">

              <div class="form-group">
                <label for="name">Name</label>
                <input type="text"  id="name" value="updateRequest.name"
                       placeholder="Name" v-model="updateRequest.name" required>
              </div>

              <div class="form-group">
                <label for="status">District</label>
                <div id = "status" class="select">
                  <select v-model="updateRequest.districtId" value="updateRequest.districtId">
                    <option v-for="district in districtList"
                            :value="district.id">
                      {{ district.name }}</option>
                    <!--<option value="Active">ACTIVE</option>-->
                    <!--<option value="Inactive">INACTIVE</option>-->
                  </select>
                </div>
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


              <button type="submit" class="btn-block btn btn-lg btn-primary">Update Thana</button>

            </form>
          </div>
        </div>
      </div>
    </div>

    <div id="AddThanaModal" class="modal fade" role="dialog">
      <div class="modal-dialog  modal-md">
        <!-- Modal content-->

        <div class="modal-content">
          <div class="modal-header" style="text-align: center;">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h3>Add Thana</h3>
          </div>

          <div class="modal-body">
            <form role="form" @submit.prevent="addThana">


              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name"
                       placeholder="Name" v-model="createRequest.name" required>
              </div>

              <div class="form-group">
                <label for="status">District</label>
                <div id = "status" class="select">
                  <select v-model="createRequest.districtId" value="createRequest.districtId">
                    <option v-for="district in districtList"
                    :value="district.id">{{ district.name }}</option>
                  </select>
                </div>
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


              <button type="submit" class="btn-block btn btn-lg btn-primary">Add Thana</button>

            </form>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="gr-4">
        <button class="button-search" role="button" @click="showAddThanaModal">
          <i class="fa fa-plus"></i> Add Thana
        </button>
      </div>
      <br><br>
      <div>
        <input class="gr-3 push-5" v-model="thanaSearch" placeholder="Thana name"
               style="height: 35px;"/>
      </div>
      <br>
    </div>

    <div v-if="thanaList.length > 0">
      <table class="table table-striped">
        <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>District</th>
          <th style="text-align: center;">Country</th>
          <th style="text-align: center;">Status</th>
          <th style="text-align: center;">Edit</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="thana, index in filterThanaEnabledList">
          <td>{{ index + 1}}</td>
          <td>{{ thana.name || 'N/A'}}</td>
          <td>{{ districtIdToDistrictName[thana.districtId] }}</td>
          <td style="text-align: center;">Bangladesh</td>
          <td style="text-align: center;">{{ thana.status }}</td>
          <td style="text-align: center;"> <a @click="showUpdateThanaModal(thana)"> <i class="fa fa-edit"></i> </a> </td>
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
    name: 'StaticDistrictComponent',
    data () {
      return {
        thanaList: {},
        districtList: {},
        showAddNewThanaButton: true,
        showLoader: false,
        districtIdToDistrictName: {},
        thanaSearch: '',
        updateRequest: {},
        createRequest: {}
      }
    },
    created () {
      this.init()
    },
    computed: {
      filterThanaEnabledList () {
        if (this.thanaList.length > 0) {
          return this.thanaList.filter(thana => {
            return thana.name.toLowerCase().includes(this.thanaSearch.toLowerCase())
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
        Http.GET('resource', ['thana'])
        .then(({data: response}) => {
          this.showLoader = false
          this.thanaList = response.data
          console.log('successfully got the list of thana: ', response)
          localStorage.removeItem('thana')
          localStorage.setItem('thana', JSON.stringify(this.thanaList))
        },
        error => {
          console.log('error in receiving thana list ', error)
          this.showLoader = false
          if (error.response && error.response.data.status === 401) {
            this.logout()
          }
        })
        this.districtList = JSON.parse(localStorage.getItem('district'))
        this.districtIdToDistrictName = JSON.parse(localStorage.getItem('districtIdToDistrictName'))
      },
      showUpdateThanaModal (thana) {
        this.updateRequest = {
          'id': thana.id,
          'name': thana.name,
          'districtId': thana.districtId,
          'countryId': 0,
          'status': thana.status
        }
        console.log('updateRequest: ', this.updateRequest)
        console.log('districtList: ', this.districtList)
        $('#UpdateThanaModal').modal({backdrop: false})
      },
      showAddNewThanaModal () {
        alert('Not implemented yet.')
      },
      updateThana () {
        this.showLoader = true
        Http.PUT('resource', this.updateRequest, ['thana'])
          .then(({data: response}) => {
            this.showLoader = false
            $('#UpdateThanaModal').modal('hide')
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
            $('#UpdateThanaModal').modal('hide')
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
      showAddThanaModal () {
        this.createRequest = {
          'name': null,
          'status': 'Active',
          'districtId': 13,
          'countryId': 0,
          'code': null
        }
        console.log('create request: ', this.createRequest)
        $('#AddThanaModal').modal({backdrop: false})
      },
      addThana () {
        Http.POST('resource', this.createRequest, ['thana'])
          .then(({data: response}) => {
            console.log('thana added successfully. response: ', response)
            this.showLoader = false
            this.init()
            $('#AddThanaModal').modal('hide')
            $.notify({
              // options
              title: '<strong>Success!</strong>',
              message: 'Thana Added.'
            }, {
              // settings
              type: 'success',
              delay: 3000
            })
          },
          error => {
            this.showLoader = false
            if (error.response && error.response.data.status === 401) {
              this.logout()
            }
            $('#AddThanaModal').modal('hide')
            console.log('Thana addition unsuccessful, error: ', error)
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
