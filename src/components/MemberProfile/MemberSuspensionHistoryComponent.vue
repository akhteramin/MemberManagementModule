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
    <div class="form-group push-4">
      <!--<div class="gr-4">-->
        <!--<button type="submit" class="button-search">-->
          <!--<i class="fa fa-search" aria-hidden="true"></i> Search</button>-->
        <!--<button type="reset" class="button-reset">-->
          <!--<i class="fa fa-undo" aria-hidden="true"></i> Reset</button>-->
      <!--</div>-->

      <div id="container" class="gr-8" style="height: 40px;">
        <!--<label class="gr-5" style="background-color: red; width: 250px;">Number of entries per page</label>-->
        <div class="gr-2 push-10">
          <div class="select select-sm">
            <select v-model="suspensionHistoryQuery.pageSize" @change="getSuspensionHistory(true)">
              <option disabled>Number of Entries</option>
              <option selected value=10>10</option>
              <option value=20>20</option>
              <option value=30>30</option>
              <option value=50>50</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div>
      <table class="table ui celled" cellspacing="0" width="100%">
        <thead class="thead-default">
        <tr>
          <th style="text-align: center;">#</th>
          <th style="text-align: center;">Initiated On</th>
          <th style="text-align: center;">Status</th>
          <th style="text-align: center;">Effective From</th>
          <th style="text-align: center;">Effective To</th>
          <th style="text-align: center;">Taken By</th>
          <th style="text-align: center;">Description</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="suspension, index in suspensionHistory" >
            <td style="width: 30px;">{{ suspensionHistoryQuery.pageNumber * suspensionHistoryQuery.pageSize + 1 + index }}</td>
            <td style="text-align: center;">{{ suspension.createdAt | date('MMM D, YYYY - HH:mm:ss a') }}</td>
            <td style="text-align: center;">{{ suspension.suspensionStatus }} </td> <!--{{ activity.deviceBrowser }}-->
            <td style="text-align: center;">{{ suspension.effectiveFrom | date('MMM D, YYYY - HH:mm:ss a') }}</td>
            <td style="text-align: center;">{{ suspension.effectiveTo | date('MMM D, YYYY - HH:mm:ss a') }}</td>
            <td style="text-align: center;">{{ suspension.adminUserDetails ? suspension.adminUserDetails.name : 'SYSTEM' }}</td>
            <td style="width: 350px; text-align: center;">{{ suspension.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card-footer text-muted" v-if="totalElements > 0 && totalPages > 1">
      <div class="row">
        <div class="gr-3">
          <div style="margin-top: 0.2rem;" v-if="suspensionHistory">
            <small>Showing {{ parseInt(suspensionHistoryQuery.pageNumber * suspensionHistoryQuery.pageSize + 1)
              }} to {{ parseInt(suspensionHistoryQuery.pageNumber * suspensionHistoryQuery.pageSize
              + suspensionHistory.length)
              }} out of {{ totalElements }}
            </small>
          </div>
        </div>
        <div class="gr-9">
          <div v-if="totalPages <= maxPaginationItem">
            <nav aria-label="SuspensionHistoryPagination">
              <ul class="pagination pagination-sm justify-content-end">
                <li class="page-item " v-bind:class="{ disabled: suspensionHistoryQuery.pageNumber === 0 }">
                  <a class="page-link" v-on:click="pageChange(suspensionHistoryQuery.pageNumber - 1)" tabindex="-1">Previous</a>
                </li>
                <li class="page-item"
                    v-bind:class="{ active: suspensionHistoryQuery.pageNumber === (n - 1) }"
                    v-for="n in totalPages">
                  <a class="page-link" v-on:click="pageChange(n - 1)" tabindex="-1">{{ n }}</a>
                </li>
                <li class="page-item" v-bind:class="{ disabled: suspensionHistoryQuery.pageNumber === totalPages - 1 }">
                  <a class="page-link" v-on:click="pageChange(suspensionHistoryQuery.pageNumber + 1)" tabindex="-1">Next</a>
                </li>
              </ul>
            </nav>
          </div>
          <div class="pull-right" v-else>
            <a class="btn btn-sm btn-secondary"
               role="button"
               v-bind:class="{ disabled: suspensionHistoryQuery.pageNumber === 0 }"
               v-on:click="pageChange(0)">
              <i class="fa fa-angle-double-left" aria-hidden="true"></i> First
            </a>
            <a class="btn btn-sm btn-secondary"
               role="button"
               v-bind:class="{ disabled: suspensionHistoryQuery.pageNumber === 0 }"
               v-on:click="pageChange(suspensionHistoryQuery.pageNumber - 1)">
              <i class="fa fa-angle-left" aria-hidden="true"></i> Previous
            </a>
            <small>Page {{ suspensionHistoryQuery.pageNumber + 1 }} of {{ totalPages }}</small>
            <a class="btn btn-sm btn-secondary"
               role="button"
               v-bind:class="{ disabled: suspensionHistoryQuery.pageNumber === totalPages - 1 }"
               v-on:click="pageChange(suspensionHistoryQuery.pageNumber + 1)">
              Next <i class="fa fa-angle-right" aria-hidden="true"></i>
            </a>
            <a class="btn btn-sm btn-secondary"
               role="button"
               v-bind:class="{ disabled: suspensionHistoryQuery.pageNumber === totalPages - 1 }"
               v-on:click="pageChange(totalPages - 1)">
              Last <i class="fa fa-angle-double-right" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Http from '../../services/Http'
  export default {
    name: 'MemberSuspensionHistory',
    props: [
      'id'
    ],
    data () {
      return {
        activities: {},
        maxPaginationItem: 10,
        suspensionHistory: {},
        suspensionHistoryQuery: {},
        totalElements: 0,
        totalPages: 0,
        hasNextPage: false,
        showLoader: false
      }
    },
    methods: {
      init () {
        this.imageBaseUrl = Http.IMAGE_URL
        // Http call for basic information of the member with the 'id'
        this.suspensionHistoryQuery = Object.assign({}, {
          pageNumber: 0,
          pageSize: 10,
          order: 'DESC' // or 'ASC'
        })
        this.getSuspensionHistory()
      },
      pageChange (number = 0) {
        if (number >= 0 && number < this.totalPages && this.suspensionHistoryQuery.pageNumber !== number) {
          this.suspensionHistoryQuery.pageNumber = number
          this.getSuspensionHistory()
          console.log('on page change, suspension history query.pageNumber: ', this.suspensionHistoryQuery.pageNumber,
            ' total pages: ', this.totalPages)
        }
      },
      getSuspensionHistory (startEntryFromZero = false) {
        if (startEntryFromZero === true) {
          this.suspensionHistoryQuery.pageNumber = 0
        }
        this.showLoader = true
        Http.GET('member', [this.id, 'suspension-history'], this.suspensionHistoryQuery)
          .then(({data: {data: history}}) => {
            this.showLoader = false
            console.log('Success, got history: ', history)
            this.suspensionHistory = history.list
            this.totalElements = history.totalElements
            this.totalPages = history.totalPages
            console.log('suspension history: ', this.suspensionHistory)
          }, error => {
            this.showLoader = false
            console.error('Error in getting history: ', error)
          })
      }
    },
    created () {
      this.init()
    }
  }
</script>


