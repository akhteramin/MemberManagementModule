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
    <div class="gr-12 w3-header-card">
      <div class="gr-12 panel-label">
            <label class="text-label"><b>Verification</b></label>
      </div>
      <div class="gr-12">
        <table class="table">
          <tbody>
          <tr class="gr-12">
            <td class="gr-6 verification-block">
              <!--How cow verification status: {{ verificationStatus }} and verification type: {{ verificationType }}-->
              <div v-restrict="'MS_MM_USER_VERIFICATION_VERIFY'">
                <form  v-on:submit.prevent="acceptVerification" v-on:reset.prevent="rejectVerification">
                  <br>
                  <div class="row text-center red" v-if="verificationStatus === 'NOT_VERIFIED' || verificationStatus === 'UNVERIFY'">
                    <i class="fa fa-times" aria-hidden="true"></i> NOT VERIFIED
                    <br> <br>
                    <div class="gr-10 push-1">
                      <textarea v-model="verificationComment" placeholder="Enter comment" required></textarea>
                    </div>
                    <div>
                      <div class="gr-12">
                        <div class="form-group">
                          <button type="submit" class="button-md-verify width-90"
                          :disabled="verificationComment === null || verificationComment === ''">
                            <i class="fa fa-check" aria-hidden="true"></i>
                            Verify
                          </button>
                          <button type="reset" class="button-reset"
                          :disabled="verificationComment === null || verificationComment === ''">
                            <i class="fa fa-times"></i>
                            Reject
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>


                  <div v-else-if="verificationStatus === 'IN_PROGRESS' || (verificationStatus === 'ACCEPT' && verificationType === 'VERIFY')" class="row" >
                    <div class="text-center inprogress-color">
                      <i class="fa fa-spinner" aria-hidden="true"></i> IN PROGRESS
                    </div>
                    <br>
                    <div class="gr-4 push-1 text-left">
                      Verified By:
                    </div>
                    <div class="gr-6 push-1 break-word">
                      {{ verificationHistory && verificationHistory.length > 0 ? member.verifyDetails.actor.name
                      : 'N/A' }}
                      <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
                    </div>
                    <br><br>
                    <div class="gr-4 push-1 text-left;">
                      Time:
                    </div>
                    <div class="gr-6 push-1 break-word" v-if="verificationHistory && verificationHistory.length > 0">
                      {{ verificationHistory && member.verifyDetails.updateTime | date('MMM D, YYYY - HH:mm:ss a') }}
                      <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
                    </div>
                    <div v-else class="gr-6 push-1">
                      N/A
                    </div>
                    <br>

                  </div>

                  <div v-else-if="(verificationStatus === 'REJECTED' && verificationType === null) || (verificationStatus === 'REJECT' && verificationType === 'VERIFY')"
                      class="row justify-content-center text-center">
                    <div class="red">
                      <i class="fa fa-times"></i> REJECTED
                    </div>
                    <br>
                    <div class="gr-5" >
                      <div class="text-left">
                        Rejected By:
                      </div>
                    </div>
                    <div class="gr-7 text-left break-word">
                      {{ verificationHistory && verificationHistory.length > 0 ? member.verifyDetails.actor.name
                      : 'N/A' }}
                      <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
                    </div>
                    <br> <br>
                    <div class="gr-5 text-left text-left">
                      Time:
                    </div>
                    <div class="gr-7 text-left" v-if="verificationHistory && verificationHistory.length > 0">
                      {{ member.verifyDetails.updateTime | date('MMM D, YYYY') }}
                      <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
                    </div>
                    <div v-else class="gr-7 text-left">
                      N/A
                    </div>
                  </div>

                  <div v-else-if="(verificationStatus === 'REJECTED' || verificationStatus === 'REJECT') && verificationType === 'APPROVE'">
                    <div class="text-center inprogress-color">

                    </div>
                    <br>
                    <div class="gr-4 push-1 text-left">
                      Verified By:
                    </div>
                    <div class="gr-6 push-1 break-word">
                      {{ verificationHistory && verificationHistory.length > 0 ? member.verifyDetails.actor.name
                      : 'N/A' }}
                      <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
                    </div>
                    <br><br>
                    <div class="gr-4 push-1 text-left">
                      Time:
                    </div>
                    <div class="gr-6 push-1 break-word" v-if="verificationHistory && verificationHistory.length > 0">
                      {{ verificationHistory && member.verifyDetails.updateTime | date('MMM D, YYYY - HH:mm:ss a') }}
                      <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
                    </div>
                    <div v-else class="gr-6 push-1">
                      N/A
                    </div>
                    <br>
                  </div>



                  <div v-else-if="(verificationStatus === 'ACCEPT' && verificationType === 'APPROVE') || (verificationStatus === 'VERIFIED' && verificationType === null) || (verificationStatus === 'VERIFIED' && verificationType === 'APPROVE')" class="row text-center">
                    <div class="verified-color">
                      <i class="fa fa-check"></i> VERIFIED
                    </div>
                    <br>
                    <div class="gr-5 text-left">
                      Verified By:
                    </div>
                    <div class="gr-7 text-left break-word">
                      {{ verificationHistory && verificationHistory.length > 0 ? member.verifyDetails.actor.name : 'N/A' }}
                      <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
                    </div>
                    <br><br><br>
                    <div class="gr-5 text-left break-word">
                      Time:
                    </div>
                    <div class="gr-7 text-left break-word" v-if="verificationHistory && verificationHistory.length > 0">
                      {{ verificationHistory && member.verifyDetails.updateTime | date('MMM D, YYYY - HH:mm:ss a') }}
                      <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
                    </div>
                    <div v-else class="gr-1 text-left;">
                      N/A
                    </div>
                  </div>
                </form>
              </div>
            </td>



            <td class="gr-6 height-280">
              <br>
              <div v-restrict="'MS_MM_USER_VERIFICATION_APPROVE'">
                <div v-if="(verificationStatus === 'ACCEPT' && verificationType === 'APPROVE') ||
                  (verificationStatus === 'VERIFIED' && verificationType === null) ||
                  (verificationStatus === 'VERIFIED' && verificationType === 'APPROVE')" class="row text-center">
                  <div class="verified-color">
                    <i class="fa fa-check"></i> APPROVED
                  </div>
                  <br>
                  <div class="gr-5 text-left">
                    Approved By:
                  </div>
                  <div class="gr-7 text-left break-word">
                    {{ member.approveDetails ? member.approveDetails.actor.name : 'N/A' }}
                    <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
                  </div>
                  <br><br><br>
                  <div class="gr-5 text-left">
                    Time:
                  </div>
                  <div class="gr-7 text-left break-word" v-if="member.approveDetails">
                    {{ member.approveDetails && member.approveDetails.updateTime | date('MMM D, YYYY - HH:mm:ss a') }}
                    <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
                  </div>
                  <div v-else class="gr-1 text-left;">
                    N/A
                  </div>
                </div>

                <div v-else-if="(verificationStatus === 'REJECTED' || verificationStatus === 'REJECT')
                && verificationType === 'APPROVE'">
                  <div class="red text-center">
                    <i class="fa fa-times"></i> APPROVAL REJECTED
                  </div>
                  <br>
                  <div class="gr-5 text-left">
                    Rejected By:
                  </div>
                  <div class="gr-7 text-left break-word">
                    {{  member.approveDetails ? member.approveDetails.actor.name : 'N/A' }}
                    <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
                  </div>
                  <br><br>
                  <div class="gr-5 text-left">
                    Time:
                  </div>
                  <div class="gr-7 text-left" v-if="member.approveDetails">
                    {{ member.approveDetails && member.approveDetails.updateTime | date('MMM D, YYYY - HH:mm:ss a') }}
                    <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
                  </div>
                  <div v-else class="gr-7 text-left;">
                    N/A
                  </div>
                </div>

                <div v-else>
                  <form v-on:submit.prevent="acceptApproval" v-on:reset.prevent="rejectApproval">

                    <div v-if="verificationStatus === 'IN_PROGRESS' || (verificationStatus === 'ACCEPT' &&
                  verificationType === 'VERIFY')" class="row text-center">
                      <div class="red">
                        <i class="fa fa-times"></i> NOT APPROVED
                      </div>
                      <br> <br>
                      <textarea v-model="approvalComment" placeholder="Enter comment" required
                                class="comment-textarea"></textarea>

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

                    <div v-if="verificationStatus === 'NOT_VERIFIED' || verificationStatus === 'UNVERIFY'" class="row text-center">
                      <div class="red">
                        <i class="fa fa-times"></i> NOT APPROVED
                      </div>
                    </div>

                  </form>
                </div>
              </div>
            </td>

          </tr>
          </tbody>
        </table>
        <div v-restrict="'MS_MM_USER_VERIFICATION_REVOKE'" v-if="(verificationStatus === 'ACCEPT' && verificationType === 'APPROVE') ||
                  (verificationStatus === 'VERIFIED' && verificationType === null) ||
                  (verificationStatus === 'VERIFIED' && verificationType === 'APPROVE')" class="row text-center">
          <button data-toggle="modal" data-target="#MemberUnverifiedModal" data-backdrop="false"
          class="button-md-verify width-100">
            <i class="fa fa-times" aria-hidden="true"></i>
            Unverify
          </button>
        </div>

        <div id="MemberUnverifiedModal" class="modal fade" role="dialog">
          <div class="modal-dialog  modal-md">
            <!-- Modal content-->

            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" >&times;</button>
                <h4 class="modal-title"> Confirm Unverification (max. 250 characters) </h4>
              </div>
              <div class="modal-body">
                <div class="form-group">
                  <div class="row">
                    <div class="col-md-6 col-md-offset-2">
                      <span>
                        <div class="comment">
                          <!--<span>Browse</span>-->
                          Comment:
                          <textarea id="comment" v-model="paramData.comment" rows="4" cols="50"></textarea>
                        </div>
                        <!-- <input id="uploadFile3" placeholder="Choose File" disabled="disabled" /> -->
                      </span>
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <div class="row">
                    <div class="col-md-6 col-md-offset-2">
                      Account Class:
                      <div class="select">
                        <select v-model="paramData.accountClass">
                          <option v-for="item in classes" :value="item.id">{{ item.name }}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">

                <button type="submit" class="btn btn-sm btn-default btn-active-til" data-dismiss="modal" @click="unverifyMember()" :disabled="paramData.comment === null || paramData.comment === ''">Unverify</button>
                <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="gr-12 w3-header-card">
        <div class="gr-12 panel-label">
          <label class="text-label"><b>Verification History</b></label>
        </div>
        <!--div class="gr-12 padding-5">
          <ul class="nav nav-tabs">
            <li class="gr-6 text-center" :class="{active: showVerificationHistory}"
                @click="setTab('tabVerificationHistory')"><a data-toggle="tab">Verification</a></li>
            <!--<li class="col-md-3 text-center" ng-click="setType('approved')"><a data-toggle="tab" >Approved</a></li>-->
            <!--li class="gr-6 text-center" :class="{active: showApprovalHistory}"
                @click="setTab('tabApprovalHistory')"><a data-toggle="tab">Approval</a></li>
          </ul>
        </div>
        <br>
      </div-->

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
                          <strong class="primary-font">
                          {{history.verificationType == 'APPROVE'? 'Approval' : 'Verification'}} {{ history.verificationStatus }}</strong> by
                          <strong class="primary-font">{{ history.actor ? history.actor.name : 'N/A' }}  </strong>
                          <small class="pull-right text-muted">
                            <i class="fa fa-clock-o" aria-hidden="true"></i>
                            {{ history.updateTime | date('MMM D, YYYY HH:mm:ss a') }}
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
</template>

