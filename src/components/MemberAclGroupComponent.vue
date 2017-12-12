<template>
    <div class="gr-10 push-2">
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
      <div class="gr-6 push-4">
        <h1>iPay Member ACL</h1>
      </div>
      <div class="gr-12">
        <hr>
        <div class="gr-3">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>
                            <div class="gr-6">
                                <h4>Group List</h4>
                            </div>
                            <button type="button" class="btn btn-sm btn-default"
                            data-toggle="modal"
                            data-target="#addGroupModal"> 
                            <i class="fa fa-plus" aria-hidden="true"></i> Add New Group
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody v-if="groups && groups.length > 0">
                    <tr v-for="groupData in groups">
                        <td @click="getService(groupData.id)">
                             {{groupData.groupName}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="gr-7 push-1">
            <div class="gr-3">
            <h3>Manage groups</h3>
            </div>
            <div class="gr-2 push-8">
                <button type="reset" class="button-reset">
                    <i class="fa fa-ban" aria-hidden="true"></i>
                </button>
                <button type="search" class="button-search" @click="edit(tempGroup.id)">
                    <i class="fa fa-pencil" aria-hidden="true"></i>
                </button>
            </div>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <td class="col-md-3">
                            <div class="small-scrollable" style="height:500px">
                                <div class="padding-2" v-for="service in group.enabledServices">
                                    <input type="checkbox"
                                            v-model="service.checked"
                                            :disabled="service.status == 0 || service.status == 3">
                                    <small>{{service.serviceName}}</small>
                                    <!--span class="label "
                                            data-ng-class="{'label-danger': service.status == 0, 'label-warning': service.status == 1,'label-info': service.status == 2,'label-success': service.status == 3}">{{mapper.access[service.status]}}
                                    </span-->
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
                                    :disabled="group === null"
                                    @click="swap('enabled-blocked')">
                                <i class="fa fa-chevron-right" aria-hidden="true"></i>
                            </button>
                            </div>
                            <div class="col-md-12 padding-5 text-center">
                            <button type="button" 
                                    class="btn btn-sm btn-default" 
                                    :disabled="group === null"
                                    @click="swap('blocked-enabled')">
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
                                <div v-for="service in group.blockedServices">
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

            <div class="col-md-12">
                <div class="col-md-2 col-md-offset-10 padding-5">
                    <button type="button" class="btn btn-sm btn-default"> 
                    <i class="fa fa-plus" aria-hidden="true"></i> Add Member
                    </button>
                </div>
                <span v-if="group && group.userList.length === 0">
                    <hr>
                    <div class="text-center"><label>No user found</label></div>
                </span>
                <table class="table table-condensed" v-if="group && group.userList.length > 0">
                    <tbody>
                    <tr v-for="(user, index) in group.userList">
                        <th scope="row">
                            <span v-if="user.profilePictureUrl">
                            <img :src="imageBaseUrl+user.profilePictureUrl" class="img-circle" alt="N/A" width="30" height="30">
                            </span>
                            <span v-else>
                            <img src="static/images/default-original.jpg" class="img-circle" alt="N/A" width="30" height="30">
                            </span>
                        </th>
                        <td>{{user.name}}</td>
                        <td>{{user.mobileNumber}}</td>
                        <td>{{user.verificationStatus}}</td>
                        <td><span class="label label-default">{{mapper.accountType[user.accountType - 1]}}</span>
                        </td>
                        <td>
                            <div class="pull-right">
                                <i class="fa fa-window-close" aria-hidden="true" @click="addOrRemoveMembersToGroup([],[user.accountId],index)"></i>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

    </div>

        <div id="addGroupModal" class="modal fade" role="dialog" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                                aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Add New Group</h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-11">
                                <p>
                                <form class="form-horizontal">
                                    <div class="form-group">
                                        <label for="groupName" class="col-sm-3 control-label">Group Name</label>
                                        <div class="col-sm-9">
                                            <input type="text"
                                                   class="form-control" id="groupName"
                                                   v-model="name"
                                                   placeholder="For e.g. Allow Bill Payment, Block Withdraw Money">
                                        </div>
                                    </div>
                                </form>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-sm btn-default" 
                        data-dismiss="modal">
                        <i class="fa fa-times" aria-hidden="true"></i>Close</button>
                        <button type="button"
                                class="btn btn-sm btn-primary"
                                data-dismiss="modal" @click="add(name)">
                            <i class="fa fa-check" aria-hidden="true"></i> Save
                        </button>

                    </div>
                </div>
            </div>
        </div>

        <div id="editGroupModal" class="modal fade" role="dialog" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                                aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Edit Group</h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-11">
                                <p>
                                <form class="form-horizontal">
                                    <div class="form-group">
                                        <label for="tempGroupName" class="col-sm-3 control-label">Group Name</label>
                                        <div class="col-sm-9">
                                            <input type="text"
                                                   class="form-control" id="tempGroupName"
                                                   v-model="tempGroup.groupName"
                                                   placeholder="For e.g. Allow Bill Payment, Block Withdraw Money">
                                        </div>
                                    </div>
                                </form>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-sm btn-default" data-dismiss="modal" v-click="tempGroup = null">Close</button>
                        <button type="button"
                                class="btn btn-sm btn-active-til"
                                data-dismiss="modal" v-click="edit()">
                            <i class="glyphicon glyphicon-ok"></i> Update
                        </button>

                    </div>
                </div>
            </div>
        </div>

        <div id="service_group_conflict_modal" modal-show-hide  class="modal fade" role="dialog">
            <div class="modal-dialog">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" @click="init()">&times;</button>
                        <h4 class="modal-title" style="color: red">Conflict !</h4>
                    </div>
                    <!--  <form name="newUserForm" id="newUserForm"  ng-submit="submitUserData(userData)" novalidate> -->
                        <div class="modal-body">
                            <div class="container-fluid">
                                <div class="col-sm-12">

                                    <div class="form-group">
                                        <div class="row">
                                            <p>{{conflictObject.conflictMessage}}</p>
                                            <table class="table table-striped" style="width:100%;" data-pagination="true" data-search="true">
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
import Http from '../services/Http'
import route from '../router'
export default {
  name: 'MemberOffer',
  components: {
    // 'member-offer-update': MemberOfferUpdate,
    // 'member-offer-add': MemberOfferAdd
  },
  data () {
    return {
      showLoader: false,
      groups: {},
      group: {},
      mapper: {
        access: ['Blocked', 'Closed', 'Open', 'Public'],
        accountType: ['Personal', 'Business']
      },
      allMemberList: [],
      immutableServices: {},
      conflictObject: {
        conflictMessage: '',
        conflictList: []
      },
      imageBaseUrl: '',
      name: '',
      tempGroup: {
        id: '',
        groupName: '',
        isActive: true
      }
    }
  },
  created () {
    this.init()
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
      this.imageBaseUrl = Http.IMAGE_URL
      console.log('Hello')
      this.showLoader = true
      Http.GET('aclUserGroup')
        .then(({data: aclUserGroup}) => {
          this.showLoader = false
          console.log('Success, got group list: ', aclUserGroup)
          this.groups = aclUserGroup.data.groupList
          this.getService()
        }, error => {
          this.showLoader = false
          if (error.response) {
            if (error.response.status === 401) { // unauthorized, logging out.
              this.logout()
            }
          }
          console.error('Error in offers: ', error)
        })
    },
    getService (param = 1) {
      this.showLoader = true
      this.tempGroup = Object.assign({}, this.groups.find(x => x.id === param))
      Http.GET('aclUserGroup', [param, 'details'])
        .then(({data: aclService}) => {
          this.showLoader = false
          console.log('Success, got group list: ', aclService)
          this.group = aclService.data
          this.immutableServices = {
            enabledServices: Object.assign([], this.group.enabledServices),
            blockedServices: Object.assign([], this.group.blockedServices)
          }
          console.log('Success, got group list: ', this.group)
        //   this.groupList = aclUserGroup.data.groupList
        }, error => {
          this.showLoader = false
          if (error.response) {
            if (error.response.status === 401) { // unauthorized, logging out.
              this.logout()
            }
          }
          console.error('Error in offers: ', error)
        })
    },
    swap (direction = 'enabled-blocked') {
      let {enabledServices: enabled, blockedServices: blocked} = this.group
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
      this.group.enabledServices = enabled
      this.group.blockedServices = blocked
    },
    applyChanges () {
      let i
      let enabledServices = []
      let removedServices = []
      let {enabledServices: enabled, blockedServices: blocked} = this.group
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
        Http.POST('aclUserGroup', {enabledServices, removedServices}, [this.group.id, 'manage-acl'])
          .then(({data: aclService}) => {
            console.log(aclService)
            if (status === 200) {
              this.immutableServices = {
                enabledServices: Object.assign([], this.group.enabledServices),
                blockedServices: Object.assign([], this.group.blockedServices)
              }
              console.log(aclService)
              $.notify({
                // options
                title: '<strong>Success!</strong>',
                message: 'Changes have been made successfully.'
              }, {
                // settings
                type: 'success',
                delay: 3000
              })
              this.getService()
            }
          }, error => {
            if (error.response) {
              if (error.response.status === 401) { // unauthorized, logging out.
                this.logout()
              }
            }
            if (error.response.status === 409) {
              this.conflictObject.conflictedServiceList = error.response.data.serviceList
              this.conflictObject.conflictMessage = error.response.data.message
              $('#service_group_conflict_modal').modal()
              console.log('Error in updateACLUserGroup!')
              console.log('response')
            }
          })
      }
    },
    addOrRemoveMembersToGroup (addedMembers, removedMembers, index) {
      let param = {
        'addedUsers': addedMembers,
        'removedUsers': removedMembers
      }
         // iPayAclServices.sendHttpRequest(angular.toJson(param), '13011')
      Http.POST('aclUserGroup', param, [this.group.id])
        .then(({data: response}) => {
        //   notiService.showNotiFunc("Success!","Access Control of Group Changed Successfully","alert alert-success");
            // vm.getServiceDetails(vm.selectedService);
          $.notify({
            // options
            title: '<strong>Success!</strong>',
            message: 'Access Control of Group Changed Successfully.'
          }, {
            // settings
            type: 'success',
            delay: 3000
          })
          this.getService(this.group.id)
            // this porition is needed only commented out for not implemented loadmemberlist
            // if(removedMembers.length==0){
            //     this.allMemberList[index].flag = "Added"
            //   }
        }, error => {
          if (error.response) {
            if (error.response.status === 401) { // unauthorized, logging out.
              this.logout()
            }
          }
        //  notiService.showNotiFunc("Error!",data.description,"alert alert-danger")
          $.notify({
                // options
            title: '<strong>Error!</strong>',
            message: 'Access Control of Group Changed Error.'
          }, {
                // settings
            type: 'danger',
            delay: 3000
          })
        }
      )
    },
    add (name = null) {
      Http.POST('aclUserGroup', {groupName: name})
        .then(({data: response}) => {
          console.log('Success ADD: ', response)
          this.groups.push({id: response.data.group.id, groupName: name, isActive: true})
            // notiService.showNotiFunc("Success!", "Group Added Successfully", "alert alert-success")
          $.notify({
            // options
            title: '<strong>Success!</strong>',
            message: 'Group Added Successfully.'
          }, {
                    // settings
            type: 'success',
            delay: 3000
          })
        }, error => {
          if (error.response) {
            if (error.response.status === 401) { // unauthorized, logging out.
              this.logout()
            }
          }
        //  notiService.showNotiFunc("Error!",data.description,"alert alert-danger")
          $.notify({
                // options
            title: '<strong>Error!</strong>',
            message: 'Access Control of Group Changed Error.'
          }, {
                // settings
            type: 'danger',
            delay: 3000
          })
        })
    },
    edit (id = null) {
      if (id) {
        this.tempGroup = Object.assign({}, this.groups.find(x => x.id === id))
        $('#editGroupModal').modal('show')
      } else {
        // iPayAclServices.sendHttpRequest(vm.tempGroup, '13008')
        Http.PUT('updateUserGroup', {}, this.tempGroup)
            .then(({data: response}) => {
              this.tempGroup = null
              // notiService.showNotiFunc("Success!", "Group Edit Successfully", "alert alert-success");
              $.notify({
              // options
                title: '<strong>Success!</strong>',
                message: 'Group Edit Successfully'
              }, {
                    // settings
                type: 'Success',
                delay: 3000
              })
            }, error => {
              if (error.response) {
                if (error.response.status === 401) { // unauthorized, logging out.
                  this.logout()
                }
              }
              $.notify({
              // options
                title: '<strong>Error!</strong>',
                message: 'Access Control of Group Changed Error.'
              }, {
                    // settings
                type: 'danger',
                delay: 3000
              })
            })
      }
    }
  }
}
</script>