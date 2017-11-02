<template>

  <div class="col-md-12" v-if="member">
      <br>
      <div class="col-md-10 offset-md-1"> <!--offset-md-1-->
        <div class="card"> <!-- class="card"-->
          <h3 class="card-header">
            <i class="fa fa-user" aria-hidden="true"></i> Member Information</h3>
          <div class="card-block">
              <div class="card">
                <div class="card-block">
                  <h5>Basic Information</h5>
                  <br>
                  <div class="row">
                    <div class="col-2">
                      <img class="img-thumbnail mx-auto d-block" alt="180x180" :src="'/static/images/default-profile-180x180.png'" data-holder-rendered="true" style="width: 180px;">
                    </div>


                    <div class="col-4 text-left offset-1">
                      Name:
                      <br>
                      Mobile Number:
                      <br>
                      Email:
                      <br>
                      Date of Birth:
                      <br>
                      Gender:
                      <br>
                      Occupation:
                      <br>
                      Introduced by:
                      <br>
                      Verification Status:
                    </div>
                    <div class="col-5 text-left">
                      {{ member.basicInfo.name || 'N/A'}}
                      <br>
                      {{ member.basicInfo.mobileNumber || 'N/A' }}
                      <br>
                      {{  member.emails.length !== 0 ? member.emails[0].emailAddress: 'N/A' }}
                      <br>
                      {{ member.basicInfo.dateOfBirth | date('MMM D, YYYY') || 'N/A' }}
                      <br>
                      <i v-bind:class="{'fa fa-male':member.basicInfo.gender==='M','fa fa-female':member.basicInfo.gender==='F'}"></i>{{ !member.basicInfo.gender ? 'N/A' : '' }}
                      <br>
                      {{ member.basicInfo.occupation || 'N/A' }}
                      <br>
                      N/A
                      <br>
                      {{ member.basicInfo.verificationStatus === null ? 'N/A': member.basicInfo.verificationStatus == 'VERIFIED' ? 'Verified':
                      member.basicInfo.verificationStatus == 'NOT_VERIFIED' ? 'Not Verified':
                      member.basicInfo.verificationStatus == 'IN_PROGRESS' ? 'In Progress':
                      'Rejected'}}
                      <!--<div v-for="item in info.emails">-->
                        <!--<span>{{ item.emailAddress }} {{ `${item.primary ? '(P)' : ''}` }}</span>-->
                      <!--</div>-->
                    </div>
                  </div>
                  <hr>
                </div>

                <div class="card-block">
                  <h5>Address</h5>
                  <br>
                  <div class="row">
                    <div class="col-3 text-left offset-1">
                      Address Line 1:
                      <br>
                      Address Line 2:
                      <br>
                      Thana Id:
                      <br>
                      District Id:
                      <br>
                      Country:
                      <br>
                    </div>
                    <div class="col-6 text-left">
                      {{ member.addresses.length !== 0 ? member.addresses[0].addressLine1 : 'N/A' }}
                      <br>
                      {{ member.addresses.length !== 0 ? member.addresses[0].addressLine2 : 'N/A' }}
                      <br>
                      {{ member.addresses.length !== 0 ? thanaName : 'N/A' }}
                      <br>
                      {{ member.addresses.length !== 0 ? member.addresses[0].districtId : 'N/A'}}
                      <br>
                      {{ member.addresses.length !== 0 ? member.addresses[0].country : 'N/A' }}
                      <br>
                      <!--<div v-for="item in info.emails">-->
                      <!--<span>{{ item.emailAddress }} {{ `${item.primary ? '(P)' : ''}` }}</span>-->
                      <!--</div>-->
                    </div>
                  </div>
                  <hr>
                </div>

                <div class="card-block" v-if="bankAccounts">
                  <div class="verification">
                    <div>
                      <div class="row justify-content-center">
                        <div class="col-10">
                          <h5>Bank Info</h5>
                          <strong v-if="bankAccounts.length === 0">N/A<br></strong>
                          <table v-else class="table table-hover table-sm">
                            <thead class="thead-default">
                            <tr>
                              <th class = "text-center">Bank</th>
                              <th class = "text-center">A/C No</th>
                              <th class = "text-center">A/C Name</th>
                              <th class = "text-center">A/C Status</th>
                              <th class = "text-center">Verification</th>
                              <th class = "text-center">Added</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="item in bankAccounts.filter(x => x.accountStatus === 0)">
                              <td>{{ item.bankName }}</td>
                              <td>{{ item.accountNumber }}</td>
                              <td>{{ item.accountName }}</td>
                              <td><span class="badge" :class="{'badge-success': true }">ACTIVE</span></td>
                              <td>{{ item.verificationStatus | capitalize | underscoreless }}</td>
                              <td>{{ item.creationDate | date }}</td>
                            </tr>
                            </tbody>
                          </table>
                          <br>
                        </div>
                      </div>
                      <div class="row justify-content-center" v-if="introducers">
                        <div class="col-5">
                          <h5>Introduced By</h5>
                          <hr>
                          <strong v-if="introducers.length === 0">N/A</strong>
                          <div v-else class="pre-scrollable" style="height: 210px;">
                            <div class="row" v-for="item in introducers">
                              <div class="col-3">
                                <img class="img-rounded mx-auto d-block" :src="profilePicture(item.profilePictureUrl)"
                                     data-holder-rendered="true" style="width: 50px;">
                              </div>
                              <div class="col-9">
                                {{item.name}}<br>
                                {{item.mobileNumber}}
                                <hr>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-5">
                          <h5>Has Introduced</h5>
                          <hr>
                          <strong v-if="introduced.length === 0">N/A</strong>
                          <div v-else class="pre-scrollable" style="height: 210px;">
                            <div class="row" v-for="item in introduced">
                              <div class="col-3">
                                <img class="img-rounded mx-auto d-block" :src="profilePicture(item.profilePictureUrl)"
                                     data-holder-rendered="true" style="width: 50px;">
                              </div>
                              <div class="col-9">
                                {{item.name}}<br>
                                {{item.mobileNumber}}
                                <hr>
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
      </div>
    </div>
  </div>






  <!--<div v-for="item in introducers">-->
    <!--&lt;!&ndash;<span>{{ item.emailAddress }} {{ `${item.primary ? '(P)' : ''}` }}</span>&ndash;&gt;-->
    <!--&lt;!&ndash;<div class="col-3"></div>&ndash;&gt;-->
    <!--<div class="col-2" style="background-color: red;">-->
      <!--<img class="img-thumbnail mx-auto d-block" alt="64x64"-->
           <!--:src="'/static/images/default-profile-64x64.png'"-->
           <!--data-holder-rendered="true" style="width: 180px;">-->
    <!--</div>-->
    <!--<div class="col-4 text-left" style="background-color: aqua;">-->
      <!--{{ item.name }}-->
      <!--<br>-->
      <!--{{ item.mobileNumber }}-->
      <!--<br>-->
    <!--</div>-->
  <!--</div>-->


