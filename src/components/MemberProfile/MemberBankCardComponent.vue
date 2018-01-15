 <template>
    <div class="row justify-content-center">
      <div class="gr-12 panel-label">
        <label class="text-label"><b>Card Info</b></label>
      </div>
      <div class="gr-11 padding-5">
        <div class="text-center" v-if="bankCards.length === 0">No Card Added<br></div>
        <div v-else-if="bankCards" class="small-scrollable" style="height: 210px;">
          <table class="table ui celled" cellspacing="0" width="100%">
            <thead class="thead-default">
            <tr>
              <th class = "text-center">Bin No.</th>
              <th class = "text-center">Card Info.</th>
              <th class = "text-center">Card Level</th>
              <th class = "text-center">Card Status</th>
              <th class = "text-center">Card Type</th>
              <th class = "text-center">Issuer Name</th>
              <th class = "text-center">Network Company</th>
              <th class = "text-center">Action</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in bankCards">
              <td>{{ item.binNumber }}</td>
              <td>{{ item.cardInfo }}</td>
              <td>{{ item.cardLevel }}</td>
              <td><span class="badge" :class="{'badge-success': true }">{{item.cardStatus}}</span></td>
              <td>{{ item.cardType }}</td>
              <td>{{ item.issuerName }}</td>
              <td>{{ item.networkCompany }}</td>
              <td><button @click= "verifyCard(item)"
                  class="button-md-verify" v-if="item.cardStatus=='PENDING'">Verify <i class="fa fa-check-circle-o" aria-hidden="true"></i></button></td>
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
    name: 'MemberBankCard',
    props: [
      'id'
    ],
    data () {
      return {
        bankCards: {},
        imageBaseUrl: '',
        showLoader: false
      }
    },
    created () {
      console.log('card document created::::')
      this.init()
    },
    methods: {
      init () {
        this.imageBaseUrl = Http.IMAGE_URL
        this.getMemberCard()
      },
      getMemberCard (key = 'member') {
            // Http call for affiliated bank accounts
        this.showLoader = true
        Http.GET('member', [this.id, 'card'])
           .then(
             ({data: {data: bankCards}}) => {
              
              this.showLoader = false
              if (bankCards)
                this.bankCards = bankCards
              console.log('Got the list of bank accounts: ', this.bankCards)
             },
             error => {
               this.showLoader = false
               console.log('Error in getting the list of bank accounts, error: ', error)
             }
           )
      },
      verifyCard (item) {
        this.showLoader = true
        let paramData = {
            cardInfo: item.cardInfo,
            status: "Verified"
        }
        console.log(paramData)
        Http.PUT('verification', paramData, [this.id, 'card'])
           .then(
             ({data: cardVerify}) => {
               console.log(cardVerify)
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
              }
           )
      }
    }
}
</script>
