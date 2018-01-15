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
                <th class = "text-center">URL</th>
                <th class = "text-center">Verification</th>
                <th class = "text-center" v-if="containsPermission('MS_MM_USER_ADD_DOC')">Action</th>

                </tr>
                </thead>
                <tbody>
                <tr class = "text-center" v-for="item in documents">
                <td>{{ item.documentType ? item.documentType : 'N/A' | underscoreless}}</td>
                <td>{{ item.documentIdNumber ? item.documentIdNumber : 'N/A' }}</td>
                <td>
                    <button>
                    <img default-src="/images/default-news-feed.jpg"
                    v-if="!isPdf(item.documentUrl)"
                    :src="documentBaseUrl + item.documentUrl"
                    alt="Profile Picture"
                    height="50"
                    width="auto"
                    class="img-rounded">
                    <i v-if="isPdf(item.documentUrl)"
                    class="fa fa-file-pdf-o"
                    style="font-size:50px;"
                    aria-hidden="true"></i>
                    </button>
                </td>
                <td>{{ item.documentVerificationStatus | underscoreless }}</td>
                <td v-if="containsPermission('MS_MM_USER_ADD_DOC')">
                  <span>

                  <button data-toggle="modal" :data-target="`#ChangeDocumentModal${item.id}`"
                  class="button-md-verify" data-backdrop="false"><i class="fa fa-pencil-square-o"></i> Edit </button>
                    <div :id="`ChangeDocumentModal${item.id}`" class="modal fade" role="dialog">
                      <update-member-identification-document
                      :document="item"
                      :id="id"
                      @update="editIdentificationDocument">
                      </update-member-identification-document>
                    </div>
                    <button
                     data-toggle="modal" data-target="#DocumentVerificationModal" data-backdrop="false" @click= "setDocument(item)"
                     class="button-md-verify" v-if="item.documentVerificationStatus=='NOT_VERIFIED'">Verify <i class="fa fa-check-circle-o" aria-hidden="true"></i></button>
                  </span>

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

            <div class="gr-3 push-4"  v-if="containsPermission('MS_MM_USER_ADD_DOC')">
              <div class="form-group">
                <br>
                <label>Document Type: </label>
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

            <div class="gr-10 push-2" v-if="showDocumentUploadData && containsPermission('MS_MM_USER_ADD_DOC')">
              <div class="gr-4">
                <div class="form-group">
                  <label> Document ID: </label>
                  <input  name="queryName" type="text" id="queryName" placeholder="ID" v-model="documentID"
                          value=""/>
                </div>
              </div>

              <div class="gr-4">
                <div class="form-group">
                  <label> Document: </label>
                    <input id="uploadBtn3" type="file" class="btn btn-default" @change="onDocumentChange"/>
                </div>
              </div>

              <div class="gr-12 push-3">
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
        memberDocument: {},
        documentID: '',
        showLoader: false,
        accessControlList: []
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
        if (this.accountType === 1) {
          this.documentTypes = GLOBAL_VARS.DOCUMENT_TYPE
        } else {
          this.documentTypes = GLOBAL_VARS.DOCUMENT_TYPE_BUSINESS
        }
        this.accessControlList = localStorage.getItem('accessControlList')
        this.accessControlList = this.accessControlList.split(',')
        this.getIdentificationDocuments()
      },
      getIdentificationDocuments (key = 'member') {
        // Http call for identification documEnts
        this.showLoader = true
        Http.GET('member', [this.id, 'identification-documents'])
           .then(
             ({data: {data: documents}}) => {
               this.showLoader = false
               this.documents = documents
//               console.log('docs::', this.documents)
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
          documentVerificationStatus: 'VERIFIED',
          documentID: document.id
        }
      },
      verifyDocument () {
//        console.log('param data ::', this.paramData)
        this.showLoader = true
        Http.PUT('verification', this.paramData, [this.id, 'document', this.paramData.documentID])
        .then(
          ({data: documentData}) => {
//            console.log('document data::', documentData)
            this.showLoader = false
            $.notify({
              // options
              title: '<strong>Success!</strong>',
              message: 'Document verified successfully'
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
//        console.log('document::', this.document)
        var files = e.target.files || e.dataTransfer.files
        if (!files.length) {
          return
        }
        this.memberDocument = files[0]
      },
      submitDocument () {
//        console.log(this.memberDocument)
//        console.log(this.documentID)
//        console.log(this.docType)
        var fd = new FormData()
        fd.append('file', this.memberDocument)
        fd.append('documentIdNumber', this.documentID)
        fd.append('documentType', this.docType)
//        console.log('document type::', this.docType)
        this.showLoader = true
        Http.POST('member', fd, [this.id, 'identification-document'])
          .then(
            () => {
//              console.log('document data: ', documentData)
              this.showLoader = false
              $.notify({
                // options
                title: '<strong>Success!</strong>',
                message: 'Document uploaded successfully'
              }, {
                // settings
                type: 'success',
                delay: 3000
              })
              this.editIdentificationDocument()
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
      }
    },
    created () {
//      console.log('document created::::')
      this.init()
    }
  }
</script>
