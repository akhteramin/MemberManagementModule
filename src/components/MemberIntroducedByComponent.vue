 <template>
    <div class="gr-6">
        <div class="gr-12 panel-label">
          <label class="text-label"><b>Introduced by</b></label>
        </div>
        <hr>
        <div class="text-center" v-if="introducers.length === 0">This member has no introducer.</div>
        <div v-else class="small-scrollable" style="height: 210px;">
            <div class="row" v-for="item in introducers">
                <div class="gr-3">
                <img class="img-rounded mx-auto d-block" :src="imageBaseUrl+item.profilePictureUrl"
                        data-holder-rendered="true" style="width: 50px;"
                     onerror="this.onerror=null;this.src='/static/images/default-profile-180x180.png'">
                </div>
                <div class="gr-9">
                {{item.name}}<br>
                {{item.mobileNumber}}
                <hr>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
  import Http from '../services/Http'
  export default {
    name: 'MemberIntroducedBy',
    props: [
      'id'
    ],
    data () {
      return {
        imageBaseUrl: '',
        introducers: {}
      }
    },
    methods: {
      init () {
        this.imageBaseUrl = Http.IMAGE_URL
        this.getIntroducedBy()
      },
      getIntroducedBy (key = 'member') {
        // Http call for the introducers
        Http.GET('member', [this.id, 'introducers'])
           .then(
             ({data: {data: introducers}}) => {
               this.introducers = introducers
//               console.log('Got the list of introducers: ', introducers)
             },
             error => {
               console.log('Error in getting the list of introducers, error: ', error)
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
