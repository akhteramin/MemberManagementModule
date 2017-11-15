 <template>
    <div class="gr-5">
        <h5>Has Introduced</h5>
        <hr>
        <strong v-if="introduced.length === 0">N/A</strong>
        <div v-else class="pre-scrollable" style="height: 210px;">
        <div class="row" v-for="item in introduced">
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
    name: 'MemberHasIntroduced',
    props: [
      'id'
    ],
    data () {
      return {
        imageBaseUrl: '',
        introduced: {}
      }
    },
    methods: {
      init () {
        this.imageBaseUrl = Http.IMAGE_URL
        this.getIntroducedBy()
      },
      getIntroducedBy (key = 'member') {
          // Http call for the introduced list
        Http.GET('member', [this.id, 'introduced'])
           .then(
             ({data: {data: introduced}}) => {
               this.introduced = introduced
//               console.log('Got the list of introduced: ', introduced)
             },
             error => {
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