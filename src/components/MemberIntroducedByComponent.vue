 <template>
    <div class="gr-5">
        <h5><b>Introduced by</b></h5>
        <hr>
        <div class="text-center" v-if="introducers.length === 0">This member has no introducer.</div>
        <div v-else class="small-scrollable" style="height: 210px;">
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
  import route from '../router'
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
               if (error.response) {
                 if (error.response.status === 401) { // unauthorized, logging out.
                   this.logout()
                 }
               }
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
