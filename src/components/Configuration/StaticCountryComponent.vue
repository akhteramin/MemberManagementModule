<template>
  <div class="gr-5 padding-5">
    <br>
    <h3 style="text-align: center;">Countries</h3>
    <hr>

    <div id="UpdateCountryModal" class="modal fade" role="dialog">
      <div class="modal-dialog  modal-md">
        <!-- Modal content-->

        <div class="modal-content">
          <div class="modal-header" style="text-align: center;">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h3><i class="fa fa-user-edit" aria-hidden="true"></i>Update Country</h3>
          </div>

          <div class="modal-body">
            <form role="form" @submit.prevent="updateCountry">

              <div class="form-group">
                <label for="name">Name</label>
                <input type="text"  id="name" value="updateRequest.name"
                       placeholder="Name" v-model="updateRequest.name" required>
              </div>


              <div class="form-group">
                <label for="code">Code</label>
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


              <button type="submit" class="btn-block btn btn-lg btn-primary">Update Country</button>

            </form>
          </div>
        </div>
      </div>
    </div>

    <div id="AddCountryModal" class="modal fade" role="dialog">
      <div class="modal-dialog  modal-md">
        <!-- Modal content-->

        <div class="modal-content">
          <div class="modal-header" style="text-align: center;">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h3>Add Country</h3>
          </div>

          <div class="modal-body">
            <form role="form" @submit.prevent="addCountry">


              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name"
                       placeholder="Name" v-model="createRequest.name" required>
              </div>

              <div class="form-group">
                <label for="name">code</label>
                <input type="text" id="code"
                       placeholder="code" v-model="createRequest.code" required>
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


              <button type="submit" class="btn-block btn btn-lg btn-primary">Add Country</button>

            </form>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="gr-4" v-if="showAddNewCountryButton">
        <button class="button-search" role="button" @click="showAddNewCountryModal">
          <i class="fa fa-plus"></i> Add Country
        </button>
      </div>
      <br><br>
      <div>
        <input class="gr-3 push-9" v-model="countrySearch" placeholder="Country name"
               style="height: 35px;"/>
      </div>
      <br><br><br>
    </div>

    <div v-if="countryList.length > 0">
      <table class="table ui celled" cellspacing="0" width="100%">
        <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Code</th>
          <th>Status</th>
          <th style="text-align: center;">Edit</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="country, index in filterCountryEnabledList">
          <td>{{ index + 1}}</td>
          <td>{{ country.name || 'N/A'}}</td>
          <td>{{ country.code || 'N/A'}}</td>
          <td>{{ country.status || 'N/A' }}</td>
          <td style="text-align: center;"> <a @click="showUpdateCountryModal(country)"> <i class="fa fa-edit"></i> </a> </td>
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
    name: 'StaticCountryComponent',
    data () {
      return {
        countryList: {},
        showAddNewCountryButton: true,
        showLoader: false,
        countrySearch: '',
        updateRequest: {},
        createRequest: {}
      }
    },
    created () {
      this.init()
    },
    computed: {
      filterCountryEnabledList () {
        if (this.countryList.length > 0) {
          return this.countryList.filter(country => {
            return country.name.toLowerCase().includes(this.countrySearch.toLowerCase())
          })
        }
      }
    },
    methods: {
      init () {
        Http.GET('resource', ['country'])
          .then(({data: response}) => {
            this.showLoader = false
            this.countryList = response.data
            console.log('successfully got the list of countries: ', response)
            localStorage.removeItem('country')
            localStorage.setItem('country', JSON.stringify(this.countryList))
          },
          error => {
            console.log('error in receiving country list ', error)
            this.showLoader = false
          })
      },
      showUpdateCountryModal (country) {
        this.updateRequest = {
          'code': country.code,
          'id': country.id,
          'name': country.name,
          'status': country.status
        }
        $('#UpdateCountryModal').modal({backdrop: false})
      },
      showAddNewCountryModal () {
        this.createRequest = {
          'code': null,
          'name': null,
          'status': 'Active'
        }
        $('#AddCountryModal').modal({backdrop: false})
      },
      updateCountry () {
        this.showLoader = true
        Http.PUT('resource', this.updateRequest, ['country'])
          .then(({data: response}) => {
            this.showLoader = false
            $('#UpdateCountryModal').modal('hide')
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
            $('#UpdateCountryModal').modal('hide')
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
      addCountry () {
        Http.POST('resource', this.createRequest, ['country'])
          .then(({data: response}) => {
            console.log('country added successfully. response: ', response)
            this.showLoader = false
            this.init()
            $('#AddCountryModal').modal('hide')
            $.notify({
              // options
              title: '<strong>Success!</strong>',
              message: 'Country Added.'
            }, {
              // settings
              type: 'success',
              delay: 3000
            })
          },
          error => {
            this.showLoader = false
            $('#AddCountryModal').modal('hide')
            console.log('Country addition unsuccessful, error: ', error)
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
