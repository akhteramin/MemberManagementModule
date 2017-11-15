<template>
  <div id = "list" class="gr-10 content-container">
    <h1>Members</h1>
    <hr>
    <form v-on:submit.prevent="filter" v-on:reset.prevent="init">
        <div class="row">
          <div class="gr-12">
            <div class="gr-3">
              <div class="form-group">
                <label> Name: </label>
                <input  name="queryName" type="text" id="queryName" placeholder="Name"
                        v-model="query.name"
                        value=""/>
              </div>
            </div>
          

            <div class="gr-3">
              <div class="form-group">
                <label> Mobile Number: </label>
                <input  name="mobilenumber" type="text" id="mobilenumber"
                        v-model="query.mobileNumber" placeholder="+8801XXXXXXXXX"
                        value=""/>
              </div>
            </div>

            <div class="gr-3">
              <div class="form-group">
                <label>Account Type: </label>
                <div class="select">
                  <select id="personal-business-select"  v-model="query.accountType">
                    <!--<option selected disabled>Select account type</option>-->
                    <option selected value = "">Both</option>
                    <option value="1">Personal</option>
                    <option value="2">Business</option>
                </select>
                </div>
              </div>
            </div>

            <div class="gr-3">
              <div class="form-group">
                <label> Verified: </label>
                <div class="select">
                  <select id="verification-status" v-model="query.verificationStatus">
                    <option selected value = "">All</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="NOT_VERIFIED">Not Verified</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        <div class="gr-12">  
          <div class="gr-6">
            <label> Profile Completion Range: </label>
            <vue-slider ref="slider" v-model="value" :width="'100%'"></vue-slider>
          </div>
          <div class="gr-3">
            <label class="offset-0.5">Sort by: </label>
            <div class="select">
              <select id="sort-by-select"  v-model="query.sort">
                <!--<option selected disabled>Select account type</option>-->
                <option selected value = "DOCUMENT_UPLOAD"> Document Upload Date</option>
                <option value="CREATION_DATE">Document Creation Date</option>
              </select>
            </div>
          </div>
          <div class="gr-3">
            <label class="offset-2">Order by: </label>
            <div class="select">
              <select id="order-by-select"  v-model="query.order">
                <!--<option selected disabled>Select account type</option>-->
                <option selected value = "DESC">Descending</option>
                <option value="ASC">Ascending</option>
              </select>
            </div>
          </div>
        </div>
          

        
        <div class="gr-4 push-4">
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

      </div>
    </form>

          <!--========================================= my filters ==================================================-->
        <div class="table-responsive gr-12">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile Number</th>
                <th>A/C Type</th>
                <th>Verification</th>
                <th>Profile Completed</th>
              </tr>
            </thead>
            <tbody>
            <tr v-for="member in members.list">
              
              <td class="member-name">
                <span v-if="member.mmUserPictures[0]">
                  <img :src="imageBaseUrl+member.mmUserPictures[0].document.url" class="img-circle" alt="N/A" width="30" height="30"> 
                </span>
                <span v-else>
                  <img src="static/images/default-original.jpg" class="img-circle" alt="N/A" width="30" height="30"> 
                </span>
                
                <a href="#"  @click="openNewTab(member.accountId)">
                  {{ member.name }}
                </a>
                <i class="fa fa-external-link" aria-hidden="true" @click="loadProfile(member)"></i>              
              </td>
              <td>{{ member.mobileNumber }}</td>
              <td>
                <span v-if="member.accountType == 1">
                  <i class="fa fa-user fa-2" aria-hidden="true"></i>
                </span>
                <span v-else>
                  <i class="fa fa-briefcase fa-2" aria-hidden="true"></i>
                </span>
              </td>
              <td>{{ member.verificationStatus }}</td>
              <td>{{ member.profileCompletionScore }}%</td>
            </tr>
            </tbody>
          </table>
        </div>
          <div class="gr-12" v-if="members.totalElements > 0">
            <div class="row">
              <div class="gr-3">
                <div v-if="members.list">
                  <small>Showing {{ parseInt(query.pageNumber * query.pageSize + 1)
                    }} to {{ parseInt(query.pageNumber * query.pageSize + members.list.length)
                    }} out of {{ members.totalElements }} entries
                  </small>
                </div>
              </div>
              <div class="gr-9">
                <!-- Member Pagination -->
                <div v-if="members.totalPages <= maxPaginationItem">
                  <nav aria-label="MemberPagination">
                    <ul class="pagination pagination-sm justify-content-end">
                      <li class="page-item " v-bind:class="{ disabled: query.pageNumber === 0 }">
                        <a class="page-link" v-on:click="pageChange(query.pageNumber - 1)" tabindex="-1">Previous</a>
                      </li>
                      <li class="page-item"
                          v-bind:class="{ active: query.pageNumber === (n - 1) }"
                          v-for="n in members.totalPages">
                        <a class="page-link" v-on:click="pageChange(n - 1)" tabindex="-1">{{ n }}</a>
                      </li>
                      <li class="page-item" v-bind:class="{ disabled: query.pageNumber === members.totalPages - 1 }">
                        <a class="page-link" v-on:click="pageChange(query.pageNumber + 1)" tabindex="-1">Next</a>
                      </li>
                    </ul>
                  </nav>
                </div>
                <div class="pull-right" v-else>
                  <a class="btn btn-sm btn-secondary"
                     role="button"
                     v-bind:class="{ disabled: query.pageNumber === 0 }"
                     v-on:click="pageChange(0)">
                    <i class="fa fa-angle-double-left" aria-hidden="true"></i> First
                  </a>
                  <a class="btn btn-sm btn-secondary"
                     role="button"
                     v-bind:class="{ disabled: query.pageNumber === 0 }"
                     v-on:click="pageChange(query.pageNumber - 1)">
                    <i class="fa fa-angle-left" aria-hidden="true"></i> Previous
                  </a>
                  <small>Page {{ query.pageNumber + 1 }} of {{ members.totalPages }}</small>
                  <a class="btn btn-sm btn-secondary"
                     role="button"
                     v-bind:class="{ disabled: query.pageNumber === members.totalPages - 1 }"
                     v-on:click="pageChange(query.pageNumber + 1)">
                    Next <i class="fa fa-angle-right" aria-hidden="true"></i>
                  </a>
                  <a class="btn btn-sm btn-secondary"
                     role="button"
                     v-bind:class="{ disabled: query.pageNumber === members.totalPages - 1 }"
                     v-on:click="pageChange(members.totalPages - 1)">
                    Last <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <!--========================================= slider ==================================================-->
        <div class="slider" v-if="sliderShow">
            <div class="gr-12">
                <div class="gr-6">
                        <h5>Update Profile</h5>
                </div>
                <div class="gr-6 push-4">
                        <i class="fa fa-external-link" style="color:black" aria-hidden="true" @click="openNewTab(memberProfile.accountId)"></i>                                                   
                        <i class="fa fa-window-close" aria-hidden="true" @click="hideProfile()"></i>                        
                </div>
                <hr>
                <div class="gr-2">
                <span v-if="memberProfile.mmUserPictures[0]">
                  <img :src="imageBaseUrl+memberProfile.mmUserPictures[0].document.url" class="img-rounded" alt="Profile Picture" width="70" height="80"> 
                </span>
                <span v-else>
                  <img src="static/images/default-original.jpg" class="img-rounded" alt="N/A" width="70" height="80"> 
                </span>
                </div>
                <div class="gr-10">
                    <div class="gr-2">
                        <button class="button-banner" >{{memberProfile.verificationStatus}}</button>    
                    </div>
                    <div class="gr-3 push-7">
                        <button class="button-edit">Edit <i class="fa fa-pencil-square-o"></i></button>
                        
                    </div>
                    <div class="gr-12 small-text">
                        <b>{{memberProfile.name}}</b>
                        <span class="banner-text" v-if="memberProfile.accountType == 1">(Personal)</span>
                        <span class="banner-text" v-else>(Business)</span>
                        <span>{{memberProfile.profileCompletionScore}}%</span>                        
                        <br>{{memberProfile.mobileNumber}}
                        <br>General

                    </div>
                    
                </div>
                <div class="gr-12 small-text">
                    <b>Missing Information</b>
                    <hr>
                    <div class="gr-4">
                        <span class="text-ash">
                            -Profile Picture
                        </span>
                    </div>
                    <div class="gr-4">
                        <span class="text-ash">
                            -Father Name   
                        </span>
                    </div>
                    <div class="gr-4">
                        <span class="text-ash">
                            -Mother Name
                        </span>
                    </div>
                    <div class="gr-4">
                        <span class="text-ash">
                            -Present Address   
                        </span>
                    </div>
                    <div class="gr-4">
                        <span class="text-ash">
                            -Permanent Address
                        </span>
                    </div>
                </div>
                <div class="gr-12 small-text min-height-slider" v-if="memberDocuments">
                    <b>Identification Document</b> 
                    <hr>
                    <div class="row margin-5" v-for="memberDocument in memberDocuments">
                        <div class="gr-5">
                            <img :src="imageBaseUrl+memberDocument.documentUrl" class="img-rounded" alt="Documents" width="140" height="80">     
                        </div>
                        <div class="gr-7">
                            <b>{{memberDocument.documentType}}</b> 
                            <i v-if="memberDocument.documentVerificationStatus=='VERIFIED'"  class="fa fa-check-circle-o banner-text" aria-hidden="true"></i>
                            <br>{{memberDocument.documentIdNumber}}
                            <br>Updated On:12/05/2017
                            <br>   
                            <span v-if="memberDocument.documentVerificationStatus=='NOT_VERIFIED'">                     
                              <button class="button-small-edit"><i class="fa fa-pencil-square-o"></i> Edit </button>
                              <button class="button-small-verify">Verify <i class="fa fa-check-circle-o" aria-hidden="true"></i></button>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="gr-12 small-text" v-if="memberDocuments">

                      <div class="row container side-nav">
                          <ul class="nav nav-tabs">
                              <li class="text-center margin-left-15 active">
                                  <a class="black-text" data-toggle="tab" href="#introducedBy">Introduced By</a>
                              </li>
                              <!--<li class="col-md-3 text-center" ng-click="setType('approved')"><a data-toggle="tab" >Approved</a></li>-->
                              <li class="text-center margin-left-15">
                                  <a class="black-text" data-toggle="tab" href="#hasIntroduced" @click="loadMemberIntroduced(memberProfile.accountId)">Has Introduced</a>
                              </li>
                              <li class="text-center margin-left-15">
                                  <a class="black-text" data-toggle="tab" href="#invitedBy" @click="loadMemberInvitedBy(memberProfile.accountId)">Invited By</a>
                              </li>
                          </ul>
                          <div class="tab-content">
                              <div id="introducedBy" class="tab-pane fade in active padding-4">
                                  <div class="gr-4 text-center" v-if="memberIntroducers">
                                      <div class="gr-6 padding-5" v-for="memberIntroducer in memberIntroducers">
                                              <img :src="imageBaseUrl+memberIntroducer.profilePictureUrl" class="img-circle" alt="Profile Picture" width="80" height="80"> 
                                              <br><b>{{memberIntroducer.name}}</b>
                                              <br>{{memberIntroducer.mobileNumber}}
                                      </div>
                                  </div>
                              </div>
                              <div id="hasIntroduced" class="tab-pane fade  padding-4">
                                  <div class="gr-4 text-center" v-if="membersIntroduced">
                                      <div class="gr-6 padding-5" v-for="memberIntroduced in membersIntroduced">
                                              <img :src="imageBaseUrl+memberIntroduced.profilePictureUrl" class="img-circle" alt="Profile Picture" width="80" height="80"> 
                                              <br><b>{{memberIntroduced.name}}</b>
                                              <br>{{memberIntroduced.mobileNumber}}
                                              
                                      </div>
                                  </div>
                              </div>
                              <div id="invitedBy" class="tab-pane fade  padding-4">
                                  <div class="gr-4 text-center" v-if="membersInvitedBy">
                                      <div class="gr-6 padding-5" v-for="memberInvitedBy in membersInvitedBy">
                                              <img :src="imageBaseUrl+memberInvitedBy.profilePictureUrl" class="img-circle" alt="Profile Picture" width="80" height="80"> 
                                              <br><b>{{memberInvitedBy.name}}</b>
                                              <br>{{memberInvitedBy.mobileNumber}}
                                              
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
</template>

