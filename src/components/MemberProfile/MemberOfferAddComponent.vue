<template>
    <div>
        <div class="gr-12">
          <div class="gr-2">
          <button type="button" class="button-search" title="go to list of offers" @click="memberOfferAdd()">
              <i class="fa fa-chevron-left" aria-hidden="true"></i>
          </button>
          </div>
        </div>
        <br>
        <div class="row">
            <div class="gr-4 text-right">
                <label for="abc" >Name:</label>
            </div>
            <div class="gr-4">
                <input id="abc" type="text" class="form-control" v-model="singleOfferInfo.name" required/>
            </div>
        </div>
        <br>
        <div class="row">
            <div class="gr-4 text-right">
                <label for="abc" >Version:</label>
            </div>
            <div class="gr-4">
            <input id="abc" type="text" class="form-control" v-model="singleOfferInfo.version" required="true" />
            </div>
        </div>
        <br>
        <div class="row">
            <div class="gr-4 text-right">
                <label for="abc" >Status:</label>
            </div>
            <div class="gr-6">
                <div class="select select-sm select-md">
                    <select class="form-control" v-model="singleOfferInfo.isActive" required>
                        <option v-for="status in offerStatusTypeList" :value="status.value">{{status.name}}</option>
                    </select>
                </div>
            </div>
        </div>
        <br>
        <div class="row">
            <div class="gr-4 text-right">
                <label for="abc" >Template:</label>
            </div>
            <div class="gr-6">
                <div class="select select-sm select-md">
                    <select class="form-control" @change="getData(selectedTemplate)" v-model="selectedTemplate" required>
                        <option v-for="template in templates" :value="template">{{template.offerName}}</option>
                    </select>
                </div>
            </div>
        </div>
        <br>
        <!-- <hr ng-if="selectedTemplate.variables.length>0" style="border: 1px solid grey"> -->
        <div v-for="variable in selectedTemplate.variables">
        <div class="row">
            <div class="gr-4 text-right">
            <label for="abc" >{{variable.fieldName }}</label>
            </div>
            <div class="gr-4">
            <div v-if="variable.type==='Integer'">
                <input  id="abc" type="number" step="1" class="form-control" v-model="singleOfferInfo.variables[variable.fieldName]" required="true" />
            </div>
            <div v-if="variable.type==='Double' || variable.type==='Float'">
                <input  id="abc" type="number" step="0.01" class="form-control" v-model="singleOfferInfo.variables[variable.fieldName]" required="true"/>
            </div>
            <div v-if="variable.type=='Date'">
                <div class="input-group input-group-sm date gr-8" id="fromDateTimePicker"
                    datetimepicker v-model="singleOfferInfo.variables[variable.fieldName]">
                    <input type="text" class="form-control" name="dob" required="true"/>
                    <span class="input-group-addon">
                    <span class="glyphicon glyphicon-calendar"></span>
                    </span>
                </div>
            </div>
            <div v-if="variable.type=='String'">
                <input  id="abc" type="text" class="form-control" v-model="singleOfferInfo.variables[variable.fieldName]" required="true" />
            </div>
            </div>
        </div>
        <br>
        </div>
        <div class="row padding-5">
            <div class="text-center">
                <button  type="button" class="btn btn-sm btn-primary" @click="createNewOffer(singleOfferInfo,selectedTemplate)">Create</button>
                <button type="button" v-show="offerEditFlag" class="btn btn-sm btn-default" @click="memberOfferAdd()">Cancel</button>
            </div>
        </div>
    </div>
                      <!-- end offer create -->
</template>
<script>
import Http from '../../services/Http'

export default {
  name: 'MemberOffer',
  props: [
    'id'
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
    init () {
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
    createNewOffer (dataToSend, template) {
      let accountId = this.id
      let templateId = template.id
      Http.POST('offer', dataToSend, [accountId, templateId])
      .then(({data: offerCreated}) => {
        this.showLoader = false
        console.log(offerCreated)
        $.notify({
            // options
          title: '<strong>Success!</strong>',
          message: 'Offer Created successfully'
        }, {
          // settings
          type: 'success',
          delay: 3000
        })
        this.memberOfferAddtion()
      }, error => {
        this.showLoader = false
        console.error('Error in offers: ', error)
        $.notify({
          // options
          title: '<strong>Fail!</strong>',
          message: 'Offer Creation failed'
        }, {
          // settings
          type: 'danger',
          delay: 3000
        })
      })
    },
    getData (data) {
      console.log(data)
    },
    memberOfferAdd () {
      this.$emit('update', 'false')
    }
  }
}
</script>