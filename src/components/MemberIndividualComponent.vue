<template>

    <div class="gr-10 push-2" v-if="member">

        <br>
        <div class="gr-12"> <!--offset-md-1-->
          <div class="card"> <!-- class="card"-->
            <h3 class="card-header">
              <i class="fa fa-user" aria-hidden="true"></i> Member Information</h3>

            <div id = "nav-bar">
              <ul class="nav nav-tabs">
                <li class="gr-3 text-center" :class="{active: showBasicDetails}"
                    @click="setTab('basicDetails')"><a data-toggle="tab">Basic Details</a></li>
                <!--<li class="col-md-3 text-center" ng-click="setType('approved')"><a data-toggle="tab" >Approved</a></li>-->
                <li class="gr-3 text-center" :class="{active: showActivities}"
                    @click="setTab('activities')"><a data-toggle="tab">Activities</a></li>
                <li class="gr-3 text-center" :class="{active: showTransactions}"
                    @click="setTab('transactions')"><a data-toggle="tab">Transactions</a></li>
              </ul>
            </div>



            <div  v-if="showBasicDetails">
              <div v-if="member.basicInfo">

                    <div class="row">
                      <div class="gr-2 push-6">
                        <span v-if="balance">Balance: {{ balance.availableBalance || 'N/A'}} BDT </span>
                        <span v-else>Balance: N/A BDT </span>
                      </div>
                    </div>
                    <br>
                    <div class="row">

                      <div class="gr-2">
                        <img v-if="member.basicInfo.mmUserPictures[0]"
                              :src="imageBaseUrl+member.basicInfo.mmUserPictures[0].document.url || 'static/images/default-original.jpg'" class="img-circle" width="250" height="250">

                        <img v-else src="static/images/default-original.jpg" class="img-circle"
                            alt="N/A" width="30" height="30">
                        <update-member-image
                          :member="member"
                          :id="id"
                          @update="editProfilePic">
                        </update-member-image>

                      </div>
                      <div class="gr-9 text-left push-.5">
                        <div class="gr-12">
                          <div class="gr-2">
                            <h5><b>Basic Information</b></h5>
                          </div>
                          <div class="gr-2 push-6" v-if="!editBasicProfileMode">
                              <button class="button-md-edit" @click="editBasicInfo()"><i class="fa fa-pencil-square-o"></i> Edit </button>
                          </div>
                        </div>
                        <div v-if="!editBasicProfileMode">
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
                        <div v-else>
                          <member-basic-info-update
                            :member="member"
                            :occupationList="occupationList"
                            @update="editBasicInfo">
                          </member-basic-info-update>
                        </div>
                        <hr>
                      <div class="gr-12">
                        <div class="gr-2">
                            <h5><b>Family Information</b></h5>
                          </div>
                          <div class="gr-2 push-6" v-if="!editParentsMode">
                              <button class="button-md-edit" @click="editParents()"><i class="fa fa-pencil-square-o"></i> Edit </button>
                          </div>
                      </div>
                      <div v-if="!editParentsMode">
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
                  </div>

                  <hr>
              </div>


              <div id="addresses" class="gr-12">
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
                        <div class="gr-2 push-6" v-if="!editPresentAddressMode">
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

                    <div v-else id="editPresentAddress">
                      <update-member-address
                            :id= "id"
                            :memberPresentAddress="memberPresentAddress"
                            :thanaList= "thanaList"
                            :districtList= "districtList"
                            @update="editPresentAddress">
                      </update-member-address>
                    </div>

                    <!-- ================================= permanent address =============================================== -->

                    <div class="gr-5" v-if="!editPermanentAddressMode">
                      <div class="gr-12">
                        <div class="gr-2">
                          <h5><b>Permanent</b></h5>
                        </div>
                        <div class="gr-2 push-6" v-if="!editPermanentAddressMode">
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

                    <div v-else id="editPermanentAddress">
                      <update-member-address
                            :id= "id"
                            :memberPermanentAddress="memberPermanentAddress"
                            :thanaList= "thanaList"
                            :districtList= "districtList"
                            @update="editPermanentAddress">
                      </update-member-address>
                    </div>
                  </div>
                </div>

              <hr>

              <div>
                <div class="verification">
                  <div>
                    <member-identification-document :id="id" :accountType="accountType"></member-identification-document>
                    <member-bank-account :id="id"></member-bank-account>
                    <div class="row justify-content-center">
                      <member-introduced-by :id="id"></member-introduced-by>
                      <member-has-introduced :id="id"></member-has-introduced>
                    </div>

                  </div>

                  <div class="row justify-content-center">
                    Hello I am who!!! {{ member.basicInfo.verificationStatus }}
                    <member-verify-and-approve :id="id" :verificationStatus="member.basicInfo.verificationStatus"
                    :verificationHistory="member.verificationHistory"></member-verify-and-approve>
                  </div>
                </div>
              </div>
            </div>
            <member-activity v-if="showActivities" :id="id"></member-activity>
            <member-transaction v-if="showTransactions" :id="id"></member-transaction>
        </div>
      </div>
    </div>
