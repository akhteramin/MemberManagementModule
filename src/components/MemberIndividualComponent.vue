<template>

    <div class="gr-10 push-2" v-if="member">

        <br>
        <div class="gr-12"> <!--offset-md-1-->
          <div class="card"> <!-- class="card"-->
            <h3 class="card-header">
              <i class="fa fa-user" aria-hidden="true"></i> Member Information</h3>

            <div id = "nav-bar" style="cursor: pointer;">
              <ul class="nav nav-tabs">
                <li class="text-center" :class="{active: showBasicDetails}"
                    @click="setTab('basicDetails')"><a data-toggle="tab">Basic Details</a></li>
                <!--<li class="col-md-3 text-center" ng-click="setType('approved')"><a data-toggle="tab" >Approved</a></li>-->
                <li v-if="containsPermission('MS_MM_USER_GET_ACTIVITIES')" class="text-center" :class="{active: showActivities}"
                    @click="setTab('activities')"><a data-toggle="tab">Activities</a></li>
                <li v-if="containsPermission('MS_MM_USER_GET_TRANSACTION_HISTORY')" class="text-center" :class="{active: showTransactions}"
                    @click="setTab('transactions')"><a data-toggle="tab">Transactions</a></li>
                <li v-if="containsPermission('MS_MM_USER_SUSPENSION_HISTORY')" class="text-center" :class="{active: showSuspensionHistory}"
                    @click="setTab('suspensionHistory')"><a data-toggle="tab">Suspension History</a></li>
                <li v-if="containsPermission('MS_MM_USER_GET_LIKELY_NAMES')" class="text-center" :class="{active: showLikelyNames}"
                    @click="setTab('likelyNames')"><a data-toggle="tab">Likely Names</a></li>
                <li v-if="containsPermission('MS_MM_USER_GET_CONTACTS')" class="text-center" :class="{active: showFriends}"
                    @click="setTab('friends')"><a data-toggle="tab">Friends</a></li>
                <li v-if="member.basicInfo && member.basicInfo.accountType==2" class="text-center" :class="{active: showOffer}"
                    @click="setTab('offers')"><a data-toggle="tab">Offers</a></li>
                <li v-if="containsPermission('MS_IPAY_ACL_CHANGE_SERVICE_ACCESS_LEVEL')" class="text-center" :class="{active: showAccessControl}"
                    @click="setTab('accessControl')"><a data-toggle="tab">Access Control</a></li>

              </ul>
            </div>



            <div  v-if="showBasicDetails">
              <div v-if="member.basicInfo">

                    <div class="row">
                      <div class="gr-4 push-7">



                      </div>
                    </div>
                    <br>
                    <div class="row">

                      <div class="gr-2 text-center">
                        <img v-if="member.basicInfo.mmUserPictures[0]"
                              :src="imageBaseUrl+member.basicInfo.mmUserPictures[0].document.url || 'static/images/default-original.jpg'"
                              class="img-circle img-responsive" width="250" height="250"
                             onerror="onerror=null; src='/static/images/default-profile-180x180.png'">

                        <img v-else src="/static/images/default-original.jpg" class="img-circle img-responsive"
                            alt="N/A" width="250" height="250"
                             onerror="onerror=null; src='/static/images/default-profile-180x180.png'">
                        <update-member-image
                          :member="member"
                          :id="id"
                          @update="editProfilePic"
                          v-if="containsPermission('MS_MM_USER_UPLOAD_PROFILE_PIC')">
                        </update-member-image>
                        <b>{{member.basicInfo.name}}</b>
                        <span class="banner-text" v-if="member.basicInfo.accountType == 1">(Personal)</span>
                        <span class="banner-text" v-else>(Business)</span>
                        <br>{{member.basicInfo.mobileNumber}}
                        <br><span>{{member.basicInfo.profileCompletionScore}}%</span>
                        <br>General
                        <button class="button-md-balance padding-2" >
                          <span v-if="balance">Balance: {{ balance.availableBalance || 'N/A'}} BDT </span>
                          <span v-else>Balance: N/A </span>
                        </button>
                      </div>



                      <div class="gr-9 text-left push-.5">
                        <div class="gr-1" v-if="member.basicInfo.accountType===2">
                          <span v-if="member.businessDetails.businessOwnerPictures[0]">
                              <img :src="imageBaseUrl+member.businessDetails.businessOwnerPictures[0].url"
                              class="img-rounded img-responsive" alt="Profile Picture" width="130" height="100">
                          </span>
                          <span v-else>
                              <img src="static/images/default-original.jpg" class="img-rounded" alt="N/A" width="70" height="80">
                          </span>
                          <update-member-business-image
                            :member="member"
                            :id="id"
                            @update="editProfilePic">
                          </update-member-business-image>
                        </div>


                        <div class="gr-11">
                          <div class="gr-2">
                            <h5><b>Basic Information</b></h5>
                          </div>
                          <div class="gr-2 push-7" v-if="!editBasicProfileMode && containsPermission('MS_MM_USER_UPDATE_BASIC_DETAILS')">
                              <button class="button-md-edit" @click="editBasicInfo()"><i class="fa fa-pencil-square-o"></i> Edit </button>
                          </div>
                        </div>
                        <div class="gr-10" v-if="!editBasicProfileMode">
                          <div class="gr-2">
                            Name:
                          </div>
                          <div class="gr-4 text-left">
                            {{ member.basicInfo.name || 'N/A'}}
                          </div>
                          <div class="gr-2">
                            Mobile Number:
                          </div>
                          <div class="gr-4 text-left pull-.5">
                            {{ member.basicInfo.mobileNumber || 'N/A' }}
                          </div>
                          <div class="gr-2">
                            Email:
                          </div>
                          <div class="gr-4 text-left">
                          {{  member.emails.length !== 0 ? member.emails[0].emailAddress: 'N/A' }}
                          </div>
                          <div class="gr-2">
                            Date of Birth:
                          </div>
                          <div class="gr-4 text-left pull-.5">
                          {{ member.basicInfo.dob | date('MMM D, YYYY') || 'N/A' }}
                          </div>
                          <div class="gr-2">
                          Gender:
                          </div>
                          <div class="gr-4 text-left">
                          <i v-bind:class="{'fa fa-male':member.basicInfo.gender==='M','fa fa-female':member.basicInfo.gender==='F'}"></i>{{ !member.basicInfo.gender ? 'N/A' : '' }}
                          </div>
                          <div class="gr-2">
                          Occupation:
                          </div>
                          <div class="gr-4 text-left pull-.5">
                          {{ occupationName || 'N/A' }}
                          </div>

                          <div class="gr-2">
                          Verification Status:
                          </div>
                          <div class="gr-4 text-left">
                            {{ member.basicInfo.verificationStatus === null ? 'N/A': member.basicInfo.verificationStatus == 'VERIFIED' ? 'Verified':
                            member.basicInfo.verificationStatus == 'NOT_VERIFIED' ? 'Not Verified':
                            member.basicInfo.verificationStatus == 'IN_PROGRESS' ? 'In Progress':
                            'Rejected'}}
                          </div>
                          <div class="gr-2">
                          Member Since:
                          </div>
                          <div class="gr-4 text-left pull-.5">
                          {{ member.basicInfo.accountCreationDate | date('MMM D, YYYY') || 'N/A' }}
                          </div>
                          <div class="gr-2">
                          Organization Name:
                          </div>
                          <div class="gr-4 text-left pull-.5">
                          {{ member.basicInfo.organizationName || 'N/A' }}
                          </div>
                        </div>
                        <div class="gr-11" v-else>
                          <member-basic-info-update
                            :member="member"
                            :occupationList="occupationList"
                            @update="editBasicInfo">
                          </member-basic-info-update>
                        </div>

                        <hr>
                      <div v-if="member.basicInfo.accountType===1">
                        <div class="gr-11">
                          <div class="gr-2">
                              <h5><b>Family Information</b></h5>
                            </div>
                            <div class="gr-2 push-7"
                                 v-if="!editParentsMode && containsPermission('MS_MM_USER_UPDATE_BASIC_DETAILS')">
                                <button class="button-md-edit" @click="editParents()">
                                  <i class="fa fa-pencil-square-o"></i> Edit </button>
                            </div>
                        </div>
                        <div v-if="!editParentsMode" class="gr-10">
                          <div class="gr-2">
                          Father Name:
                          </div>
                          <div class="gr-4 text-left">
                            {{ member.basicInfo.father || 'N/A' }}

                          </div>
                          <div class="gr-2">
                          Mother Name:
                          </div>
                          <div class="gr-4 text-left">
                            {{ member.basicInfo.mother || 'N/A' }}
                          </div>
                          <div class="gr-2">
                          Father Mobile:
                          </div>
                          <div class="gr-4 text-left">
                            {{ member.basicInfo.fatherMobileNumber || 'N/A' }}
                          </div>
                          <div class="gr-2">
                          Mother Mobile:
                          </div>
                          <div class="gr-4 text-left">
                            {{ member.basicInfo.motherMobileNumber || 'N/A' }}
                          </div>
                        </div>
                        <div v-else>
                          <update-member-parents
                              :member="member"
                              @update="editParents">
                          </update-member-parents>
                        </div>
                      </div>
                      <div v-if="member.basicInfo.accountType===2">
                        <div class="gr-12">
                          <div class="gr-2">
                              <h5><b>Business Information</b></h5>
                            </div>

                        </div>
                        <div>
                          <div class="gr-2">
                          Business Name:
                          </div>
                          <div class="gr-4 text-left">
                            {{ member.businessDetails.businessBasicInfo.businessName || 'N/A' }}

                          </div>
                          <div class="gr-2">
                          Business Type:
                          </div>
                          <div class="gr-4 text-left">
                            {{ member.businessDetails.businessBasicInfo.businessType || 'N/A' }}
                          </div>
                          <div class="gr-2">
                          Email:
                          </div>
                          <div class="gr-4 text-left">
                            {{ member.businessDetails.businessBasicInfo.email || 'N/A' }}
                          </div>
                          <div class="gr-2">
                          Mobile Number:
                          </div>
                          <div class="gr-4 text-left">
                            {{ member.businessDetails.businessBasicInfo.mobileNumber || 'N/A' }}
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>

                  <hr>
              </div>


              <div id="addresses" class="gr-12" v-if="containsPermission('MS_MM_USER_BASIC_DETAILS')">
                  <div class="gr-12">
                    <h5><b>Address</b></h5>
                  </div>
                  <!--<div class="gr-2 push-6" v-if="!editAddressMode">-->
                    <!--<button class="button-md-edit" @click="editAddress"><i class="fa fa-pencil-square-o"></i> Edit </button>-->
                  <!--</div>-->

                <!--<br>-->
                  <div class="row justify-content-left">
                    <!-- ================================= present address =============================================== -->

                    <div class="gr-5" v-if="!editPresentAddressMode">
                      <div class="gr-12">
                        <div class="gr-2">
                          <h5><b>Present</b></h5>
                        </div>
                        <div class="gr-2 push-6"
                             v-if="!editPresentAddressMode && containsPermission('MS_MM_USER_UPDATE_ADDRESS')">
                          <button class="button-md-edit" @click="editPresentAddress">
                            <i class="fa fa-pencil-square-o"></i> Edit </button>
                        </div>
                      </div>
                      <div class="row text-left">
                        <div class="gr-2">
                          Line 1:
                        </div>
                        <div class="gr-3">
                          {{ memberPresentAddress.addressLine1 }}
                        </div>
                      </div>
                      <div class="row text-left">
                        <div class="gr-2">
                          Line 2:
                        </div>
                        <div class="gr-3 ">
                          {{ memberPresentAddress.addressLine2 }}
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
                          {{ countryNamePresent }}
                        </div>
                      </div>
                    </div>

                    <div v-else id="editPresentAddress" v-else-if="containsPermission('MS_MM_USER_UPDATE_ADDRESS')">
                      <update-member-address
                            :id= "id"
                            :memberPresentAddress="memberPresentAddress"
                            :thanaList= "thanaList"
                            :districtList= "districtList"
                            @update="editPresentAddress">
                      </update-member-address>
                    </div>

                    <!-- ================================= permanent address =============================================== -->

                    <div class="gr-5" v-if="!editPermanentAddressMode" >
                      <div class="gr-12">
                        <div class="gr-2">
                          <h5 v-if="member.basicInfo && member.basicInfo.accountType===1"><b>Permanent</b></h5>
                          <h5 v-if="member.basicInfo && member.basicInfo.accountType===2"><b>Business</b></h5>

                        </div>
                        <div class="gr-2 push-6"
                             v-if="!editPermanentAddressMode && containsPermission('MS_MM_USER_UPDATE_ADDRESS')">
                          <button class="button-md-edit" @click="editPermanentAddress">
                            <i class="fa fa-pencil-square-o"></i> Edit </button>
                        </div>
                      </div>
                      <div class="row text-left">
                        <div class="gr-2">
                          Line 1:
                        </div>
                        <div class="gr-3">
                          {{ memberPermanentAddress.addressLine1 }}
                          <!--{{ member.addresses.length > 1 ? member.addresses[1].addressLine1 : 'N/A' }}-->
                        </div>
                      </div>
                      <div class="row text-left">
                        <div class="gr-2">
                          Line 2:
                        </div>
                        <div class="gr-3 ">
                          {{ memberPermanentAddress.addressLine2 }}
                          <!--{{ member.addresses.length > 1 ? member.addresses[1].addressLine2 : 'N/A' }}-->
                        </div>
                      </div>
                      <div class="row text-left">
                        <div class="gr-2">
                          District:
                        </div>
                        <div class="gr-3">
                          {{ districtNamePermanent }}
                        </div>
                      </div>
                      <div class="row text-left">
                        <div class="gr-2">
                          Thana:
                        </div>
                        <div class="gr-3">
                          {{ thanaNamePermanent }}
                        </div>
                      </div>
                      <div class="row text-left">
                        <div class="gr-2">
                          Country:
                        </div>
                        <div class="gr-3">
                          {{ countryNamePermanent }}
                        </div>
                      </div>
                    </div>

                    <div v-else id="editPermanentAddress" v-if="containsPermission('MS_MM_USER_UPDATE_ADDRESS')">
                      <update-member-address
                            :id= "id"
                            :memberPermanentAddress="memberPermanentAddress"
                            :thanaList= "thanaList"
                            :districtList= "districtList"
                            @update="editPermanentAddress">
                      </update-member-address>
                    </div>
                  </div>
                  <hr>
                </div>


              <div>
                <div class="verification">
                  <div>
                    <div v-if="containsPermission('MS_MM_USER_GET_IDENTIFICATION_DOCUMENTS')">
                      Yes, inside identification documents...
                      <member-identification-document
                        :id="id" :accountType="accountType" :boom="2">
                      </member-identification-document>
                    </div>

                    <div v-if="containsPermission('MS_MM_USER_GET_BANK_LIST')">
                      <member-bank-account :id="id">
                      </member-bank-account>
                    </div>

                    <div class="row justify-content-center"
                         v-if="containsPermission('MS_MM_USER_GET_INTRODUCER_LIST')">
                      <member-introduced-by :id="id">
                      </member-introduced-by>

                      <member-has-introduced :id="id">
                      </member-has-introduced>
                    </div>

                  </div>

                  <div class="row justify-content-center"
                       v-if="containsPermission('MS_MM_USER_VERIFICATION_VERIFY')">
                     {{ member.basicInfo.verificationStatus ? '' : '' }}
                    <member-verify-and-approve :id="id" :member="member">

                    </member-verify-and-approve>

                  </div>
                </div>
              </div>
            </div>
            <member-activity v-if="showActivities" :id="id"></member-activity>
            <member-transaction v-if="showTransactions" :id="id"></member-transaction>
            <member-suspension-history v-if="showSuspensionHistory" :id="id"></member-suspension-history>
            <member-likely-names v-if="showLikelyNames" :mobileNumber="member.basicInfo.mobileNumber"></member-likely-names>
            <member-offer v-if="showOffer" :id="id"></member-offer>
            <member-access-control v-if="showAccessControl" :id="id"></member-access-control>
            <member-friends v-if="showFriends" :mobileNumber="member.basicInfo.mobileNumber"></member-friends>
        </div>
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
</template>

