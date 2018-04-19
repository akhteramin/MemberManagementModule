<template>
    <div>
      
        <div class="btn-group">
            <button type="button" :class="[(infoValidationStatus == 'VALIDATED') ? 'active' : '','btn btn-xs btn-primary']" @click="validateData('VALIDATED')">{{(infoValidationStatus == 'VALIDATED') ?"Validated":"Validate"}}</button>
            <button type="button" :class="[(infoValidationStatus == 'INVALIDATED') ? 'active' : '','btn btn-xs btn-primary']" @click="validateData('INVALIDATED')">{{(infoValidationStatus == 'INVALIDATED') ?"Invalidated":"Invalidate"}}</button>
        </div>
        <span v-if="infoValidationStatus=='NOT_VALIDATED'">(yet to be validated)</span>
        <span v-else><small>{{infoValidationStatus}} By <b>{{adminValidationData}}</b></small></span>
        
        
        <div :id="'MemberInfoValidationModal_'+infoType" class="modal fade text-left" role="dialog">
                <div class="modal-dialog  modal-md">
                <!-- Modal content-->

                <div class="modal-content">
                    <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title"> Info Validation </h4>
                    </div>
                    <div class="modal-body">
                    <div class="form-group">
                        <div class="row">
                        <div class="col-md-10 col-md-offset-1">
                            <span>
                            <div class="comment">
                                <!--<span>Browse</span>-->
                                <div class="form-group">
                                  <div class="row">
                                    <div class="col-md-12" v-if="!memberValidationHistory.message" style="overflow-y: scroll; height:250px;">
                                      <div class="col-md-12 comment" v-for="history in memberValidationHistory">
                                        <ul class="chat">
                                          <li class="left clearfix"><span class="chat-img pull-left">
                                              <!--img src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar" class="img-circle" /-->
                                              </span>
                                                  <div class="chat-body clearfix">
                                                      <div class="header">
                                                          <strong :class="[(history.validationStatus == 'VALIDATED') ? 'text-success' : 'text-danger','primary-font']">{{history.validationStatus}}</strong> by <strong class="primary-font">{{ history.adminLoginId }}  </strong> <small class="pull-right text-muted">
                                                              <span class="glyphicon glyphicon-time"></span>{{history.createdAt | date('MMM D, YYYY')}}</small>
                                                      </div>
                                                      <p>
                                                          {{history.adminComment}}
                                                      </p>
                                                  </div>
                                              </li>
                                          </ul>
                                      </div>
                                    </div>
                                    <div class="col-md-12" v-else>
                                      {{memberValidationHistory.message}}
                                    </div>
                                    <div class="col-md-8 col-md-offset-2 margin-10">
                                        <span>
                                          <b>Are you sure you want to {{infoValidationType}} this data?</b>
                                          <textarea v-model="memberInfoValidateComment" placeholder="Enter message (Max. 200 character)" rows="2" cols="50" maxlength="200" required></textarea>

                                        <!-- <input id="uploadFile3" placeholder="Choose File" disabled="disabled" /> -->
                                        </span>
                                    </div>
                                  </div>
                                </div>
                            </div>
                            </span>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-default btn-active-til" @click="confirmInfoValidation(infoType)" data-dismiss="modal">Yes</button>
                    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">No</button>
                    </div>
                </div>
                </div>
            </div>

        
        </div>
    </div>
</template>

<script>
import Http from '../../services/Http'
export default {
  name: 'MemberInfoValidation',
  props: [
    'id',
    'infoType',
    'infoValidationStatus',
    'adminValidationData'
  ],
  data () {
    return {
      memberInfoValidateComment:'',
      infoValidationType:'',
      infoTypeData:'',
      memberValidationHistory:{}
    }
  },
  created () {
    console.log('member validation with id: ', this.id)
    console.log('member validation with type: ', this.infoType)
    console.log('member validation with status: ', this.infoValidationStatus)
    
    this.init()
  },
  methods: {
    init () {
        this.infoValidationType=this.infoValidationStatus
        this.infoTypeData=this.infoType
      
    },
    validateData: function (validityType) {
        console.log("info type data::",this.infoType)
        this.infoValidationType = validityType
        // this.infoTypeData = this.infoType
        this.showLoader = true
        Http.GET('memberValidation', ['history',this.id, this.infoType])
          .then(
            ({data: validationHistory}) => {
              this.showLoader = false
              console.log("valid history",validationHistory)
              this.memberValidationHistory= validationHistory.validationHistoryList
            },
            error => {
              this.showLoader = false
              console.log('Error in getting list of verification history, error: ', error.response.data)
              this.memberValidationHistory=error.response.data
            }
           )
        $('#MemberInfoValidationModal_'+this.infoType).modal('show')
    },
    confirmInfoValidation: function (memberInfoType) {
        let user = JSON.parse(localStorage.getItem('user'))
        console.log("info type data::",memberInfoType)
        let paramData = {
          "accountId": this.id,
          "adminLoginId": user.loginID,
          "comment": this.memberInfoValidateComment,
          "infoType": memberInfoType,
          "validationStatus": this.infoValidationType
        }
        this.showLoader = true
        Http.POST('memberValidation', paramData, [])
        .then(
          ({data: validationData}) => {
            this.showLoader = false
            this.memberInfoValidateComment = ''
            $.notify({
              // options
              title: '<strong>Success!</strong>',
              message: this.infoValidationType
            }, {
              // settings
              type: 'success',
              delay: 3000
            })
            console.log('account validation data::', this.infoValidationType)
            this.updateInfoValidation()
          },
          error => {
            this.showLoader = false
            $.notify({
              // options
              title: '<strong>Info Validation failed!</strong>',
              message: 'Please try again.'
            }, {
              // settings
              type: 'danger',
              delay: 3000
            })
            console.log('Error info validation change: ', error)
            this.updateInfoValidation()
          }
        )
        
      },
      updateInfoValidation () {
        this.$emit('update', 'false')
      }
    
  }

}
</script>