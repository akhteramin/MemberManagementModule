<template>
  <div id = "list" class="ListRenderer gr-10 push-2 content-container">
    <h1>Members</h1>
    <hr>
    <form v-on:submit.prevent="filter" v-on:reset.prevent="init">
      <div class="row">
        <div class="gr-12">
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
              <label> Name: </label>
              <input  name="queryName" type="text" id="queryName" placeholder="Name"
                      v-model="query.name"
                      value=""/>
            </div>
          </div>

          <div class="gr-3">
            <div class="form-group">
              <label class="push-2">Account Type: </label>
              <div class="push-1">
                <div class="select select-sm">
                  <select id="personal-business-select"  v-model="query.accountType">
                    <!--<option selected disabled>Select account type</option>-->
                    <option selected value = "">Both</option>
                    <option value="1">Personal</option>
                    <option value="2">Business</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="gr-3">
            <div class="form-group">
              <label class="push-2"> Verification Status: </label>
              <div class="push-0">
                <div class="select select-sm">
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
        </div>

        <div>

        </div>


        <div v-if="doAdvancedSearch">
          <br>
          <div class="gr-12">

            <div class="gr-3">
              <label>Signup From: </label>
              <input type="date" :max="new Date().toISOString().substring(0,10)" v-model="signUpDateFrom"/>
            </div>
            <div class="gr-3">
              <label>Signup To: </label>
              <input type="date" :max="new Date().toISOString().substring(0,10)" v-model="signUpDateTo"/>
            </div>

            <div class="gr-3">
              <label class="push-2">Sort by: </label>
              <div class="push-1">
                <div class="select select-sm">
                  <select id="sort-by-select"  v-model="query.sort">
                    <!--<option selected disabled>Select account type</option>-->
                    <option selected value = "DOCUMENT_UPLOAD">Document Upload Date</option>
                    <option value="CREATION_DATE">Account Creation Date</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="gr-3">
              <label class="offset-2">Order by: </label>
              <div class="push-0">
                <div class="select select-sm">
                  <select id="order-by-select"  v-model="query.order">
                    <!--<option selected disabled>Select account type</option>-->
                    <option selected value = "DESC">DESC</option>
                    <option value="ASC">ASC</option>
                  </select>
                </div>
              </div>
            </div>


          </div>
          <div class="gr-6 push-2 text-center">
            <br>
            <label> Profile Completion Range: </label>
            <vue-slider ref="slider" v-model="value" :width="'100%'"></vue-slider>
          </div>

        </div>
        <div class="gr-8 pointer">
          <span style="display: inline-block; width: 10px;"></span>
          <a @click="toggleAdvancedSearch">
            <i class="fa fa-search-plus" aria-hidden="true" v-if="!doAdvancedSearch"></i>
            <i class="fa fa-search-minus" aria-hidden="true" v-if="doAdvancedSearch"></i>
            Advanced Search</a>
        </div>
        <div class="gr-12">
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

          <div class="gr-1 push-7">
            <div class="select select-sm">
              <select v-model="query.pageSize" @change="filter">
                <option disabled>Number of Entries</option>
                <option selected value=10>10</option>
                <option value=20>20</option>
                <option value=30>30</option>
                <option value=50>50</option>
              </select>
            </div>
          </div>

        </div>



      </div>
    </form>

    <!--========================================= my filters ==================================================-->
    <div class="table-responsive gr-12">
      <table class="table table-striped">
        <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Mobile Number</th>
          <th>A/C Type</th>
          <th>Verification</th>
          <th>Profile Completed</th>
          <th>Account Status</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="member,index in members.list">
          <td>{{query.pageNumber * query.pageSize + index + 1}}</td>

          <td class="member-name">
                <span v-if="member.mmUserPictures[0]">
                  <img :src="imageBaseUrl+member.mmUserPictures[0].document.url" class="img-circle" alt="N/A" width="30" height="30">
                </span>
            <span v-else>
                  <img src="static/images/default-original.jpg" class="img-circle" alt="N/A" width="30" height="30">
                </span>

            <a href=""  @click="memberDetails(member.accountId,member.accountType)">
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
          <td>{{ member.verificationStatus | underscoreless }}</td>
          <td>{{ member.profileCompletionScore }}%</td>
          <td>
            <div class="select">
              <select id="order-by-select"  v-model="member.accountStatus" @change="statusChange( member.accountId,member.accountStatus)">
                <option value = "1">Active</option>
                <option value = "2">Suspended</option>
              </select>
            </div>

          </td>

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
    <member-list-slider  v-if="sliderShow"
                         :id = "memberProfile.id"
                         :memberBasicDetails = "loadMemberBasicDetails"
                         :memberProfile="memberProfile"
                         :memberDocuments="memberDocuments"
                         :memberIntroducers="memberIntroducers"
                         :memberMissingInfo="memberMissingInfo"
                         @update="hideProfile"></member-list-slider>

    <div id="MemberAccountStatusModal" class="modal fade" role="dialog">
      <div class="modal-dialog  modal-md">
        <!-- Modal content-->

        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" >&times;</button>
            <h4 class="modal-title">Change Account Status </h4>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <div class="row">
                <div class="col-md-12" v-if="memberSuspensionHistory.list">
                  <div class="col-md-12 comment" v-for="history in memberSuspensionHistory.list">
                    <ul class="chat">
                      <li class="left clearfix"><span class="chat-img pull-left">
                              <!--img src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar" class="img-circle" /-->
                              </span>
                        <div class="chat-body clearfix">
                          <div class="header">
                            <strong class="primary-font">{{history.suspensionStatus}}</strong> by <strong class="primary-font">{{history.adminUserDetails.name}}  </strong> <small class="pull-right text-muted">
                            <span class="glyphicon glyphicon-time"></span>{{history.createdAt | date('MMM D, YYYY')}}</small>
                          </div>
                          <p>
                            {{history.description}}
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="col-md-8 col-md-offset-2">
                        <span>
                        <div class="comment">
                            <!--<span>Browse</span>-->
                            Comment:
                            <textarea id="comment" rows="4" cols="50" v-model="memberComment"></textarea>
                        </div>
                          <!-- <input id="uploadFile3" placeholder="Choose File" disabled="disabled" /> -->
                        </span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">

            <button v-if="memberAccountStatus==2" type="button" class="btn btn-sm btn-default btn-active-til" data-dismiss="modal" @click="changeAccountStatus(2)">Suspend</button>
            <button v-if="memberAccountStatus==1" type="button" class="btn btn-sm btn-default btn-active-til" data-dismiss="modal" @click="changeAccountStatus(1)">Activate</button>

            <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal" @click="init">Cancel</button>
          </div>
        </div>
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
  import Http from '../../services/Http'
  // import route from '../router'
  import MemberListSlider from './MemberListSliderComponent.vue'
  export default {
    name: 'MemberList',
    components: {
      'member-list-slider': MemberListSlider
    },
    data () {
      return {
        members: [],
        query: {},
        memberProfile: {},
        memberDocuments: {},
        memberIntroducers: {},
        memberMissingInfo: {},
        imageBaseUrl: '',
        value: [
          0,
          100
        ],
        sliderShow: false,
        maxPaginationItem: '',
        memberAccountStatus: 0,
        memberComment: '',
        memberAccountID: '',
        doAdvancedSearch: false,
        signUpDateFrom: null,
        signUpDateTo: null,
        memberSuspensionHistory: {},
        loadMemberBasicDetails: {},
        showLoader: false
      }
    },
    methods: {
      toggleAdvancedSearch () {
        if (this.doAdvancedSearch) {
          this.doAdvancedSearch = false
        } else {
          this.doAdvancedSearch = true
        }
      },
      loadProfile: function (member) {
        console.log('accountID:', member)

        if (this.sliderShow === true && this.memberProfile.accountId === member.accountId) {
          this.sliderShow = false
        } else {
          this.memberProfile = member
          this.showLoader = true
          Http.GET('member', [member.accountId, 'identification-documents'])
            .then(
              ({data: {data: documents}}) => {
                this.showLoader = false
                this.memberDocuments = documents
                console.log('Got the list of documents: ', this.memberDocuments, ' documents.length: ',
                  this.memberDocuments.length)
              },
              error => {
                this.showLoader = false
                console.log('Error in getting list of identification documents, error: ', error)
              }
            )
          // Http call for the introducers
          this.showLoader = true
          Http.GET('member', [member.accountId, 'introducers'])
            .then(
              ({data: {data: introducers}}) => {
                this.showLoader = false
                this.memberIntroducers = introducers
                console.log('Got the list of introducers: ', this.memberIntroducers)
              },
              error => {
                this.showLoader = false
                console.log('Error in getting the list of introducers, error: ', error)
              }
            )
          // Http call for the missing information
          this.showLoader = true
          Http.GET('member', [member.accountId, 'is-verifiable'])
            .then(
              ({data: {data: missingData}}) => {
                this.showLoader = false
                this.memberMissingInfo = missingData
                console.log('Got the list of missing: ', this.memberMissingInfo)
              },
              error => {
                this.showLoader = false
                console.log('Error in getting the list of missing, error: ', error)
              }
            )
          this.showLoader = true
          Http.GET('member', [member.accountId, 'basic-details'])
            .then(
              ({data: {data: member}}) => {
                this.showLoader = false
                console.log('In member list component, member basic details: ', member)
                this.loadMemberBasicDetails = member
              },
              error => {
                this.showLoader = false
                console.log('Error in loading member basic details for slider... ', error)
              }
            )
          this.sliderShow = true
        }
      },
      hideProfile: function (param = 'false') {
        this.sliderShow = false
      },
      getMembers: function (key = 'member') {
        this.showLoader = true
        Http.GET(key, this.query)
          .then(({data: {data}}) => {
            this.showLoader = false
            console.log('Success, got members: ', data)
            this.members = data
          }, error => {
            this.showLoader = false
            console.error('Error in getting members: ', error)
          })
      },
      statusChange: function (accountID, accountStatus) {
        console.log(accountStatus)
        this.memberAccountStatus = accountStatus
        this.memberAccountID = accountID
        let paramData = Object.assign({}, {
          order: 'DESC',
          pageNumber: 0,
          pageSize: 3
        })
        this.showLoader = true
        Http.GET('member', [accountID, 'suspension-history'], paramData)
          .then(({data: {data}}) => {
            this.showLoader = false
            console.log('Success, got members: ', data)
            this.memberSuspensionHistory = data
          }, error => {
            this.showLoader = false
            console.error('Error in getting members: ', error)
          })
        $('#MemberAccountStatusModal').modal({backdrop: false})
      },
      changeAccountStatus: function (accountStatus) {
        let paramData = {
          'message': this.memberComment,
          'effectiveFrom': new Date().getTime().toString()
        }
        this.showLoader = true
        Http.PUT('member', paramData, [this.memberAccountID, 'status', accountStatus])
          .then(
            ({data: statusData}) => {
              this.showLoader = false
              console.log('document data::', statusData)
              this.init()
            },
            error => {
              this.showLoader = false
              console.log('Error vrification of document: ', error)
            }
          )
      },
      pageChange (number = 0) {
        if (number >= 0 && number < this.members.totalPages && this.query.pageNumber !== number) {
          this.query.pageNumber = number
          this.getMembers()
        }
      },
      memberDetails (value, accntType) {
        console.log('Okay, I am doing it now!!!, value: ', value, accntType)
//        router.push(`./member/${value}`)
//        router.push({
//          name: 'MemberIndividualComponent',
//          params: {id: value, accountType: accntType}
//        })
        const host = window.location.href.split('/')[0]
        window.open(`${host}/member/profile/${value}/${accntType}`, '_blank')
        // window.open(`${window.location.href}/profile/${value}/${accntType}`, '_blank')
      },
      init () {
        this.imageBaseUrl = Http.IMAGE_URL
        this.query = Object.assign({}, {
          name: '', // string
          mobileNumber: '', // string
          accountType: '', // int: 1 = personal, 2 = business
          verificationStatus: 'NOT_VERIFIED', // string: VERIFIED, NOT_VERIFIED
          profileCompletionScoreStartRange: '',
          profileCompletionScoreEndRange: '',
          startSignUpDate: '',
          endSignUpDate: '',
          sort: 'DOCUMENT_UPLOAD',
          order: 'DESC',
          pageNumber: 0,
          pageSize: 10
        })
        this.value = [0, 100]
        this.signUpDateFrom = null
        this.signUpDateTo = null
        this.getMembers()
      },
      filter (key = 'member') {
        this.query.pageNumber = 0
        this.query.profileCompletionScoreStartRange = this.value[0]
        this.query.profileCompletionScoreEndRange = this.value[1]
        console.log('mobile number: ' + this.query.mobileNumber + ' accountType: ' + this.query.accountType +
          ' verified: ' + this.query.verificationStatus)
        if (this.signUpDateFrom !== null && this.signUpDateFrom.length > 0) {
          this.query.startSignUpDate = new Date(this.signUpDateFrom).getTime() - 6 * 3600 * 1000
        } else {
          this.query.startSignUpDate = 0
        }
        if (this.signUpDateTo !== null && this.signUpDateTo.length > 0) {
          this.query.endSignUpDate = new Date(this.signUpDateTo).getTime() - 6 * 60 * 60 * 1000
        } else {
          this.query.endSignUpDate = new Date().getTime() - 6 * 3600 * 1000
        }
        console.log('query, signup from date: ', this.query.startSignUpDate, ' to date: ',
          this.query.endSignUpDate)
        this.showLoader = true
        Http.GET('member', this.query)
          .then(({data: {data}}) => {
            this.showLoader = false
            console.log('Success in getting filtered results, data: ', data)
            this.members = data
          }, error => {
            this.showLoader = false
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
