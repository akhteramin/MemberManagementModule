<template>
  <div class="gr-10 push-1">
    <div class="loaders loading" v-if="showLoader > 0">
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
      <br>
      <br>
      <h4>Manage Groups</h4>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th class="col-md-3">
              <input type="text" v-model="activeSearch" placeholder="User Groups..">
            </th>
            <th class="col-md-1">
            </th>
            <th class="col-md-3">
              <input type="text" v-model="inactiveSearch" placeholder="Other Groups..">
            </th>
          </tr>
          <tr>
            <td class="col-md-3">
              <div class="small-scrollable heiht-500">
                <div class="padding-2" v-for="group in filterActiveList">
                  <input type="checkbox"
                          v-model="group.checked">
                  <small>{{group.groupName}}</small>
                </div>
              </div>
            </td>
            <td class="col-md-1">
              <div class="col-md-12 padding-5 text-center">
                <button type="button" 
                        class="btn btn-sm btn-default" 
                        @click="swap('active-inactive')">
                  <i class="fa fa-chevron-right" aria-hidden="true"></i>
                </button>
              </div>
              <div class="col-md-12 padding-5 text-center">
                <button type="button" 
                        class="btn btn-sm btn-default" 
                        @click="swap('inactive-active')">
                  <i class="fa fa-chevron-left" aria-hidden="true"></i>
                </button>
              </div>
              <div class="col-md-12 padding-5 text-center">
                <button type="button" 
                class="btn btn-primary btn-sm"
                @click="applyChanges()">
                    Apply Changes
                </button>
              </div>
            </td>
            <td class="col-md-3">
              <div class="small-scrollable">
                <div v-for="group in filterInactiveList">
                  <input type="checkbox"
                          v-model="group.checked">
                  <small>{{group.groupName}}</small>
                </div>
              </div>
            </td>
          </tr>
        </thead>
      </table>
      <br>
      <br>
      <h4>Manage Services</h4>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th class="col-md-3">
              <input type="text" v-model="enabledSearch" placeholder="Enabled Services..">
            </th>
            <th class="col-md-1">
            </th>
            <th class="col-md-3">
              <input type="text" v-model="blockedSearch" placeholder="Blocked Services..">
            </th>
          </tr>
          <tr>
            <td class="col-md-3">
              <div class="small-scrollable height-500">
                <div class="padding-2" v-for="service in filterEnabledList">
                  <input type="checkbox"
                          v-model="service.checked"
                          :disabled="service.status == 0 || service.status == 3">
                  <small>{{service.serviceName}}</small>
                  <span v-if="service.status == 0" class="label label-danger">{{mapper.access[service.status]}}</span>
                  <span v-if="service.status == 1" class="label label-warning">{{mapper.access[service.status]}}</span>
                  <span v-if="service.status == 2" class="label label-info">{{mapper.access[service.status]}}</span>
                  <span v-if="service.status == 3" class="label label-success">{{mapper.access[service.status]}}</span>
                </div>
              </div>
            </td>
            <td class="col-md-1">
              <div class="col-md-12 padding-5 text-center">
                <button type="button" 
                        class="btn btn-sm btn-default" 
                        @click="swapService('enabled-blocked')">
                  <i class="fa fa-chevron-right" aria-hidden="true"></i>
                </button>
              </div>
              <div class="col-md-12 padding-5 text-center">
                <button type="button" 
                        class="btn btn-sm btn-default" 
                        @click="swapService('blocked-enabled')">
                  <i class="fa fa-chevron-left" aria-hidden="true"></i>
                </button>
              </div>
              <div class="col-md-12 padding-5 text-center">
                <button type="button" 
                class="btn btn-primary btn-sm"
                @click="applyChangesService()">
                    Apply Changes
                </button>
              </div>
            </td>
            <td class="col-md-3">
              <div class="small-scrollable">
                <div v-for="service in filterBlockedList">
                  <input type="checkbox"
                          v-model="service.checked">
                  <small>{{service.serviceName}}</small>
                  <span v-if="service.status == 0" class="label label-danger">{{mapper.access[service.status]}}</span>
                  <span v-if="service.status == 1" class="label label-warning">{{mapper.access[service.status]}}</span>
                  <span v-if="service.status == 2" class="label label-info">{{mapper.access[service.status]}}</span>
                  <span v-if="service.status == 3" class="label label-success">{{mapper.access[service.status]}}</span>
                </div>
              </div>
            </td>
          </tr>
        </thead>
      </table>
    </div>
    <div id="service_permission_conflict_modal" modal-show-hide  class="modal fade" role="dialog">
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
                        <!--th>Status</th-->
                        </tr>

                        <tr v-for="service in conflictObject.conflictedServiceList">
                        <th>{{service.id}}</th>
                        <th>{{service.serviceCode}}</th>
                        <th>{{service.serviceName}}</th>
                        <!--th>{{getStatusValue(service.status)}}</th-->
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal" @click="init()">Close</button>
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
  name: 'MemberAccessControl',
  props: [
    'id'
  ],
  data () {
    return {
      showLoader: 0,
      mapper: {
        access: ['Blocked', 'Closed', 'Open', 'Public']
      },
      groups: {},
      services: {},
      immutableGroups: {},
      immutableServices: {},
      conflictObject: {
        conflictMessage: '',
        conflictList: []
      },
      activeSearch: '',
      inactiveSearch: '',
      enabledSearch: '',
      blockedSearch: ''
    }
  },
  computed: {
    filterActiveList () {
      if (this.groups.activeGroups) {
        return this.groups.activeGroups.filter(
          group => group.groupName.toLowerCase().includes(this.activeSearch.toLowerCase())
        )
      }
    },
    filterInactiveList () {
      if (this.groups.inActiveGroups) {
        return this.groups.inActiveGroups.filter(
          group => group.groupName.toLowerCase().includes(this.inactiveSearch.toLowerCase())
        )
      }
    },
    filterEnabledList () {
      if (this.services.enabledServices) {
        return this.services.enabledServices.filter(
          service => service.serviceName.toLowerCase().includes(this.enabledSearch.toLowerCase())
        )
      }
    },
    filterBlockedList () {
      if (this.services.blockedServices) {
        return this.services.blockedServices.filter(
          service => service.serviceName.toLowerCase().includes(this.blockedSearch.toLowerCase())
        )
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.getGroups()
      this.getServices()
    },
    getGroups () {
      this.showLoader = this.showLoader + 1
      Http.GET('memberAclGet', [this.id, 'groups'])
      .then(
        ({data: {data}}) => {
          console.log(data)
          this.immutableGroups = {
            activeGroups: Object.assign([], data.activeGroups),
            inActiveGroups: Object.assign([], data.inActiveGroups)
          }
          this.groups = data
          this.showLoader = this.showLoader - 1
        },
        error => {
          console.error('Error in offers: ', error)
          this.showLoader = this.showLoader - 1
        }
      )
    },
    getServices () {
      this.showLoader = this.showLoader + 1
      Http.GET('memberAclGet', [this.id])
      .then(
        ({data: {data}}) => {
          console.log(data)
          this.immutableServices = {
            enabledServices: Object.assign([], data.enabledServices),
            blockedServices: Object.assign([], data.blockedServices)
          }
          this.services = data
          this.showLoader = this.showLoader - 1
        },
        error => {
          console.error('Error in offers: ', error)
          this.showLoader = this.showLoader - 1
        }
      )
    },
    swap (direction = 'active-inactive') {
      let {activeGroups: active, inActiveGroups: inactive} = this.groups
      let i
      let temp
      if (direction === 'inactive-active') {
        i = inactive.length
        while (i--) {
          if (inactive[i].checked) {
            temp = inactive[i]
            temp.checked = false
            active.unshift(temp)
            inactive.splice(i, 1)
          }
        }
      } else {
        i = active.length
        while (i--) {
          if (active[i].checked) {
            temp = active[i]
            temp.checked = false
            inactive.unshift(temp)
            active.splice(i, 1)
          }
        }
      }
      this.groups.activeGroups = active
      this.groups.inActiveGroups = inactive
    },
    swapService (direction = 'enabled-blocked') {
      let {enabledServices: enabled, blockedServices: blocked} = this.services
      let i
      let temp
      if (direction === 'blocked-enabled') {
        i = blocked.length
        while (i--) {
          if (blocked[i].checked) {
            temp = blocked[i]
            temp.checked = false
            enabled.unshift(temp)
            blocked.splice(i, 1)
          }
        }
      } else {
        i = enabled.length
        while (i--) {
          if (enabled[i].checked) {
            temp = enabled[i]
            temp.checked = false
            blocked.unshift(temp)
            enabled.splice(i, 1)
          }
        }
      }
      this.services.enabledServices = enabled
      this.services.blockedServices = blocked
    },
    applyChanges () {
      let i
      let addedGroups = []
      let removedGroups = []
      let {activeGroups: active, inActiveGroups: inactive} = this.groups
      let {activeGroups: activeImmutable, inActiveGroups: inactiveImmutable} = this.immutableGroups
      console.log(this.groups, this.immutableGroups)
      active = active.map(({id}) => id)
      inactive = inactive.map(({id}) => id)
      activeImmutable = activeImmutable.map(({id}) => id)
      inactiveImmutable = inactiveImmutable.map(({id}) => id)
      for (i = 0; i < inactiveImmutable.length; i++) {
        if (inactive.indexOf(inactiveImmutable[i]) === -1) {
          addedGroups.push(inactiveImmutable[i])
        }
      }
      for (i = 0; i < activeImmutable.length; i++) {
        if (active.indexOf(activeImmutable[i]) === -1) {
          removedGroups.push(activeImmutable[i])
        }
      }
      if (addedGroups.length === 0 && removedGroups.length === 0) {
        //   notiService.showNotiFunc("Warning!", "No change has been made!", "alert alert-warning");
        $.notify({
                // options
          title: '<strong>Warning!</strong>',
          message: 'No change has been made'
        }, {
          // settings
          type: 'warning',
          delay: 3000
        })
      } else {
          // iPayAclServices.sendHttpRequest({groupId: vm.group.id, enabledServices, removedServices}, '13009')
        Http.POST('memberAclUpdate', {addedGroups, removedGroups}, [this.id, 'groups'])
          .then(({data}) => {
            console.log(data)
            $.notify({
              // options
              title: '<strong>Success!</strong>',
              message: 'Changes have been made successfully.'
            }, {
              // settings
              type: 'success',
              delay: 3000
            })
            this.getGroups()
          }, error => {
            console.error('Error in offers: ', error)
            $.notify({
              // options
              title: '<strong>Failure!</strong>',
              message: 'Changes not saved.'
            }, {
              // settings
              type: 'danger',
              delay: 3000
            })
            console.log('error occurred member acl UPDATE')
          })
      }
    },
    applyChangesService () {
      let i
      let enabledServices = []
      let removedServices = []
      let {enabledServices: enabled, blockedServices: blocked} = this.services
      let {enabledServices: enabledImmutable, blockedServices: blockedImmutable} = this.immutableServices
      console.log(this.immutableServices)
      enabled = enabled.map(({id}) => id)
      blocked = blocked.map(({id}) => id)
      enabledImmutable = enabledImmutable.map(({id}) => id)
      blockedImmutable = blockedImmutable.map(({id}) => id)
      console.log(blockedImmutable)
      for (i = 0; i < blockedImmutable.length; i++) {
        if (blocked.indexOf(blockedImmutable[i]) === -1) {
          enabledServices.push(blockedImmutable[i])
        }
      }
      for (i = 0; i < enabledImmutable.length; i++) {
        if (enabled.indexOf(enabledImmutable[i]) === -1) {
          removedServices.push(enabledImmutable[i])
        }
      }
      if (enabledServices.length === 0 && removedServices.length === 0) {
        //   notiService.showNotiFunc("Warning!", "No change has been made!", "alert alert-warning");
        $.notify({
                // options
          title: '<strong>Warning!</strong>',
          message: 'No change has been made'
        }, {
          // settings
          type: 'warning',
          delay: 3000
        })
      } else {
          // iPayAclServices.sendHttpRequest({groupId: vm.group.id, enabledServices, removedServices}, '13009')
        Http.POST('memberAclUpdate', {enabledServices, removedServices}, [this.id, 'manage-acl'])
          .then(({data}) => {
            console.log(data)
            $.notify({
              // options
              title: '<strong>Success!</strong>',
              message: 'Changes have been made successfully.'
            }, {
              // settings
              type: 'success',
              delay: 3000
            })
            this.getServices()
          }, error => {
            if (error.response) {
              if (error.response.status === 409) {
                this.conflictObject.conflictedServiceList = error.response.data.serviceList
                this.conflictObject.conflictMessage = error.response.data.message
                $('#service_permission_conflict_modal').modal()
                console.log('Error in updateMemberServicePermissions!')
                console.log('response')
              }
            }
          })
      }
    }
  }
}
</script>
