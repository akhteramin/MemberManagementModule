<template>
    <div class="slider">
        <div class="gr-12" v-if="profileDetails">
            <div class="gr-6">
                    <h5>Update Profile</h5>
            </div>
            <div class="gr-6 push-4">
                    <i class="fa fa-external-link" style="color:black" aria-hidden="true" @click="memberDetails(memberProfile.accountId,memberProfile.accountType)"></i>
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
                <div class="gr-3">
                    <button class="button-banner padding-2" >{{memberProfile.verificationStatus}}</button>
                </div>
                <div class="gr-2 push-7" v-if="memberProfile.accountType===2">
                    <!--button class="button-edit">Edit <i class="fa fa-pencil-square-o"></i></button-->

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
                <div class="gr-12 text-center" v-if="memberMissingInfo.isVerifiable">
                    No missing Information.This Member is <b>Verifiable</b>.
                </div>
                <div class="gr-12" v-else>
                    <div class="gr-6" v-for="missingInfo in memberMissingInfo.missingInformation">
                        <span class="text-ash">
                            -{{missingInfo | underscoreless}}
                        </span>
                    </div>

                </div>
            </div>
            <div class="gr-12 small-text min-height-slider" v-if="memberDocuments">
                <b>Identification Document</b>
                <hr>
                <div class="row margin-5" v-for="memberDocument in memberDocuments">
                    <div class="gr-5 text-center padding-2">
                        <img :src="imageBaseUrl+memberDocument.documentUrl"
                        v-if="!isPdf(memberDocument.documentUrl)"
                        class="img-rounded" alt="Documents" width="140" height="80"
                        @click="showDocumentDetails(memberDocument)">

                        <i v-if="isPdf(memberDocument.documentUrl)"
                        class="fa fa-file-pdf-o"
                        style="font-size:50px;"
                        aria-hidden="true"
                        @click="showDocumentDetails(memberDocument)"></i>
                    </div>
                    <div class="gr-7">
                        <b>{{memberDocument.documentType | underscoreless}}</b>
                        <i v-if="memberDocument.documentVerificationStatus=='VERIFIED'"  class="fa fa-check-circle-o banner-text" aria-hidden="true"></i>
                        <br>{{memberDocument.documentIdNumber}}
                        <br>Updated On:12/05/2017
                        <br>
                        <span v-if="memberDocument.documentVerificationStatus=='NOT_VERIFIED'">
                            <button class="button-small-edit"
                             data-toggle="modal" :data-target="`#ChangeDocumentModal${memberDocument.id}`"
                             data-backdrop="false">
                             <i class="fa fa-pencil-square-o"></i>
                             Edit
                            </button>
                            <div :id="`ChangeDocumentModal${memberDocument.id}`" class="modal fade modal-slider" role="dialog">
                                <update-member-identification-document
                                :document="memberDocument"
                                :id="memberProfile.accountId"
                                @update="editIdentificationDocument">
                                </update-member-identification-document>
                            </div>
                            <button class="button-small-verify"
                            data-toggle="modal" data-target="#DocumentVerificationModal" data-backdrop="false"
                            @click= "setDocument(memberDocument)">
                            Verify
                            <i class="fa fa-check-circle-o" aria-hidden="true"></i>
                            </button>
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
        <div class="gr-12" v-else>
            <div class="gr-2 padding-5">
            <i class="fa fa-arrow-left" aria-hidden="true" @click="showDocumentDetails(memberDocumentDetail)"></i>
            </div>
            <div class="gr-10">
            <h5>{{memberDocumentDetail.documentType | underscoreless}}</h5>
            </div>
            <hr>
            <div class="gr-12">
                <img v-if="!isPdf(memberDocumentDetail.documentUrl)"
                :src="imageBaseUrl+memberDocumentDetail.documentUrl"
                class="img-rounded" alt="Documents" width="350" height="200">

                <iframe v-if="isPdf(memberDocumentDetail.documentUrl)"
                :src="imageBaseUrl+memberDocumentDetail.documentUrl" width="350" height="200"></iframe>

            </div>
            <br>
            <div class="gr-12" v-if="documentDetails.histories">
                <div class="gr-12 comment" v-for="history in documentDetails.histories">
                   <ul class="chat">
                    <li class="left clearfix"><span class="chat-img pull-left">
                        <!--img src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar" class="img-circle" /-->
                        </span>
                            <div class="chat-body clearfix">
                                <div class="header">
                                    <strong class="primary-font">{{history.verificationStatus}}</strong> by <strong class="primary-font">{{history.verifier.name}}  </strong> <small class="pull-right text-muted">
                                        <span class="glyphicon glyphicon-time"></span>{{history.creationTime | date('MMM D, YYYY')}}</small>
                                </div>
                                <p>
                                    {{history.comment}}
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="gr-7">
                <i v-if="memberDocumentDetail.documentVerificationStatus=='VERIFIED'"  class="fa fa-check-circle-o banner-text" aria-hidden="true"></i>
                <br>{{memberDocumentDetail.documentIdNumber}}
                <br>Updated On:12/05/2017
                <br>
                <span v-if="memberDocumentDetail.documentVerificationStatus=='NOT_VERIFIED'">
                <button class="button-md-edit"
                data-toggle="modal" :data-target="`#ChangeDocumentModal${memberDocumentDetail.id}`"
                             data-backdrop="false">
                             <i class="fa fa-pencil-square-o"></i>
                             Edit
                </button>
                <div :id="`ChangeDocumentModal${memberDocumentDetail.id}`" class="modal-slider modal fade" role="dialog">
                    <update-member-identification-document
                    :document="memberDocumentDetail"
                    :id="memberProfile.accountId"
                    @update="editIdentificationDocument">
                    </update-member-identification-document>
                </div>
                <button class="button-md-verify"
                        data-toggle="modal" data-target="#DocumentVerificationModal" data-backdrop="false"
                        @click= "setDocument(memberDocumentDetail)">
                        Verify
                        <i class="fa fa-check-circle-o" aria-hidden="true"></i>
                </button>
                </span>
            </div>
        </div>


        <div id="DocumentVerificationModal" class="modal-slider modal fade" role="dialog">
            <div class="modal-dialog  modal-md">
            <!-- Modal content-->

            <div class="modal-content">
                <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" >&times;</button>
                <h4 class="modal-title"> {{paramData.documentType | underscoreless}} Verification </h4>
                </div>
                <div class="modal-body">
                <div class="form-group">
                    <div class="row">
                    <div class="col-md-4 col-md-offset-3">
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
                </div>
                <div class="modal-footer">

                <button type="submit" class="btn btn-sm btn-default btn-active-til" data-dismiss="modal" @click="verifyDocument()">Verify</button>
                <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Cancel</button>
                </div>
            </div>
            </div>
        </div>



        </div>

    </div>
