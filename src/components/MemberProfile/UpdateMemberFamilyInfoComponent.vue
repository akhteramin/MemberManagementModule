 <template>

    <div>

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

      <form v-on:submit.prevent="updateMemberParents">
            <div class="gr-2">
            Father Name:
            </div>
            <div class="gr-4 text-left">
                <input  name="memberFather" class="input-sm" type="text" id="memberFather" placeholder="Father Name"
                v-model="member.basicInfo.father"/>
            </div>
            <div class="gr-2">
            Mother Name:
            </div>
            <div class="gr-4 text-left">
                <input  name="memberMother" class="input-sm" type="text" id="memberMother" placeholder="Mother Name"
                v-model="member.basicInfo.mother"/>
            </div>
            <div class="gr-2">
            Father Mobile:
            </div>
            <div class="gr-4 text-left">
                <input  name="memberFatherMobile" class="input-sm" type="text" id="memberFatherMobile" placeholder="Father Mobile Number"
                v-model="member.basicInfo.fatherMobileNumber"/>
            </div>
            <div class="gr-2">
            Mother Mobile:
            </div>
            <div class="gr-4 text-left">
                <input  name="memberMotherMobile" class="input-sm" type="text" id="memberMotherMobile" placeholder="Mother Mobile Number"
                v-model="member.basicInfo.motherMobileNumber"/>
            </div>
            <div class="gr-4 push-4">
                <div class="form-group">
                  <button type="submit" class="button-search">
                      <i class="fa fa-edit" aria-hidden="true"></i>
                      Update
                  </button>
                  <button type="reset" class="button-reset" @click="editParents()">
                      <i class="fa fa-times"></i>
                      Cancel
                  </button>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
  import Http from '../../services/Http'
  export default {
    name: 'UpdateMemberFamilyInfo',
    props: [
      'member'
    ],
    data () {
      return {
        showLoader: false
      }
    },
    methods: {
      init () {
      },
      updateMemberParents () {
        this.showLoader = true
        Http.PUT('member', this.member.basicInfo, [this.member.basicInfo.accountId, 'basic-details'])
          .then(
            ({data: {data: memberUpdate}}) => {
              this.showLoader = false
              $.notify({
                // options
                title: '<strong>Success!</strong>',
                message: 'Member basic details updated' // error.response.data.message
              }, {
                // settings
                type: 'success',
                delay: 3000
              })
              console.log('updated profile::', memberUpdate)
              this.init()
              this.editParents()
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
              console.log('Error in getting list of identification documents, error: ', error)
            }
          )
      },
      editParents () {
        this.$emit('update', 'false')
      }
    },
    created () {
      this.init()
    }
}
</script>
