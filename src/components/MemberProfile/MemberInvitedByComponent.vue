 <template>
    <div class="gr-6">
      <div class="gr-12 panel-label">
        <label class="text-label"><b>Invited By</b></label>
      </div>
      <hr>
      <div class="text-center" v-if="inviters.length === 0">This member has been invited by none.</div>
      <div v-else class="small-scrollable height-210">
        <div class="row" v-for="item in inviters">
            <div class="gr-3">
            <img class="img-rounded mx-auto d-block width-50" :src="imageBaseUrl+item.profilePictureUrl"
                  onerror="this.onerror=null;this.src='/static/images/default-profile-180x180.png'"
                    data-holder-rendered="true">
            </div>
            <div class="gr-9">
            {{item.name}}<br>
            {{item.mobileNumber}}
            <hr>
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
  export default {
    name: 'MemberInvitedBy',
    props: [
      'id'
    ],
    data () {
      return {
        imageBaseUrl: '',
        inviters: {},
        showLoader: false
      }
    },
    methods: {
      init () {
        this.imageBaseUrl = Http.IMAGE_URL
        this.getInvitedBy()
      },
      getInvitedBy (key = 'member') {
          // Http call for the introduced list
        this.showLoader = true
        Http.GET('member', [this.id, 'inviters'])
           .then(
             ({data: {data: inviters}}) => {
               this.showLoader = false
               this.inviters = inviters
//               console.log('Got the list of introduced: ', introduced)
             },
             error => {
               this.showLoader = false
               console.log('Error in getting the list of inviters, error: ', error)
             }
           )
      }
    },
    created () {
      console.log('invited by created::::')
      this.init()
    }
  }
</script>
