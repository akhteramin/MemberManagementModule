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

    <div class="gr-12" v-if="user">

      <br>
      <div class="gr-12"> <!--offset-md-1-->
        <div class="card"> <!-- class="card"-->
          <h3 class="card-header">
            <i class="fa fa-user" aria-hidden="true"></i> User Information
          </h3>
        <div>
          
          <div>
            <div v-if="user">

              <br>
              <div class="row">

                <div class="gr-3 w3-header-card w3-panel w3-border-top w3-border-bottom w3-border-left w3-round user-profile-header">
                  <img v-if="user.profilePictureUrl"
                      :src="imageBaseUrl+user.profilePictureUrl || '../static/images/default-original.jpg'"
                      class="img-rounded img-responsive" width="330" height="330">

                  <img v-else src="static/images/default-original.jpg" class="img-rounded img-responsive"
                      alt="N/A" width="330" height="330">
                  <update-user-image
                    :id="id"
                    :user="user"
                    @update="editProfilePic"
                    v-if="containsPermission('MS_USER_PROFILE_PICTURE_UPLOAD')">
                  </update-user-image>
                  <div class="text-center"><b>{{ user.name || 'N/A'}}</b></div>
                  <div class="text-center">{{ user.email || 'N/A'}}</div>
                  <table id="userIndividual" class="table ui celled hover padding-5">
                      <tbody>
                          <tr class="selected pointer">
                              <td @click="highlightRow(); showSegmant ('profile')">
                                  Personal Information
                              </td>
                          </tr>
                          <tr class="pointer">
                              <td @click="highlightRow(); showSegmant ('address')">
                                  Address
                              </td>
                          </tr>
                          <tr class="pointer" v-if="containsPermission('MS_USER_GET_ACTIVITY')">
                              <td @click="highlightRow(); showSegmant ('activity')">
                                  Activity
                              </td>
                          </tr>
                      </tbody>
                  </table>
                </div>

                <div class="gr-8 text-left w3-header-card w3-panel w3-border-top w3-border-bottom w3-border-left w3-round user-info-block">
                  
                  
                  <div class="gr-12" v-if="showProfile">
                    <div class="gr-12 panel-label padding-3">
                      <div class="gr-2"><b>Personal Information</b></div>
                      <div class="gr-4 push-8" v-if="!updateUser">
                        <!--a @click="showUpdateUserFields">
                          <i class="fa fa-edit" aria-hidden="true"></i>
                        </a-->
                        <button class="button-md-verify" @click="showUpdateUserFields"><i class="fa fa-pencil-square-o"></i> Edit </button>
                      </div>
                    </div>
                    <div v-if="!updateUser">
                      <div class="gr-4 push-2 padding-5">
                        Name:
                      </div>
                      <div class="gr-8 padding-5 text-left">
                        {{ user.name || 'N/A'}}
                      </div>
                      <br>
                      <div class="gr-4 push-2 padding-5">
                        Email:
                      </div>
                      <div class="gr-8 padding-5 text-left">
                        {{ user.email || 'N/A' }}
                      </div>
                      <br>
                      <div class="gr-4 push-2 padding-5">
                        Designation:
                      </div>
                      <div class="gr-8 padding-5 text-left">
                        {{ user.designation || 'N/A' }}
                      </div>
                      <br>
                      <div class="gr-4 push-2 padding-5">
                        Status:
                      </div>
                      <div class="gr-8 padding-5 text-left">
                        {{  user.status || 'N/A' }}
                      </div>
                      <br>
                      <div class="gr-4 push-2 padding-5">
                        <i class="fa fa-clock-o" aria-hidden="true"></i> User since:
                      </div>
                      <div class="gr-8 padding-5 text-left">
                        {{ user.creationTime | date('MMM D, YYYY') || 'N/A' }}
                      </div>
                    </div>
                    <div class="gr-12" v-else>
                        <update-user
                        :loginID = "loginID"
                        @update = "reloadFields">

                        </update-user>
                      </div>
                  </div>
                  
                  <div class="gr-12" v-if="showAddress">
                    <div class="gr-12 panel-label padding-3">
                      <b>Address Book</b>
                    </div>
                    <div class="gr-12">
                      <div class="gr-2"><h4>Present Adress</h4></div>
                      <div v-if="!updatePresentAddr">
                        <div class="gr-2 push-8"><button class="button-md-verify" @click="updateAddress('present')"><i class="fa fa-pencil-square-o"></i> Edit </button></div>
                        <div v-if="user.userAddressList.length>0 && userPresentAddress.thanaId!='N/A'">
                          <div class="gr-12">
                            <div class="row text-left">
                              <div class="gr-2">
                                Address Line 1:
                              </div>
                              <div class="gr-3">
                                {{ userPresentAddress.addressLine1 }}
                              </div>
                            </div>
                            <div class="row text-left">
                              <div class="gr-2">
                                Address Line 2:
                              </div>
                              <div class="gr-3 ">
                                {{ userPresentAddress.addressLine2 }}
                              </div>
                            </div>
                            <div class="row text-left">
                              <div class="gr-2">
                                District:
                              </div>
                              <div class="gr-3">
                                {{ districtNamePresent }}
                              </div>
                            </div>
                            <div class="row text-left">
                              <div class="gr-2">
                                Thana:
                              </div>
                              <div class="gr-3">
                                {{ thanaNamePresent }}
                              </div>
                            </div>
                            <div class="row text-left">
                              <div class="gr-2">
                                Country:
                              </div>
                              <div class="gr-3">
                                {{ countryNamePresent === 'BD' ? 'Bangladesh' : countryNamePresent }}
                              </div>
                            </div>
                            <div class="row text-left">
                              <div class="gr-2">
                                Postal Code:
                              </div>
                              <div class="gr-3">
                                {{ userPresentAddress.postalCode }}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="gr-12 push-3" v-else>
                          Please update your present address.
                        </div>
                      </div>
                      <div v-else>
                        <form v-on:submit.prevent="updateUserAddress(2)">
                            <div class="gr-12">
                              <div class="row text-left">
                                  <div class="gr-2">
                                  Address Line 1:
                                  </div>
                                  <div class="gr-10 padding-2">
                                  <input
                                  id="presentAddrssLine1"
                                  class="input-sm"
                                  type="text"
                                  v-model="userPresentAddress.addressLine1"/>
                                  </div>
                              </div>
                              <div class="row text-left">
                                  <div class="gr-2">
                                  Address Line 2:
                                  </div>
                                  <div class="gr-10 padding-2">
                                  <input class="input-sm"
                                          type="text"
                                          v-model="userPresentAddress.addressLine2"/>
                                  </div>
                              </div>
                            </div>
                            <div class="gr-5">
                              <div class="row text-left">
                                  <div class="gr-2">
                                  District:
                                  </div>
                                  <div class="push-3 gr-8 padding-2">
                                  <div class="select select-sm">
                                      <select id="districtSelection" v-model="userPresentAddress.districtId" required>
                                      <option value="" disabled>Select District</option>
                                      <option v-for="district in districtList" :value="district.id">{{ district.name }}</option>
                                      </select>
                                  </div>
                                  </div>
                              </div>
                            </div>
                            <div class="gr-6">
                              <div class="row text-left">
                                  <div class="gr-2">
                                  Thana:
                                  </div>
                                  <div class="gr-8 padding-2">
                                  <div class="select select-sm">
                                      <select id="thanaSelection" v-model="userPresentAddress.thanaId" required>
                                      <option value="" disabled>Select Thana</option>
                                      <option v-for="thana in thanaList" :value="thana.id"
                                              v-if="thana.districtId == userPresentAddress.districtId">{{ thana.name }}</option>

                                      </select>
                                  </div>

                                  </div>
                              </div>
                            </div>
                            <div class="gr-5">
                              <div class="row text-left">
                                  <div class="gr-2">
                                  Country:
                                  </div>
                                  <div class="push-3 gr-8 padding-2">
                                  {{ userPresentAddress.country === 'BD' ? 'Bangladesh' : userPresentAddress.country }}
                                  </div>
                              </div>
                            </div>
                            <div class="gr-6">
                              <div class="row text-left">
                                  <div class="gr-2">
                                  Postal Code:
                                  </div>
                                  <div class="gr-8 padding-2">
                                    <input
                                      id="postalCode"
                                      class="input-sm"
                                      type="text"
                                      v-model="userPresentAddress.postalCode"/>
                                  </div>
                              </div>
                            </div>
                            <div class="gr-12 text-center">
                              <div class="form-group">
                                  <button type="submit" class="button-search" @click="updateAddress('present')">
                                  <i class="fa fa-edit" aria-hidden="true"></i>
                                  Update
                                  </button>
                                  <button type="reset" class="button-reset" @click="updateAddress('present')">
                                  <i class="fa fa-times"></i>
                                  Cancel
                                  </button>
                              </div>
                            </div>
                        </form>
                      </div>
                    </div>
                    <div class="gr-12">
                    <hr>
                      <div class="gr-2"><h4>Permanent Adress</h4></div>
                      <div v-if="!updatePermanentAddr">
                        <div class="gr-2 push-8"><button class="button-md-verify" @click="updateAddress('permanent')"><i class="fa fa-pencil-square-o"></i> Edit </button></div>
                        <div v-if="user.userAddressList.length>0 && userPermanentAddress.thanaId!='N/A'">
                          <div class="gr-12">
                            <div class="row text-left">
                              <div class="gr-2">
                                Address Line 1:
                              </div>
                              <div class="gr-3">
                                {{ userPermanentAddress.addressLine1 }}
                              </div>
                            </div>
                            <div class="row text-left">
                              <div class="gr-2">
                                Address Line 2:
                              </div>
                              <div class="gr-3 ">
                                {{ userPermanentAddress.addressLine2 }}
                              </div>
                            </div>
                            <div class="row text-left">
                              <div class="gr-2">
                                District:
                              </div>
                              <div class="gr-3">
                                {{ districtNamePresent }}
                              </div>
                            </div>
                            <div class="row text-left">
                              <div class="gr-2">
                                Thana:
                              </div>
                              <div class="gr-3">
                                {{ thanaNamePresent }}
                              </div>
                            </div>
                            <div class="row text-left">
                              <div class="gr-2">
                                Country:
                              </div>
                              <div class="gr-3">
                                {{ countryNamePresent === 'BD' ? 'Bangladesh' : countryNamePresent }}
                              </div>
                            </div>
                            <div class="row text-left">
                              <div class="gr-2">
                                Postal Code:
                              </div>
                              <div class="gr-3">
                                {{ userPermanentAddress.postalCode }}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="gr-12 push-3" v-else>
                          Please update your permanent address.
                        </div>
                      </div>
                      <div v-else>
                        <form v-on:submit.prevent="updateUserAddress(1)">
                            <div class="gr-12">
                              <div class="row text-left">
                                  <div class="gr-2">
                                  Address Line 1:
                                  </div>
                                  <div class="gr-10 padding-2">
                                  <input
                                  id="permanentAddrssLine1"
                                  class="input-sm"
                                  type="text"
                                  v-model="userPermanentAddress.addressLine1"/>
                                  </div>
                              </div>
                              <div class="row text-left">
                                  <div class="gr-2">
                                  Address Line 2:
                                  </div>
                                  <div class="gr-10 padding-2">
                                  <input class="input-sm"
                                          type="text"
                                          v-model="userPermanentAddress.addressLine2"/>
                                  </div>
                              </div>
                            </div>
                            <div class="gr-5">
                              <div class="row text-left">
                                  <div class="gr-2">
                                  District:
                                  </div>
                                  <div class="push-3 gr-8 padding-2">
                                  <div class="select select-sm">
                                      <select id="districtSelection" v-model="userPermanentAddress.districtId" required>
                                      <option value="" disabled>Select District</option>
                                      <option v-for="district in districtList" :value="district.id">{{ district.name }}</option>
                                      </select>
                                  </div>
                                  </div>
                              </div>
                            </div>
                            <div class="gr-6">
                              <div class="row text-left">
                                  <div class="gr-2">
                                  Thana:
                                  </div>
                                  <div class="gr-8 padding-2">
                                  <div class="select select-sm">
                                      <select id="thanaSelection" v-model="userPermanentAddress.thanaId" required>
                                      <option value="" disabled>Select Thana</option>
                                      <option v-for="thana in thanaList" :value="thana.id"
                                              v-if="thana.districtId == userPermanentAddress.districtId">{{ thana.name }}</option>

                                      </select>
                                  </div>

                                  </div>
                              </div>
                            </div>
                            <div class="gr-5">
                              <div class="row text-left">
                                  <div class="gr-2">
                                  Country:
                                  </div>
                                  <div class="push-3 gr-8 padding-2">
                                  {{ userPermanentAddress.country === 'BD' ? 'Bangladesh' : userPermanentAddress.country }}
                                  </div>
                              </div>
                            </div>
                            <div class="gr-6">
                              <div class="row text-left">
                                  <div class="gr-2">
                                  Postal Code:
                                  </div>
                                  <div class="gr-8 padding-2">
                                    <input
                                      id="postalCode"
                                      class="input-sm"
                                      type="text"
                                      v-model="userPermanentAddress.postalCode"/>
                                  </div>
                              </div>
                            </div>
                            <div class="gr-12 text-center">
                              <div class="form-group">
                                  <button type="submit" class="button-search" @click="updateAddress('permanent')">
                                  <i class="fa fa-edit" aria-hidden="true"></i>
                                  Update
                                  </button>
                                  <button type="reset" class="button-reset" @click="updateAddress('permanent')">
                                  <i class="fa fa-times"></i>
                                  Cancel
                                  </button>
                              </div>
                            </div>
                        </form>
                        
                      </div>
                    </div>
                  </div>

                  <div class="gr-12" v-if="showActivity">
                    <user-activity
                    :id="id"
                    v-if="containsPermission('MS_USER_GET_ACTIVITY')"
                    ></user-activity>
                  </div>
                </div>
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
  import UserActivityComponent from './UserActivityComponent.vue'

  export default {
    name: 'UserIndividualProfileComponent',
    props: [
      'id'
    ],
    components: {
      'update-user': UpdateUserComponent,
      'update-user-image': UpdateUserImageComponent,
      'user-activity': UserActivityComponent
    },
    data () {
      return {
        loginID: '',
        user: {},
        updateUser: false,
        updatingUserId: '',
        imageBaseUrl: '',
        userUpdateSuccessful: false,
        userUpdateUnsuccessful: false,
        showLoader: false,
        accessControlList: [],
        showProfile: true,
        showAddress: false,
        showActivity: false,
        updatePresentAddr: false,
        updatePermanentAddr: false,
        userPresentAddress: {
          addressLine1: 'N/A',
          addressLine2: 'N/A',
          country: 1,
          districtId: 'N/A',
          postalCode: 'N/A',
          status: 'N/A',
          thanaId: 'N/A',
          addressType: 2
        },
        userPermanentAddress: {
          addressLine1: 'N/A',
          addressLine2: 'N/A',
          country: 1,
          districtId: 'N/A',
          postalCode: 'N/A',
          status: 'N/A',
          thanaId: 'N/A',
          addressType: 1
        },
        thanaNamePresent: '',
        districtNamePresent: '',
        countryNamePresent: '',
        thanaNamePermanent: '',
        districtNamePermanent: '',
        countryNamePermanent: '',
        thanaList: {},
        districtList: {}
      }
    },
    created () {
      console.log('created user  information..., user login id iss: ', this.loginID)
      console.log('get the data')
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
      showSegmant (name = '') {
        this.showProfile = false
        this.showAddress = false
        this.showActivity = false
        if (name === 'profile') {
          console.log(name)
          this.showProfile = true
        }      else if (name === 'address') {
          console.log(name)
          this.showAddress = true
        }      else if (name === 'activity') {
          console.log(name)
          this.showActivity = true
        }
      },
      updateAddress (addressType = '') {
        if (addressType === 'present')      {
          if (!this.updatePresentAddr)        {
            this.updatePresentAddr = true
          }        else        {
            this.updatePresentAddr = false
          }
        }      else if (addressType === 'permanent')      {
          if (!this.updatePermanentAddr)        {
            this.updatePermanentAddr = true
          }        else        {
            this.updatePermanentAddr = false
          }
        }
      },
      updateUserAddress (addressId) { // addressId is in {1,2}
        console.log('in member update, addressId: ', addressId)
        let updatedAddress = {}
        if (addressId === 2) {
          updatedAddress = {
            'address': this.userPresentAddress
          }
        } else {
          updatedAddress = {
            'address': this.userPermanentAddress
          }
        }
  
        console.log('updatedAddress: ', updatedAddress)
        this.showLoader = true
        Http.PUT('user', updatedAddress.address, [this.id, 'address'])
          .then(
            ({data: {data: response}}) => {
              this.showLoader = false
              $.notify({
                // options
                title: '<strong>Success!</strong>',
                message: 'Address Updated successfully'
              }, {
                // settings
                type: 'success',
                delay: 3000
              })
              console.log('updated address: ', response)
              this.updateAddress()
              this.init()
            },
            error => {
              this.showLoader = false
              $.notify({
                // options
                title: '<strong>Failure!</strong>',
                message: error.response.data.message
              }, {
                // settings
                type: 'danger',
                delay: 3000
              })
              console.log('Error in address update, error: ', error)
            }
          )
        console.log('after http put in update member address.')
      },
      highlightRow () {
        $('#userIndividual tbody').on('click', 'tr', function () {
          $('#userIndividual tbody > tr').removeClass('selected')
          $(this).addClass('selected')
      })
    },
      init () {
        this.imageBaseUrl = Http.IMAGE_URL
        this.highlightRow()

        this.userPresentAddress = {
          addressLine1: 'N/A',
          addressLine2: 'N/A',
          country: 'Bangladesh',
          districtId: 'N/A',
          postalCode: 'N/A',
          status: 'N/A',
          thanaId: 'N/A',
          addressType: 2
        }
        this.userPermanentAddress = {
          addressLine1: 'N/A',
          addressLine2: 'N/A',
          country: 'Bangladesh',
          districtId: 'N/A',
          postalCode: 'N/A',
          status: 'N/A',
          thanaId: 'N/A',
          addressType: 1
        }
        // Http call for basic information of the member with the 'id'
        this.accessControlList = localStorage.getItem('accessControlList')
        this.accessControlList = this.accessControlList.split(',')

        this.showLoader = true
        Http.GET('user', [this.id])
          .then(
            ({data: {data: user}}) => {
              this.showLoader = false
              this.user = user
              this.loginID = this.user.email
              console.log('Successfully got the user: ', this.user)
              for (let indx in this.user.userAddressList) {
                let address = this.user.userAddressList[indx]
                if (address.addressType === 2) {
                  this.userPresentAddress = address
                } else if (address.addressType === 1) {
                  this.userPermanentAddress = address
                }
              }
              this.getStaticNames()
            },
            error => {
              this.showLoader = false
              console.log('Error occurred getting details of the user, error: ', error)
            }
          )
      },
      getStaticNames () {
        this.thanaList = JSON.parse(localStorage.getItem('thana'))
        this.districtList = JSON.parse(localStorage.getItem('district'))
        this.thanaNamePresent = this.thanaList.find(x => x.id === this.userPresentAddress.thanaId)
        if (this.thanaNamePresent) {
          this.thanaNamePresent = this.thanaNamePresent.name
        } else {
          this.thanaNamePresent = 'N/A'
        }
        this.districtNamePresent = this.districtList.find(x => x.id === this.userPresentAddress.districtId)
        if (this.districtNamePresent) {
          this.districtNamePresent = this.districtNamePresent.name
        } else {
          this.districtNamePresent = 'N/A'
        }
        this.countryNamePresent = this.userPresentAddress.country

//        console.log('Line 1322, thana id: ', this.thanaNamePermanent.thanaId)
        this.thanaNamePermanent = this.thanaList.find(x => x.id === this.userPermanentAddress.thanaId)
        if (this.thanaNamePermanent) {
          this.thanaNamePermanent = this.thanaNamePermanent.name
//          console.log('Line 1325, thana name permanent: ', this.thanaNamePermanent)
        } else {
          this.thanaNamePermanent = 'N/A'
//          console.log('Line 1328, thana name permanent: ', this.thanaNamePermanent)
        }
        this.districtNamePermanent = this.districtList.find(x => x.id === this.userPermanentAddress.districtId)
        if (this.districtNamePermanent) {
          this.districtNamePermanent = this.districtNamePermanent.name
        } else {
          this.districtNamePermanent = 'N/A'
        }
        this.countryNamePermanent = this.userPermanentAddress.country
      }
    }
  }
</script>
