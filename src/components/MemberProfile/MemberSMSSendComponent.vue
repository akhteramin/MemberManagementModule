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
        <div class="gr-12 w3-card w3-padding-16 height-110">
            <div class="gr-1 push-10">
              <div class="select select-sm">
                <select v-model="smsQuery.pageSize" @change="triggerSMSHistory">
                  <option disabled>Number of Entries</option>
                  <option selected value=10>10</option>
                  <option value=20>20</option>
                  <option value=30>30</option>
                  <option value=50>50</option>
                </select>
              </div>
            </div>
            <div class="gr-1 push-8" v-if="!showSendMessageForm">
                <button type="button" class="btn btn-sm btn-default btn-active-til" @click="toggleSendMessage">Send Message</button>
            </div>
            <div class="gr-6" v-if="showSendMessageForm">
                <div class="gr-7">
                    <textarea v-model="memberMSG" placeholder="Enter message (Max. 200 character)" rows="2" cols="50" maxlength="200" required></textarea>
                </div>
                <div class="gr-4 text-center padding-5">
                    <button type="button" class="btn btn-sm btn-default btn-active-til" @click="showSendMessageModal" >Send <span class="ti-email"></span></button>
                    <button type="button" class="btn btn-sm btn-danger" @click="toggleSendMessage">Cancel</button>
                </div>
            </div>
        </div>
        <div class="padding-5 gr-1 push-10">

        </div>
        <div class="gr-12 w3-card w3-padding-16">
            <div class="table-responsive ">
                
                <table class="table table-striped" v-if="smsHistory.list && smsHistory.list.length > 0">
                    <thead class="thead-default">
                    <tr>
                        <th class="text-center">Admin</th>
                        <th>SMS Text</th>
                        <th>Mobile Number</th>
                        <th>Creation Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    
                    <tr v-for="history in smsHistory.list">
                        <td  class="text-center">
                        {{history.adminLoginId}}
                        </td>
                        <td>{{history.smsText}}</td>
                        <td>{{history.mobileNumber}}</td>
                        <td>{{history.time | date('MMM D, YYYY - HH:mm:ss a')}}</td>
                        
                    </tr>
                    </tbody>
                </table>
                <div v-else>
                <strong class="primary-font">NO ENTRIES FOUND</strong>
                </div>
            </div>
            <div class="card-footer text-muted" v-if="smsHistory.totalElements > 0 && smsHistory.totalPages > 1">
                <div class="row">
                <div class="gr-3">
                    <div class="margin-top-rem" v-if="smsHistory.list">
                    <small>Showing {{ parseInt(smsQuery.pageNumber * smsQuery.pageSize + 1)
                        }} to {{ parseInt(smsQuery.pageNumber * smsQuery.pageSize + smsHistory.list.length)
                        }} out of {{ smsHistory.totalElements }}
                    </small>
                    </div>
                </div>
                <div class="gr-9">
                    <div v-if="smsHistory.totalPages <= maxPaginationItem">
                    <nav aria-label="SMSHistoryPagination">
                        <ul class="pagination pagination-sm justify-content-end">
                        <li class="page-item " v-bind:class="{ disabled: smsQuery.pageNumber === 0 }">
                            <a class="page-link" v-on:click="pageChange(smsQuery.pageNumber - 1)" tabindex="-1">Previous</a>
                        </li>
                        <li class="page-item"
                            v-bind:class="{ active: smsQuery.pageNumber === (n - 1) }"
                            v-for="n in smsHistory.totalPages">
                            <a class="page-link" v-on:click="pageChange(n - 1)" tabindex="-1">{{ n }}</a>
                        </li>
                        <li class="page-item" v-bind:class="{ disabled: smsQuery.pageNumber === smsHistory.totalPages - 1 }">
                            <a class="page-link" v-on:click="pageChange(smsQuery.pageNumber + 1)" tabindex="-1">Next</a>
                        </li>
                        </ul>
                    </nav>
                    </div>
                    <div class="pull-right" v-else>
                    <a class="btn btn-sm btn-default btn-active-til"
                        role="button"
                        v-bind:class="{ disabled: smsQuery.pageNumber === 0 }"
                        v-on:click="pageChange(0)">
                        <i class="fa fa-angle-double-left" aria-hidden="true"></i> First
                    </a>
                    <a class="btn btn-sm btn-default btn-active-til"
                        role="button"
                        v-bind:class="{ disabled: smsQuery.pageNumber === 0 }"
                        v-on:click="pageChange(smsQuery.pageNumber - 1)">
                        <i class="fa fa-angle-left" aria-hidden="true"></i> Previous
                    </a>
                    <small>Page {{ smsQuery.pageNumber + 1 }} of {{ smsHistory.totalPages }}</small>
                    <a class="btn btn-sm btn-default btn-active-til"
                        role="button"
                        v-bind:class="{ disabled: smsQuery.pageNumber === smsHistory.totalPages - 1 }"
                        v-on:click="pageChange(smsQuery.pageNumber + 1)">
                        Next <i class="fa fa-angle-right" aria-hidden="true"></i>
                    </a>
                    <a class="btn btn-sm btn-default btn-active-til"
                        role="button"
                        v-bind:class="{ disabled: smsQuery.pageNumber === smsHistory.totalPages - 1 }"
                        v-on:click="pageChange(smsHistory.totalPages - 1)">
                        Last <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                    </a>
                    </div>
                </div>
                </div>
            </div>
        </div>
        <div id="MemberSendMesgModal" class="modal fade" role="dialog">
            <div class="modal-dialog  modal-md">
            <!-- Modal content-->

            <div class="modal-content">
                <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" >&times;</button>
                <h4 class="modal-title"> Message Send </h4>
                </div>
                <div class="modal-body">
                <div class="form-group">
                    <div class="row">
                    <div class="col-md-10 col-md-offset-1">
                        <span>
                        <div class="comment">
                            <!--<span>Browse</span>-->
                            <b>Are you sure you want to send this message?</b>
                        </div>
                        </span>
                    </div>
                    </div>
                </div>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-sm btn-default btn-active-til" @click="sendMessage" data-dismiss="modal">Yes</button>
                <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">No</button>
                </div>
            </div>
            </div>
        </div>
   </div>
