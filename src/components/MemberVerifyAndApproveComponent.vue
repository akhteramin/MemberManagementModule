<template>
  <div>
    <div class="gr-10" style="text-align: center;">
      <h5><b>Verification</b></h5>
    </div>
    <div class="gr-10">
      <table class="table table-bordered">
        <tbody>
        <tr>
          <td>
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
                {{ approveHistory.actor ? approveHistory.actor.name : 'N/A' }}
                <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
              </div>
              <br>
              <div class="gr-4 push-1" style="text-align: left;">
                Time:
              </div>
              <div class="gr-4 push-1" v-if="approveHistory.actor">
                {{ approveHistory.updateTime | date('MMM D, YYYY h:mm:ss') }}
                <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
              </div>
              <div v-else class="gr-6 push-1">
                N/A
              </div>
              <br>
              <!--<div class="gr-4 push-1" style="text-align: left;">-->
                <!--Comment:-->
              <!--</div>-->
              <!--<div class="gr-6 push-1">-->
                <!--{{ approveHistory.comment ? approveHistory.comment : 'No comment available' }}-->
                <!--&lt;!&ndash;{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}&ndash;&gt;-->
              <!--</div>-->

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
                {{ approveHistory.actor ? approveHistory.actor.name : 'N/A' }}
                <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
              </div>
              <br>
              <div class="gr-2 text-left" style="text-align: left;">
                Time:
              </div>
              <div class="gr-3" v-if="approveHistory.actor" style="text-align: left;">
                {{ approveHistory.updateTime | date('MMM D, YYYY h:mm:ss') }}
                <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
              </div>
              <div v-else class="gr-4 push-1">
                N/A
              </div>
            </div>

            <!--<div v-else-if="verificationStatus === 'ACCEPT' && verificationType === 'VERIFY'" class="row text-center">-->
              <!--<div style="color: #5BC43C;">-->
                <!--<i class="fa fa-check"></i> VERIFIED-->
              <!--</div>-->
              <!--<br>-->
              <!--<div class="gr-4 push-1">-->
                <!--Verified By:-->
              <!--</div>-->
              <!--<div class="gr-4 push-1">-->
                <!--{{ approveHistory.actor ? approveHistory.actor.name : 'N/A' }}-->
                <!--&lt;!&ndash;{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}&ndash;&gt;-->
              <!--</div>-->
            <!--</div>-->

            <div v-else-if="(verificationStatus === 'ACCEPT' && verificationType === 'APPROVE') ||
              (verificationStatus === 'VERIFIED' && verificationType === null)" class="row text-center">
              <div style="color: #5BC43C;">
                <i class="fa fa-check"></i> VERIFIED
              </div>
              <br>
              <div class="gr-2" style="text-align: left;">
                Approved By:
              </div>
              <div class="gr-4" style="text-align: left;">
                {{ approveHistory.actor ? approveHistory.actor.name : 'N/A' }}
                <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
              </div>
              <br>
              <div class="gr-2" style="text-align: left;">
                Time:
              </div>
              <div class="gr-4" v-if="approveHistory.actor" style="text-align: left;">
                {{ approveHistory.updateTime | date('MMM D, YYYY h:mm:ss') }}
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
              (verificationStatus === 'REJECTED' || verificationStatus === 'REJECT'))">
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
      <div class="card-block" v-if="approveHistory.comment && verificationStatus !== 'NOT_VERIFIED'">
        <h4>Comment</h4>
        <br>
        {{ approveHistory.comment}}
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
        approveHistory: '',
        verificationComment: '',
        approvalComment: ''
      }
    },
    created () {
      this.init()
      console.log('verification information component created:::::')
    },
    methods: {
      init () {
        if (this.member.approveHistory.length > 0) {
          this.approveHistory = this.member.approveHistory[this.member.approveHistory.length - 1]
        } else {
          this.approveHistory = null
        }
        this.verificationStatus = this.member.basicInfo.verificationStatus
        this.verificationType = this.member.approveHistory.verificationType ? this.member.approveHistory.verificationType : null
        console.log('verification status: ', this.verificationStatus, ' verification type: ', this.verificationType,
        'approveHistory: ', this.approveHistory)
      },
      acceptVerification () {
        let request = {
          'comment': this.verificationComment,
          'status': 'ACCEPT'
        }
        console.log('verification request: ', request)
        Http.PUT('verification', request, [this.id])
          .then(
            ({data: {data: verificationResponse}}) => {
              console.log('verification request response::', verificationResponse)
              this.verificationStatus = verificationResponse.verificationStatus
              this.verificationType = verificationResponse.verificationType
              this.approveHistory = verificationResponse
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
              this.approveHistory = verificationResponse
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
              this.approveHistory = approvalResponse.data
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
              this.approveHistory = approvalResponse.data
            },
            error => {
              console.log('Error in putting approval request, error: ', error)
            }
          )
      }
    }
  }
</script>
