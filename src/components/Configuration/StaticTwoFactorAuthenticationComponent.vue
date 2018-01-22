<template>
  <div class="gr-6 padding-5">
    <br>
    <h3 style="text-align: center;">Two Factor Authentication</h3>
    <hr>

    <div>
      <div class="gr-4">
        <button class="button-search" role="button" @click="showCreateNew2faModal">
          <i class="fa fa-plus"></i> Add New
        </button>
      </div>
      <br><br>
      <div>
        <input class="gr-3 push-9" v-model="twoFactorSearch" placeholder="2FA Service Tag"
               style="height: 35px;"/>
      </div>
      <br><br><br>
    </div>

    <div id="CreateNew2faModal" class="modal fade" role="dialog">
      <div class="modal-dialog  modal-md">
        <!-- Modal content-->

        <div class="modal-content">
          <div class="modal-header" style="text-align: center;">
            <button type="button" class="close" data-dismiss="modal" @click="setCreateNew2faButtonToTrue">&times;</button>
            <h3>Create New 2FA Preference</h3>
          </div>

          <div class="modal-body">
            <form role="form" @submit.prevent="createNew2fa">

              <div class="form-group">
                <label for="status">Service</label>
                <div id = "status" class="select">
                  <select required v-model="createNew2faRequest.serviceId">
                    <option :value="null">Choose ...</option>
                    <option v-for="item in services" :value="item.serviceId">{{ item.serviceName }}</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="status">Account Class</label>
                <div id = "status" class="select">
                  <select v-model="createNew2faRequest.accountClass">
                    <option :value="null">Choose ...</option>
                    <option v-for="item,index in mapper.accountClass" :value="index+1">{{ item }}</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="status">Account Type</label>
                <div id = "status" class="select">
                  <select v-model="createNew2faRequest.accountType">
                    <option :value="null">Choose ...</option>
                    <option v-for="item,index in mapper.accountType" :value="index+1">{{ item }}</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="status">Status</label>
                <div id = "status" class="select">
                  <select v-model="createNew2faRequest.is2FAEnabled">
                    <option value="true" selected>ACTIVE</option>
                    <option value="false">INACTIVE</option>
                  </select>
                </div>
              </div>
    
              <div class="form-group">
                <label for="status">Required</label>
                <div id = "status" class="select">
                  <select v-model="createNew2faRequest.isMandatory">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>

              <button type="submit" class="btn-block btn btn-lg btn-primary">Create Preference</button>

            </form>
          </div>
        </div>
      </div>
    </div>


    <div id="Update2faModal" class="modal fade" role="dialog">
      <div class="modal-dialog  modal-md">
        <!-- Modal content-->

        <div class="modal-content">
          <div class="modal-header" style="text-align: center;">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h3><i class="fa fa-user-edit" aria-hidden="true"></i>Update 2FA Preference</h3>
          </div>

          <div class="modal-body">
            <form role="form" @submit.prevent="update2fa" id="loginForm">

              <div class="form-group">
                <label for="status">Service</label>
                <div id = "status" class="select">
                  <select v-model="update2faRequest.serviceId">
                    <option v-for="item in services" :value="item.serviceId">{{ item.serviceName }}</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="status">Account Class</label>
                <div id = "status" class="select">
                  <select v-model="update2faRequest.accountClass">
                    <option v-for="item,index in mapper.accountClass" :value="index+1">{{ item }}</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="status">Account Type</label>
                <div id = "status" class="select">
                  <select v-model="update2faRequest.accountType">
                    <option v-for="item,index in mapper.accountType" :value="index+1">{{ item }}</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="status">Status</label>
                <div id = "status" class="select">
                  <select v-model="update2faRequest.is2FAEnabled">
                    <option value="true">ACTIVE</option>
                    <option value="false">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="status">Required</label>
                <div id = "status" class="select">
                  <select v-model="update2faRequest.isMandatory">
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>


              <button type="submit" class="btn-block btn btn-lg btn-primary">Update Preference</button>

            </form>
          </div>
        </div>
      </div>
    </div>


    <div>
      <div v-if="twoFactorList.length > 0">
        <table class="table ui celled" cellspacing="0" width="100%">
          <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th style="text-align: left;">Service Tag</th>
            <th style="text-align: left;">Service</th>
            <th style="text-align: left;">Account Type</th>
            <th style="text-align: left;">Account Class</th>
            <th style="text-align: center;">Status</th>
            <th v-restrict="'MS_2FA_UPDATE_PREFERENCES'" style="text-align: center;">Action</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item, index in filter2faEnabledList">
            <td>{{ index+1 }}</td>
            <td>{{ item.id }}</td>
            <td style="text-align: left;">{{ item.serviceTag || 'N/A'}}</td>
            <td style="text-align: left;">{{ serviceMapper[item.serviceId] }}</td>
            <td style="text-align: left;">{{ mapper.accountType[item.accountType-1] || 'N/A' }}</td>
            <td style="text-align: left;">{{ mapper.accountClass[item.accountClass-1] || 'N/A' }}</td>
            <td style="text-align: center;">{{ item.is2FAEnabled ? 'ACTIVE' : 'INACTIVE' }}</td>
            <td v-restrict="'MS_2FA_UPDATE_PREFERENCES'" style="text-align: center;">
              <a @click="showUpdate2faModal(item)"> <i class="fa fa-edit"></i></a>
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
  import Http from '../../services/Http'

  export default {
    name: 'StaticTwoFactorAuthenticationComponent',
    data () {
      return {
        twoFactorList: {},
        showCreateNew2faButton: true,
        showLoader: false,
        mapper: {
          accountClass: ['General', 'Gold', 'Platinum', 'Bronze', 'Verified General'],
          accountType: ['Personal', 'Business', 'Unverified']
        },
        serviceMapper: {},
        createNew2faRequest: {
          'accountClass': null,
          'accountType': null,
          'is2FAEnabled': true,
          'isMandatory': true,
          'serviceId': null
        },
        twoFactorSearch: '',
        update2faRequest: {},
        services: []
      }
    },
    created () {
      this.init()
    },
    computed: {
      filter2faEnabledList () {
        if (this.twoFactorList.length > 0) {
          return this.twoFactorList.filter(twoFactor => {
            return twoFactor.serviceTag.toLowerCase().includes(this.twoFactorSearch.toLowerCase())
          })
        }
      }
    },
    methods: {
      init () {
        console.log('Static 2fa component created:::')
        this.showLoader = true
        Http.GET('twofactor')
          .then(
            ({data: {data: twoFactor}}) => {
              this.showLoader = false
              this.twoFactorList = twoFactor.service2FAPreferences
              console.log('got twoFactor list successfully, list: ', twoFactor)
            },
            error => {
              this.showLoader = false
              console.log('error in getting twoFactor list: ', error)
            })
        Http.GET('resource', ['service'])
          .then(
            ({data: {data: services}}) => {
              this.services = services
              console.log('successfully got service list: ', services)
              this.services.forEach(service => {
                this.serviceMapper[service.serviceId] = service.serviceName
              })
            },
            error => {
              console.log('error getting service list', error)
            }
          )
      },
      showCreateNew2faModal () {
        this.showCreateNew2faButton = false
        this.createNew2faRequest = {
          'accountClass': null,
          'accountType': null,
          'is2FAEnabled': true,
          'isMandatory': true,
          'serviceId': null
        }
        $('#CreateNew2faModal').modal({backdrop: false})
      },
      setCreateNew2faButtonToTrue () {
        this.showCreateNew2faButton = true
      },
      showUpdate2faModal (twoFactor) {
        this.update2faRequest = Object.assign({}, twoFactor)
        $('#Update2faModal').modal({backdrop: false})
      },
      update2fa () {
        this.showLoader = true
        Http.PUT('twofactor', {'service2FAPreferences': [this.update2faRequest]})
          .then(({data: response}) => {
            this.showLoader = false
            $('#Update2faModal').modal('hide')
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
            $('#Update2faModal').modal('hide')
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
      createNew2fa () {
        console.log('create new twoFactor button clicked::::')
        this.showLoader = true
        // change this API call
        Http.PUT('twofactor', {'service2FAPreferences': [this.createNew2faRequest]})
          .then(({data: response}) => {
            console.log('twoFactor added successfully. response: ', response)
            this.showCreateNew2faButton = true
            this.init()
            $('#CreateNew2faModal').modal('hide')
            this.showLoader = false
            $.notify({
              // options
              title: '<strong>Success!</strong>',
              message: '2FA created.'
            }, {
              // settings
              type: 'success',
              delay: 3000
            })
          },
          error => {
            this.showCreateNew2faButton = true
            this.showLoader = false
            $('#CreateNew2faModal').modal('hide')
            console.log('twoFactor addition unsuccessful, error: ', error)
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