<script>
  import Http from '../services/Http'
  import Constants from '../services/Constants'
  import MemberSuspensionHistory from './MemberSuspensionHistoryComponent.vue'
  import MemberActivity from './MemberActivityComponent.vue'
  import MemberTransaction from './MemberTransactionComponent.vue'
  import MemberIdentificationDocument from './MemberIdentificationDocumentComponent.vue'
  import MemberIntroducedBy from './MemberIntroducedByComponent.vue'
  import MemberHasIntroduced from './MemberHasIntroducedComponent.vue'
  import MemberBankAccount from './MemberBankAccountComponent.vue'
  import MemberBasicInfoUpdate from './UpdateMemberBasicInfoComponent.vue'
  import MemberLikelyNamesComponent from './MemberLikelyNamesComponent.vue'
  import MemberFriendsComponent from './MemberFriendsComponent.vue'
  import UpdateMemberFamilyInfo from './UpdateMemberFamilyInfoComponent.vue'
  import UpdateMemberAddress from './UpdateMemberAddressComponent.vue'
  import UpdateMemberImage from './UpdateMemberImageComponent.vue'
  import MemberVerifyAndApproveComponent from './MemberVerifyAndApproveComponent.vue'
  import MemberOffer from './MemberOfferComponent.vue'
  import UpdateMemberBusinessImage from './UpdateMemberBusinessImageComponent.vue'
  import MemberAccessControl from './MemberAccessControlComponent.vue'
  export default {
    name: 'MemberIndividualComponent',
    props: [
      'id',
      'accountType'
    ],
    components: {
      'member-suspension-history': MemberSuspensionHistory,
      'member-activity': MemberActivity,
      'member-transaction': MemberTransaction,
      'member-identification-document': MemberIdentificationDocument,
      'member-introduced-by': MemberIntroducedBy,
      'member-likely-names': MemberLikelyNamesComponent,
      'member-friends': MemberFriendsComponent,
      'member-has-introduced': MemberHasIntroduced,
      'member-bank-account': MemberBankAccount,
      'member-basic-info-update': MemberBasicInfoUpdate,
      'member-verify-and-approve': MemberVerifyAndApproveComponent,
      'update-member-parents': UpdateMemberFamilyInfo,
      'update-member-address': UpdateMemberAddress,
      'update-member-image': UpdateMemberImage,
      'update-member-business-image': UpdateMemberBusinessImage,
      'member-offer': MemberOffer,
      'member-access-control': MemberAccessControl
    },
    data () {
      return {
        member: {},
        balance: '',
        thanaNamePresent: '',
        districtNamePresent: '',
        countryNamePresent: '',
        thanaNamePermanent: '',
        districtNamePermanent: '',
        countryNamePermanent: '',
        serviceList: Constants,
        showBasicDetails: true,
        showActivities: false,
        showAccessControl: false,
        showTransactions: false,
        showSuspensionHistory: false,
        showLikelyNames: false,
        showFriends: false,
        showOffer: false,
        occupationName: '',
        editBasicProfileMode: false,
        editParentsMode: false,
        editPresentAddressMode: false,
        editPermanentAddressMode: false,
        imageBaseUrl: '',
        thanaList: {},
        districtList: {},
        profilePicture: {},
        accessControlList: [],
        memberPresentAddress: {
          addressLine1: 'N/A',
          addressLine2: 'N/A',
          country: 1,
          districtId: 'N/A',
          postalCode: 'N/A',
          status: 'N/A',
          thanaId: 'N/A',
          type: 'PRESENT'
        },
        memberPermanentAddress: {
          addressLine1: 'N/A',
          addressLine2: 'N/A',
          country: 1,
          districtId: 'N/A',
          postalCode: 'N/A',
          status: 'N/A',
          thanaId: 'N/A',
          type: 'PERMANENT'
        },
        showLoader: false
      }
    },
    created () {
//      console.log('created member basic information..., member id iss: ', this.id)
      this.init()
    },
    methods: {
      containsPermission (permission) {
        return this.accessControlList.indexOf(permission) > -1
      },
      init () {
        this.imageBaseUrl = Http.IMAGE_URL
        // Http call for basic information of the member with the 'id'
        this.memberPresentAddress = {
          addressLine1: 'N/A',
          addressLine2: 'N/A',
          country: 'BD',
          districtId: 'N/A',
          postalCode: 'N/A',
          status: 'N/A',
          thanaId: 'N/A',
          type: 'PRESENT'
        }
        this.memberPermanentAddress = {
          addressLine1: 'N/A',
          addressLine2: 'N/A',
          country: 'BD',
          districtId: 'N/A',
          postalCode: 'N/A',
          status: 'N/A',
          thanaId: 'N/A',
          type: 'PERMANENT'
        }
        this.accessControlList = localStorage.getItem('accessControlList')
        this.accessControlList = this.accessControlList.split(',')
        this.showLoader = true
        Http.GET('member', [this.id, 'basic-details'])
          .then(
            ({data: {data: member}}) => {
              this.showLoader = false
              this.member = member
              console.log('Got, member success::')
              console.log('member basic info: ', this.member.basicInfo,
                ' member verification history: ', this.member.verificationHistory)
              this.dob = this.$options.filters.date(member.basicInfo.dateOfBirth, 'YYYY-MM-DD')
              // check for address

              for (let indx in this.member.addresses) {
                let address = this.member.addresses[indx]
                if (address.type === 'PRESENT') {
                  this.memberPresentAddress = address
                } else if (address.type === 'PERMANENT') {
                  this.memberPermanentAddress = address
                }
              }
              console.log('this.memberPresentAddress: ', this.memberPresentAddress)
              console.log('this.memberPermanentAddress: ', this.memberPermanentAddress)
              console.log('response addresses: ', this.member.addresses)
              this.getStaticNames()
            },
            error => {
              this.showLoader = false
              console.log('Error occurred getting details of the member, error: ', error)
            }
          )
//         Http call for balance
        this.showLoader = true
        Http.GET('member', [this.id, 'balance'])
          .then(
            ({data}) => {
              this.showLoader = false
              this.balance = data.data
//              console.log('balance is: ', this.balance)
            },
            error => {
              this.showLoader = false
              console.log('Error in retrieving balance... ', error)
            }
          )
      },
      editBasicInfo (param = '') {
        if (this.editBasicProfileMode) {
          this.editBasicProfileMode = false
          this.init()
        } else {
          this.editBasicProfileMode = true
        }
      },
      editParents (param = '') {
        if (this.editParentsMode) {
          this.editParentsMode = false
          this.init()
        } else {
          this.editParentsMode = true
        }
      },
      editProfilePic () {
        this.init()
      },
      editPresentAddress (param = '') {
//        console.log('edit button of PRESENT address clicked... it was: ', this.editPresentAddressMode)
        if (this.editPresentAddressMode) {
          this.init()
          this.editPresentAddressMode = false
        } else {
          this.editPresentAddressMode = true
        }
        console.log('now editAddressMode is: ', this.editPresentAddressMode)
      },
      editPermanentAddress (param = '') {
//        console.log('edit button of PARMANENT address clicked... it was: ', this.editPermanentAddressMode)
        if (this.editPermanentAddressMode) {
          this.editPermanentAddressMode = false
          this.init()
        } else {
          this.editPermanentAddressMode = true
        }
//        console.log('now edit Parmanent AddressMode is: ', this.editPermanentAddressMode)
      },
      setTab (tabName) {
        this.showBasicDetails = false
        this.showActivities = false
        this.showTransactions = false
        this.showSuspensionHistory = false
        this.showLikelyNames = false
        this.showFriends = false
        this.showOffer = false
        this.showAccessControl = false
        if (tabName === 'basicDetails') {
          this.showBasicDetails = true
        } else if (tabName === 'activities') {
          this.showActivities = true
        } else if (tabName === 'transactions') {
          this.showTransactions = true
        } else if (tabName === 'suspensionHistory') {
          this.showSuspensionHistory = true
        } else if (tabName === 'likelyNames') {
          this.showLikelyNames = true
        } else if (tabName === 'friends') {
          this.showFriends = true
        } else if (tabName === 'offers') {
          this.showOffer = true
        } else if (tabName === 'accessControl') {
          this.showAccessControl = true
        }
      },
      getStaticNames () {
        if (this.member.basicInfo.occupation) {
          this.occupationList = JSON.parse(localStorage.getItem('occupation'))
          this.occupationName = this.occupationList.find(x => x.id === this.member.basicInfo.occupation).name
        }
        this.thanaList = JSON.parse(localStorage.getItem('thana'))
        this.districtList = JSON.parse(localStorage.getItem('district'))
        this.thanaNamePresent = this.thanaList.find(x => x.id === this.memberPresentAddress.thanaId)
        if (this.thanaNamePresent) {
          this.thanaNamePresent = this.thanaNamePresent.name
        } else {
          this.thanaNamePresent = 'N/A'
        }
        this.districtNamePresent = this.districtList.find(x => x.id === this.memberPresentAddress.districtId)
        if (this.districtNamePresent) {
          this.districtNamePresent = this.districtNamePresent.name
        } else {
          this.districtNamePresent = 'N/A'
        }
        this.countryNamePresent = this.memberPresentAddress.country

//        console.log('Line 1322, thana id: ', this.thanaNamePermanent.thanaId)
        this.thanaNamePermanent = this.thanaList.find(x => x.id === this.memberPermanentAddress.thanaId)
        if (this.thanaNamePermanent) {
          this.thanaNamePermanent = this.thanaNamePermanent.name
//          console.log('Line 1325, thana name permanent: ', this.thanaNamePermanent)
        } else {
          this.thanaNamePermanent = 'N/A'
//          console.log('Line 1328, thana name permanent: ', this.thanaNamePermanent)
        }
        this.districtNamePermanent = this.districtList.find(x => x.id === this.memberPermanentAddress.districtId)
        if (this.districtNamePermanent) {
          this.districtNamePermanent = this.districtNamePermanent.name
        } else {
          this.districtNamePermanent = 'N/A'
        }
        this.countryNamePermanent = this.memberPermanentAddress.country
//        if (this.countryNamePermanent) {
//          this.countryNamePermanent = this.countryNamePermanent.name
//        } else {
//          this.countryNamePermanent = 'N/A'
//        }
      }
    }
  }
</script>
