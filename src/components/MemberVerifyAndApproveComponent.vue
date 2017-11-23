<template>
  <div>
    <div class="gr-10">
      <h5><b>Verification</b></h5>
    </div>
    <div class="gr-10">
      <table class="table table-bordered">
        <tbody>
        <tr>
          <td>
            <!--How cow verification status: {{ verificationStatus }} and verification type: {{ verificationType }}-->
            <form  v-on:submit.prevent="acceptVerification" v-on:reset.prevent="rejectVerification">
              <br>
              <div class="row text-center" v-if="verificationStatus === 'NOT_VERIFIED'" style="color: red;">
                <i class="fa fa-times" aria-hidden="true"></i> NOT VERIFIED
                <br> <br>
                <div class="gr-10 push-1">
                  <textarea v-model="verificationComment" placeholder="Enter comment" required
                            style="width: 80%; height: 150px; color: black;"></textarea>
                </div>
                <div>
                  <div class="form-group gr-12">
                    <button type="submit" class="button-md-verify">
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
                {{ verificationHistory.length > 0 ? verificationHistory[ verificationHistory.length - 1 ].actor.name
                : 'N/A' }}
                <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
              </div>
              <br>
              <div class="gr-4 push-1" style="text-align: left;">
                Time:
              </div>
              <div class="gr-4 push-1" v-if="verificationHistory.length > 0">
                {{ verificationHistory[verificationHistory.length - 1].updateTime | date('MMM D, YYYY') }}
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
              <div class="gr-2 text-left">
                Rejected By:
              </div>
              <div class="gr-4" style="text-align: left;">
                {{ verificationHistory.length > 0 ? verificationHistory[ verificationHistory.length - 1 ].actor.name
                : 'N/A' }}
                <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
              </div>
              <br>
              <div class="gr-2 text-left" style="text-align: left;">
                Time:
              </div>
              <div class="gr-3" v-if="verificationHistory.length > 0" style="text-align: left;">
                {{ verificationHistory[verificationHistory.length - 1].updateTime | date('MMM D, YYYY h:mm:ss') }}
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
              <div class="gr-2" style="text-align: left;">
                Approved By:
              </div>
              <div class="gr-4" style="text-align: left;">
                {{ approvalHistory.length > 0 ? approvalHistory[approvalHistory.length - 1].actor.name : 'N/A' }}
                <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
              </div>
              <br>
              <div class="gr-2" style="text-align: left;">
                Time:
              </div>
              <div class="gr-4" v-if="approvalHistory.length > 0" style="text-align: left;">
                {{ approvalHistory[approvalHistory.length - 1].updateTime | date('MMM D, YYYY h:mm:ss') }}
                <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
              </div>
              <div v-else class="gr-4 push-1">
                N/A
              </div>
            </div>
           </form>

          </td>



          <td v-if="!((verificationStatus === 'ACCEPT' && verificationType === 'APPROVE') ||
              (verificationStatus === 'VERIFIED' && verificationType === null) ||
              (verificationStatus === 'REJECTED' || verificationStatus === 'REJECT')
              || (verificationStatus === 'VERIFIED' && verificationType === 'APPROVE'))">
            <br>
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
          </td>

        </tr>
        </tbody>
      </table>
      <hr>


      <div id = "nav-bar">
        <h5><b>Verification History</b></h5>
        <ul class="nav nav-tabs">
          <li class="gr-2 text-center" :class="{active: showVerificationHistory}"
              @click="setTab('tabVerificationHistory')"><a data-toggle="tab">Verification</a></li>
          <!--<li class="col-md-3 text-center" ng-click="setType('approved')"><a data-toggle="tab" >Approved</a></li>-->
          <li class="gr-2 text-center" :class="{active: showApprovalHistory}"
              @click="setTab('tabApprovalHistory')"><a data-toggle="tab">Approval</a></li>
        </ul>
        <br>
      </div>
      <div class="pre-scrollable" style="height: 250px;">
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
          <div class="card-block" v-if="verificationHistory.length > 0">
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
        this.verificationType = this.approvalHistory.length > 0 ? this.approvalHistory[this.approvalHistory.length - 1].verificationType : null
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
              console.log('Error in putting approval request, error: ', error)
            }
          )
      }
    }
  }
</script>
