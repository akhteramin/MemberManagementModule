<template>

  <div class="gr-10 push-2" v-if="user">

    <br>
    <div class="gr-12"> <!--offset-md-1-->
      <div class="card"> <!-- class="card"-->
        <h3 class="card-header">
          <i class="fa fa-user" aria-hidden="true"></i> User Information
        </h3>
        <div class="gr-4 push-6">
          <a @click="showUpdateUserModal">
            <i class="fa fa-edit" aria-hidden="true"></i>
          </a>
        </div>
        <div>
          <div v-if="user">

            <br>
            <div class="row">

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
                <div class="gr-10">
                  <div class="gr-4">
                    Name:
                  </div>
                  <div class="gr-4 text-left">
                    <input value="updateRequest.name" v-model="updateRequest.name"/>
                    <!--{{ user.name || 'N/A'}}-->
                  </div>
                  <br>
                  <div class="gr-4">
                    Email:
                  </div>
                  <div class="gr-4 text-left pull-.5">
                    {{ user.email || 'N/A' }}
                  </div>
                  <br>
                  <div class="gr-4">
                    Designation:
                  </div>
                  <div class="gr-4 text-left">
                    <input value="updateRequest.designation" v-model="updateRequest.designation"/>
                  </div>
                  <br>
                  <div class="gr-4">
                    Status:
                  </div>
                  <div class="gr-4 select">
                    <select v-model="updateRequest.status">
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="SUSPENDED">SUSPENDED</option>
                    </select>
                  </div>
                  <br>
                  <div class="gr-4">
                    <i class="fa fa-clock-o" aria-hidden="true"></i> User since:
                  </div>
                  <div class="gr-4 text-left pull-.5">
                    {{ user.creationTime | date('MMM D, YYYY') || 'N/A' }}
                  </div>
                  <br>
                </div>
              </div>
            </div>

            <hr>
          </div>
        </div>






      </div>
    </div>
  </div>
</template>

<script>
  import Http from '../services/Http'
  //  import Constants from '../services/Constants'
  //  import MemberSuspensionHistory from './MemberSuspensionHistoryComponent.vue'
  //  import MemberActivity from './MemberActivityComponent.vue'
  //  import MemberTransaction from './MemberTransactionComponent.vue'
  //  import MemberIdentificationDocument from './MemberIdentificationDocumentComponent.vue'
  //  import MemberIntroducedBy from './MemberIntroducedByComponent.vue'
  //  import MemberHasIntroduced from './MemberHasIntroducedComponent.vue'
  //  import MemberBankAccount from './MemberBankAccountComponent.vue'
  //  import MemberBasicInfoUpdate from './UpdateMemberBasicInfoComponent.vue'
  //  import UpdateMemberFamilyInfo from './UpdateMemberFamilyInfoComponent.vue'
  //  import UpdateMemberAddress from './UpdateMemberAddressComponent.vue'
  //  import UpdateMemberImage from './UpdateMemberImageComponent.vue'
  //  import MemberVerifyAndApproveComponent from './MemberVerifyAndApproveComponent.vue'
  //  import UpdateMemberBusinessImage from './UpdateMemberBusinessImageComponent.vue'
  import route from '../router'
  export default {
    name: 'MemberIndividualComponent',
    props: [
      'loginID'
//      'id',
//      'accountType'
    ],
//    components: {
//      MemberSuspensionHistory,
//      'member-suspension-history': MemberSuspensionHistory,
//      'member-activity': MemberActivity,
//      'member-transaction': MemberTransaction,
//      'member-identification-document': MemberIdentificationDocument,
//      'member-introduced-by': MemberIntroducedBy,
//      'member-has-introduced': MemberHasIntroduced,
//      'member-bank-account': MemberBankAccount,
//      'member-basic-info-update': MemberBasicInfoUpdate,
//      'member-verify-and-approve': MemberVerifyAndApproveComponent,
//      'update-member-parents': UpdateMemberFamilyInfo,
//      'update-member-address': UpdateMemberAddress,
//      'update-member-image': UpdateMemberImage,
//      'update-member-business-image': UpdateMemberBusinessImage
//    },
    data () {
      return {
        user: {},
        updateRequest: {},
        updatingUserId: '',
        imageBaseUrl: '',
        userUpdateSuccessful: false,
        userUpdateUnsuccessful: false
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
      showUpdateUserModal () {
        $('#UserUpdateResponseModal').modal({backdrop: false})
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
        Http.GET('user', query)
          .then(
            ({data: {data: list}}) => {
              this.user = list.list[0]
              this.updatingUserId = this.user.id
              this.updateRequest.name = this.user.name
              this.updateRequest.designation = this.user.designation
              this.updateRequest.status = this.user.status
              console.log('Successfully got the user: ', this.user)
            },
            error => {
              if (error.response) {
                if (error.response.status === 401) { // unauthorized, logging out.
                  this.logout()
                }
              }
              console.log('Error occurred getting details of the user, error: ', error)
            }
          )
      },
      updateUser () {
        console.log('in update user, id: ', this.updatingUserId)
        Http.PUT('user', this.updateRequest, [this.updatingUserId])
          .then(() => {
            console.log('User updated successfully.')
            this.userUpdateSuccessful = true
            this.userUpdateUnsuccessful = false
          }, error => {
            if (error.response) {
              if (error.response.status === 401) { // unauthorized, logging out.
                this.logout()
              }
            }
            this.userUpdateUnsuccessful = true
            console.error('Error in getting users: ', error)
          })
      },
      doNotUpdateUser () {
        console.log('cancel button clicked...')
        $('#UserUpdateResponseModal').modal('hide')
      }
    }
  }
</script>