<script>
  import Http from '../services/Http'

  export default {
    name: 'WaitingForApprovalList',
    data () {
      return {
        members: [],
        query: {},
        memberProfile: {},
        memberDocuments: {},
        memberIntroducers: {},
        membersIntroduced: {},
        membersInvitedBy: {},
        imageBaseUrl: '',
        value: [
          0,
          100
        ],
        sliderShow: false,
        maxPaginationItem: 10
      }
    },
    methods: {
      loadProfile: function (member) {
        console.log('accountID:', member)
        this.memberProfile = member
        Http.GET('member', [member.accountId, 'identification-documents'])
          .then(
            ({data: {data: documents}}) => {
              this.memberDocuments = documents
              console.log('Got the list of documents: ', this.memberDocuments, ' documents.length: ',
              this.memberDocuments.length)
            },
            error => {
              console.log('Error in getting list of identification documents, error: ', error)
            }
          )
        // Http call for the introducers
        Http.GET('member', [member.accountId, 'introducers'])
          .then(
            ({data: {data: introducers}}) => {
              this.memberIntroducers = introducers
              console.log('Got the list of introducers: ', this.memberIntroducers)
            },
            error => {
              console.log('Error in getting the list of introducers, error: ', error)
            }
          )
        this.sliderShow = true
      },
      loadMemberIntroduced: function (accountId) {
        Http.GET('member', [accountId, 'introduced'])
          .then(
            ({data: {data: introduced}}) => {
              this.membersIntroduced = introduced
              console.log('Got the list of introduced: ', this.membersIntroduced)
            },
            error => {
              console.log('Error in getting the list of introduced, error: ', error)
            }
          )
      },
      loadMemberInvitedBy: function (accountId) {
        Http.GET('member', [accountId, 'inviters'])
          .then(
            ({data: {data: invited}}) => {
              this.membersInvitedBy = invited
              console.log('Got the list of inviters: ', this.membersInvitedBy)
            },
            error => {
              console.log('Error in getting the list of inviters, error: ', error)
            }
          )
      },
      hideProfile: function () {
        this.sliderShow = false
      },
      getMembers: function (key = 'member') {
        Http.GET(key, this.query)
          .then(({data: {data}}) => {
            console.log('Success, got members: ', data)
            this.members = data
          }, error => {
            console.error('Error in getting members: ', error)
          })
      },
      pageChange (number = 0) {
        if (this.query.pageNumber !== number) {
          this.query.pageNumber = number
          this.getMembers()
        }
      },
      openNewTab (value) {
        console.log('Okay, I am doing it now!!!, value: ', value)
        window.open(`${window.location.href}/${value}`, '_blank')
      },
      init () {
        this.imageBaseUrl = Http.IMAGE_URL
        this.query = Object.assign({}, {
          name: '', // string
          mobileNumber: '', // string
          accountType: '', // int: 1 = personal, 2 = business
          verificationStatus: 'IN_PROGRESS', // string: VERIFIED, NOT_VERIFIED
          profileCompletionScoreStartRange: '',
          profileCompletionScoreEndRange: '',
          sort: 'DOCUMENT_UPLOAD',
          order: 'DESC',
          pageNumber: 0,
          pageSize: 10
        })
        this.value = [0, 100]
        this.getMembers()
      },
      filter: function (key = 'member') {
        this.query.pageNumber = 0
        this.query.profileCompletionScoreStartRange = this.value[0]
        this.query.profileCompletionScoreEndRange = this.value[1]
        console.log('mobile number: ' + this.query.mobileNumber + ' accountType: ' + this.query.accountType +
          ' verified: ' + this.query.verificationStatus)
        Http.GET('member', this.query)
          .then(({data: {data}}) => {
            console.log('Success in getting filtered results, data: ', data)
            this.members = data
          }, error => {
            console.log('Error in getting filtered results: ', error)
          })
      }
    },
    created () {
      console.log('Member list component created::::')
      this.init()
    }
  }
</script>
