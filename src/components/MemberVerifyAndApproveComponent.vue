<template>
  <div>
    <div class="gr-10" style="text-align: center;">
      <h5><b>Verification</b></h5>
    </div>
    <div class="gr-8 push-1">
      <table class="table table-bordered">
        <tbody>
        <tr>
          <td style="width:50%;">
            <form v-on:submit.prevent="acceptVerification" v-on:reset.prevent="rejectVerification">
              <br>
              <div class="row text-center" v-if="verificationStatus === 'NOT_VERIFIED'" style="color: red;">
                NOT VERIFIED
                <br> <br>
                <textarea v-model="verificationComment" placeholder="Enter comment" required
                style="color: black; width: 300px; height: 150px;"></textarea>
                <div>
                  <div class="form-group">
                    <button type="submit" class="button-md-verify" style="width: 90px; height: 32px;">
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


            <div v-else-if="verificationStatus === 'IN_PROGRESS'" class="row text-center" >
              <div style="color: #eb9316;">
                IN PROGRESS
              </div>
              <br>
              <div class="gr-4 push-1">
                Verified By:
              </div>
              <div class="gr-4 push-1">
                Joomla
                <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
              </div>
            </div>

            <div v-else-if="verificationStatus === 'REJECTED'" class="row justify-content-center text-center">
              <div style="color: red;">
                <i class="fa fa-times"></i> REJECTED
              </div>
              <br>
              <div class="gr-4 push-1">
                Rejected By:
              </div>
              <div class="gr-4 push-1">
                Joomla 2
                <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
              </div>
            </div>

            <div v-else class="row text-center">
              <div style="color: #5BC43C;">
                <i class="fa fa-check"></i> VERIFIED
              </div>
              <br>
              <div class="gr-4 push-1">
                Verified By:
              </div>
              <div class="gr-4 push-1">
                Joomla 3
                <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
              </div>
            </div>
           </form>

          </td>




          <td>
            <br>
            <form v-on:submit.prevent="acceptApproval" v-on:reset.prevent="rejectApproval">

              <div v-if="verificationStatus === 'IN_PROGRESS'" class="row text-center">
                <div style="color: red;">
                  <i class="fa fa-times"></i> NOT APPROVED
                </div>
                <br> <br>
                <textarea v-model="approvalComment" placeholder="Enter comment" required
                          style="color: black; width: 300px; height: 150px;"></textarea>

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

              <div v-else-if="verificationStatus === 'VERIFIED'" class="row text-center">
                <div style="color: #5BC43C;">
                  <i class="fa fa-check"></i> APPROVED
                </div>
                <br>
                <div class="gr-5 push-1">
                  Approved By:
                </div>
                <div class="gr-4 push-1">
                  Joomla 4
                  <!--{{ verificationHistory ? verificationHistory.actor.name : 'N/A' }}-->
                </div>
              </div>

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
    </div>
  </div>
</template>

<script>
  import Http from '../services/Http'
  export default {
    name: 'MemberVerifyAndApproveComponent',
    props: [
      'id',
      'verificationStatus',
      'verificationHistory'
    ],
    data () {
      return {
        verificationComment: '',
        approvalComment: ''
      }
    },
    methods: {
      acceptVerification () {
        let request = {
          'comment': this.verificationComment,
          'status': 'ACCEPT'
        }
        console.log('verification request: ', request)
        Http.PUT('verification', request, [this.id])
          .then(
            ({data: verificationResponse}) => {
              console.log('verification request response::', verificationResponse)
              this.verificationStatus = verificationResponse.verificationStatus
            },
            error => {
              console.log('Error in putting verification request, error: ', error)
            }
          )
      },
      rejectVerification () {
        let ok = 2
        return ok
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
              console.log('verification request response::', approvalResponse)
              this.verificationStatus = approvalResponse.verificationStatus
            },
            error => {
              console.log('Error in putting approval request, error: ', error)
            }
          )
      },
      rejectApproval () {
        return 4
      }
    }
  }
</script>
