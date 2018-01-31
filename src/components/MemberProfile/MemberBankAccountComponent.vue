 <template>
    <div class="row justify-content-center">
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
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in bankAccounts">
              <td>{{ item.bankName }}</td>
              <td>{{ item.accountNumber }}</td>
              <td>{{ item.accountName }}</td>
              <td><span class="badge" :class="{'badge-success': true }">ACTIVE</span></td>
              <td>{{ item.verificationStatus }}</td>
              <td>{{ item.creationDate | date }}</td>
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
  export default {
    name: 'MemberBankAccount',
    props: [
      'id'
    ],
    data () {
      return {
        bankAccounts: {},
        imageBaseUrl: '',
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
//               console.log('Got the list of bank accounts: ', bankAccounts)
             },
             error => {
               this.showLoader = false
               console.log('Error in getting the list of bank accounts, error: ', error)
             }
           )
      }
    }
}
</script>