<script>
  import Http from '../../services/Http'
  export default {
    name: 'MemberVerifyAndApproveComponent',
    props: [
      'id',
      'member'
    ],
    watch: {
      id: function (val) {
        this.init()
      }
    },
    data () {
      return {
        verificationStatus: '',
        verificationType: '',
        approvalHistory: [],
        verificationHistory: [],
        verificationComment: '',
        approvalComment: '',
        showVerificationHistory: true,
        showLoader: false,
        paramData: {
          comment: null,
          accountClass: 1
        },
        accountClassMapper: {},
        classes: []
      }
    },
    created () {
      console.log('verify and approve component::', this.member)
      this.init()
      console.log('verification information component created, verification status: ', this.verificationStatus,
        ', verirification type: ', this.verificationType)
    },
    methods: {
      init () {
        
        if (this.member.verificationHistory && this.member.verificationHistory.length > 0) {
          this.verificationHistory = this.member.verificationHistory
        } else {
          this.verificationHistory = []
        }
        this.verificationStatus = this.member.basicInfo.verificationStatus
        // this.verificationType = this.approvalHistory && this.approvalHistory.length > 0 ? this.approvalHistory[this.approvalHistory.length - 1].verificationType : null
        if (this.member.approveDetails) {
          this.verificationType = this.member.approveDetails.verificationType
        }
        else if (this.member.verifyDetails) {
          this.verificationType = this.member.verifyDetails.verificationType
        }
        else {
          this.verificationType = null
        }
        console.log('verification status: ', this.verificationStatus, ' verification type: ', this.verificationType)
        Http.GET('resource', ['account-class'])
          .then(
            ({data: {data: classes}}) => {
              this.classes = classes
              console.log('successfully got account class list: ', classes)
              this.classes.forEach(item => {
                this.accountClassMapper[item.id] = item.name
              })
            },
            error => {
              console.log('error getting service list', error)
            }
          )
      },
      acceptVerification () {
        let request = {
          'comment': this.verificationComment,
          'status': 'ACCEPT'
        }
        console.log('verification request: ', request, ' this.id: ', this.id)
        this.showLoader = true
        Http.PUT('verification', request, [this.id])
          .then(
            ({data: {data: verificationResponse}}) => {
              this.showLoader = false
              $.notify({
                // options
                title: '<strong>Success!</strong>',
                message: 'Verification successful.'
              }, {
                // settings
                type: 'success',
                delay: 3000
              })
              console.log('verification request response::', verificationResponse)
              this.verificationStatus = verificationResponse.verificationStatus
              this.verificationType = verificationResponse.verificationType
              this.verificationHistory.push(verificationResponse)
              console.log('now, verification history: ', this.verificationHistory)
              this.init()
            },
            error => {
              this.showLoader = false
              $.notify({
                // options
                title: '<strong>Verification failed!</strong>',
                message: 'Please try again.'
              }, {
                // settings
                type: 'danger',
                delay: 3000
              })
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
        this.showLoader = true
        Http.PUT('verification', request, [this.id])
          .then(
            ({data: {data: verificationResponse}}) => {
              this.showLoader = false
              $.notify({
                // options
                title: '<strong>Success!</strong>',
                message: 'Verification rejected.'
              }, {
                // settings
                type: 'success',
                delay: 3000
              })
              console.log('verification request response::', verificationResponse)
              this.verificationStatus = verificationResponse.verificationStatus
              this.verificationType = verificationResponse.verificationType
              this.verificationHistory.push(verificationResponse)
              console.log('now, verification history: ', this.verificationHistory)
              this.init()
            },
            error => {
              this.showLoader = false
              $.notify({
                // options
                title: '<strong>Rejection failed!</strong>',
                message: 'Please try again.'
              }, {
                // settings
                type: 'danger',
                delay: 3000
              })
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
        this.showLoader = true
        Http.PUT('verification', request, [this.id, 'approve'])
          .then(
            ({data: approvalResponse}) => {
              $.notify({
                // options
                title: '<strong>Success!</strong>',
                message: 'Account approved.'
              }, {
                // settings
                type: 'success',
                delay: 3000
              })
              this.showLoader = false
              console.log('approval request response::', approvalResponse)
              this.verificationStatus = approvalResponse.data.verificationStatus
              this.verificationType = approvalResponse.data.verificationType
              this.verificationHistory.push(approvalResponse.data)
              console.log('now, approval history: ', this.verificationHistory)
              this.init()
            },
            error => {
              this.showLoader = false
              $.notify({
                // options
                title: '<strong>Rejection failed!</strong>',
                message: 'Please try again.'
              }, {
                // settings
                type: 'danger',
                delay: 3000
              })
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
        this.showLoader = true
        Http.PUT('verification', request, [this.id, 'approve'])
          .then(
            ({data: approvalResponse}) => {
              this.showLoader = false
              console.log('approval request response::', approvalResponse)
              this.verificationStatus = approvalResponse.data.verificationStatus
              this.verificationType = approvalResponse.data.verificationType
              this.verificationHistory.push(approvalResponse.data)
              console.log('now, approval history: ', this.verificationHistory)
              this.init()
            },
            error => {
              this.showLoader = false
              console.log('Error in putting approval request, error: ', error)
            }
          )
      },
      unverifyMember () {
        console.log(this.paramData)
        this.showLoader = true
        Http.PUT('verification', this.paramData, [this.id, 'revoke-verification'])
          .then(
            ({data: revokeResponse}) => {
              this.showLoader = false
              $.notify({
                // options
                title: '<strong>Success!</strong>',
                message: 'Verification revoked.'
              }, {
                // settings
                type: 'success',
                delay: 3000
              })
              console.log('revoke request response::', revokeResponse)
              this.verificationStatus = revokeResponse.data.verificationStatus
              this.verificationType = revokeResponse.data.verificationType
              this.verificationHistory.push(revokeResponse.data)
              console.log('now, approval history: ', this.verificationHistory)
              this.init()
            },
            error => {
              this.showLoader = false
              $.notify({
                // options
                title: '<strong>Revoke failed!</strong>',
                message: 'Please try again.'
              }, {
                // settings
                type: 'danger',
                delay: 3000
              })
              console.log('Error in putting approval request, error: ', error)
            }
          )
      }
    }
  }
</script>
