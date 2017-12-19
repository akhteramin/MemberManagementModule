<template>
  <div class="gr-6 push-4 padding-5">
    <br>
    <h3 style="text-align: center;">Occupations</h3>
    <hr>

    <div>
      <div class="gr-4">
        <button class="button-search" role="button" @click="showCreateNewOccupationModal">
          <i class="fa fa-plus"></i> Add Occupation
        </button>
      </div>
      <br><br>
      <div>
        <input class="gr-3 push-5" v-model="occupationSearch" placeholder="Occupation"
               style="height: 35px;"/>
      </div>
      <br>
    </div>

    <div id="CreateNewOccupationModal" class="modal fade" role="dialog">
      <div class="modal-dialog  modal-md">
        <!-- Modal content-->

        <div class="modal-content">
          <div class="modal-header" style="text-align: center;">
            <button type="button" class="close" data-dismiss="modal" @click="setCreateNewOccupationButtonToTrue">&times;</button>
            <h3>Create New Occupation</h3>
          </div>

          <div class="modal-body">
            <form role="form" @submit.prevent="createNewOccupation">


              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name"
                       placeholder="Name" v-model="createNewOccupationRequest.name" required>
              </div>



              <div class="form-group">
                <label for="code">Code</label>
                <input type="text" id="code"
                       placeholder="code" v-model="createNewOccupationRequest.code"
                       required>
              </div>


              <div class="form-group">
                <label for="status">Status</label>
                <div id = "status" class="select">
                  <select v-model="createNewOccupationRequest.status" value="createNewOccupationRequest.status">
                    <option value="Active" selected>ACTIVE</option>
                    <option value="Suspended">SUSPENDED</option>
                  </select>
                </div>
              </div>


              <button type="submit" class="btn-block btn btn-lg btn-primary">Create Occupation</button>

            </form>
          </div>
        </div>
      </div>
    </div>


    <div id="UpdateOccupationModal" class="modal fade" role="dialog">
      <div class="modal-dialog  modal-md">
        <!-- Modal content-->

        <div class="modal-content">
          <div class="modal-header" style="text-align: center;">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h3><i class="fa fa-user-edit" aria-hidden="true"></i>Update Occupation</h3>
          </div>

          <div class="modal-body">
            <form role="form" @submit.prevent="updateOccupation" id="loginForm">

              <div class="form-group">
                <label for="name">Name</label>
                <input type="text"  id="name" value="updateOccupationRequest.name"
                       placeholder="Name" v-model="updateOccupationRequest.name" required>
              </div>




              <div class="form-group">
                <label for="status">Status</label>
                <div id = "status" class="select">
                  <select v-model="updateOccupationRequest.status" value="updateOccupationRequest.status">
                    <option value="Active">ACTIVE</option>
                    <option value="Suspended">SUSPENDED</option>
                  </select>
                </div>
              </div>


              <button type="submit" class="btn-block btn btn-lg btn-primary">Update Occupation</button>

            </form>
          </div>
        </div>
      </div>
    </div>


    <div>
      <div v-if="occupationList.length > 0">
        <table class="table table-striped">
          <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th style="text-align: left;">Code</th>
            <th style="text-align: center;">Status</th>
            <th style="text-align: center;">Update</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="occupation, index in filterOccupationEnabledList">
            <td>{{ index + 1}}</td>
            <td>{{ occupation.name || 'N/A'}}</td>
            <td style="text-align: left;">{{ occupation.code || 'N/A' }}</td>
            <td style="text-align: center;">{{ occupation.status }}</td>
            <td style="text-align: center;">
              <a @click="showUpdateOccupationModal(occupation)"> <i class="fa fa-edit"></i></a>
            </td>
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
  </div>
</template>

<script>
  import Http from '../services/Http'

  export default {
    name: 'StaticOccupationComponent',
    data () {
      return {
        occupationList: {},
        showCreateNewOccupationButton: true,
        showLoader: false,
        createNewOccupationRequest: {
          'code': null,
          'name': null,
          'status': 'ACTIVE'
        },
        occupationSearch: '',
        updateOccupationRequest: {}
      }
    },
    created () {
      this.init()
    },
    computed: {
      filterOccupationEnabledList () {
        if (this.occupationList.length > 0) {
          return this.occupationList.filter(occupation => {
            return occupation.name.toLowerCase().includes(this.occupationSearch.toLowerCase())
          })
        }
      }
    },
    methods: {
      init () {
        console.log('Static occupation component created:::')
        this.showLoader = true
        Http.GET('resource', ['occupation'])
          .then(({data: occupation}) => {
            this.showLoader = false
            this.occupationList = occupation.data
            console.log('got occupation list successfully, list: ', occupation)
          },
          error => {
            this.showLoader = false
            console.log('error in getting occupation list: ', error)
          })
      },
      showCreateNewOccupationModal () {
        this.showCreateNewOccupationButton = false
        this.createNewOccupationRequest = {
          'code': null,
          'name': null,
          'status': 'Active'
        }
        $('#CreateNewOccupationModal').modal({backdrop: false})
      },
      setCreateNewOccupationButtonToTrue () {
        this.showCreateNewOccupationButton = true
      },
      showUpdateOccupationModal (occupation) {
        this.updateOccupationRequest = {
          'id': occupation.id,
          'name': occupation.name,
          'status': occupation.status
        }
        $('#UpdateOccupationModal').modal({backdrop: false})
      },
      updateOccupation () {
        this.showLoader = true
        Http.PUT('resource', this.updateOccupationRequest, ['occupation'])
          .then(({data: response}) => {
            this.showLoader = false
            $('#UpdateOccupationModal').modal('hide')
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
            $('#UpdateOccupationModal').modal('hide')
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
      createNewOccupation () {
        console.log('create new occupation button clicked::::')
        this.showLoader = true
        Http.POST('resource', this.createNewOccupationRequest, ['occupation'])
          .then(({data: response}) => {
            console.log('occupation added successfully. response: ', response)
            this.showCreateNewOccupationButton = true
            Http.GET('resource', ['occupation'])
              .then(({data: occupation}) => {
                $('#CreateNewOccupationModal').modal('hide')
                this.occupationList = occupation.data
                console.log('got occupation list successfully, list: ', occupation)
              },
              error => {
                $('#CreateNewOccupationModal').modal('hide')
                console.log('error in getting occupation list: ', error)
              })
            this.showLoader = false
            $.notify({
              // options
              title: '<strong>Success!</strong>',
              message: 'Occupation created.'
            }, {
              // settings
              type: 'success',
              delay: 3000
            })
          },
          error => {
            this.showCreateNewOccupationButton = true
            this.showLoader = false
            $('#CreateNewOccupationModal').modal('hide')
            console.log('occupation addition unsuccessful, error: ', error)
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
