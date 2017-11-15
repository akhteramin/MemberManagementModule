 <template>
    <div class="row justify-content-center">
        <div class="gr-10">
            <h3>Identification Documents</h3>
            <strong v-if="documents === null || documents.length === 0">N/A<br></strong>
            <div v-else class="pre-scrollable" style="height: 210px;">
            <table class="table table-hover table-sm">
                <thead class="thead-default">
                <tr>
                <th class = "text-center">Type</th>
                <th class = "text-center">Document No.</th>
                <th class = "text-center">URL</th>
                <th class = "text-center">Verification</th>
                </tr>
                </thead>
                <tbody>
                <tr class = "text-center" v-for="item in documents">
                <td>{{ item.documentType ? item.documentType : 'N/A' }}</td>
                <td>{{ item.documentIdNumber ? item.documentIdNumber : 'N/A' }}</td>
                <td>
                    <button>
                    <img default-src="images/default-news-feed.jpg"
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
                </tr>
                </tbody>
            </table>
            </div>
            <br>
        </div>
    </div>
</template>

<script>
  import Http from '../services/Http'
  export default {
    name: 'MemberIdentificationDocument',
    props: [
      'id'
    ],
    data () {
      return {
        documentBaseUrl: '',
        documents: {}
      }
    },
    methods: {
      init () {
        this.documentBaseUrl = Http.IMAGE_URL
        this.getIdentificationDocuments()
      },
      getIdentificationDocuments (key = 'member') {
        // Http call for identification documEnts
        Http.GET('member', [this.id, 'identification-documents'])
           .then(
             ({data: {data: documents}}) => {
               this.documents = documents
//               console.log('Got the list of documents: ', this.documents, ' documents.length: ',
//               this.documents.length)
             },
             error => {
               console.log('Error in getting list of identification documents, error: ', error)
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
      }
    },
    created () {
      console.log('document created::::')
      this.init()
    }
  }
</script>