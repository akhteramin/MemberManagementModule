 <template>
    <div class="row justify-content-center">
      <div class="gr-10">
        <h5><b>Bank Info</b></h5>
        <div class="text-center" v-if="bankAccounts.length === 0">No Bank Added<br></div>
        <div v-else-if="bankAccounts" class="pre-scrollable" style="height: 210px;">
          <table class="table table-hover table-sm">
            <thead class="thead-default">
            <tr>
              <th class = "text-center">Bank</th>
              <th class = "text-center">A/C No</th>
              <th class = "text-center">A/C Name</th>
              <th class = "text-center">A/C Status</th>
              <th class = "text-center">Verification</th>
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
    </div>

</template>

<script>
  import Http from '../services/Http'
  import route from '../router'
  export default {
    name: 'MemberBankAccount',
    props: [
      'id'
    ],
    data () {
      return {
        bankAccounts: {},
        imageBaseUrl: ''
      }
    },
    created () {
      console.log('document created::::')
      this.init()
    },
    methods: {
      logout () {
        Http.GET('logout')
          .then(
            ({data: list}) => {
              console.log(list)
              console.log('hey')
              // auth.setAccessControl(list)
              localStorage.removeItem('token')
              route.push('/')
            }
          )
      },
      init () {
        this.imageBaseUrl = Http.IMAGE_URL
        this.getBankAccount()
      },
      getBankAccount (key = 'member') {
            // Http call for affiliated bank accounts
        Http.GET('member', [this.id, 'bank-accounts'])
           .then(
             ({data: {data: bankAccounts}}) => {
               this.bankAccounts = bankAccounts
//               console.log('Got the list of bank accounts: ', bankAccounts)
             },
             error => {
               if (error.response) {
                 if (error.response.status === 401) { // unauthorized, logging out.
                   this.logout()
                 }
               }
               console.log('Error in getting the list of bank accounts, error: ', error)
             }
           )
      }
    }
}
</script>
