<template>
  <div>
    <div class="gr-12">
      <h5><b>Verification</b></h5>
    </div>
    <div class="gr-12">
      <table class="table">
        <tbody>
        <tr class="gr-12">
          <td class="gr-6" style="border-right: 1px solid #cdd0d4; height: 280px;">
            <!--How cow verification status: {{ verificationStatus }} and verification type: {{ verificationType }}-->
            <div>
              <form  v-on:submit.prevent="acceptVerification" v-on:reset.prevent="rejectVerification">
                <br>
                <div class="row text-center" v-if="verificationStatus === 'NOT_VERIFIED'" style="color: red;">
                  <i class="fa fa-times" aria-hidden="true"></i> NOT VERIFIED
                  <br> <br>
                  <div class="gr-10 push-1">
                    <textarea v-model="verificationComment" placeholder="Enter comment" required></textarea>
                  </div>
                  <div>
                    <div class="gr-12">
                      <div class="form-group">
                        <button type="submit" class="button-md-verify" style="width: 90px;">
                          <i class="fa fa-check" aria-hidden="true"></i>
                          Verify
                        </button>
                        <button type="reset" class="button-reset">
                          <i class="fa fa-times"></i>
                          Reject
                        </button>
                      </div>
                    </div>

                  </div>
                </div>


                <div v-else-if="verificationStatus === 'IN_PROGRESS' || (verificationStatus === 'ACCEPT' &&
              verificationType === 'VERIFY')" class="row" >
                  <div style="color: #eb9316;" class="text-center">
                    <i class="fa fa-spinner" aria-hidden="true"></i> IN PROGRESS
                  </div>
                  <br>
                  <div class="gr-4 push-1" style="text-align: left;">
                    Verified By:
                  </div>
                  <div class="gr-4 push-1">
                    {{ verificationHistory && verificationHistory.length > 0 ? verificationHistory[ verificationHistory.length - 1 ].actor.name
                    : 'N/A' }}
                    <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
                  </div>
                  <br>
                  <div class="gr-4 push-1" style="text-align: left;">
                    Time:
                  </div>
                  <div class="gr-4 push-1" v-if="verificationHistory.length > 0">
                    {{ verificationHistory && verificationHistory[verificationHistory.length - 1].updateTime | date('MMM D, YYYY') }}
                    <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
                  </div>
                  <div v-else class="gr-6 push-1">
                    N/A
                  </div>
                  <br>

                </div>

                <div v-else-if="verificationStatus === 'REJECTED' || verificationStatus === 'REJECT'"
                     class="row justify-content-center text-center">
                  <div style="color: red;">
                    <i class="fa fa-times"></i> REJECTED
                  </div>
                  <br>
                  <div class="gr-5" >
                    <div class="text-left">
                      Rejected By:
                    </div>
                  </div>
                  <div class="gr-7" style="text-align: left;">
                    {{ verificationHistory && verificationHistory.length > 0 ? verificationHistory[ verificationHistory.length - 1 ].actor.name
                    : 'N/A' }}
                    <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
                  </div>
                  <br>
                  <div class="gr-5 text-left" style="text-align: left;">
                    Time:
                  </div>
                  <div class="gr-7" v-if="verificationHistory && verificationHistory.length > 0" style="text-align: left;">
                    {{ verificationHistory[verificationHistory.length - 1].updateTime | date('MMM D, YYYY') }}
                    <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
                  </div>
                  <div v-else class="gr-4 push-1">
                    N/A
                  </div>
                </div>



                <div v-else-if="(verificationStatus === 'ACCEPT' && verificationType === 'APPROVE') ||
              (verificationStatus === 'VERIFIED' && verificationType === null) ||
              (verificationStatus === 'VERIFIED' && verificationType === 'APPROVE')" class="row text-center">
                  <div style="color: #5BC43C;">
                    <i class="fa fa-check"></i> APPROVED
                  </div>
                  <br>
                  <div class="gr-5" style="text-align: left;">
                    Approved By:
                  </div>
                  <div class="gr-7" style="text-align: left;">
                    {{ approvalHistory && approvalHistory.length > 0 ? approvalHistory[approvalHistory.length - 1].actor.name : 'N/A' }}
                    <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
                  </div>
                  <br>
                  <div class="gr-5" style="text-align: left;">
                    Time:
                  </div>
                  <div class="gr-7" v-if="approvalHistory.length > 0" style="text-align: left;">
                    {{ approvalHistory && approvalHistory[approvalHistory.length - 1].updateTime | date('MMM D, YYYY') }}
                    <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
                  </div>
                  <div v-else class="gr-4 push-1">
                    N/A
                  </div>
                </div>
              </form>
            </div>
          </td>



          <td class="gr-6" style="height: 280px;"> <!-- v-if="!((verificationStatus === 'ACCEPT' && verificationType === 'APPROVE') ||
            (verificationStatus === 'VERIFIED' && verificationType === null) ||
            (verificationStatus === 'REJECTED' || verificationStatus === 'REJECT')
            || (verificationStatus === 'VERIFIED' && verificationType === 'APPROVE'))" -->
            <br>
            <div >
              <form v-on:submit.prevent="acceptApproval" v-on:reset.prevent="rejectApproval">

                <div v-if="verificationStatus === 'IN_PROGRESS' || (verificationStatus === 'ACCEPT' &&
              verificationType === 'VERIFY')" class="row text-center">
                  <div style="color: red;">
                    <i class="fa fa-times"></i> NOT APPROVED
                  </div>
                  <br> <br>
                  <textarea v-model="approvalComment" placeholder="Enter comment" required
                            style="width: 80%; height: 150px;"></textarea>

                  <div>
                    <div class="form-group">
                      <button type="submit" class="button-md-verify">
                        Approve
                      </button>
                      <button  type="reset" class="button-reset">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>

                <!--<div v-else-if="verificationStatus === 'VERIFIED'" class="row text-center">-->
                <!--<div style="color: #5BC43C;">-->
                <!--<i class="fa fa-check"></i> APPROVED-->
                <!--</div>-->
                <!--<br>-->
                <!--<div class="gr-5 push-1">-->
                <!--Approved By:-->
                <!--</div>-->
                <!--<div class="gr-4 push-1">-->
                <!--Joomla 4-->
                <!--&lt;!&ndash;{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}&ndash;&gt;-->
                <!--</div>-->
                <!--</div>-->

                <div v-if="verificationStatus === 'NOT_VERIFIED'" class="row text-center">
                  <div style="color: red;">
                    <i class="fa fa-times"></i> NOT APPROVED
                  </div>
                </div>

              </form>
            </div>
          </td>

        </tr>
        </tbody>
      </table>
      <hr>


      <div id = "nav-bar">
        <h5><b>Verification History</b></h5>
        <ul class="nav nav-tabs">
          <li class="gr-6 text-center" :class="{active: showVerificationHistory}"
              @click="setTab('tabVerificationHistory')"><a data-toggle="tab">Verification</a></li>
          <!--<li class="col-md-3 text-center" ng-click="setType('approved')"><a data-toggle="tab" >Approved</a></li>-->
          <li class="gr-6 text-center" :class="{active: showApprovalHistory}"
              @click="setTab('tabApprovalHistory')"><a data-toggle="tab">Approval</a></li>
        </ul>
        <br>
      </div>
      <div class="small-scrollable padding-5">
        <div v-if="showApprovalHistory">
          <div class="card-block" v-if="approvalHistory && approvalHistory.length > 0">
            <div class="col-md-12">
              <div class="col-md-12 comment">
                <ul class="chat">
                  <div v-for="history in approvalHistory">
                    <li class="left clearfix">
                      <span class="chat-img pull-left"></span>
                      <div class="chat-body clearfix">
                        <div class="header">
                          <strong class="primary-font">{{ history.verificationStatus }}</strong> by
                          <strong class="primary-font">{{ history.actor ? history.actor.name : 'N/A' }}  </strong>
                          <small class="pull-right text-muted">
                            <span class="glyphicon glyphicon-time"></span>
                            {{ history.updateTime | date('MMM D, YYYY hh:mm') }}
                          </small>
                        </div>
                        <p>
                          {{ history.comment }}
                        </p>
                      </div>
                    </li>
                  </div>


                </ul>
              </div>
            </div>
          </div>
          <div v-else>
            <strong class="primary-font">N/A</strong>
          </div>
        </div>

        <div v-if="showVerificationHistory">
          <div class="card-block" v-if="verificationHistory && verificationHistory.length > 0">
            <div class="col-md-12">
              <div class="col-md-12 comment">
                <ul class="chat">
                  <div v-for="history in verificationHistory">
                    <li class="left clearfix">
                      <span class="chat-img pull-left"></span>
                      <div class="chat-body clearfix">
                        <div class="header">
                          <strong class="primary-font">{{ history.verificationStatus }}</strong> by
                          <strong class="primary-font">{{ history.actor ? history.actor.name : 'N/A' }}  </strong>
                          <small class="pull-right text-muted">
                            <span class="glyphicon glyphicon-time"></span>
                            {{ history.updateTime | date('MMM D, YYYY hh:mm') }}
                          </small>
                        </div>
                        <p>
                          {{ history.comment }}
                        </p>
                      </div>
                    </li>
                  </div>


                </ul>
              </div>
            </div>
          </div>
          <div v-else>
            <strong class="primary-font">N/A</strong>
          </div>
        </div>
        <br> <br> <br> <br>
      </div>



    </div>
  </div>
