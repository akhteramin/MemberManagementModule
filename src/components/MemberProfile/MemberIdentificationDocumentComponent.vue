 <template>
    <div class="justify-content-center">
        <div class="gr-12 panel-label">
          <label class="text-label"><b>Identification Documents</b></label>
        </div>
        <div class="gr-11 padding-5">
            <div class="text-center" v-if="documents === null || documents.length === 0">
              No Document has been uploaded.
            </div>
            <div v-else class="small-scrollable">
            <table class="table ui celled hover" cellspacing="0" width="100%">
                <thead class="thead-default">
                <tr>
                <th class = "text-center">Type</th>
                <th class = "text-center">Document No.</th>
                <th class = "text-center">Document</th>
                <th class = "text-center">Verification Status</th>
                <th class = "text-center" v-if="containsPermission('MS_MM_USER_ADD_DOC')">Action</th>
                <th class = "text-center">History</th>

                </tr>
                </thead>
                <tbody>
                <tr class = "text-center" v-for="item in documents">
                <td>
                  <span class="margin-10">
                    {{ item.documentType ? item.documentType : 'N/A' | underscoreless}}
                  </span>
                </td>
                <td>
                  <span class="margin-10">
                    {{ item.documentIdNumber ? item.documentIdNumber : 'N/A' }}
                  </span>
                </td>
                <td>
                  <table>
                  <tbody>
                  <tr>
                    <td v-for="page in item.documentPages">
                      <button data-toggle="modal" data-target="#DocumentPreviewModal" data-backdrop="false" @click="setPreviewDocument(page)">
                        <img default-src="/static/images/default-document-icon.png"
                        v-if="!isPdf(page.url)"
                        :src="documentBaseUrl + page.url"
                        onerror="onerror=null; src='/static/images/default-document-icon.png'"
                        height="50"
                        width="auto"
                        class="img-rounded">
                        <i v-if="isPdf(page.url)"
                        class="fa fa-file-pdf-o font-size-50"
                        alt="PDF"
                        aria-hidden="true"></i>
                      </button>
                    </td>
                  </tr>
                  </tbody>
                  </table>
                </td>
                <!-- <td>{{ item.documentVerificationStatus | underscoreless }}</td> -->
                <td>
                  <span class="margin-10" v-if="item.documentVerificationStatus === 'VERIFIED'">
                    <i class="fa fa-check-circle-o banner-text fa-lg"></i>
                  </span>
                  <span class="margin-10" v-else-if="item.documentVerificationStatus === 'NOT_VERIFIED'">
                    <i class="fa fa-times-circle-o fa-lg" style="color: red"></i>
                  </span>
                </td>
                <td>
                  <span>

                  <button :disabled="!containsPermission('MS_MM_USER_ADD_DOC')" data-toggle="modal" :data-target="`#ChangeDocumentModal${item.id}`"
                  class="button-md-verify" data-backdrop="false"><i class="fa fa-pencil-square-o"></i> Edit </button>
                    <div :id="`ChangeDocumentModal${item.id}`" class="modal fade" role="dialog">
                      <update-member-identification-document
                      :document="item"
                      :id="id"
                      @update="editIdentificationDocument">
                      </update-member-identification-document>
                    </div>
                    <button :disabled="!containsPermission('MS_MM_USER_VERIFICATION_DOCUMENT')"
                     data-toggle="modal" data-target="#DocumentVerificationModal" data-backdrop="false" @click= "setDocument(item)"
                     class="button-md-verify" v-if="item.documentVerificationStatus=='NOT_VERIFIED'">Verify <i class="fa fa-check-circle-o" aria-hidden="true"></i></button>
                    <button :disabled="!containsPermission('MS_MM_USER_VERIFICATION_DOCUMENT')"
                     data-toggle="modal" data-target="#DocumentUnverificationModal" data-backdrop="false" @click= "setDocumentUnverify(item)"
                     class="button-md-verify width-100" v-else>Unverify <i class="fa fa-times" aria-hidden="true"></i></button>
                  </span>

                </td>
                <td>
                  <button :disabled="!containsPermission('MS_MM_USER_GET_SPECIFIC_DOCUMENTS')" data-toggle="modal" data-target="#DocumentHistoryModal" data-backdrop="false" @click="setDocumentHistory(item)"
                     class="button-md-verify width-100">View History</button>
                </td>

                </tr>
                </tbody>
            </table>

            <div id="DocumentVerificationModal" class="modal fade" role="dialog">
              <div class="modal-dialog  modal-md">
                <!-- Modal content-->

                <div class="modal-content">
                  <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" >&times;</button>
                    <h4 class="modal-title"> Document Verification </h4>
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

                    <button type="submit" class="btn btn-sm btn-default btn-active-til" data-dismiss="modal" @click="verifyDocument()"
                    :disabled="paramData.comment === null || paramData.comment === ''">Verify</button>
                    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Cancel</button>
                  </div>
                </div>
              </div>
            </div>

            <div id="DocumentUnverificationModal" class="modal fade" role="dialog">
              <div class="modal-dialog  modal-md">
                <!-- Modal content-->

                <div class="modal-content">
                  <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" >&times;</button>
                    <h4 class="modal-title"> Document Unverification </h4>
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

                    <button type="submit" class="btn btn-sm btn-default btn-active-til" data-dismiss="modal" @click="verifyDocument()"
                    :disabled="paramData.comment === null || paramData.comment === ''">Unverify</button>
                    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Cancel</button>
                  </div>
                </div>
              </div>
            </div>

            <div id="DocumentPreviewModal" class="modal fade" role="dialog">
              <div class="modal-dialog modal-lg" style="width: 70%">
                <div class="modal-content">
                  <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" >&times;</button>
                    <!-- <h4 class="modal-title"> Document {{ document.documentType }} </h4> -->
                  </div>
                  <div class="modal-body">
                    <div class="form-group">

                      <div class="row">
                        <!-- <div class="col-md-3">
                          <label class="control-label">Document</label>
                        </div> -->
                        <div class="col-md-12">
                          <div class="text-center">
                              <div v-if="!isPdf(document.url)">
                                <img id="ppImage" v-if="document.url"
                                      :src="documentBaseUrl+document.url"
                                      onerror="onerror=null; src='/static/images/default-document-icon.png'"
                                      class="img-rounded" width="90%" height="auto">

                                <img v-else src="/static/images/default-document-icon.png" class="img-rounded"
                                    onerror="onerror=null; src='/static/images/default-document-icon.png'" width="90%" height="auto">
                              </div>
                              <div v-if="isPdf(document.url)">
                                  <iframe :src="documentBaseUrl+document.url"
                                  alt="PDF" width="70%" height="700px"></iframe>
                              </div>


                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>

            <div id="DocumentHistoryModal" class="modal fade" role="dialog">
              <div class="modal-dialog modal-md">
                <div class="modal-content">
                  <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" >&times;</button>
                    <h4 class="modal-title"> Document {{ documentForHistory.documentType }} </h4>
                  </div>
                  <div class="modal-body">
                    
                    <div class="row">
                      <div class="row">
                        <div class="col-md-3">
                          <label class="control-label">History</label>
                        </div>
                      </div>
                      <div class="gr-12 margin-top-10 pre-scrollable" v-if="documentHistory && documentHistory.length > 0">
                        <div class="gr-12 comment" v-for="history in documentHistory">
                          <ul class="chat">
                            <li class="left clearfix"><span class="chat-img pull-left">
                              </span>
                                <div class="chat-body clearfix">
                                  <div class="header">
                                    <strong class="primary-font">{{history.verificationStatus}}</strong> by <strong class="primary-font">{{history.adminLoginId ? history.adminLoginId : 'Legacy Admin User'}}</strong>
                                    <small class="pull-right text-muted"><span class="glyphicon glyphicon-time"></span>{{history.createdAt | date}}</small>
                                  </div>
                                  <p>
                                    {{history.comment}}
                                  </p>
                                </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div class="gr-10 margin-10" v-else>
                        N/A
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>

          </div>

            <div class="gr-4 push-4"  v-if="containsPermission('MS_MM_USER_ADD_DOC') && documentTypes.filter(x=>x.found === 'Not Found').length">
              <div class="form-group">
                <br>
                <label>Upload Missing Documents </label>
                <div class="select">
                  <select id="personal-business-select" v-model="docType" @change="showDocumentUpload()">
                    <!--<option selected disabled>Select account type</option>-->
                    <option selected value = "">Select Document Type</option>
                    <option v-for="documentType in documentTypes" :value="documentType.type"
                            v-if="documentType.found == 'Not Found'">{{ documentType.type }}</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="gr-12" v-if="showDocumentUploadData && containsPermission('MS_MM_USER_ADD_DOC')">
              <div class="row">
                <div class="gr-4 push-4">
                  <div class="form-group">
                    <label> Document ID </label>
                    <input  name="queryName" type="text" id="queryName" placeholder="ID" v-model="documentID"
                            value=""/>
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="gr-4 push-4">
                  <div class="form-group">
                    <label> Document Pages </label>
                    <div class="row" v-if="memberDocument.length > 0">
                      <ul>
                        <li v-for="item in memberDocument">
                          {{ item.name }}
                        </li>
                      </ul>
                    </div>
                    <input id="uploadBtn3" multiple type="file" class="btn btn-default" @change="onDocumentChange"/>
                  </div>
                </div>
              </div>

              <div class="gr-4 push-4">
                <div class="form-group">
                  <button type="submit" class="button-search" @click="submitDocument()">
                    Submit
                  </button>
                  <button type="reset" class="button-reset" @click="showDocumentUpload()">
                    Cancel
                  </button>
                </div>
              </div>

            </div>

            <br>
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
  import GLOBAL_VARS from '../../services/GlobalVariables'
  import UpdateMemberIdentificationDocument from './UpdateMemberIdentificationDocumentComponent.vue'
  export default {
    name: 'MemberIdentificationDocument',
    props: [
      'id',
      'accountType'
    ],
    components: {
      'update-member-identification-document': UpdateMemberIdentificationDocument
    },
    data () {
      return {
        documentBaseUrl: '',
        documents: {},
        paramData: {
          comment: '',
          documentIdNumber: '',
          documentType: '',
          documentVerificationStatus: ''
        },
        documentTypes: {},
        showDocumentUploadData: false,
        docType: '',
        memberDocument: [],
        documentID: '',
        showLoader: false,
        accessControlList: [],
        document: {},
        documentForHistory: {},
        documentHistory: {}
      }
    },
    methods: {
      containsPermission (permission) {
        return this.accessControlList.indexOf(permission) > -1
      },
      init () {
        console.log('member identification component called.... id: ', this.id,
          ' account type: ', this.accountType)
        this.showDocumentUploadData = false
        this.documentBaseUrl = Http.IMAGE_URL
        if (this.accountType == 1) {
          this.documentTypes = GLOBAL_VARS.DOCUMENT_TYPE
        } else {
          this.documentTypes = GLOBAL_VARS.DOCUMENT_TYPE_BUSINESS
        }
        console.log('document type::', this.documentTypes)
        this.accessControlList = localStorage.getItem('accessControlList')
        this.accessControlList = this.accessControlList.split(',')
        this.getIdentificationDocuments()
      },
      getIdentificationDocuments (key = 'member') {
        // Http call for identification documEnts
        this.showLoader = true
        Http.GET('member', [this.id, 'identification-documents'])
          .then(
            ({data: {list: documents}}) => {
              this.showLoader = false
              this.documents = documents
              console.log('docs::', this.documents)
              for (var i = 0; i < this.documentTypes.length; i++) {
                if (this.documents.find(x => x.documentType === this.documentTypes[i].type)) {
                  this.documentTypes[i].found = 'Found'
                } else {
                  this.documentTypes[i].found = 'Not Found'
                }
              }
//               console.log('Got the list of documents: ', this.documents, ' documents.length: ',
//               this.documents.length)
//               console.log('document types::', this.documentTypes)
            },
            error => {
              this.showLoader = false
              console.log('Error in getting list of identification documents, error: ', error)
            }
           )
      },
      editIdentificationDocument (param = 'false') {
        this.init()
      },
      showDocumentUpload () {
//        console.log('doc typ:', this.docType)
        this.memberDocument = []
        if (!this.showDocumentUploadData && this.docType) {
          this.showDocumentUploadData = true
        } else {
          this.showDocumentUploadData = false
          this.docType = ''
        }
      },
      setDocument (document) {
//        console.log(document)
        this.paramData = {
          documentIdNumber: document.documentIdNumber,
          documentType: document.documentType,
          documentVerificationStatus: 'VERIFIED'
          // documentID: document.id
        }
      },
      setDocumentUnverify (document) {
//        console.log(document)
        this.paramData = {
          documentIdNumber: document.documentIdNumber,
          documentType: document.documentType,
          documentVerificationStatus: 'NOT_VERIFIED'
          // documentID: document.id
        }
      },
      setDocumentHistory (document) {
        this.documentForHistory = document
        console.log(document)
        this.getDocumentHistory(document.documentType)
      },
      setPreviewDocument (document) {
        this.document = document
        console.log(this.document)
      },
      verifyDocument () {
//        console.log('param data ::', this.paramData)
        this.showLoader = true
        Http.PUT('verification', this.paramData, [this.id, 'document'])
        .then(
          ({data: documentData}) => {
//            console.log('document data::', documentData)
            this.showLoader = false
            $.notify({
              // options
              title: '<strong>Success!</strong>',
              message: `Document ${this.paramData.documentVerificationStatus === 'NOT_VERIFIED' ? 'un' : ''}verified successfully`
            }, {
              // settings
              type: 'success',
              delay: 3000
            })
            this.init()
          },
          error => {
            this.showLoader = false
            $.notify({
              // options
              title: '<strong>Failure!</strong>',
              message: error.response.data.message
            }, {
              // settings
              type: 'danger',
              delay: 3000
            })
          })
      },
      onDocumentChange (e) {
        this.memberDocument = []
        var files = e.target.files || e.dataTransfer.files
        if (!files.length) {
          return
        }
        this.url = new Image()
        var reader = new FileReader()
        reader.onload = (e) => {
          this.url = e.target.result
        }
        for (var i = files.length - 1; i >= 0; i--) {
          this.memberDocument.push(files[i])
        }
      },
      submitDocument () {
//        console.log(this.memberDocument)
//        console.log(this.documentID)
//        console.log(this.docType)
        console.log(this.memberDocument)
        var fd = new FormData()
        // fd.append('file', this.memberDocument)
        for (var i = 0; i < this.memberDocument.length; i++) {
          fd.append('file', this.memberDocument[i])
        }
        fd.append('documentIdNumber', this.documentID)
        fd.append('documentType', this.docType)
        console.log('document type::', this.docType)
        this.showLoader = true
        Http.POST('mmAdminMember', fd, [this.id, 'identificationdoc', 'v2'])
          .then(
            ({data: documentdata}) => {
              $.notify({
                // options
                title: '<strong>Success!</strong>',
                message: 'Document Uploaded successfully'
              }, {
                // settings
                type: 'success',
                delay: 3000
              })
              this.showLoader = false
              console.log('document data: ', documentdata)
              this.editIdentificationDocument()
              this.init()
            },
            error => {
              $.notify({
                // options
                title: '<strong>Failure!</strong>',
                message: error.response.data.message
              }, {
                // settings
                type: 'danger',
                delay: 3000
              })
              this.showLoader = false
              console.log('Error in address update, error: ', error)
            }
          )
      },
      isPdf (fileName) {
        if (fileName) {
          var ext = fileName.substr(fileName.lastIndexOf('.') + 1)
          if (ext === 'pdf') {
            // console.log('returning trueeee')
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      },
      getDocumentHistory: function (documentType) {
        this.showLoader = true
        // Http.GET('member', ['identification-document', documentID])
        // .then(
        //     ({data: {data: documentDetail}}) => {
        //       this.showLoader = false
        //       this.documentDetails = documentDetail
        //       console.log('documentDetail:', documentDetail)
        //     },
        //     error => {
        //       this.showLoader = false
        //       console.log('Error in getting list of identification documents, error: ', error)
        //     }
        // )
        Http.GET('member', [this.id, 'document-history', documentType])
        .then(
            ({data: {data: history}}) => {
              this.showLoader = false
              this.documentHistory = history
              console.log('documentHistory:', this.documentHistory)
            },
            error => {
              this.showLoader = false
              console.log('Error in getting list of identification documents, error: ', error)
            }
        )
      }
    },
    created () {
//      console.log('document created::::')
      this.init()
    }
  }
</script>
