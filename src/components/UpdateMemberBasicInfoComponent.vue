 <template>

    <div>
        <form v-on:submit.prevent="updateMemberBasicProfile">
            <div class="gr-2">
                Name:
            </div>
            <div class="gr-4 text-left">
                <input  name="memberName" class="input-sm" type="text" id="memberName" placeholder="Name"
                v-model="member.basicInfo.name"/>
            </div>
            <div class="gr-2">
                Mobile Number:
            </div>
            <div class="gr-4 text-left pull-.5">
                {{ member.basicInfo.mobileNumber || 'N/A' }}
            </div>
            <br><br><br>
            <div class="gr-2">
                Email:
            </div>
            <div class="gr-4 text-left">
            {{ member.emails.length > 0 ? member.emails[0].emailAddress : 'N/A' }}
            </div>
            <div class="gr-2">
                Date of Birth:
            </div>
            <div class="gr-4 text-left pull-.5">
                <input type="date" class="input-sm" name="memberDOB" v-model="dob"/>
            </div>
            <div class="gr-2">
            Gender:
            </div>
            <div class="gr-4 text-left">
                <div class="select select-sm">
                <select id="genderSelection"  v-model="member.basicInfo.gender">
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                </select>
                </div>
            </div>
            <div class="gr-2">
            Occupation:
            </div>
            <div class="gr-4 text-left pull-.5">
                <div class="select select-sm">
                <select id="occupationSelection" v-model="member.basicInfo.occupation">
                    <option value="">Select Occupation</option>
                    <option v-for="occupation in occupationList" :value="occupation.id">{{ occupation.name }}</option>
                </select>
                </div>
            </div>

            <div class="gr-2">
            Verification Status:
            </div>
            <div class="gr-4 text-left">
                <div class="select select-sm">
                    <select id="verification" v-model="member.basicInfo.verificationStatus" disabled>
                    <option value="">Select Status</option>
                    <option value="NOT_VERIFIED">Not Verified</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>
            <div class="gr-2">
            Member Since:
            </div>
            <div class="gr-4 text-left pull-.5">
            {{ member.basicInfo.accountCreationDate | date('MMM D, YYYY') || 'N/A' }}
            </div>

            <div class="gr-2">
            Organization Name:
            </div>
            <div class="gr-4 text-left pull-.5">
                <input  name="memberOrganizationName" class="input-sm" type="text" id="memberOrganizationName" placeholder="Organization Name"
                v-model="member.basicInfo.organizationName"/>
            </div>

            <div class="gr-5 push-2">
                <div class="form-group">
                <button type="submit" class="button-search">
                    <i class="fa fa-edit" aria-hidden="true"></i>
                    Update
                </button>
                <button type="reset" class="button-reset" @click="editBasicInfo()">
                    <i class="fa fa-times"></i>
                    Cancel
                </button>
                </div>
            </div>
            </form>
    </div>
</template>

<script>
  import Http from '../services/Http'
  import route from '../router'
  export default {
    name: 'MemberBasicInfoUpdate',
    props: [
      'member',
      'occupationList'
    ],
    data () {
      return {
        'dob': ''
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
        this.dob = this.$options.filters.date(this.member.basicInfo.dob, 'YYYY-MM-DD')
        console.log(this.member)
      },
      updateMemberBasicProfile () {
        this.member.basicInfo.dateOfBirth = Date.parse(this.dob)
        console.log(this.member.basicInfo)
        this.member.basicInfo.dob = Date.parse(this.dob)
        console.log('update member clicked, this.member.basicInfo: ', this.member.basicInfo)
        Http.PUT('member', this.member.basicInfo, [this.member.basicInfo.accountId, 'basic-details'])
          .then(
            ({data: {data: memberUpdate}}) => {
              console.log('updated profile::', memberUpdate)
              this.init()
              this.editBasicInfo()
            },
            error => {
              if (error.response) {
                if (error.response.status === 401) { // unauthorized, logging out.
                  this.logout()
                }
              }
              console.log('Error in getting list of identification documents, error: ', error)
            }
          )
      },
      editBasicInfo () {
        this.$emit('update', 'false')
      }
    },
    created () {
      console.log('update member basic information created::::::')
      this.init()
    }
}
</script>
