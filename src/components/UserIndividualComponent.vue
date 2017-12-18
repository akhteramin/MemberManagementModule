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

    <div class="gr-10 push-2" v-if="user">

      <br>
      <div class="gr-12"> <!--offset-md-1-->
        <div class="card"> <!-- class="card"-->
          <h3 class="card-header">
          <i class="fa fa-user" aria-hidden="true"></i> User Information
        </h3>
          <div class="gr-4 push-6" v-if="!updateUser">
            <a @click="showUpdateUserFields">
              <i class="fa fa-edit" aria-hidden="true"></i>
            </a>
          </div>
        <div>
          <div v-if="user">

            <br>
            <div class="row" v-if="!updateUser">

              <div class="gr-2">
                <img v-if="user.profilePictureUrl"
                     :src="imageBaseUrl+user.profilePictureUrl || 'static/images/default-original.jpg'"
                     class="img-circle img-responsive" width="250" height="250">

                <img v-else src="static/images/default-original.jpg" class="img-circle img-responsive"
                     alt="N/A" width="30" height="30">

              </div>



              <div class="gr-6 text-left push-.5">


                <div class="gr-11">
                  <div class="gr-2">
                  </div>
                  <!--<div class="gr-2 push-7" v-if="!editBasicProfileMode">-->
                    <!--<button class="button-md-edit" @click="editBasicInfo()"><i class="fa fa-pencil-square-o"></i> Edit </button>-->
                  <!--</div>-->
                </div>
                <div class="gr-12">
                  <div class="gr-4 padding-5">
                    Name:
                  </div>
                  <div class="gr-8 padding-5 text-left">
                    {{ user.name || 'N/A'}}
                  </div>
                  <br>
                  <div class="gr-4 padding-5">
                    Email:
                  </div>
                  <div class="gr-8 padding-5 text-left pull-.5">
                    {{ user.email || 'N/A' }}
                  </div>
                  <br>
                  <div class="gr-4 padding-5">
                    Designation:
                  </div>
                  <div class="gr-8 padding-5 text-left">
                    {{ user.designation || 'N/A' }}
                  </div>
                  <br>
                  <div class="gr-4 padding-5">
                    Status:
                  </div>
                  <div class="gr-8 padding-5 text-left">
                    {{  user.status || 'N/A' }}
                  </div>
                  <br>
                  <div class="gr-4 padding-5">
                    <i class="fa fa-clock-o" aria-hidden="true"></i> User since:
                  </div>
                  <div class="gr-8 padding-5 text-left pull-.5">
                    {{ user.creationTime | date('MMM D, YYYY') || 'N/A' }}
                  </div>
                  <br>
                </div>
              </div>
            </div>

            <div v-else>
              <update-user
              :loginID = this.loginID
              @update = "reloadFields">

              </update-user>
            </div>

            <hr>
          </div>
        </div>

      </div>
    </div>
    </div>

  </div>
</template>

<script>
  import Http from '../services/Http'
  import route from '../router'
  import UpdateUserComponent from '../components/UpdateUserComponent.vue'

  export default {
    name: 'UserIndividualComponent',
    props: [
      'loginID'
    ],
    components: {
      'update-user': UpdateUserComponent
    },
    data () {
      return {
        user: {},
        updateUser: false,
        updatingUserId: '',
        imageBaseUrl: '',
        userUpdateSuccessful: false,
        userUpdateUnsuccessful: false,
        showLoader: false
      }
    },
    created () {
      console.log('created user  information..., user login id iss: ', this.loginID)
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
      showUpdateUserFields () {
        this.updateUser = true
      },
      reloadFields () {
        this.updateUser = false
        this.init()
      },
      init () {
        this.imageBaseUrl = Http.IMAGE_URL
        // Http call for basic information of the member with the 'id'
        let query = {
          'name': null,
          'email': this.loginID,
          'designation': null,
          'status': null,
          'pageNumber': 0,
          'pageSize': 10
        }
        this.showLoader = true
        Http.GET('user', query)
          .then(
            ({data: {data: list}}) => {
              this.showLoader = false
              this.user = list.list[0]
              console.log('Successfully got the user: ', this.user)
            },
            error => {
              this.showLoader = false
              if (error.response) {
                if (error.response.status === 401) { // unauthorized, logging out.
                  this.logout()
                }
              }
              console.log('Error occurred getting details of the user, error: ', error)
            }
          )
      }
    }
  }
</script>
