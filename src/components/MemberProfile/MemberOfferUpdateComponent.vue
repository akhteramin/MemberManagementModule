<template>
    <div>
        <div class="gr-12">
            <div class="gr-2">
            <button type="button" class="button-search" title="go to list of offers" @click="memberOfferUpdate()">
                <i class="fa fa-chevron-left" aria-hidden="true"></i>
            </button>
            </div>
        </div>
        <div v-if="singleOfferInfo.offerId>0">
            <div class="row">
                <div class="gr-4 text-right">
                    <label for="abc" >Name:</label>
                </div>
                <div class="gr-6">
                    <input v-show="offerEditFlag"  id="abc" type="text" class="form-control" v-model="singleOfferInfo.offerName"  />
                    <p  v-show="!offerEditFlag" style="word-wrap: break-word;">{{singleOfferInfo.offerName}}</p>
                </div>
            </div>
            <br>
            <div class="row">
                <div class="gr-4 text-right">
                    <label class="abc">Creation Time:</label>
                </div>
                <div class="gr-6">
                    <p>{{singleOfferInfo.createdAt | date('DD-MM-YYYY hh:mm a')}}</p>
                </div>
            </div>
            <br>
            <div class="row">
                <div class="gr-4 text-right">
                    <label for="abc">Update Time:</label>
                </div>
                <div class="gr-6">
                    <p>{{singleOfferInfo.updatedAt | date('DD-MM-YYYY hh:mm a')}}</p>
                </div>
            </div>
            <br>
            <div class="row">
                <div class="gr-4 text-right">
                    <label for="abc">Status:</label>
                </div>
                <div class="gr-6">

                    <select v-show="offerEditFlag" class="form-control" v-model="singleOfferInfo.offerRule.isActive" required>
                        <option v-for="status in offerStatusTypeList" :value="status.value">
                        {{status.name}}</option>
                    </select>
                    <p  v-show="!offerEditFlag && singleOfferInfo.offerRule.isActive" >Active</p>
                    <p  v-show="!offerEditFlag && !singleOfferInfo.offerRule.isActive" >Inactive</p>
                </div>
            </div>

            <div v-for="(key,value) in singleOfferInfo.variables">
                <br>
                <div class="row" >
                <div class="col-md-4 text-right">
                <label for="abc">{{value}}</label>
                </div>
                <div class="col-md-6">
                    <input v-show="offerEditFlag"  id="abc" type="text" class="form-control" v-model="singleOfferInfo.variables[value]"  />
                    <p v-show="!offerEditFlag">{{value}}</p>
                </div>
                </div>
            </div>
            <br>
            <div class="row padding-5"  v-show="offerEditFlag">
                <div class="text-center">
                <button type="button" class="btn btn-sm btn-default btn-active-til" @click="updateOffer(singleOfferInfo)">Update</button>
                <button  type="button" class="btn btn-sm btn-danger" @click="openModal(singleOfferInfo)">Delete</button>
                <button type="button" class="btn btn-sm btn-default" @click="memberOfferUpdate()">Cancel</button>
                </div>
            </div>  
        </div>
        
        <div id="business_offer_delete_modal" modal-show-hide  class="modal fade" role="dialog">
            <div class="modal-dialog">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Delete offer?</h4>
                    </div>
                    <div class="modal-body">
                        <div class="container-fluid">
                            <div class="col-sm-12 text-danger text-center">
                                Are you sure?
                            </div>

                        </div>
                    </div>
                    <div class="modal-footer">

                        <button id="business_offer_delete_modal_yes" type="submit" class="btn btn-sm btn-danger" @click="deleteOffer(selectedOffer)" data-dismiss="modal" >Yes</button>
                        <button id="business_offer_delete_modal_no" type="button" class="btn btn-sm btn-default" data-dismiss="modal">No</button>
                    </div>
                </div>
            </div>
        </div>  

    </div>
</template>
<script>
import Http from '../../services/Http'
export default {
  name: 'MemberOfferUpdate',
  props: [
    'id',
    'singleOfferInfo'
  ],
  data () {
    return {
      templates: {},
      showLoader: false,
      selectedTemplate: {},
      offerEditFlag: true,
      offerStatusTypeList: [
        { name: 'Active', value: true },
        { name: 'Inactive', value: false }
      ],
      selectedOffer: {},
      EditSystemUserFlag: false
    }
  },
  created () {
    console.log('member likely names component created with id: ', this.id)
    this.init()
  },
  methods: {
    init () {
      console.log('Hello')
      console.log(this.singleOfferInfo)
      console.log(this.templates)

      console.log('Hello')
      this.showLoader = true
      Http.GET('offer', ['templates'])
        .then(({data: templates}) => {
          this.showLoader = false
          console.log('Success, got offer list: ', templates)
          this.templates = templates.data
        }, error => {
          this.showLoader = false
          console.error('Error in offers: ', error)
        })
    },
    updateOffer (dataToUpdate) {
      let accountId = this.id
      let offerId = dataToUpdate.offerId
    //   let param='?accountId='+accountId+'&offerId='+offerId;
      let putObject = {
        'name': dataToUpdate.offerName,
        'version': dataToUpdate.version,
        'variables': dataToUpdate.variables,
        'isActive': dataToUpdate.offerRule.isActive
      }
      Http.PUT('offer', putObject, [accountId, offerId])
      .then(({data: offerCreated}) => {
        this.showLoader = false
        console.log(offerCreated)
        $.notify({
            // options
          title: '<strong>Success!</strong>',
          message: 'Offer Updated successfully'
        }, {
          // settings
          type: 'success',
          delay: 3000
        })
        // this.memberOfferAddtion()
      }, error => {
        this.showLoader = false
        console.error('Error in offers: ', error)
        $.notify({
          // options
          title: '<strong>Fail!</strong>',
          message: 'Offer Update failed'
        }, {
          // settings
          type: 'danger',
          delay: 3000
        })
      })
    },
    deleteOffer (dataToUpdate) {
      let accountId = this.id
      let offerId = dataToUpdate.offerId
      Http.DELETE('offer', [accountId, offerId])
      .then(({data: offerDeleted}) => {
        this.showLoader = false
        console.log(offerDeleted)
        $.notify({
            // options
          title: '<strong>Success!</strong>',
          message: 'Offer Deleted successfully'
        }, {
          // settings
          type: 'success',
          delay: 3000
        })
        this.memberOfferUpdate()
      }, error => {
        this.showLoader = false
        console.error('Error in offers: ', error)
        this.memberOfferUpdate()
        $.notify({
          // options
          title: '<strong>Fail!</strong>',
          message: 'Offer Deleted failed'
        }, {
          // settings
          type: 'danger',
          delay: 3000
        })
      })
    },
    openModal (selectedOffer) {
      this.selectedOffer = selectedOffer
      $('#business_offer_delete_modal').modal()
    },
    memberOfferUpdate () {
      this.$emit('update', 'false')
    }
  }
}
</script>
