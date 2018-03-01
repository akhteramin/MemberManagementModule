<template>
    <div>
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
      <div class="gr-12 w3-header-card w3-panel w3-border-top w3-border-bottom w3-border-left w3-round">
        <div class="gr-3">
            <div class="gr-12 panel-label padding-5">
                <div class="gr-6">
                    <h4>Group List</h4>
                </div>
                <button type="button" class="btn btn-sm btn-default"
                data-toggle="modal"
                data-target="#addGroupModal">
                <i class="fa fa-plus" aria-hidden="true"></i> Add New Group
                </button>
            </div>
            <table id="aclGroup" class="table ui celled hover">
                <thead>
                    <tr>
                        <input type="text" v-model="groupSearch" placeholder="Group..">
                    </tr>
                </thead>
                <tbody v-if="groups && groups.length > 0">
                    <tr v-for="groupData in filteredGroup" class="pointer">
                        <td @click="highlightRow(); getService(groupData.id); ">
                             {{groupData.groupName}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="gr-9">
            <div class="gr-12 panel-label padding-3">
                <div class="gr-2">
                <h4>Manage group</h4>
                </div>
                <div class="gr-2 push-8">
                    <button type="reset" class="button-reset" @click="deactivate(group.id)">
                        <i class="fa fa-ban" aria-hidden="true"></i>
                    </button>
                    <button type="search" class="button-search" @click="edit(group.id)">
                        <i class="fa fa-pencil" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
            
            <table class="table table-bordered">
                <thead>
                    <tr>
                      <th class="col-md-3">
                        <input type="text" v-model="enabledSearch" placeholder="Enabled Service..">
                      </th>
                      <th class="col-md-1">
                      </th>
                      <th class="col-md-3">
                        <input type="text" v-model="blockedSearch" placeholder="Disabled Service..">
                      </th>
                    </tr>
                    <tr>
                        <td class="col-md-3">
                            <div class="small-scrollable height-500">
                                <div class="padding-2" v-for="service in filteredEnabledList">
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
                                <div v-for="service in filteredBlockedList">
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
                <div class="col-md-5">
                  <input type="text" v-model="memberSearch" placeholder="Members..">
                </div>
                <div class="col-md-2 col-md-offset-5 padding-5">
                    <button type="button" class="btn btn-sm btn-default"
                    data-toggle="modal"
                    data-target="#member_add_remove_for_service_modal">
                    <i class="fa fa-plus" aria-hidden="true"></i> Add Member
                    </button>
                </div>
                <span v-if="group && group.userList.length === 0">
                    <hr>
                    <div class="text-center"><label>No user found</label></div>
                </span>
                <table class="table table-condensed" v-if="group && group.userList.length > 0">
                    <tbody>
                    <tr v-for="(user, index) in filteredMember">
                        <th scope="row">
                            <span v-if="user.profilePictureUrl">
                            <img :src="imageBaseUrl+user.profilePictureUrl" class="img-circle"
                                 alt="N/A" width="30" height="30"
                                 onerror="this.onerror=null; this.src='/static/images/default-profile-64x64.png';">
                            </span>
                            <span v-else>
                            <img src="static/images/default-original.jpg"
                                 onerror="this.onerror=null; this.src='/static/images/default-profile-64x64.png';"
                                 class="img-circle" alt="N/A" width="30" height="30">
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

        <div id="member_add_remove_for_service_modal" modal-show-hide  class="modal fade" role="dialog">
            <div class="modal-dialog modal-lg">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Add Members to Group</h4>
                    </div>
                    <!--  <form name="newUserForm" id="newUserForm"  ng-submit="submitUserData(userData)" novalidate> -->
                        <div class="modal-body">
                            <div class="container-fluid">
                              <div class="panel panel-default">
                                  <div class="panel-heading iPay-white-panel-heading text-center">
                                      All Members
                                  </div>
                                  <div class="panel-body">
                                    <div class="row">
                                        <div class="col-md-8 col-md-offset-2">

                                            <input type="text" class="input-sm" placeholder="Search by Mobile Number" v-model="targetMobileNumber"  />

                                            <!--div class="col-md-3" @click="loadMemberList(targetMobileNumber,0)"-->
                                                <button class="btn btn-default" @click="loadMemberList(targetMobileNumber,0)"> <i class="fa fa-search" aria-hidden="true"></i></button>
                                            <!--/div-->
                                        </div>
                                    </div>
                                    <br>
                                    <div class="row scrollable-div">
                                      <table class="table table-hover" v-if="allMemberList && allMemberList.length>0">
                                          <tr class="tr-bg">
                                              <th >Name</th>
                                              <th >Phone</th>
                                              <th >Acc. Type</th>
                                              <th class="text-center">Status</th>
                                              <th>Action</th>

                                          </tr>
                                          <tr v-for="(user,index) in allMemberList" >
                                              <td>
                                                  <a> {{user.name}} </a>
                                              </td>
                                              <td>
                                                  {{user.mobileNumber}}
                                              </td>
                                              <td>
                                                  {{user.accountType==1?'Personal':user.accountType==2?'Business':'N/A'}}
                                              </td>
                                              <td class="text-center">
                                                      <p class="p-margin-2 green" v-if="user.verificationStatus == 'VERIFIED'">
                                                          <i class="fa fa-check" aria-hidden="true"></i></p>
                                                      <p class="p-margin-2 red" v-if="user.verificationStatus == 'NOT_VERIFIED'"><i class="fa fa-times-circle-o" aria-hidden="true"></i></p>
                                                      <p class="p-margin-2 blue" v-if="user.verificationStatus == 'IN_PROGRESS'"><i class="fa fa-refresh" aria-hidden="true"></i></p>
                                              </td>
                                              <td>
                                                <button v-if="user.flag=='Not Added'" class="btn btn-sm btn-default" title="Add to black list or white list" @click="addOrRemoveMembersToGroup([user.accountId],[],index)">
                                                    <i class="fa fa-plus" aria-hidden="true"></i>
                                                </button>
                                                <span v-if="user.flag == 'Added'" class="label label-success">
                                                  Added
                                                </span>
                                              </td>

                                          </tr>
                                      </table>
                                      <div class="text-center" v-if="allMemberList && allMemberList.length>0">
                                          Showing top {{allMemberList.length}} out of {{totalMembers}} results
                                          <br>
                                          <a v-if="SeeMoreFlag" href="" @click="loadMemberList(targetMobileNumber,searchData.currentPageNumber+1)">See More</a>
                                      </div>
                                      <div class="text-center" v-if="allMemberList.length==0">
                                          No Data Found!!!
                                      </div>
                                    </div>

                                  </div>
                            </div>
                            </div>
                        </div>
                        <div class="modal-footer">

                            <button type="button" class="btn btn-sm btn-default btn-active-til" data-dismiss="modal">Close</button>
                        </div>
                    <!-- </form> -->
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
                                                   placeholder="For example, Allow Bill Payment, Block Withdraw Money">
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
                        <button type="button" class="btn btn-sm btn-default" data-dismiss="modal">Close</button>
                        <button type="button"
                                class="btn btn-sm btn-primary"
                                data-dismiss="modal" @click="edit()">
                            <i class="fa fa-pencil"></i> Update
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

        <!-- Deactive Group Modal -->
        <div id="deactivateGroupModal" class="modal fade" role="dialog" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                                aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Deactivate Group</h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-11">
                                <p class="lead text-center margin-top-20">
                                Do you want to deactivate group <strong>{{tempGroup.groupName}}</strong>?
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-sm btn-default" data-dismiss="modal" @click="tempGroup = null">Close</button>
                        <button type="button"
                                class="btn btn-sm btn-primary"
                                data-dismiss="modal" @click="deactivate()">
                            <i class="fa fa-pencil"></i> Yes
                        </button>

                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import Http from '../../services/Http'
export default {
  name: 'MemberOffer',
  data () {
    return {
      showLoader: false,
      groups: {},
      group: {},
      mapper: {
        access: ['Blocked', 'Closed', 'Open', 'Public'],
        accountType: ['Personal', 'Business']
      },
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
      },
      allMemberList: [],
      targetMobileNumber: '',
      SeeMoreFlag: true,
      enabledSearch: '',
      blockedSearch: '',
      memberSearch: '',
      groupSearch: ''
    }
  },
  computed: {
    filteredEnabledList () {
      if (this.group.enabledServices) {
        return this.group.enabledServices.filter(service => {
          return service.serviceName.toLowerCase().includes(this.enabledSearch.toLowerCase())
        })
      }
    },
    filteredBlockedList () {
      if (this.group.blockedServices) {
        return this.group.blockedServices.filter(service => {
          return service.serviceName.toLowerCase().includes(this.blockedSearch.toLowerCase())
        })
      }
    },
    filteredMember () {
      if (this.group.userList) {
        return this.group.userList.filter(user => {
          return user.name.toLowerCase().includes(this.memberSearch.toLowerCase())
        })
      }
    },
    filteredGroup () {
      if (this.groups) {
        return this.groups.filter(group => {
          return group.groupName.toLowerCase().includes(this.groupSearch.toLowerCase())
        })
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.imageBaseUrl = Http.IMAGE_URL
      console.log('Hello')
      this.showLoader = true
      Http.GET('aclUserGroup')
        .then(({data: aclUserGroup}) => {
          this.showLoader = false
          console.log('Success, got group list: ', aclUserGroup)
          this.groups = aclUserGroup.groupList
          this.getService()
        //   this.loadMemberList('', 0)
        }, error => {
          this.showLoader = false
          console.error('Error in offers: ', error)
        })
    },
    getService (param = 1) {
      this.showLoader = true
      Http.GET('aclUserGroup', [param])
        .then(({data: aclService}) => {
          this.showLoader = false
          console.log('Success, got group list: ', aclService)
          this.group = aclService
          this.immutableServices = {
            enabledServices: Object.assign([], this.group.enabledServices),
            blockedServices: Object.assign([], this.group.blockedServices)
          }
          console.log('Success, got group list: ', this.group)
        //   this.groupList = aclUserGroup.data.groupList
        }, error => {
          this.showLoader = false
          console.error('Error in offers: ', error)
        })
    },
    highlightRow () {
      $('#aclGroup tbody').on('click', 'tr', function () {
        $('#aclGroup tbody > tr').removeClass('selected')
        $(this).addClass('selected')
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
          }, error => {
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
            // this porition is needed only commented out for not implemented loadmemberlist
          if (removedMembers.length === 0) {
            this.allMemberList[index].flag = 'Added'
          }
          this.getService(this.group.id)
        }, error => {
          console.error('Error in offers: ', error)
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
          console.error('Error in offers: ', error)
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
      console.log('id==', id)
      if (id) {
        this.tempGroup = Object.assign({}, this.groups.find(x => x.id === id))
        $('#editGroupModal').modal('show')
      } else {
        // iPayAclServices.sendHttpRequest(vm.tempGroup, '13008')
        console.log(this.tempGroup)
        Http.PUT('aclUserGroup', this.tempGroup)
            .then(({data: response}) => {
              this.tempGroup = {
                id: '',
                groupName: '',
                isActive: true
              }
              this.init()
              // notiService.showNotiFunc("Success!", "Group Edit Successfully", "alert alert-success");
              $.notify({
              // options
                title: '<strong>Success!</strong>',
                message: 'Group Edit Successfully'
              }, {
                    // settings
                type: 'success',
                delay: 3000
              })
            }, error => {
              console.error('Error in offers: ', error)
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
    },
    deactivate (id = null) {
      if (id) {
        this.tempGroup = Object.assign({}, this.groups.find(x => x.id === id))
        $('#deactivateGroupModal').modal('show')
      } else {
        Http.PUT('aclUserGroup', Object.assign(this.tempGroup, {isActive: false}))
          .then(({data: response}) => {
            this.groups = this.groups.filter(x => x.id !== this.tempGroup.id)
            console.log('groups::', this.groups)
            this.group = {}
            this.tempGroup = null
            // notiService.showNotiFunc("Success!", "Group Deactivate Successfully", "alert alert-success");
            this.init()
            $.notify({
                // options
              title: '<strong>Success!</strong>',
              message: 'Group Deactivate Successfully.'
            }, {
                  // settings
              type: 'success',
              delay: 3000
            })
          }, error => {
            console.error('Error in offers: ', error)
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
      }
    },
    loadMemberList (mobileNumberToSearch, startPage) {
      var searchData = {
        name: '', // string
        mobileNumber: mobileNumberToSearch, // string
        accountType: '', // int: 1 = personal, 2 = business
        verificationStatus: '', // string: VERIFIED, NOT_VERIFIED
        profileCompletionScoreStartRange: '',
        profileCompletionScoreEndRange: '',
        startSignUpDate: '',
        endSignUpDate: '',
        sort: 'DOCUMENT_UPLOAD',
        order: 'DESC',
        pageNumber: startPage,
        pageSize: 10
      }
      // var curData = (searchData.pageNumber + 1) * searchData.pageSize
      Http.GET('member', searchData)
      .then(({data: memberData}) => {
        console.log('response from member get')
        console.log(memberData)
        this.allMemberList = Object.assign([], memberData.data.list)
        if (startPage === 0) {
          this.allMemberList = []
        }
        this.allMemberList.push.apply(this.allMemberList, memberData.data.list)
        for (let i = 0; i < this.allMemberList.length; i++) {
          this.allMemberList[i]['flag'] = 'Not Added'
        }
        // console.log('MemberList2: ')
        // console.log(memberData)
        this.totalMembers = memberData.data.totalElements
        this.totalPages = Math.ceil((this.totalMembers / searchData.pageSize))
        console.log('totalPages: ', this.totalPages)
        // curData = (searchData.pageNumber + 1) * searchData.pageSize;
        this.SeeMoreFlag = memberData.data.hasNextPage
      }, error => {
        console.error('Error in offers: ', error)
      })
    }
  }
}
</script>
