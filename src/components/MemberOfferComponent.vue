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

    <div class="padding-5 gr-1 push-10" v-if="!showMemberOfferUpdate && !showMemberOfferAdd">
        <button type="button" class="btn btn-sm btn-default" @click="memberOfferAdd()">Add Offer</button>
    </div>
    <div class="gr-12" v-if="!showMemberOfferUpdate && !showMemberOfferAdd">
        <table class="table table-striped" v-if="businessMemberOffers.length>0">
            <thead>
            <tr>
                <th>Name</th>
                <th>Creation Time</th>
                <th>Update Time</th>
                <th>Version</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="offer in businessMemberOffers">
                <td>
                {{offer.offerName}}
                </td>
                <td>{{offer.createdAt | date('MM-DD-YYYY hh:mm a')}}</td>
                <td>{{offer.updatedAt | date('MM-DD-YYYY hh:mm a')}}</td>
                <td>{{offer.version}}</td>
                <td>
                    <span v-show="offer.offerRule.isActive">Active</span>
                    <span v-show="!offer.offerRule.isActive">Inactive</span>
                </td>
                <td>
                    <button type="submit" class="btn btn-sm btn-primary" @click="memberOfferUpdate(offer)">Edit</button>
                    <button type="button" class="btn btn-sm btn-danger" @click="openModal(offer)">Delete</button>
    
                </td>
            </tr>
            </tbody>
        </table>
    </div>
    <member-offer-update
    v-if="showMemberOfferUpdate"
    :id="id"
    :singleOfferInfo="singleOfferInfo"
    @update="memberOfferUpdate"
    ></member-offer-update>

    <member-offer-add
    v-if="showMemberOfferAdd"
    :id="id"
    @update="memberOfferAdd"
    ></member-offer-add>
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

        <hr>
        <div class="gr-2 push-4 text-center padding-5" v-if="businessMemberOffers.length==0 && !showMemberOfferUpdate && !showMemberOfferAdd">
            <label>
                No Data Found
            </label>
        </div>
    </div>
</template>

<script>
import Http from '../services/Http'
import route from '../router'
import MemberOfferUpdate from './MemberOfferUpdateComponent.vue'
import MemberOfferAdd from './MemberOfferAddComponent.vue'
export default {
  name: 'MemberOffer',
  props: [
    'id'
  ],
  components: {
    'member-offer-update': MemberOfferUpdate,
    'member-offer-add': MemberOfferAdd
  },
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
      EditSystemUserFlag: false,
      businessMemberOffers: {},
      showMemberOfferUpdate: false,
      showMemberOfferAdd: false,
      singleOfferInfo: {
        name: '',
        version: '',
        variables: {},
        isActive: true
      }
    }
  },
  created () {
    console.log('member likely names component created with id: ', this.id)
    this.init()
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
      console.log('Hello')
      this.showLoader = true
      Http.GET('offer', [this.id])
        .then(({data: offerlist}) => {
          this.showLoader = false
          console.log('Success, got offer list: ', offerlist)
          this.businessMemberOffers = offerlist.data
        }, error => {
          this.showLoader = false
          if (error.response) {
            if (error.response.status === 401) { // unauthorized, logging out.
              this.logout()
            }
          }
          console.error('Error in offers: ', error)
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
        this.init()
      }, error => {
        this.showLoader = false
        this.init()
        if (error.response) {
          if (error.response.status === 401) { // unauthorized, logging out.
            this.logout()
          }
        }
        $.notify({
          // options
          title: '<strong>Fail!</strong>',
          message: 'Offer Delete failed'
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
    memberOfferUpdate (param = '') {
      if (this.showMemberOfferUpdate) {
        this.showMemberOfferUpdate = false
        this.init()
      } else {
        this.singleOfferInfo = param
        this.showMemberOfferUpdate = true
      }
    },
    memberOfferAdd (param = '') {
      if (this.showMemberOfferAdd) {
        this.showMemberOfferAdd = false
        this.init()
      } else {
        this.showMemberOfferAdd = true
      }
    }
  }

}
</script>