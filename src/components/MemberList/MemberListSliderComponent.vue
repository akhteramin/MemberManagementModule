<template>
    <div class="custom-scrollable slider">
      <!--Here is memberProfile: {{ this.memberBasicDetails }}-->

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

        <div class="gr-12" v-if="profileDetails">
            <div class="gr-6">
                    <h5>Update Profile</h5>
            </div>
            <div class="gr-6 push-4">
                    <i class="fa fa-external-link black" aria-hidden="true" @click="memberDetails(memberProfile.accountId,memberProfile.accountType)"></i>
                    <i class="fa fa-window-close" aria-hidden="true" @click="hideProfile()"></i>
            </div>
            <hr>
            <div class="gr-2">
            <span v-if="memberProfile.userPictureResponses[0]">
                <img :src="imageBaseUrl+memberProfile.userPictureResponses[0].url" class="img-rounded" alt="Profile Picture" width="70" height="80"
                     onerror="onerror=null; src='/static/images/default-original.jpg';">
            </span>
            <span v-else>
                <img src="/static/images/default-original.jpg" class="img-rounded" alt="N/A" width="70" height="80"
                     onerror="onerror=null; src='/static/images/default-original.jpg';">
            </span>
            </div>
            <div class="gr-10">
                <div class="gr-3">
                    <button class="button-banner-label-text padding-2" >{{memberProfile.verificationStatus | underscoreless}}</button>
                </div>
                <div class="gr-2 push-7" v-if="memberProfile.accountType===2">
                    <!--button class="button-edit">Edit <i class="fa fa-pencil-square-o"></i></button-->

                </div>
                <div class="gr-12 small-text">
                    <b v-if="memberProfile.accountType == 2">Business Name: {{member.businessDetails.businessBasicInfo.businessName}}<br></b>
                    <b>{{memberProfile.name}}</b>
                    <span class="banner-text" v-if="memberProfile.accountType == 1">(Personal)</span>
                    <span class="banner-text" v-else>(Business)</span>
                    <span>{{memberProfile.profileCompletionScore}}%</span>
                    <br>{{memberProfile.mobileNumber}}
                    <br>{{memberAccountClass}}

                </div>

            </div>
            <div class="gr-12 small-text" v-if="containsPermission('MS_MM_USER_IS_VERIFIABLE')">
                <div class="gr-12 panel-label"><b>Missing Information</b></div>
                <div class="gr-12 text-center" v-if="memberMissingInfo.isVerifiable">
                    No missing Information.This Member is <b>Verifiable</b>.
                </div>
                <div class="gr-12" v-else>
                    <div class="gr-6" v-for="missingInfo in memberMissingInfo.missingInformation">
                        <span><b>
                            -{{missingInfo | underscoreless}}
                        </b></span>
                    </div>

                </div>
            </div>
            <div class="gr-12 small-text min-height-slider"
                 v-if="memberDocuments && containsPermission('MS_MM_USER_GET_IDENTIFICATION_DOCUMENTS')">
                <div class="gr-12 panel-label"><b>Identification Documents</b></div>
                <div v-if="memberDocuments.length > 0">
                  <div class="row margin-5" v-for="memberDocument in memberDocuments">
                      <div class="gr-5 text-center padding-2">
                          <img :src="imageBaseUrl+memberDocument.documentPages[0].url"
                          v-if="!isPdf(memberDocument.documentPages[0].url)"
                          class="img-rounded" onerror="onerror=null; src='/static/images/default-document-icon.png'" width="140" height="80"
                          @click="showDocumentDetails(memberDocument)">

                          <i v-if="isPdf(memberDocument.documentPages[0].url)"
                          class="fa fa-file-pdf-o font-size-50"
                          alt="PDF"
                          aria-hidden="true"
                          @click="showDocumentDetails(memberDocument)"></i>
                      </div>
                      <div class="gr-7">
                          <b>{{memberDocument.documentType | underscoreless}}</b>
                          <i v-if="memberDocument.documentVerificationStatus=='VERIFIED'"  class="fa fa-check-circle-o banner-text" aria-hidden="true"></i>
                          <br>{{memberDocument.documentIdNumber}}
                          <br>
                          <span v-if="memberDocument.documentVerificationStatus=='NOT_VERIFIED'">
                              <button class="button-small-edit" :disabled="!containsPermission('MS_MM_USER_ADD_DOC')"
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
                              <button class="button-small-verify" :disabled="!containsPermission('MS_MM_USER_VERIFICATION_DOCUMENT')"
                              data-toggle="modal" data-target="#DocumentVerificationModal" data-backdrop="false"
                              @click="setDocument(memberDocument)">
                              Verify
                              <i class="fa fa-check-circle-o" aria-hidden="true"></i>
                              </button>
                          </span>
                          <span v-else>
                            <button class="button-small-verify width-90" :disabled="!containsPermission('MS_MM_USER_VERIFICATION_DOCUMENT')"
                            data-toggle="modal" data-target="#DocumentUnverificationModal" data-backdrop="false"
                            @click="setDocumentUnverify(memberDocument)">
                            Unverify
                            <i class="fa fa-times" aria-hidden="true"></i>
                            </button>
                          </span>
                      </div>
                  </div>
                </div>
                <div v-else>
                  <strong class="primary-font">N/A</strong>
                </div>
            </div>
            <div class="gr-12 small-text" v-if="
              containsPermission('MS_MM_USER_GET_INTRODUCER_LIST') &&
              containsPermission('MS_MM_USER_GET_LIKELY_NAMES') &&
              containsPermission('MS_MM_USER_GET_INVITED_LIST')">

                    <div class="row container side-nav">
                        <ul class="nav nav-tabs">
                            <li class="text-center active">
                                <a class="black-text" data-toggle="tab" href="#introducedBy">Introduced <br>By</a>
                            </li>
                            <!--<li class="col-md-3 text-center" ng-click="setType('approved')"><a data-toggle="tab" >Approved</a></li>-->
                            <li class="text-center">
                                <a class="black-text" data-toggle="tab" href="#hasIntroduced" @click="loadMemberIntroduced(memberProfile.accountId)">Has <br> Introduced</a>
                            </li>
                            <li class="text-center">
                                <a class="black-text" data-toggle="tab" href="#invitedBy" @click="loadMemberInvitedBy(memberProfile.accountId)">Invited<br>By</a>
                            </li>
                            <li class="text-center">
                              <a class="black-text" data-toggle="tab" href="#likelyNames" @click="loadMemberLikelyNames(memberProfile.mobileNumber)">Likely<br>Names</a>
                            </li>
                        </ul>
                        <div class="tab-content">
                            <div id="introducedBy" class="tab-pane fade in active padding-4">
                                <div class="gr-4 text-center" v-if="memberIntroducers && memberIntroducers.length > 0">
                                    <div class="gr-6 padding-5" v-for="memberIntroducer in memberIntroducers">
                                            <img :src="imageBaseUrl+memberIntroducer.profilePictureUrl"
                                                 class="img-circle" alt="Profile Picture" width="80" height="80"
                                                 onerror="this.onerror=null;this.src='/static/images/default-profile-180x180.png'">
                                            <br><b>{{memberIntroducer.name}}</b>
                                            <br>{{memberIntroducer.mobileNumber}}
                                    </div>
                                </div>
                                <div class="gr-4 text-left" v-else>
                                  <strong class="primary-font">N/A</strong>
                                </div>
                            </div>
                            <div id="hasIntroduced" class="tab-pane fade  padding-4">
                                <div class="gr-4 text-center" v-if="membersIntroduced && membersIntroduced.length > 0">
                                    <div class="gr-6 padding-5" v-for="memberIntroduced in membersIntroduced">
                                            <img :src="imageBaseUrl+memberIntroduced.profilePictureUrl" class="img-circle"
                                                 alt="Profile Picture" width="80" height="80"
                                                 onerror="this.onerror=null;this.src='/static/images/default-profile-180x180.png'">
                                            <br><b>{{memberIntroduced.name}}</b>
                                            <br>{{memberIntroduced.mobileNumber}}

                                    </div>
                                </div>
                                <div class="gr-4 text-left" v-else>
                                  <strong class="primary-font">N/A</strong>
                                </div>
                            </div>
                            <div id="invitedBy" class="tab-pane fade  padding-4">
                                <div class="gr-4 text-center" v-if="membersInvitedBy && membersInvitedBy.length > 0">
                                    <div class="gr-6 padding-5" v-for="memberInvitedBy in membersInvitedBy">
                                            <img :src="imageBaseUrl+memberInvitedBy.profilePictureUrl"
                                                 class="img-circle" alt="Profile Picture" width="80" height="80"
                                                 onerror="this.onerror=null;this.src='/static/images/default-profile-180x180.png'">
                                            <br><b>{{memberInvitedBy.name}}</b>
                                            <br>{{memberInvitedBy.mobileNumber}}

                                    </div>
                                </div>
                                <div class="gr-4 text-left" v-else>
                                  <strong class="primary-font">N/A</strong>
                                </div>
                            </div>
                            <div id="likelyNames" class="tab-pane fade  padding-4">
                              <div class="gr-4 text-center" v-if="likelyNameList && likelyNameList.length > 0">
                                  <table lass="table ui celled hover" cellspacing="0" width="100%">
                                    <thead>
                                    <tr>
                                      <th class="text-center">Name</th>
                                      <th class="text-center">Frequency</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="entry in likelyNameList">

                                      <td class="text-center">{{ entry.name }}</td>

                                      <td class="text-center">{{ entry.frequency }}</td>

                                    </tr>
                                    </tbody>
                                  </table>
                                </div>
                                <div class="gr-4 text-left" v-else>
                                  <strong class="primary-font">N/A</strong>
                                </div>
                              </div>
                            </div>
                        </div>
                    </div>
                </div>
            <div class="gr-12 small-text" v-if="memberBasicDetails.basicInfo && profileDetails">
              <member-verify-and-approve-component
                :id = "memberBasicDetails.basicInfo.accountId"
                :member = "memberBasicDetails">

              </member-verify-and-approve-component>
            </div>


        <div class="gr-12" v-else-if="containsPermission('MS_MM_USER_GET_SPECIFIC_DOCUMENTS')">
            <div class="gr-2 padding-5">
            <i class="fa fa-arrow-left" aria-hidden="true" @click="showDocumentDetails(memberDocumentDetail)"></i>
            </div>
            <div class="gr-10">
            <h5>{{memberDocumentDetail.documentType | underscoreless}}</h5>
            </div>
            <hr>
            <div class="gr-12">
                <img v-if="!isPdf(memberDocumentDetail.documentPages[0].url)"
                :src="imageBaseUrl+memberDocumentDetail.documentPages[0].url"
                class="img-rounded" alt="Documents" width="350" height="200">

                <iframe v-if="isPdf(memberDocumentDetail.documentPages[0].url)"
                :src="imageBaseUrl+memberDocumentDetail.documentPages[0].url" width="350" height="200"></iframe>

            </div>
            <br>
            <div class="gr-7 margin-top-10">
                <i v-if="memberDocumentDetail.documentVerificationStatus=='VERIFIED'"  class="fa fa-check-circle-o banner-text" aria-hidden="true"></i>
                <br>{{memberDocumentDetail.documentIdNumber}}
                <br>
                <span v-if="memberDocumentDetail.documentVerificationStatus=='NOT_VERIFIED'">
                <button class="button-md-edit" :disabled="!containsPermission('MS_MM_USER_ADD_DOC')"
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
                <button class="button-md-verify" :disabled="!containsPermission('MS_MM_USER_VERIFICATION_DOCUMENT')"
                        data-toggle="modal" data-target="#DocumentVerificationModal" data-backdrop="false"
                        @click="setDocument(memberDocumentDetail)">
                        Verify
                        <i class="fa fa-check-circle-o" aria-hidden="true"></i>
                </button>
                </span>
                <span v-else>
                  <button class="button-small-verify width-90" :disabled="!containsPermission('MS_MM_USER_VERIFICATION_DOCUMENT')"
                  data-toggle="modal" data-target="#DocumentUnverificationModal" data-backdrop="false"
                  @click= "setDocumentUnverify(memberDocument)">
                  Unverify
                  <i class="fa fa-times" aria-hidden="true"></i>
                  </button>
                </span>
            </div>
            <div class="gr-12 margin-top-10" v-if="documentDetails.histories && containsPermission('MS_MM_USER_GET_SPECIFIC_DOCUMENTS')">
                <div class="gr-12 comment" v-for="history in documentDetails.histories">
                   <ul class="chat">
                    <li class="left clearfix"><span class="chat-img pull-left">
                        <!--img src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar" class="img-circle" /-->
                        </span>
                            <div class="chat-body clearfix">
                                <div class="header">
                                    <strong class="primary-font">{{history.verificationStatus}}</strong> by <strong class="primary-font">{{history.adminLoginId ? history.adminLoginId : 'Legacy Admin User'}}  </strong> <small class="pull-right text-muted">
                                        <span class="glyphicon glyphicon-time"></span>{{history.createdAt | date('MMM D, YYYY')}}</small>
                                </div>
                                <p>
                                    {{history.comment}}
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>
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
                    <div class="col-md-8 col-md-offset-2">
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

        <div id="DocumentUnverificationModal" class="modal-slider modal fade" role="dialog">
            <div class="modal-dialog  modal-md">
            <!-- Modal content-->

            <div class="modal-content">
                <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" >&times;</button>
                <h4 class="modal-title"> {{paramData.documentType | underscoreless}} Unverification </h4>
                </div>
                <div class="modal-body">
                <div class="form-group">
                    <div class="row">
                    <div class="col-md-8 col-md-offset-2">
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

                <button type="submit" class="btn btn-sm btn-default btn-active-til" data-dismiss="modal" @click="verifyDocument()">Unverify</button>
                <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Cancel</button>
                </div>
            </div>
            </div>
        </div>

    </div>
