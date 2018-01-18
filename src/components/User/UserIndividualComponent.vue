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

    <div class="gr-11" v-if="user">

      <br>
      <div class="gr-12"> <!--offset-md-1-->
        <div class="card"> <!-- class="card"-->
          <h3 class="card-header">
            <i class="fa fa-user" aria-hidden="true"></i> User Information
          </h3>
        <div class="gr-12 w3-header-card w3-panel w3-border-top w3-border-bottom w3-border-left w3-round">
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
                      :src="user.profilePictureUrl || '../static/images/default-original.jpg'"
                      class="img-rounded img-responsive" width="250" height="250">

                  <img v-else src="static/images/default-original.jpg" class="img-rounded img-responsive"
                      alt="N/A" width="250" height="250">
                  <update-user-image
                    :user="user"
                    @update="editProfilePic"
                    v-if="containsPermission('MS_USER_PROFILE_PICTURE_UPLOAD')">
                  </update-user-image>
                </div>



                <div class="gr-6 text-left">


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

            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

  </div>
</template>

<script>
  import Http from '../../services/Http'
  import UpdateUserComponent from './UpdateUserComponent.vue'
  import UpdateUserImageComponent from './UpdateUserImageComponent.vue'

  export default {
    name: 'UserIndividualComponent',
    props: [
      'loginID'
    ],
    components: {
      'update-user': UpdateUserComponent,
      'update-user-image':UpdateUserImageComponent
    },
    data () {
      return {
        user: {},
        id: '',
        updateUser: false,
        updatingUserId: '',
        imageBaseUrl: '',
        userUpdateSuccessful: false,
        userUpdateUnsuccessful: false,
        showLoader: false,
        accessControlList: []
      }
    },
    created () {
      console.log('created user  information..., user login id iss: ', this.loginID)
      console.log("get the data")
      this.init()
    },
    methods: {
      containsPermission (permission) {
        return this.accessControlList.indexOf(permission) > -1
      },
      showUpdateUserFields () {
        this.updateUser = true
      },
      reloadFields () {
        this.updateUser = false
        this.init()
      },
      editProfilePic () {
        this.init()
      },
      init () {
        // Http call for basic information of the member with the 'id'
        this.accessControlList = localStorage.getItem('accessControlList')
        this.accessControlList = this.accessControlList.split(',')

        let userProfile=JSON.parse(localStorage.getItem('user-profile'))
        this.id=userProfile.id

        this.showLoader = true
        Http.GET('user', [userProfile.id])
          .then(
            ({data: {data: user}}) => {
              this.showLoader = false
              this.user = user
              console.log('Successfully got the user: ', this.user)
            },
            error => {
              this.showLoader = false
              console.log('Error occurred getting details of the user, error: ', error)
            }
          )
      }
    }
  }
</script>
