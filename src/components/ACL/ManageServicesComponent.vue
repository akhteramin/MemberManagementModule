<template>
    <div id="content">
        <div class="gr-6 push-5">
            <h1>Manage Service</h1> <br>
        </div>
        <div class="gr-10">
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
        
        <div class="gr-12">
            <table  class="table ui celled" cellspacing="0" width="100%">
                <thead>
                    <tr>
                        <th>
                            <b>S/N</b>
                        </th>
                        <th>
                            Name
                        </th>
                        <th>
                            Status
                        </th>

                    </tr>
                </thead>
                <tbody v-if="aclServiceList && aclServiceList.length > 0">
                    <tr v-for="(serviceData,index) in aclServiceList">
                        <td>
                            {{index+1}}
                        </td>
                        <td>
                            {{serviceData.serviceName}}
                        </td>
                        <td>
                            <div class="select">
                            <select id="order-by-select"  v-model="serviceData.status" @change="openModal( serviceData )">
                                <option v-for="(indexMapper,mapper) in statusMapper" :value = "mapper+1">{{indexMapper}}</option>
                            </select>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>

      <div id="service_change_access_level_modal" modal-show-hide  class="modal fade" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Change status of {{selectedServiceInfo.serviceName}}?</h4>
                </div>
               <!--  <form name="newUserForm" id="newUserForm"  ng-submit="submitUserData(userData)" novalidate> -->
                    <div class="modal-body">
                        <div class="container-fluid">
                            <div class="col-sm-12">

                                <div class="form-group">
                                    <div class="row">
                                        <label>Service's status will be changed by this action. Do you want to make this change?</label>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-sm btn-default btn-active-til" data-dismiss="modal" @click="changeAccessLevelOfService(selectedServiceInfo)">Yes</button>
                        <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal" @click="init()">No</button>
                    </div>
                <!-- </form> -->
            </div>
        </div>
      </div>

      <div id="service_change_conflict_modal" modal-show-hide  class="modal fade" role="dialog">
        <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" @click="init()">&times;</button>
                    <h4 class="modal-title red">Conflict !</h4>
                </div>
               <!--  <form name="newUserForm" id="newUserForm"  ng-submit="submitUserData(userData)" novalidate> -->
                    <div class="modal-body">
                        <div class="container-fluid">
                            <div class="col-sm-12">

                                <div class="form-group">
                                    <div class="row">
                                        <p>{{conflictObject.conflictMessage}}</p>
                                        <table class="table table-striped width-full" data-pagination="true" data-search="true">
                                          <tr class="tr-bg">
                                            <th>Id</th>
                                            <th>Service Code</th>
                                            <th>Service Name</th>
                                            <th>Status</th>
                                          </tr>

                                          <tr v-for="service in conflictObject.conflictedServiceList">
                                            <th>{{service.id}}</th>
                                            <th>{{service.serviceCode}}</th>
                                            <th>{{service.serviceName}}</th>
                                            <th>{{statusMapper[service.status-1]}}</th>
                                          </tr>
                                        </table>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal" ng-click="self.loadList()">Close</button>
                    </div>
                <!-- </form> -->
            </div>
        </div>
      </div>

    </div>
</template>
<script>
import Http from '../../services/Http'
export default {
  name: 'ManageServices',
  props: [
  ],
  data () {
    return {
      showLoader: false,
      aclServiceList: [],
      statusMapper: ['CLOSED', 'OPEN', 'PUBLIC', 'BLOCKED'],
      selectedServiceInfo: {},
      conflictObject: {
        conflictMessage: '',
        conflictList: []
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.showLoader = true
      Http.GET('memberAclGet', ['service', ''])
        .then(({data: aclServices}) => {
          this.showLoader = false
          console.log('Success, got service list: ', aclServices)
          this.aclServiceList = aclServices.serviceList
        }, error => {
          this.showLoader = false
          console.error('Error in offers: ', error)
        }
      )
    },
    changeAccessLevelOfService (service) {
      console.log('service selected,', service)
      let param = {
        'serviceDescription': service.serviceDescription,
        'serviceTag': service.serviceTag,
        'status': service.status
      }
        // iPayAclServices.sendHttpRequest(angular.toJson(param), '13003')
      Http.PUT('memberAclGet', param, ['service', service.id])
      .then(({data: response}) => {
        $.notify({
          // options
          title: '<strong>Success!</strong>',
          message: 'Changes have been made successfully.'
        }, {
          // settings
          type: 'success',
          delay: 3000
        })
        console.log('response from change access level of service:')
        console.log(response)
      }, error => {
        if (error.response.status === 409) {
          this.conflictObject.conflictedServiceList = error.response.data.serviceList
          this.conflictObject.conflictMessage = error.response.data.message
          $('#service_change_conflict_modal').modal()
          console.log('Error in updateACLUserGroup!')
          console.log(error.response)
        }
      })
    },
    openModal (service) {
      this.selectedServiceInfo = Object.assign({}, service)
      $('#service_change_access_level_modal').modal() // will add it when jquery issue fixes
    }
  }
}
</script>
