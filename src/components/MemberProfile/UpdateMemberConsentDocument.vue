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
      <div class="modal-dialog  modal-md">
          <!-- Modal content-->

          <div class="modal-content">
            <div class="modal-header">
              <button type="button" @click="clearDocument" class="close" data-dismiss="modal" >&times;</button>
              <h4 class="modal-title"> Consent Document</h4>
            </div>
            <div class="modal-body">
              <!-- <div class="form-group">
                <div class="row">
                  <div class="col-md-3">
                    <label class="control-label">Document No</label>
                  </div>
                  <div class="col-md-8">
                    <input type="text" v-model="document.documentIdNumber" required>
                  </div>
                </div>
              </div> -->
              <div class="form-group">

                <div class="row">
                  <div class="col-md-3">
                    <label class="control-label">Document</label>
                  </div>
                  <div class="col-md-8">
                    <div v-if="url">
                        <div v-if="!isPdf(url)">
                          <img id="ppImage" v-if="url"
                                :src="docUrl"
                                onerror="onerror=null; src='/static/images/default-document-icon.png'"
                                class="img-rounded" width="250" height="250">

                          <img v-else src="/static/images/default-document-icon.png"
                          onerror="onerror=null; src='/static/images/default-document-icon.png'" class="img-rounded"
                          width="250" height="250">
                        </div>
                        <div v-if="isPdf(url)">
                            <iframe :src="docUrl" alt="PDF" width="400" height="400"></iframe>
                        </div>


                    </div>
                    <div v-else>
                      <span><strong>No Document Uploaded</strong></span>
                    </div>
                  </div>
                </div>
                <br>
                <div class="row">
                  <div class="col-md-4 col-md-offset-3">
                    <span>
                      <div class="fileUpload">
                        <input id="uploadBtn3" type="file" class="btn btn-default" @change="onDocumentChange"/>
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">

              <button type="button" class="btn btn-sm btn-default btn-active-til" @click="uploadDocument" data-dismiss="modal">Update</button>
              <button type="button" class="btn btn-sm btn-danger" @click="clearDocument" data-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
  import Http from '../../services/Http'
  export default {
    name: 'UpdateMemberConsentDocument',
    props: [
      'url',
      'id'
    ],
    data () {
      return {
        consentDocument: {},
        docUrl: '',
        showLoader: false
      }
    },
    methods: {
      init () {
        this.documentBaseUrl = Http.IMAGE_URL
        this.docUrl = this.documentBaseUrl + this.url
        console.log('consent url::', this.docUrl)
        // this.docUrl = this.url
        // console.log(this.id, this.url)
      },
      onDocumentChange (e) {
        console.log('document::', this.document)

        var files = e.target.files || e.dataTransfer.files
        if (!files.length) {
          return
        }
        this.docUrl = new Image()
        var reader = new FileReader()
        reader.onload = (e) => {
          this.docUrl = e.target.result
        }
        reader.readAsDataURL(files[0])
        this.consentDocument = files[0]
        console.log(files[0])
      },
      clearDocument () {
        console.log('clear the document')
        $('#uploadBtn3').val('')
      },
      uploadDocument () {
        console.log(this.consentDocument)
        var fd = new FormData()
        fd.append('consentAgreement', this.consentDocument)
        this.showLoader = true
        Http.POST('mmAdminBusiness', fd, ['consent-agreement', this.id])
          .then(
            ({data}) => {
              $.notify({
                // options
                title: '<strong>Success!</strong>',
                message: 'Consent Document Uploaded successfully'
              }, {
                // settings
                type: 'success',
                delay: 3000
              })
              this.showLoader = false
              this.editConsentDocument()
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
      editConsentDocument () {
        this.$emit('update', 'false')
      }
    },
    created () {
//      console.log(this.id, this.document)
      this.init()
    }
}
</script>