</template>

<script>
  import Http from '../services/Http'
  import router from '../router/index'
  import UpdateMemberIdentificationDocument from './UpdateMemberIdentificationDocumentComponent.vue'
  export default {
    name: 'MemberListSlider',
    props: [
      'memberProfile',
      'memberDocuments',
      'memberIntroducers',
      'memberMissingInfo'
    ],
    components: {
      'update-member-identification-document': UpdateMemberIdentificationDocument
    },
    data () {
      return {
        imageBaseUrl: '',
        membersIntroduced: '',
        membersInvitedBy: '',
        paramData: {
          comment: '',
          documentIdNumber: '',
          documentType: '',
          documentVerificationStatus: ''
        },
        memberDocumentDetail: {},
        profileDetails: true,
        documentDetails: {}
      }
    },
    created () {
      console.log('document created::::')
      this.init()
    },
    methods: {
      init () {
        this.imageBaseUrl = Http.IMAGE_URL
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
      loadIdentificationDocument: function (accountId) {
        Http.GET('member', [accountId, 'identification-documents'])
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
      },
      getDocumentDetails: function (documentID) {
        Http.GET('member', ['identification-document', documentID])
        .then(
            ({data: {data: documentDetail}}) => {
              this.documentDetails = documentDetail
              console.log('documentDetail:', documentDetail)
            },
            error => {
              console.log('Error in getting list of identification documents, error: ', error)
            }
        )
      },
      setDocument (document) {
        console.log(document)
        this.paramData = {
          documentIdNumber: document.documentIdNumber,
          documentType: document.documentType,
          documentVerificationStatus: 'VERIFIED',
          documentID: document.id
        }
      },
      verifyDocument () {
        console.log('param data ::', this.paramData)
        Http.PUT('verification', this.paramData, [this.memberProfile.accountId, 'document', this.paramData.documentID])
        .then(
          ({data: documentData}) => {
            console.log('document data::', documentData)
            this.loadIdentificationDocument(this.memberProfile.accountId)
          },
          error => {
            console.log('Error vrification of document: ', error)
          }
        )
      },
      editIdentificationDocument (param = 'false') {
        this.loadIdentificationDocument(this.memberProfile.accountId)
      },
      showDocumentDetails: function (document) {
        this.memberDocumentDetail = document
        console.log(document)
        if (this.profileDetails) {
          this.profileDetails = false
          this.getDocumentDetails(document.id)
        } else {
          this.profileDetails = true
        }
      },
      memberDetails (value, accntType) {
        console.log('Okay, I am doing it now!!!, value: ', value, accntType)
        // router.push(`./member/${value}`)
        router.push({
          name: 'MemberIndividualComponent',
          params: {id: value, accountType: accntType}
        })
      },
      isPdf (fileName) {
        if (fileName) {
          var ext = fileName.substr(fileName.lastIndexOf('.') + 1)
          if (ext === 'pdf') {
            console.log('returning trueeee')
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      },
      hideProfile () {
        this.$emit('update', 'false')
      }
    }
}
</script>
