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
              <h4 class="modal-title"> Change Document {{ document.documentType }} </h4>
            </div>
            <div class="modal-body">
              <div class="form-group">

                <div class="row">
                  <div class="col-md-3">
                    <label class="control-label">Document:</label>
                  </div>
                  <div class="col-md-8">
                    <div>
                        <div v-if="!isPdf(document.documentUrl)">
                          <img id="ppImage" v-if="document.documentUrl"
                                :src="documentUrl || 'static/images/default-original.jpg'"
                                class="img-rounded" width="250" height="250">

                          <img v-else src="static/images/default-original.jpg" class="img-rounded"
                              alt="N/A" width="30" height="30">
                        </div>
                        <div v-if="isPdf(document.documentUrl)">
                            <iframe :src="documentBaseUrl+document.documentUrl" width="400" height="400"></iframe>
                        </div>


                    </div>
                  </div>
                </div>
            <br>
                <div class="row">
                  <div class="col-md-4 col-md-offset-3">
                    <span>
                      <div class="fileUpload">
                        <!--<span>Browse</span>-->
                        <input id="uploadBtn3" type="file" class="btn btn-default" @change="onDocumentChange"/>
                      </div>
                      <!-- <input id="uploadFile3" placeholder="Choose File" disabled="disabled" /> -->
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
    name: 'UpdateMemberIdentificationDocument',
    props: [
      'document',
      'id'
    ],
    data () {
      return {
        documentBaseUrl: '',
        documentUrl: '',
        memberDocument: {},
        showLoader: false
      }
    },
    methods: {
      init () {
        this.documentBaseUrl = Http.IMAGE_URL
        this.documentUrl = this.documentBaseUrl + this.document.documentUrl
//        console.log('document::', this.documentUrl)
      },
      onDocumentChange (e) {
        console.log('document::', this.document)

        var files = e.target.files || e.dataTransfer.files
        if (!files.length) {
          return
        }
        this.documentUrl = new Image()
        var reader = new FileReader()
        reader.onload = (e) => {
          this.documentUrl = e.target.result
        }
        reader.readAsDataURL(files[0])
        this.memberDocument = files[0]
        console.log(files[0])
      },
      clearDocument () {
        console.log('clear the document')
        this.documentUrl = this.documentBaseUrl + this.document.documentUrl
        $('#uploadBtn3').val('')
      },
      uploadDocument () {
        console.log(this.memberDocument)
        var fd = new FormData()
        fd.append('file', this.memberDocument)
        fd.append('documentIdNumber', this.document.documentIdNumber)
        fd.append('documentType', this.document.documentType)
        console.log('document type::', this.document.documentType)
        this.showLoader = true
        Http.POST('member', fd, [this.id, 'identification-document'])
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
      editIdentificationDocument () {
        this.$emit('update', 'false')
      }
    },
    created () {
//      console.log(this.id, this.document)
      this.init()
    }
}
</script>
