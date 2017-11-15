 <template>
    <div class="gr-5">
        <h5>Introduced by</h5>
        <hr>
        <strong v-if="introducers.length === 0">N/A</strong>
        <div v-else class="pre-scrollable" style="height: 210px;">
            <div class="row" v-for="item in introducers">
                <div class="gr-3">
                <img class="img-rounded mx-auto d-block" :src="imageBaseUrl+item.profilePictureUrl"
                        data-holder-rendered="true" style="width: 50px;">
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