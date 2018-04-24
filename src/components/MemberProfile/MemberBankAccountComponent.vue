 <template>
    <div class="row justify-content-center">
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
      <div class="gr-12 panel-label">
        <label class="text-label"><b>Bank Info</b></label>
      </div>
      <div class="gr-12 padding-5">
        <div class="text-center" v-if="bankAccounts.length === 0">No Bank Added<br></div>
        <div v-else-if="bankAccounts" class="small-scrollable height-210">
          <table class="table ui celled" cellspacing="0" width="100%">
            <thead class="thead-default">
            <tr>
              <th class = "text-center">Bank</th>
              <th class = "text-center">A/C No</th>
              <th class = "text-center">A/C Name</th>
              <th class = "text-center">A/C Status</th>
              <th class = "text-center">Verification Status</th>
              <th class = "text-center">Added</th>
              <th class = "text-center">Cheque</th>
              <th class = "text-center">Action on Cheque</th>
              <th class = "text-center">Consent Agreement</th>
            </tr>
            </thead>
            <tbody>
            <tr class="text-center" v-for="item in bankAccounts">
              <td>{{ item.bankName }}</td>
              <td>{{ item.accountNumber }}</td>
              <td>{{ item.accountName }}</td>
              <td>
                <span v-if="item.accountStatus === 0" class="label label-success">ACTIVE</span>
                <span v-else-if="item.accountStatus === 1" class="label label-default">INACTIVE</span>
                <span v-else-if="item.accountStatus === 2" class="label label-danger">DELETED</span>
              </td>
              <td>{{ item.verificationStatus }}</td>
              <td v-if="item.creationDate">{{ item.creationDate | date }}</td>
              <td v-else>{{ 'N/A' }}</td>
              <td class="text-center">
                <span v-if="item.bankDocuments[0]" :class="[(item.bankDocuments[0].documentVerificationStatus == 'VERIFIED') ? 'label label-success' : 'label label-danger']">{{item.bankDocuments[0].documentVerificationStatus}}</span>
                <table width="100%" v-if="item.bankDocuments[0]">
                  <tbody>
                    <tr>
                      <td v-for="page in item.bankDocuments[0].documentPages">
                        {{item.pageNumber}}
                        <button data-toggle="modal" data-target="#ChequePreviewModal" data-backdrop="false" @click="setPreviewDocument(page)">
                          <img default-src="/static/images/default-document-icon.png"
                          v-if="!isPdf(page.url)"
                          :src="imageBaseUrl + page.url"
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
                <table width="100%" v-else>
                  <tbody>
                    <tr>
                      <td>
                        No check available.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td>
                <span v-if="item.accountStatus===0 && item.verificationStatus!=='BLOCKED' && item.bankDocuments[0]" v-restrict="'MS_MM_USER_VERIFICATION_CHEQUE'">
                  <button v-if="item.bankDocuments[0].documentVerificationStatus!=='VERIFIED'" data-toggle="modal" :data-target="`#ChequeVerificationModal`" data-backdrop="false" @click="setPreviewDocument(item,'VERIFIED')"
                    class="button-md-verify"> Verify <i class="fa fa-check-circle-o" aria-hidden="true"></i></button>
                  <button v-if="item.bankDocuments[0].documentVerificationStatus==='VERIFIED'" data-toggle="modal" :data-target="`#ChequeVerificationModal`" data-backdrop="false" @click="setPreviewDocument(item,'NOT_VERIFIED')"
                    class="button-reset width-110"> Unverify <i aria-hidden="true" class="fa fa-times"></i></button>
                </span>
              
                <button v-if="item.accountStatus===0 && (item.verificationStatus==='NOT_VERIFIED' || item.verificationStatus==='PENDING')  && (!item.bankDocuments[0] || item.bankDocuments[0].documentVerificationStatus!=='VERIFIED')"
                v-restrict="'MS_MM_USER_ADD_CHEQUE'" class="button-md-verify width-150" @click="uploadCheque(item.bankId)">Upload Cheque <i class="fa fa-upload" aria-hidden="true"></i></button>
                <div :id="`ChangeChequeModal${item.bankId}`" class="modal fade" role="dialog">
                  <div class="modal-dialog  modal-md">
                    <!-- Modal content-->

                    <div class="modal-content">
                      <div class="modal-header">
                        <button type="button" @click="" class="close" data-dismiss="modal" >&times;</button>
                        <h4 class="modal-title"> Change Cheque of Bank: {{item.bankName}}</h4>
                      </div>
                      <div class="modal-body">
                        
                        <div class="form-group">

                          <div class="row">
                            <div class="col-md-10 text-left">
                              <label class="control-label">Cheque</label>
                                <ul>
                                  <li v-for="file in memberCheque">
                                    {{ file.name }}
                                  </li>
                                </ul>
                            </div>
                          </div>
                          <br>
                          <div class="row">
                            <div class="col-md-4 col-md-offset-3">
                              <span>
                                <div class="fileUpload">
                                  <!--<span>Browse</span>-->
                                  <input id="uploadBtn3" multiple type="file" class="btn btn-default" @change="onDocumentChange"/>
                                </div>
                                <!-- <input id="uploadFile3" placeholder="Choose File" disabled="disabled" /> -->
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="modal-footer">

                        <button type="button" class="btn btn-sm btn-default btn-active-til"  data-dismiss="modal" @click="onSubmitCheque">Upload</button>
                        <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Cancel</button>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <button data-toggle="modal" :data-target="`#ChangeDocumentModal${item.bankId}`" data-backdrop="false"
                  class="button-md-verify"><i class="fa fa-pencil-square-o"></i> Edit </button>
                <div :id="`ChangeDocumentModal${item.bankId}`" class="modal fade" role="dialog">
                  <update-member-consent-document
                  :url="item.consentAgreementUrl"
                  :id="item.bankId"
                  @update="editDoc">
                  </update-member-consent-document>
                </div>
                <button
                  class="button-md-verify width-110" @click="downloadDoc(item.bankId)">Download <i class="fa fa-download" aria-hidden="true"></i></button>
              </td>  
            </tr>
            </tbody>
          </table>
        </div>
        <br>
      </div>
      
      <div id="ChequeVerificationModal" class="modal fade" role="dialog">
        <div class="modal-dialog  modal-md">
          <!-- Modal content-->

          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" >&times;</button>
              <h4 class="modal-title"> Cheque Verification </h4>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <div class="row">
                  <div class="col-md-12" v-if="chequeDocumentDetails.data && chequeDocumentDetails.data.length>0" style="overflow-y: scroll; height:250px;">
                    <div class="col-md-12 comment" v-for="history in chequeDocumentDetails.data">
                      <ul class="chat">
                        <li class="left clearfix"><span class="chat-img pull-left">
                            <!--img src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar" class="img-circle" /-->
                            </span>
                                <div class="chat-body clearfix">
                                    <div class="header">
                                        <strong :class="[(history.verificationStatus == 'VERIFIED') ? 'text-success' : 'text-danger','primary-font']">{{history.verificationStatus=='NOT_VERIFIED'?'Unverified':'Verified'}}</strong> by <strong class="primary-font">{{ history.adminLoginId }}  </strong> <small class="pull-right text-muted">
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
                  <div class="col-md-12" v-else>
                    No action has been performed.
                  </div>

                  <div class="col-md-8 col-md-offset-2">
                    <span>
                      <div class="comment">
                        <!--<span>Browse</span>-->
                        Comment:
                        <textarea id="comment" v-model="chequeComment" rows="4" cols="50"></textarea>
                      </div>
                      <!-- <input id="uploadFile3" placeholder="Choose File" disabled="disabled" /> -->
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">

              <button type="submit" class="btn btn-sm btn-default btn-active-til" data-dismiss="modal" @click="verifyCheque()"
              :disabled="chequeComment === null || chequeComment === ''"> 
                <span v-if="chequeVerificationStatus==='VERIFIED'">Verify</span>
                <span v-else>Unverify</span>
              </button>
              
              <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <div id="ChequePreviewModal" class="modal fade" role="dialog">
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
                        <div v-if="!isPdf(chequePreviewDocument.url)">
                          <img id="ppImage" v-if="chequePreviewDocument.url"
                                :src="imageBaseUrl+chequePreviewDocument.url"
                                onerror="onerror=null; src='/static/images/default-document-icon.png'"
                                class="img-rounded" width="90%" height="auto">

                          <img v-else src="/static/images/default-document-icon.png" class="img-rounded"
                              onerror="onerror=null; src='/static/images/default-document-icon.png'" width="90%" height="auto">
                        </div>
                        <div v-if="isPdf(chequePreviewDocument.url)">
                            <iframe :src="imageBaseUrl+chequePreviewDocument.url"
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
  import UpdateMemberConsentDocument from './UpdateMemberConsentDocument.vue'

  export default {
    name: 'MemberBankAccount',
    props: [
      'id'
    ],
    components: {
      'update-member-consent-document': UpdateMemberConsentDocument
    },
    data () {
      return {
        bankAccounts: {},
        imageBaseUrl: '',
        url: '',
        showLoader: false,
        chequeBankID: '',
        memberCheque: [],
        chequePreviewDocument: {},
        chequeComment: '',
        chequeVerificationStatus: '',
        chequeDocumentDetails: {}
      }
    },
    created () {
      console.log('document created::::')
      this.init()
    },
    methods: {
      init () {
        this.imageBaseUrl = Http.IMAGE_URL
        this.chequeBankID = '',
        this.memberCheque = [],
        this.chequePreviewDocument = {},
        this.chequeComment = '',
        this.chequeVerificationStatus = ''
        this.getBankAccount()
      },
      getBankAccount (key = 'member') {
            // Http call for affiliated bank accounts
        this.showLoader = true
        Http.GET('member', [this.id, 'bank-accounts'])
           .then(
             ({data: {data: bankAccounts}}) => {
               this.showLoader = false
               this.bankAccounts = bankAccounts
               console.log('Got the list of bank accounts: ', bankAccounts)
             },
             error => {
               this.showLoader = false
               console.log('Error in getting the list of bank accounts, error: ', error)
             }
           )
      },
      editDoc (param = 'false') {
        this.init()
      },
      onDocumentChange (e) {
        // console.log('document::', this.document)
        this.memberCheque = []
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
          this.memberCheque.push(files[i])
        }
        // this.memberDocument = files[0]
        console.log(this.memberCheque)
      },
      uploadCheque (bankId) {
        this.chequeBankID = bankId
        $('#ChangeChequeModal' + this.chequeBankID).modal('show')
      },
      verifyCheque () {
        let paramData = {
          'bankId': this.chequePreviewDocument.bankId,
          'comment': this.chequeComment,
          'verificationStatus': this.chequeVerificationStatus
        }
        this.showLoader = true
        Http.PUT('verification', paramData, [this.id, 'bank-document', this.chequePreviewDocument.bankDocuments[0].documentType])
        .then(
          ({data: documentData}) => {
//            console.log('document data::', documentData)
            this.showLoader = false
            $.notify({
              // options
              title: '<strong>Success!</strong>',
              message: `Document ${this.chequeVerificationStatus} successfully`
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
      getChequeHistory (docID) {
        // this.showLoader = true
        Http.GET('member', ['document-history', docID, 'cheque'])
        .then(
            ({data: chequeDocumentDetail}) => {
              // this.showLoader = false
              this.chequeDocumentDetails = chequeDocumentDetail
              console.log('documentDetail:', chequeDocumentDetail)
            },
            error => {
              // this.showLoader = false
              console.log('Error in getting list of identification documents, error: ', error)
            }
        )
      },
      onSubmitCheque () {
        console.log(this.memberCheque)
        var fd = new FormData()
        for (var i = 0; i < this.memberCheque.length; i++) {
          fd.append('files', this.memberCheque[i])
        }
        // fd.append('files[]', this.memberCheque)
        fd.append('bankId', this.chequeBankID)
        fd.append('documentType', 'cheque')
        for (var pair of fd.entries()) {
          console.log(pair[0] + ', ' + pair[1])
        }
        this.showLoader = true
        Http.POST('mmAdminMember', fd, [this.id, 'cheque'])
          .then(
            ({data: documentdata}) => {
              $.notify({
                // options
                title: '<strong>Success!</strong>',
                message: 'Cheque Uploaded successfully'
              }, {
                // settings
                type: 'success',
                delay: 3000
              })
              this.showLoader = false
              console.log('document data: ', documentdata)
              this.memberCheque = []
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
              console.log('Error in address update, error: ', error)
            }
          )
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
      setPreviewDocument (document, status = '') {
        this.chequePreviewDocument = document
        this.chequeVerificationStatus = status
        this.getChequeHistory(this.chequePreviewDocument.bankDocuments[0].bankDocumentId)
        console.log(this.chequePreviewDocument)
      },
      downloadDoc (bankId) {
        this.showLoader = true
        Http.GET('mmAdminMember', [bankId, 'consent-agreement'], {}, {responseType: 'blob'})
          .then(
            response => {
              console.log(response)
              // const hiddenElement = document.createElement('a')
              const file = new Blob([response.data], {type: response.headers['content-type']})
              console.log(file)
              this.url = window.URL.createObjectURL(file)
              console.log(this.url)
  
              const hiddenElement = document.createElement('a')
              hiddenElement.href = this.url
              hiddenElement.target = '_blank'
              hiddenElement.download = `consent-agreement-${bankId}.pdf`
              hiddenElement.click()

              // window.open(url)
              this.showLoader = false
            },
            error => {
              console.log('error::', error.response)
              const file = new Blob([error.response.data], {type: error.response.headers['content-type']})
              const reader = new FileReader()
              reader.onload = function () {
                console.log(JSON.parse(reader.result).consentAgreementUrl)

                this.url = `${Http.IMAGE_URL}${JSON.parse(reader.result).consentAgreementUrl}`
                console.log(this.url)
  
                const hiddenElement = document.createElement('a')
                hiddenElement.href = this.url
                hiddenElement.target = '_blank'
                hiddenElement.download = `consent-agreement-${bankId}.pdf`
                hiddenElement.click()
              }
              reader.readAsText(file)
              this.showLoader = false
            }
          )
      }
    }
}
</script>