</template>

<script>
  import Http from '../services/Http'
  import route from '../router'
  export default {
    name: 'MemberVerifyAndApproveComponent',
    props: [
      'id',
      'member'
    ],
    data () {
      return {
        verificationStatus: '',
        verificationType: '',
        approvalHistory: {},
        verificationHistory: {},
        verificationComment: '',
        approvalComment: '',
        showVerificationHistory: true,
        showApprovalHistory: false
      }
    },
    created () {
      this.init()
      console.log('verification information component created, verification status: ', this.verificationStatus,
        ', verirification type: ', this.verificationType)
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
      init () {
        if (this.member.approveHistory && this.member.approveHistory.length > 0) {
          this.approvalHistory = this.member.approveHistory
        } else {
          this.approvalHistory = null
        }
        if (this.member.verificationHistory && this.member.verificationHistory.length > 0) {
          this.verificationHistory = this.member.verificationHistory
        } else {
          this.verificationHistory = null
        }
        this.verificationStatus = this.member.basicInfo.verificationStatus
        this.verificationType = this.approvalHistory && this.approvalHistory.length > 0 ? this.approvalHistory[this.approvalHistory.length - 1].verificationType : null
        console.log('verification status: ', this.verificationStatus, ' verification type: ', this.verificationType,
        'approvalHistory: ', this.approvalHistory)
      },
      setTab (setName) {
        console.log('here, at set tab:: ')
        this.showVerificationHistory = false
        this.showApprovalHistory = false
        if (setName === 'tabVerificationHistory') {
          if (this.showVerificationHistory) {
            this.showVerificationHistory = false
          } else {
            this.showVerificationHistory = true
          }
        } else {
          if (this.showApprovalHistory) {
            this.showApprovalHistory = false
          } else {
            this.showApprovalHistory = true
          }
        }
      },
      acceptVerification () {
        let request = {
          'comment': this.verificationComment,
          'status': 'ACCEPT'
        }
        console.log('verification request: ', request, ' this.id: ', this.id)
        Http.PUT('verification', request, [this.id])
          .then(
            ({data: {data: verificationResponse}}) => {
              console.log('verification request response::', verificationResponse)
              this.verificationStatus = verificationResponse.verificationStatus
              this.verificationType = verificationResponse.verificationType
              this.verificationHistory.push(verificationResponse)
            },
            error => {
              if (error.response) {
                if (error.response.status === 401) { // unauthorized, logging out.
                  this.logout()
                }
              }
              console.log('Error in putting verification request, error: ', error)
            }
          )
      },
      rejectVerification () {
        let request = {
          'comment': this.verificationComment,
          'status': 'REJECT'
        }
        console.log('verification request: ', request)
        Http.PUT('verification', request, [this.id])
          .then(
            ({data: {data: verificationResponse}}) => {
              console.log('verification request response::', verificationResponse)
              this.verificationStatus = verificationResponse.verificationStatus
              this.verificationType = verificationResponse.verificationType
              this.verificationHistory.push(verificationResponse)
            },
            error => {
              if (error.response) {
                if (error.response.status === 401) { // unauthorized, logging out.
                  this.logout()
                }
              }
              console.log('Error in putting verification request, error: ', error)
            }
          )
      },
      acceptApproval () {
        let request = {
          'comment': this.approvalComment,
          'status': 'ACCEPT'
        }
        console.log('approval request: ', request)
        Http.PUT('verification', request, [this.id, 'approve'])
          .then(
            ({data: approvalResponse}) => {
              console.log('approval request response::', approvalResponse)
              this.verificationStatus = approvalResponse.data.verificationStatus
              this.verificationType = approvalResponse.data.verificationType
              this.approvalHistory.push(approvalResponse.data)
            },
            error => {
              if (error.response) {
                if (error.response.status === 401) { // unauthorized, logging out.
                  this.logout()
                }
              }
              console.log('Error in putting approval request, error: ', error)
            }
          )
      },
      rejectApproval () {
        let request = {
          'comment': this.approvalComment,
          'status': 'REJECT'
        }
        console.log('approval request: ', request)
        Http.PUT('verification', request, [this.id, 'approve'])
          .then(
            ({data: approvalResponse}) => {
              console.log('approval request response::', approvalResponse)
              this.verificationStatus = approvalResponse.data.verificationStatus
              this.verificationType = approvalResponse.data.verificationType
              this.approvalHistory.push(approvalResponse.data)
            },
            error => {
              if (error.response) {
                if (error.response.status === 401) { // unauthorized, logging out.
                  this.logout()
                }
              }
              console.log('Error in putting approval request, error: ', error)
            }
          )
      }
    }
  }
</script>
