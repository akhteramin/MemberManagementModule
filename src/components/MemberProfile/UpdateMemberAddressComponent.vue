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

    <div v-if="addressType==0">
        <form v-on:submit.prevent="updateMemberAddress(0)">
            <div class="gr-6">
            <h3 class="text-left"><b>Present</b></h3>
            <br>
            <div class="row text-left">
                <div class="gr-2">
                Line 1:
                </div>
                <div class="gr-8 padding-2">
                <input
                id="presentAddrssLine1"
                class="input-sm"
                type="text"
                v-model="memberPresentAddress.addressLine1"/>
                </div>
            </div>
            <div class="row text-left">
                <div class="gr-2">
                Line 2:
                </div>
                <div class="gr-8 padding-2">
                <input class="input-sm"
                        type="text"
                        v-model="memberPresentAddress.addressLine2"/>
                </div>
            </div>
            <div class="row text-left">
                <div class="gr-2">
                District:
                </div>
                <div class="gr-8 padding-2">
                <div class="select select-sm">
                    <select id="districtSelection" v-model="memberPresentAddress.districtId" required>
                    <option value="" disabled>Select District</option>
                    <option v-for="district in districtList" :value="district.id">{{ district.name }}</option>
                    </select>
                </div>
                </div>
            </div>
            <div class="row text-left">
                <div class="gr-2">
                Thana:
                </div>
                <div class="gr-8 padding-2">
                <div class="select select-sm">
                    <select id="thanaSelection" v-model="memberPresentAddress.thanaId" required>
                    <option value="" disabled>Select Thana</option>
                    <option v-for="thana in thanaList" :value="thana.id"
                            v-if="thana.districtId == memberPresentAddress.districtId">{{ thana.name }}</option>

                    </select>
                </div>

                </div>
            </div>
            <div class="row text-left">
                <div class="gr-2">
                Country:
                </div>
                <div class="gr-8 padding-2">
                {{ memberPresentAddress.country === 'BD' ? 'Bangladesh' : memberPresentAddress.country}}
                </div>
            </div>
            <div class="form-group gr-4 push-2">
                <button type="submit" class="button-search">
                <i class="fa fa-edit" aria-hidden="true"></i>
                Update
                </button>
                <button type="reset" class="button-reset" @click="editPresentAddress()">
                <i class="fa fa-times"></i>
                Cancel
                </button>
            </div>
            </div>
        </form>
    </div>
    <div v-else-if="addressType==1">
        <form  v-on:submit.prevent="updateMemberAddress(1)">
            <div class="gr-6">
            <h3 class="text-center"><b>Permanent</b></h3>
            <br>
            <div class="row text-left">
                <div class="gr-2">
                Line 1:
                </div>
                <div class="gr-8 padding-2">
                <input class="input-sm"
                        type="text"
                        v-model="memberPermanentAddress.addressLine1"/>
                </div>
            </div>
            <div class="row text-left">
                <div class="gr-2">
                Line 2:
                </div>
                <div class="gr-8 padding-2">
                <input class="input-sm"
                        type="text"
                        v-model="memberPermanentAddress.addressLine2"/>
                </div>
            </div>
            <div class="row text-left">
                <div class="gr-2">
                District:
                </div>
                <div class="gr-8 padding-2">
                <div class="select select-sm">
                    <select v-model="memberPermanentAddress.districtId" required>
                    <option value="" disabled>Select District</option>
                    <option v-for="district in districtList" :value="district.id">{{ district.name }}</option>
                    </select>
                </div>

                <!--{{ districtNameFirst }}-->
                </div>
            </div>
            <div class="row text-left">
                <div class="gr-2">
                Thana:
                </div>
                <div class="gr-8 padding-2">
                <div class="select select-sm">
                    <select  v-model="memberPermanentAddress.thanaId" required>
                    <option value="" disabled>Select Thana</option>
                    <option v-for="thana in thanaList" :value="thana.id"
                            v-if="thana.districtId == memberPermanentAddress.districtId">{{ thana.name }}</option>
                    </select>
                </div>
                <!--{{ districtNameFirst }}-->
                </div>
            </div>
            <div class="row text-left">
                <div class="gr-2">
                Country:
                </div>
                <div class="gr-8">
                {{ memberPermanentAddress.country === 'BD' ? 'Bangladesh' : memberPermanentAddress.country }}
                </div>
            </div>
            <div class="form-group gr-4 push-2">
                <button type="submit" class="button-search">
                <i class="fa fa-edit" aria-hidden="true"></i>
                Update
                </button>
                <button type="reset" class="button-reset" @click="editPermanentAddress()">
                <i class="fa fa-times"></i>
                Cancel
                </button>
            </div>
            </div>

        </form>
    </div>

  </div>

</template>


<script>
  import Http from '../../services/Http'
  export default {
    name: 'UpdateMemberAddress',
    props: [
      'id',
      'memberPresentAddress',
      'memberPermanentAddress',
      'thanaList',
      'districtList'
    ],
    data () {
      return {
        addressType: 0,
        showLoader: false
      }
    },
    methods: {
      init () {
        console.log('update member address component initialized::, show loader: ', this.showLoader)
        if (this.memberPresentAddress) {
          this.addressType = 0
        } else {
          this.addressType = 1
        }
      },
      updateMemberAddress (addressId) { // addressId is in {0,1}
        console.log('in member update, addressId: ', addressId)
        let updatedAddress = {}
        if (addressId === 0) {
          updatedAddress = {
            'address': this.memberPresentAddress,
            'addressType': this.memberPresentAddress.type
          }
        } else {
          updatedAddress = {
            'address': this.memberPermanentAddress,
            'addressType': this.memberPermanentAddress.type
          }
        }
        updatedAddress.address['district'] = updatedAddress.address['districtId']
        updatedAddress.address['thana'] = updatedAddress.address['thanaId']
        updatedAddress.address['country'] = 'BD'
        // delete updatedAddress.address['thanaId']
        // delete updatedAddress.address['districtId']
        // delete updatedAddress.address['type']
        console.log('updatedAddress: ', updatedAddress)
        this.showLoader = true
        Http.PUT('mmAdminMember', updatedAddress, [this.id, 'address'])
          .then(
            ({data: {data: response}}) => {
              this.showLoader = false
              $.notify({
                // options
                title: '<strong>Success!</strong>',
                message: 'Address Updated successfully'
              }, {
                // settings
                type: 'success',
                delay: 3000
              })
              console.log('updated address: ', response)
              if (addressId === 0) {
                this.editPresentAddress()
              } else {
                this.editPermanentAddress()
              }
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
              console.log('Error in address update, error: ', error)
            }
          )
        console.log('after http put in update member address.')
      },
      editPresentAddress () {
        this.$emit('update', 'false')
      },
      editPermanentAddress () {
        this.$emit('update', 'false')
      }

    },
    created () {
      this.init()
    }
}
</script>