</template>

<script>
  import Http from '../services/Http'

  export default {
    name: 'MemberBasicInfo',
    props: [
      'id'
    ],
    data () {
      return {
        member: {},
        introducers: {},
        thanaName: '',
        districtName: '',
        bankAccounts: {}
      }
    },
    created () {
      console.log('created member basic information..., member id iss: ', this.id)
      this.init()
    },
    methods: {
      init () {
        // Http call for basic information of the member with the 'id'
        Http.GET('member', [this.id, 'basic-details'])
          .then(
            ({data: {data: member}}) => {
              this.member = member
              console.log('Got, member success::')
              console.log('member details: ', this.member)
              this.getThanaAndDistrictNames()
            },
            error => {
              console.log('Error occured getting details of the member, error: ', error)
            }
          )
        // Http call for the introducers
        Http.GET('member', [this.id, 'introducers'])
          .then(
            ({data: {data: introducers}}) => {
              this.introducers = introducers
              console.log('Got the list of introducers: ', introducers)
            },
            error => {
              console.log('Error in getting the list of introducers, error: ', error)
            }
          )
        // Http call for the introduced list
        Http.GET('member', [this.id, 'introduced'])
          .then(
            ({data: {data: introduced}}) => {
              this.introduced = introduced
              console.log('Got the list of introduced: ', introduced)
            },
            error => {
              console.log('Error in getting the list of introduced, error: ', error)
            }
          )
        // Http call for affiliated bank accounts
        Http.GET('member', [this.id, 'bank-accounts'])
          .then(
            ({data: {data: bankAccounts}}) => {
              this.bankAccounts = bankAccounts
              console.log('Got the list of bank accounts: ', bankAccounts)
            },
            error => {
              console.log('Error in getting the list of bank accounts, error: ', error)
            }
          )
      },
      getThanaAndDistrictNames () {
        console.log('district')
        if (this.member.addresses.length !== 0) {
          let thanaList = JSON.parse(localStorage.getItem('thana'))
          let districtList = JSON.parse(localStorage.getItem('district'))
          this.thanaName = thanaList.find(x => x.id === this.member.addresses[0].thanaId).name
          this.districtName = districtList.find(x => x.id === this.member.addresses[0].districtId).name

          console.log(this.thanaName)
          console.log(this.districtName)
        } else {
          this.thanaName = 'N/A'
          this.districtName = 'N/A'
        }
      }
    }
  }
</script>