</template>

<script>
import Http from '../../services/Http'
export default {
  name: 'MemberSMSSendComponent',
  props: [
    'id'
  ],
  data () {
    return {
      showLoader: false,
      showSendMessageForm: false,
      maxPaginationItem: '',
      memberMSG: '',
      smsHistory:{},
      smsQuery: {
            pageNumber: 0,
            pageSize: 10,
      }
    }
  },
  created () {
    console.log('member likely names component created with id: ', this.id)
    this.init()
  },
  methods: {
    init () {
        this.smsQuery = Object.assign({}, {
            pageNumber: 0,
            pageSize: 10,
        })
      console.log('Hello')
      this.showLoader = true
      Http.GET('member', [this.id,'sms-history'],this.smsQuery)
        .then(({data: smsHistory}) => {
          this.showLoader = false
          this.smsHistory = smsHistory
          console.log(this.smsHistory.list)
        }, error => {
          this.showLoader = false
          console.error('Error in offers: ', error)
        })
    },
    sendMessage () {
        console.log("sending msg")
        const dataToSend={'text':this.memberMSG}
        Http.POST('member', dataToSend, [this.id, 'send-sms'])
      .then(({data: message}) => {
        this.showLoader = false
        $.notify({
            // options
          title: '<strong>Success!</strong>',
          message: 'Message has been sent successfully'
        }, {
          // settings
          type: 'success',
          delay: 3000
        })
        this.memberMSG = ''
        this.toggleSendMessage ()
        this.init()
      }, error => {
        this.showLoader = false
        console.error('Error in offers: ', error)
        $.notify({
          // options
          title: '<strong>Fail!</strong>',
          message: 'Message Sent failed'
        }, {
          // settings
          type: 'danger',
          delay: 3000
        })
      })
    },
    getSMSHistory () {
    this.showLoader = true
    Http.GET('member', [this.id,'sms-history'],this.smsQuery)
        .then(({data: smsHistory}) => {
          this.showLoader = false
          this.smsHistory = smsHistory
          console.log(this.smsHistory.list)
        }, error => {
          this.showLoader = false
          console.error('Error in offers: ', error)
        })
    },
    triggerSMSHistory () {
        this.smsQuery.pageNumber = 0
        console.log('trigger search activities method invoked.')
        this.getSMSHistory()
    },
    pageChange (number = 0, smsQuery = true) {
        console.log("hey there")
        if (number > -1 && number < this.smsHistory.totalPages && smsQuery && this.smsQuery.pageNumber !== number) { // activity query
            this.smsQuery.pageNumber = number
            this.getSMSHistory()
        }
    },
    toggleSendMessage () {
        if(this.showSendMessageForm) {
            this.showSendMessageForm = false
        }
        else {
            this.showSendMessageForm = true
        }

    },
    showSendMessageModal () {
        $('#MemberSendMesgModal').modal('show')
    },
  }

}
</script>