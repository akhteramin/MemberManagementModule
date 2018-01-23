<template>
  <div>
    <!--I am user list component................................. users:: {{ users ? users : 'N/A' }}-->
    <div class="gr-6 push-5">
      <h1>Users</h1>
    </div>
    <div class="gr-12">
    <hr>
      <br>
      <!--showNewUserComponent: {{ showNewUserComponent }}-->



      <div id="CreateNewUserModal" class="modal fade" role="dialog">
        <div class="modal-dialog  modal-md">
          <!-- Modal content-->
          <div class="modal-content" style="height: 650px; width: 500px;">
            <div class="modal-header" style="text-align: center;">
              <button type="button" class="close" data-dismiss="modal" @click="setShowNewUserComponentToFalse">&times;</button>
              <h3><i class="fa fa-user-plus" aria-hidden="true"></i> Create New User</h3>
            </div>

            <div class="modal-body">
              <form role="form" @submit.prevent="createNewUser" id="loginForm">



                <div class="form-group">
                  <label for="name">Name</label>
                  <input type="text" class="form-control" id="name"
                         placeholder="Name" v-model="createUser.name" required>
                </div>



                <div class="form-group">
                  <label for="designation">Designation</label>
                  <input type="text" class="form-control" id="designation"
                         placeholder="designation" v-model="createUser.designation"
                         required>
                </div>



                <div class="form-group">
                  <label for="email">Email</label>
                  <input type="email" class="form-control" id="email" placeholder="email"
                         v-model="createUser.email" required>
                </div>



                <div class="form-group">
                  <label for="password">Password</label>
                  <input type="password" class="form-control" id="password"
                         required placeholder="Choose a password" v-model="createUser.password">
                </div>



                <div class="form-group">
                  <label for="retypePassword">Retype Password</label>
                  <input type="password" class="form-control" id="retypePassword" placeholder="Retype password"
                         required v-model="createUser.passwordReTyped">
                </div>


                <button type="submit" class="btn-block btn btn-lg btn-primary">Create User</button>

              </form>
            </div>
          </div>
        </div>
      </div>

    </div>



    <!-- ---------------------------- Filters -------------------------- -->
    <div>


      <form v-on:submit.prevent="getUsers" v-on:reset.prevent="init">
        <div class="row">
          <div class="gr-12">
            <div class="gr-4">
              <div class="form-group">
                <label> Name: </label>
                <input  name="queryName" type="text" id="queryName" placeholder="Name"
                        v-model="userQuery.name"
                        value=""/>
              </div>
            </div>


            <div class="gr-4">
              <div class="form-group">
                <label> Email: </label>
                <input  name="email" type="email"
                        v-model="userQuery.email" placeholder="a@example.com"
                        value=""/>
              </div>
            </div>

            <div class="gr-4">
              <div class="form-group">
                <label>Status: </label>
                <div class="select">
                  <select id="personal-business-select"  v-model="userQuery.status">
                    <!--<option selected disabled>Select account type</option>-->
                    <option selected value = null>Both</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="gr-4 push-5">
            <div class="form-group">
              <button type="submit" class="button-search">
                <i class="fa fa-search" aria-hidden="true"></i>
                Search
              </button>
              <button type="reset" class="button-reset">
                <i class="fa fa-undo" aria-hidden="true"></i>
                Reset
              </button>
            </div>
          </div>
          <div class="gr-1 push-7">
            <div class="select select-sm">
              <select  v-model="userQuery.pageSize" @change="getUsers">
                <option disabled>Number of Entries</option>
                <option selected value=10>10</option>
                <option value=20>20</option>
                <option value=30>30</option>
                <option value=50>50</option>
              </select>
            </div>
          </div>


        </div>
      </form>
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

      <div>
        <span style="display:inline-block; width: 5px;"></span>
        <button role="button" class="button-search"
                v-if="!showNewUserComponent && containsPermission('MS_USER_CREATE')"
                @click="loadCreateNewUserComponent">
          <i class="fa fa-plus" aria-hidden="true"></i> Create New User
        </button>
      </div>

    </div>

    <!-- ------------------------------ Main table for users ---------------------------------- -->
    <div class="table-responsive gr-12">
      <br>
      <table class="table ui celled" cellspacing="0" width="100%">
        <thead>
        <tr>
          <th style="text-align: center;">#</th>
          <th style="text-align: center;">Name</th>
          <th style="text-align: center;">Email</th>
          <th style="text-align: center;">Status</th>
          <th style="text-align: center;">Mobile No.</th>          
          <th style="text-align: center;"><i class="fa fa-clock-o" aria-hidden="true"></i> User since</th>
          <th style="text-align: center;">Update</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user,index in users">
          <td style="text-align: center;">{{userQuery.pageNumber * userQuery.pageSize + index + 1}}</td>

          <td class="member-name" style="text-align: left">
                <span v-if="user.profilePictureUrl">
                  <img :src="user.profilePictureUrl" class="img-circle" alt="N/A" width="30" height="30">
                </span>
            <span v-else>
                  <img src="static/images/default-original.jpg" class="img-circle" alt="N/A" width="30" height="30">
                </span>
              <a style="cursor: pointer;" @click="userDetails(user.id)">
                {{ user.name }}
              </a>

            <!--<i class="fa fa-external-link" aria-hidden="true" @click="loadProfile(member)"></i>-->
          </td>
          <td style="text-align: center;">{{ user.email ? user.email : 'N/A' }}</td>
          <td style="text-align: center;">
            {{ user.status }}
          </td>
          <td style="text-align: center;">{{ user.mobileNumber ? user.mobileNumber : 'N/A' }}</td>          
          <td style="text-align: center;">{{ user.creationTime | date('MMM D, YYYY hh:mm')}}</td>
          <td style="text-align: center;">
            <a @click="showUpdateUserModal(user)">
              <i class="fa fa-edit" aria-hidden="true"></i>
            </a>
          </td>

        </tr>
        </tbody>
      </table>
    </div>




    <!--  --------------------------------- table pagination --------------------------- ------>
    <div class="gr-12 push-2 card-footer text-muted" v-if="totalElements > 0 && totalPages > 1">
      <div class="row">
        <div class="gr-3">
          <div style="margin-top: 2.5rem;" v-if="users">
            <small>Showing {{ parseInt(userQuery.pageNumber * userQuery.pageSize + 1)
              }} to {{ parseInt(userQuery.pageNumber * userQuery.pageSize + users.length)
              }} out of {{ totalElements }}
            </small>
          </div>
        </div>
        <div class="gr-9 push-1">
          <div v-if="totalPages <= maxPaginationItem">
            <nav aria-label="ActivityPagination">
              <ul class="pagination pagination-sm justify-content-end">
                <li class="page-item " v-bind:class="{ disabled: userQuery.pageNumber === 0 }">
                  <a class="page-link" v-on:click="pageChange(userQuery.pageNumber - 1)" tabindex="-1">Previous</a>
                </li>
                <li class="page-item"
                    v-bind:class="{ active: userQuery.pageNumber === (n - 1) }"
                    v-for="n in totalPages">
                  <a class="page-link" v-on:click="pageChange(n - 1)" tabindex="-1">{{ n }}</a>
                </li>
                <li class="page-item" v-bind:class="{ disabled: userQuery.pageNumber === totalPages - 1 }">
                  <a class="page-link" v-on:click="pageChange(userQuery.pageNumber + 1)" tabindex="-1">Next</a>
                </li>
              </ul>
            </nav>
          </div>
          <div class="pull-right" v-else>
            <a class="btn btn-sm btn-secondary"
               role="button"
               v-bind:class="{ disabled: userQuery.pageNumber === 0 }"
               v-on:click="pageChange(0)">
              <i class="fa fa-angle-double-left" aria-hidden="true"></i> First
            </a>
            <a class="btn btn-sm btn-secondary"
               role="button"
               v-bind:class="{ disabled: userQuery.pageNumber === 0 }"
               v-on:click="pageChange(userQuery.pageNumber - 1)">
              <i class="fa fa-angle-left" aria-hidden="true"></i> Previous
            </a>
            <small>Page {{ userQuery.pageNumber + 1 }} of {{ userQuery.totalPages }}</small>
            <a class="btn btn-sm btn-secondary"
               role="button"
               v-bind:class="{ disabled: userQuery.pageNumber === userQuery.totalPages - 1 }"
               v-on:click="pageChange(userQuery.pageNumber + 1)">
              Next <i class="fa fa-angle-right" aria-hidden="true"></i>
            </a>
            <a class="btn btn-sm btn-secondary"
               role="button"
               v-bind:class="{ disabled: userQuery.pageNumber === totalPages - 1 }"
               v-on:click="pageChange(totalPages - 1)">
              Last <i class="fa fa-angle-double-right" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
    </div>





    <div id="UserUpdateResponseModal" class="modal fade" role="dialog">
      <div class="modal-dialog  modal-md">
        <!-- Modal content-->

        <div class="modal-content" style="height: 320px;">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" >&times;</button>
            <h4 class="modal-title" style="text-align: center;">Update User</h4>
            <div v-if="userUpdateSuccessful || userUpdateUnsuccessful">
              <br>
              <div v-if="userUpdateSuccessful" style="text-align: center;">
                <i class="fa fa-check" aria-hidden="true" style="color: greenyellow"></i> User update Successful
              </div>
              <div v-if="userUpdateUnsuccessful" style="text-align: center;">
                <i class="fa fa-times" aria-hidden="true" style="color: greenyellow"></i> User update Unsuccessful
              </div>
            </div>
          </div>


          <div class="modal-body" style="text-align: left;">
            <form v-on:submit.prevent="updateUser"
                v-on:reset.prevent="doNotUpdateUser">

              <div class="row push-2" style="padding: 2px;">
                <div class="gr-3">
                  <label for="name">Name: </label>
                </div>
                <div class="gr-4">
                  <input id="name" placeholder="User's name" v-model="updateRequest.name"
                         style="width: 220px; height: 35px;"  type="text" required/>
                </div>
              </div>

              <div class="row push-2" style="padding: 2px;">
                <div class="gr-3">
                  <label for="designation">Designation: </label>
                </div>
                <div class="gr-3" style="align-items: flex-start;">
                  <input id="designation" placeholder="User's designation" v-model="updateRequest.designation"
                         style="width: 220px; height: 35px;" type="text" required/>
                </div>
              </div>

              <div class="row push-2" style="padding: 2px;">
                <div class="gr-3">
                  <label for="status">Status: </label>
                </div>
                <div class="gr-3">
                  <div class="select" style="width: 220px;">
                    <select id="status" v-model="updateRequest.status">
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="SUSPENDED">SUSPENDED</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="gr-10 push-6">
                <br>
                <div class="form-group">
                  <button type="submit" class="button-search">
                    <i class="fa fa-refresh" aria-hidden="true"></i>
                    Update
                  </button>
                  <button type="reset" class="button-reset">
                    <i class="fa fa-times" aria-hidden="true"></i>
                    Cancel
                  </button>
                </div>
              </div>


            </form>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Http from '../../services/Http'
  import route from '../../router'

  export default {
    name: 'UserListComponent',
    data () {
      return {
        users: {},
        userQuery: {},
        updateRequest: {},
        totalPages: '',
        totalElements: '',
        pageNumber: 0,
        maxPaginationItem: 10,
        userUpdateSuccessful: false,
        userUpdateUnsuccessful: false,
        updatingUserId: '',
        showNewUserComponent: false,
        createUser: {},
        showLoader: true,
        accessControlList: []
      }
    },
    created () {
      console.log('User list component created::')
      this.init()
    },
    methods: {
      containsPermission (permission) {
        return this.accessControlList.indexOf(permission) > -1
      },
      setShowNewUserComponentToFalse () {
        this.showNewUserComponent = false
        this.init()
      },
      pageChange (number = 0) {
        if (number >= 0 && number < this.totalPages && this.userQuery.pageNumber !== number) {
          this.userQuery.pageNumber = number
          this.getUsers(false, this.userQuery.pageNumber, this.userQuery.pageSize)
        }
      },
      createNewUser () {
        if (this.createUser.password !== this.createUser.passwordReTyped) {
          alert('Passwords mismatched.')
          return
        }
        this.showLoader = true
        Http.POST('user', this.createUser)
          .then(({data}) => {
            console.log('Member created, response: ', data)
            this.accountCreationSuccessful = true
            $('#CreateNewUserModal').modal('hide')
//            console.log('after modal hiding, userQuery: ', this.userQuery)
            this.getUsers(false, this.userQuery.pageNumber, this.userQuery.pageSize)
            this.showNewUserComponent = false
            $.notify({
              // options
              title: '<strong>Success!</strong>',
              message: 'User has been created successfully.'
            }, {
              // settings
              type: 'success',
              delay: 3000
            })
            this.createUser = {}
            this.showLoader = false
          },
            error => {
              console.log('error is: ', error)
              this.accountCreationSuccessful = false
//              console.log('Error in member creation, error: ', error)
              $('#CreateNewUserModal').modal('hide')
              $.notify({
                // options
                title: '<strong>Failure!</strong>',
                message: error.response.data.message // 'User is not created.'
              }, {
                // settings
                type: 'danger',
                delay: 3000
              })
              this.getUsers(false, this.userQuery.pageNumber, this.userQuery.pageSize)
              this.showLoader = false
              this.showNewUserComponent = false
            })
      },
      getUsers (requestQueryByFilter = true, _pageNumber = 0, _pageSize = 10) {
        this.showLoader = true
        if (requestQueryByFilter) {
          this.userQuery.pageNumber = 0
        } else {
          this.userQuery.pageNumber = _pageNumber
          this.userQuery.pageSize = _pageSize
        }
//        console.log('in user list component.vue, userQuery: ', this.userQuery)
        Http.GET('user', this.userQuery)
          .then(({data: {data: list}}) => {
            this.users = list['list']
            this.totalPages = list.totalPages
            this.totalElements = list.totalElements
            console.log('Success, got the list of users:: ', this.users, ' here is the list: ', list)
            this.showLoader = false
          }, error => {
            this.showLoader = false
            console.error('Error in getting users: ', error)
          })
      },
      userDetails (id) {
        route.push(`/user/profile/${id}`)
      },
      init (_pageNumber = 0, _pageSize = 10) {
        this.userQuery = Object.assign({}, {
          pageNumber: 0,
          pageSize: 10,
          name: null,
          email: null,
          status: null,
          designation: null
        })
        this.createUser = Object.assign({}, {
          name: null,
          email: null,
          designation: null,
          password: null,
          passwordReTyped: null
        })
        this.accessControlList = localStorage.getItem('accessControlList')
        this.accessControlList = this.accessControlList.split(',')
        this.showNewUserComponent = false
        this.getUsers()
      },
      showUpdateUserModal (user) {
        this.updateRequest = Object.assign({}, {
          'name': user.name,
          'designation': user.designation,
          'status': user.status
        })
        this.userUpdateSuccessful = false
        this.userUpdateUnsuccessful = false
        this.updatingUserId = user.id
        $('#UserUpdateResponseModal').modal({backdrop: false})
      },
      updateUser () {
        console.log('in update user, id: ', this.updatingUserId)
        this.showLoader = true
        Http.PUT('user', this.updateRequest, [this.updatingUserId])
          .then((data) => {
            this.showLoader = false
            console.log('User updated successfully.', data)
            this.userUpdateSuccessful = true
            this.userUpdateUnsuccessful = false
            this.init(this.userQuery.pageNumber, this.userQuery.pageSize)
            $('#UserUpdateResponseModal').modal('hide')
            $.notify({
              // options
              title: '<strong>Success!</strong>',
              message: data.data.message
            }, {
              // settings
              type: 'success',
              delay: 3000
            })
          }, error => {
            this.showLoader = false
            $('#UserUpdateResponseModal').modal('hide')
            $.notify({
              // options
              title: '<strong>Failure!</strong>',
              message: error.response.data.message
            }, {
              // settings
              type: 'danger',
              delay: 3000
            })
            this.userUpdateUnsuccessful = true
            console.error('Error in getting users: ', error)
          })
      },
      doNotUpdateUser () {
        console.log('cancel button clicked...')
        $('#UserUpdateResponseModal').modal('hide')
      },
      loadCreateNewUserComponent () {
        this.showNewUserComponent = true
        console.log('clicked::::')
        $('#CreateNewUserModal').modal({backdrop: false})
      }
    }
  }
</script>
