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
      <div class="gr-11 padding-5">
        
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
              <th class = "text-center">Consent Agreement</th>
            </tr>
            </thead>
            <tbody>
            <tr class="text-center" v-for="item in bankAccounts">
              <td>{{ item.bankName }}</td>
              <td>{{ item.accountNumber }}</td>
              <td>{{ item.accountName }}</td>
              <td>
                <span v-if="item.accountStatus === 0" class="badge badge-success">ACTIVE</span>
                <span v-else-if="item.accountStatus === 1" class="badge badge-warning">INACTIVE</span>
                <span v-else-if="item.accountStatus === 2" class="badge badge-danger">DELETED</span>
              </td>
              <td>{{ item.verificationStatus }}</td>
              <td v-if="item.creationDate">{{ item.creationDate | date }}</td>
              <td v-else>{{ 'N/A' }}</td>
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
        showLoader: false
      }
    },
    created () {
      console.log('document created::::')
      this.init()
    },
    methods: {
      init () {
        this.imageBaseUrl = Http.IMAGE_URL
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