</template>

<script>
  import Http from '../services/Http'
  import Constants from '../services/Constants'
  import MemberActivity from './MemberActivityComponent.vue'
  import MemberTransaction from './MemberTransactionComponent.vue'
  import MemberIdentificationDocument from './MemberIdentificationDocumentComponent.vue'
  import MemberIntroducedBy from './MemberIntroducedByComponent.vue'
  import MemberHasIntroduced from './MemberHasIntroducedComponent.vue'
  import MemberBankAccount from './MemberBankAccountComponent.vue'
  import MemberBasicInfoUpdate from './UpdateMemberBasicInfoComponent.vue'
  import UpdateMemberFamilyInfo from './UpdateMemberFamilyInfoComponent.vue'
  import UpdateMemberAddress from './UpdateMemberAddressComponent.vue'
  import UpdateMemberImage from './UpdateMemberImageComponent.vue'
  import MemberVerifyAndApproveComponent from './MemberVerifyAndApproveComponent.vue'

  export default {
    name: 'MemberIndividualComponent',
    props: [
      'id',
      'accountType'
    ],
    components: {
      'member-activity': MemberActivity,
      'member-transaction': MemberTransaction,
      'member-identification-document': MemberIdentificationDocument,
      'member-introduced-by': MemberIntroducedBy,
      'member-has-introduced': MemberHasIntroduced,
      'member-bank-account': MemberBankAccount,
      'member-basic-info-update': MemberBasicInfoUpdate,
      'member-verify-and-approve': MemberVerifyAndApproveComponent,
      'update-member-parents': UpdateMemberFamilyInfo,
      'update-member-address': UpdateMemberAddress,
      'update-member-image': UpdateMemberImage
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
        showTransactions: false,
        occupationName: '',
        editBasicProfileMode: false,
        editParentsMode: false,
        editPresentAddressMode: false,
        editPermanentAddressMode: false,
        imageBaseUrl: '',
        thanaList: {},
        districtList: {},
        profilePicture: {},
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
        }
      }
    },
    created () {
      console.log('created member basic information..., member id iss: ', this.id)
      this.init()
    },
    methods: {
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
        Http.GET('member', [this.id, 'basic-details'])
          .then(
            ({data: {data: member}}) => {
              this.member = member
              console.log('Got, member success::')
              console.log('member basic info: ', this.member.basicInfo,
                ' member verification history: ', this.member.verificationHistory)
              this.dob = this.$options.filters.date(member.basicInfo.dateOfBirth, 'YYYY-MM-DD')
              // check for address
              if (this.member.addresses.length === 2) {
                this.memberPresentAddress = this.member.addresses[0]
                this.memberPermanentAddress = this.member.addresses[1]
              } else if (this.member.addresses.length === 1) {
                this.memberPresentAddress = this.member.addresses[0]
              }
              console.log('this.memberPresentAddress: ', this.memberPresentAddress)
              console.log('this.memberPermanentAddress: ', this.memberPermanentAddress)
              this.getStaticNames()
            },
            error => {
              console.log('Error occured getting details of the member, error: ', error)
            }
          )
//         Http call for balance
        Http.GET('member', [this.id, 'balance'])
          .then(
            ({data}) => {
              this.balance = data.data
//              console.log('balance is: ', this.balance)
            },
            error => {
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
        console.log('edit button of PRESENT address clicked... it was: ', this.editPresentAddressMode)
        if (this.editPresentAddressMode) {
          this.init()
          this.editPresentAddressMode = false
        } else {
          this.editPresentAddressMode = true
        }
        console.log('now editAddressMode is: ', this.editPresentAddressMode)
      },
      editPermanentAddress (param = '') {
        console.log('edit button of PARMANENT address clicked... it was: ', this.editPermanentAddressMode)
        if (this.editPermanentAddressMode) {
          this.editPermanentAddressMode = false
          this.init()
        } else {
          this.editPermanentAddressMode = true
        }
        console.log('now edit Parmanent AddressMode is: ', this.editPermanentAddressMode)
      },
      setTab (tabName) {
        this.showBasicDetails = false
        this.showActivities = false
        this.showTransactions = false
        if (tabName === 'basicDetails') {
          this.showBasicDetails = true
        } else if (tabName === 'activities') {
          this.showActivities = true
        } else {
          this.showTransactions = true
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

        console.log('Line 1322, thana id: ', this.thanaNamePermanent.thanaId)
        this.thanaNamePermanent = this.thanaList.find(x => x.id === this.memberPermanentAddress.thanaId)
        if (this.thanaNamePermanent) {
          this.thanaNamePermanent = this.thanaNamePermanent.name
          console.log('Line 1325, thana name permanent: ', this.thanaNamePermanent)
        } else {
          this.thanaNamePermanent = 'N/A'
          console.log('Line 1328, thana name permanent: ', this.thanaNamePermanent)
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
