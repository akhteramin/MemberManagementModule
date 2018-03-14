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
    <div class="form-group push-0">
      <!--<div class="gr-4">-->
        <!--<button type="submit" class="button-search">-->
          <!--<i class="fa fa-search" aria-hidden="true"></i> Search</button>-->
        <!--<button type="reset" class="button-reset">-->
          <!--<i class="fa fa-undo" aria-hidden="true"></i> Reset</button>-->
      <!--</div>-->

      <div id="container" class="gr-12 height-40">
        <!--<label class="gr-5" style="background-color: red; width: 250px;">Number of entries per page</label>-->
        <div class="gr-1 push-11">
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

    <div class="table-responsive gr-12">
      <table class="table ui celled" cellspacing="0" width="100%" v-if="suspensionHistory.length > 0">
        <thead class="thead-default">
        <tr>
          <th class="text-center">#</th>
          <th class="text-center">Initiated On</th>
          <th class="text-center">Status</th>
          <th class="text-center">Effective From</th>
          <th class="text-center">Effective To</th>
          <th class="text-center">Taken By</th>
          <th class="text-center">Description</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="suspension, index in suspensionHistory" >
            <td class="width-30">{{ suspensionHistoryQuery.pageNumber * suspensionHistoryQuery.pageSize + 1 + index }}</td>
            <td class="text-center">{{ suspension.createdAt | date('MMM D, YYYY - HH:mm:ss a') }}</td>
            <td class="text-center">{{ suspension.suspensionStatus }} </td> <!--{{ activity.deviceBrowser }}-->
            <td class="text-center">{{ suspension.effectiveFrom | date('MMM D, YYYY - HH:mm:ss a') }}</td>
            <td v-if="suspension.effectiveTo > 10000000000000" class="text-center">{{ 'N/A' }}</td>
            <td v-else class="text-center">{{ suspension.effectiveTo | date('MMM D, YYYY - HH:mm:ss a') }}</td>
            <td class="text-center">{{ suspension.adminLoginId ? suspension.adminLoginId : (suspension.verifierId === -1 ? 'Auto Verification' : 'Legacy Admin User') }}</td>
            <td class="width-350 text-center;">{{ suspension.description }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else>
        <strong class="primary-font">NO ENTRIES FOUND</strong>
      </div>
    </div>

    <div class="card-footer text-muted" v-if="totalElements > 0 && totalPages > 1">
      <div class="row">
        <div class="gr-3">
          <div class="margin-top-rem" v-if="suspensionHistory">
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
            <a class="btn btn-sm btn-default btn-active-til"
               role="button"
               v-bind:class="{ disabled: suspensionHistoryQuery.pageNumber === 0 }"
               v-on:click="pageChange(0)">
              <i class="fa fa-angle-double-left" aria-hidden="true"></i> First
            </a>
            <a class="btn btn-sm btn-default btn-active-til"
               role="button"
               v-bind:class="{ disabled: suspensionHistoryQuery.pageNumber === 0 }"
               v-on:click="pageChange(suspensionHistoryQuery.pageNumber - 1)">
              <i class="fa fa-angle-left" aria-hidden="true"></i> Previous
            </a>
            <small>Page {{ suspensionHistoryQuery.pageNumber + 1 }} of {{ totalPages }}</small>
            <a class="btn btn-sm btn-default btn-active-til"
               role="button"
               v-bind:class="{ disabled: suspensionHistoryQuery.pageNumber === totalPages - 1 }"
               v-on:click="pageChange(suspensionHistoryQuery.pageNumber + 1)">
              Next <i class="fa fa-angle-right" aria-hidden="true"></i>
            </a>
            <a class="btn btn-sm btn-default btn-active-til"
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
          .then(({data: history}) => {
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