</template>

<script>
  import Http from '../../services/Http'
  import UpdateMemberIdentificationDocument from '../MemberProfile/UpdateMemberIdentificationDocumentComponent.vue'
  import MemberVerifyAndApproveComponent from '../MemberProfile/MemberVerifyAndApproveComponent.vue'
  import route from '../../router'

  export default {
    name: 'MemberListSlider',
    props: [
      'id',
      'memberBasicDetails',
      'memberProfile',
      'memberDocuments',
      'memberIntroducers',
      'memberMissingInfo'
    ],
    components: {
      MemberVerifyAndApproveComponent,
      'update-member-identification-document': UpdateMemberIdentificationDocument,
      'member-verify-and-approve-component': MemberVerifyAndApproveComponent
    },
    data () {
      return {
        imageBaseUrl: '',
        membersIntroduced: '',
        membersInvitedBy: '',
        likelyNameList: null,
        paramData: {
          comment: '',
          documentIdNumber: '',
          documentType: '',
          documentVerificationStatus: ''
        },
        memberDocumentDetail: {},
        profileDetails: true,
        documentDetails: {},
        accessControlList: [],
        member: {},
        showLoader: false,
        memberAccountClass: 'GENERAL'
      }
    },
    created () {
      console.log('member slider component created:: member profile is: ', this.memberProfile)
      this.init()
    },
    watch: {
      id: function () {
        this.init()
      }
    },
    methods: {
      containsPermission (permission) {
        return this.accessControlList.indexOf(permission) > -1
      },
      init () {
        console.log('Slider loaded....')
        this.backgroundBlock()
        this.imageBaseUrl = Http.IMAGE_URL
        this.showLoader = true
        this.accessControlList = localStorage.getItem('accessControlList')
        this.accessControlList = this.accessControlList.split(',')
        Http.GET('member', [this.memberProfile.accountId, 'basic-details'])
          .then(
            ({data: {data: member}}) => {
              this.showLoader = false
              this.member = member
              console.log('In slider component, member basic details: ', this.member)
              if (member.basicInfo.accountClass === 5) {
                this.memberAccountClass = 'VERIFIED GENERAL'
              } else if (member.basicInfo.accountClass === 3) {
                this.memberAccountClass = 'PLATINUM'
              } else if (member.basicInfo.accountClass === 2) {
                this.memberAccountClass = 'GOLD'
              }
            },
            error => {
              this.showLoader = false
              console.log('Error in loading member basic details for slider... ', error)
            }
          )
      },
      loadMemberIntroduced: function (accountId) {
        this.showLoader = true
        Http.GET('member', [accountId, 'introduced'])
          .then(
            ({data: {introducedList: introduced}}) => {
              this.showLoader = false
              this.membersIntroduced = introduced
              console.log('Got the list of introduced: ', this.membersIntroduced)
            },
            error => {
              this.showLoader = false
              console.log('Error in getting the list of introduced, error: ', error)
            }
          )
      },
      loadMemberInvitedBy: function (accountId) {
        this.showLoader = true
        Http.GET('member', [accountId, 'inviters'])
          .then(
            ({data: {data: invited}}) => {
              this.showLoader = false
              this.membersInvitedBy = invited
              console.log('Got the list of inviters: ', this.membersInvitedBy)
            },
            error => {
              console.log('Error in getting the list of inviters, error: ', error)
            }
          )
      },
      loadIdentificationDocument: function (accountId) {
        this.showLoader = true
        console.log('has permission for identification document: ',
          this.containsPermission('MS_MM_USER_GET_IDENTIFICATION_DOCUMENTS'))
        Http.GET('member', [accountId, 'identification-documents'])
        .then(
            ({data: {list: documents}}) => {
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
      },
      loadMemberLikelyNames (mobileNumber) {
        this.showLoader = true
        let parameter = {
          'mobileNumber': mobileNumber
        }
        Http.GET('member', ['likely-names'], parameter)
          .then(({data: likely_names}) => {
            this.showLoader = false
            this.likelyNameList = likely_names.likelyNameList
            console.log('Success, got likely names: ', this.likelyNameList)
          }, error => {
            this.showLoader = false
            console.error('Error in getting likely names: ', error)
          })
      },
      getDocumentDetails: function (documentID) {
        this.showLoader = true
        Http.GET('member', ['identification-document', documentID])
        .then(
            ({data: {data: documentDetail}}) => {
              this.showLoader = false
              this.documentDetails = documentDetail
              console.log('documentDetail:', documentDetail)
            },
            error => {
              this.showLoader = false
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
      setDocumentUnverify (document) {
        console.log(document)
        this.paramData = {
          documentIdNumber: document.documentIdNumber,
          documentType: document.documentType,
          documentVerificationStatus: 'NOT_VERIFIED',
          documentID: document.id
        }
      },
      verifyDocument () {
        console.log('param data ::', this.paramData)
        this.showLoader = true
        Http.PUT('verification', this.paramData, [this.memberProfile.accountId, 'document', this.paramData.documentID])
        .then(
          ({data: documentData}) => {
            this.showLoader = false
            console.log('document data::', documentData)
            this.loadIdentificationDocument(this.memberProfile.accountId)
          },
          error => {
            this.showLoader = false
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
        route.push({
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
      backgroundBlock () {
        console.log('block back ground')
        $('#memberlist-table').addClass('background-nonclickable')
        $('#seachFilter').addClass('background-nonclickable')
      },
      hideProfile () {
        $('#memberlist-table').removeClass('background-nonclickable')
        $('#seachFilter').removeClass('background-nonclickable')
        this.$emit('update', 'false')
      }
    }
}
</script>
