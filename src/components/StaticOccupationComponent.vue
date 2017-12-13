<template>
  <div class="gr-6 push-4 padding-5">
    <br>
    <h3 style="text-align: center;">Occupations</h3>
    <hr>

    <div>
      <div class="gr-4" v-if="showCreateNewOccupationButton">
        <button class="button-search" role="button" @click="showCreateNewOccupationModal">
          <i class="fa fa-plus"></i> Add New Occupation
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
                <input type="text" class="form-control" id="name"
                       placeholder="Name" v-model="createNewOccupationRequest.name" required>
              </div>



              <div class="form-group">
                <label for="code">Code</label>
                <input type="text" class="form-control" id="code"
                       placeholder="code" v-model="createNewOccupationRequest.code"
                       required>
              </div>


              <div class="form-group">
                <label for="description">Description</label>
                <input type="text" class="form-control" id="description" placeholder="description"
                       v-model="createNewOccupationRequest.description" required>
              </div>


              <button type="submit" class="btn-block btn btn-lg btn-primary">Create Occupation</button>

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
            <th style="text-align: center;">Description</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="occupation, index in filterOccupationEnabledList">
            <td>{{ index + 1}}</td>
            <td>{{ occupation.name || 'N/A'}}</td>
            <td style="text-align: center;">{{ occupation.description || 'N/A' }}</td>
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
  import route from '../router'

  export default {
    name: 'StaticOccupationComponent',
    data () {
      return {
        occupationList: {},
        showCreateNewOccupationButton: true,
        showLoader: false,
        createNewOccupationRequest: {
          'code': null,
          'description': null,
          'name': null,
          'status': 'ACTIVE'
        },
        occupationSearch: ''
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
          'description': null,
          'name': null,
          'status': 'ACTIVE'
        }
        $('#CreateNewOccupationModal').modal({backdrop: false})
      },
      setCreateNewOccupationButtonToTrue () {
        this.showCreateNewOccupationButton = true
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
                this.showLoader = false
                this.occupationList = occupation.data
                console.log('got occupation list successfully, list: ', occupation)
              },
              error => {
                this.showLoader = false
                console.log('error in getting occupation list: ', error)
              })
            this.showLoader = false
            $('#CreateNewOccupationModal').modal('hide')
            $.notify({
              // options
              title: '<strong>Success!</strong>',
              message: 'User has been created successfully.'
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
