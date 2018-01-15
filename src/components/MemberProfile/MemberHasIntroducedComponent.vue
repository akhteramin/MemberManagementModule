 <template>
    <div class="gr-6">
        <div class="gr-12 panel-label">
          <label class="text-label"><b>Has Introduced</b></label>
        </div>
        <hr>
        <div class="text-center" v-if="introduced.length === 0">This member has introduced none.</div>
        <div v-else class="small-scrollable" style="height: 210px;">
        <div class="row" v-for="item in introduced">
            <div class="gr-3">
            <img class="img-rounded mx-auto d-block" :src="imageBaseUrl+item.profilePictureUrl"
                 onerror="this.onerror=null;this.src='/static/images/default-profile-180x180.png'"
                    data-holder-rendered="true" style="width: 50px;">
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
    name: 'MemberHasIntroduced',
    props: [
      'id'
    ],
    data () {
      return {
        imageBaseUrl: '',
        introduced: {},
        showLoader: false
      }
    },
    methods: {
      init () {
        this.imageBaseUrl = Http.IMAGE_URL
        this.getIntroducedBy()
      },
      getIntroducedBy (key = 'member') {
          // Http call for the introduced list
        this.showLoader = true
        Http.GET('member', [this.id, 'introduced'])
           .then(
             ({data: {data: introduced}}) => {
               this.showLoader = false
               this.introduced = introduced
//               console.log('Got the list of introduced: ', introduced)
             },
             error => {
               this.showLoader = false
               console.log('Error in getting the list of introduced, error: ', error)
             }
           )
      }
    },
    created () {
      console.log('document created::::')
      this.init()
    }
  }
</script>
