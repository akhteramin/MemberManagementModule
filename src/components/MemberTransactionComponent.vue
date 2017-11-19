 <template>
    <div>
      <br>
      <form @submit.prevent="filterTransactions" @reset.prevent="resetTransactions">
          <div class="form-group gr-12">
            <div class="gr-8">
              <label class="push-1"> Date Range From: </label>
              <input  type="date" name="fromRDate"  v-model="transactionQuery.fromDate" style="width: 200px;"
                      class="push-1"/>
              <label class="push-1">To:</label>
              <input type="date" name="toRange"  placeholder="to"
                     v-model="transactionQuery.toDate" style="width: 210px;"
                     class="push-1"/>
            </div>

          <!--<div  style="align-content: left;">-->
              <!--<label class="push-1"> Date Range From: </label>-->
              <!--<input  type="date" name="fromRDate"  v-model="transactionQuery.fromDate"/>-->
              <!--<label class="push-0.5">To:</label>-->
              <!--<input type="date" name="toRange"  v-model="transactionQuery.toDate"/>-->
          <!--</div>-->
            <div class="gr-1" style="height: 40px;
              text-align: center;  line-height: 40px;">
              <label class="push-1">Type: </label>
            </div>

            <div class="gr-3" style="border: 3px solid #C0C0C0; height: 37px; width: 200px;
                border-radius: 4px;"> <!-- #8b9eb6; -->
                <select id="transaction-selector" v-model="transactionQuery.serviceID">
                <!--<select class="push-0.5" id="transaction-selector" v-model="transactionQuery.serviceID">-->
                  <option value=null disabled selected>Select Transaction Type</option>
                  <option v-for="service in serviceList" :value="service.id">{{ service.name  | underscoreless }}</option>
                </select>
            </div>
          </div>


          <div class="form-group">
            <div class="form-group push-4">
              <div class="gr-4">
                <button type="submit" class="button-search">
                  <i class="fa fa-search" aria-hidden="true"></i> Search</button>
                <button type="reset" class="button-reset">
                  <i class="fa fa-undo" aria-hidden="true"></i> Reset</button>
              </div>
            </div>
          <!--<button type="submit">Filter</button>-->
          <!--<button type="reset">Reset</button>-->
          </div>
      </form>
      <div>
            <table class="table table-hover table-sm ">
                <thead class="thead-default">
                    <tr>
                        <th style="text-align: center;">Transaction Id</th>
                        <th style="text-align: center;">Date</th>
                        <th style="text-align: center;">Transaction Type</th>
                        <th style="text-align: center;">Description</th>
                        <th style="text-align: center;">Amount</th>
                        <th style="text-align: center;">Fee</th>
                        <th style="text-align: center;">Net Amount</th>
                        <th style="text-align: center;">Balance</th>
                        <th style="text-align: center;">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="transaction in transactions.transactions" >
                        <td style="width: 200px;">{{ transaction.transactionID }}</td>
                        <td>{{ transaction.time | date('MMM D, YYYY') }}</td>
                        <td> {{ transaction.serviceID | static_mapper(serviceList) | underscoreless }}</td>
                        <td>{{ transaction.description }}</td>
                        <td>{{ transaction.amount }}</td>
                        <td>{{ transaction.fee }}</td>
                        <td>{{ transaction.netAmount }}</td>
                        <td>{{ transaction.balance }}</td>
                        <td>{{ transaction.statusCode == 200 ? 'Success' :
                            transaction.statusCode == 102 ? 'In Progress' : 'Fail'}}</td>
                    </tr>
                </tbody>
            </table>
        </div>

      <div class="card-footer text-muted" v-if="transactions.totalCount > 0">
              <div class="row">
                <div class="gr-3">
                  <div style="margin-top: 0.2rem;" v-if="transactions.transactions">
                    <small>Showing {{ parseInt(transactionQuery.pageNumber * transactionQuery.pageSize + 1)
                      }} to {{ parseInt(transactionQuery.pageNumber * transactionQuery.pageSize + transactions.transactions.length)
                      }} out of {{ transactions.totalCount }}
                    </small>
                  </div>
                </div>
                <div class="gr-9">
                  <!-- Ticket Pagination -->
                  <div v-if="transactionTotalPages <= maxPaginationItem">
                    <nav aria-label="ActivityPagination">
                      <ul class="pagination pagination-sm justify-content-end">
                        <li class="page-item " v-bind:class="{ disabled: transactionQuery.pageNumber === 0 }">
                          <a class="page-link" v-on:click="pageChange(transactionQuery.pageNumber - 1, false)"
                             tabindex="-1">Previous</a>
                        </li>
                        <li class="page-item"
                            v-bind:class="{ active: transactionQuery.pageNumber === (n - 1) }"
                            v-for="n in transactionTotalPages">
                          <a class="page-link" v-on:click="pageChange(n - 1, false)" tabindex="-1">{{ n }}</a>
                        </li>
                        <li class="page-item" v-bind:class="{ disabled:
                        transactionQuery.pageNumber === activities.totalPages - 1 }">
                          <a class="page-link" v-on:click="pageChange(transactionQuery.pageNumber + 1, false)"
                             tabindex="-1">Next</a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                  <div class="pull-right" v-else>
                    <a class="btn btn-sm btn-secondary"
                       role="button"
                       v-bind:class="{ disabled: transactionQuery.pageNumber === 0 }"
                       v-on:click="pageChange(0, false)">
                      <i class="fa fa-angle-double-left" aria-hidden="true"></i> First
                    </a>
                    <a class="btn btn-sm btn-secondary"
                       role="button"
                       v-bind:class="{ disabled: transactionQuery.pageNumber === 0 }"
                       v-on:click="pageChange(transactionQuery.pageNumber - 1, false)">
                      <i class="fa fa-angle-left" aria-hidden="true"></i> Previous
                    </a>
                    <small>Page {{ transactionQuery.pageNumber + 1 }} of {{ transactionTotalPages }}</small>
                    <a class="btn btn-sm btn-secondary"
                       role="button"
                       v-bind:class="{ disabled: transactionQuery.pageNumber === transactionTotalPages - 1 }"
                       v-on:click="pageChange(transactionQuery.pageNumber + 1, false)">
                      Next <i class="fa fa-angle-right" aria-hidden="true"></i>
                    </a>
                    <a class="btn btn-sm btn-secondary"
                       role="button"
                       v-bind:class="{ disabled: transactionQuery.pageNumber === transactionTotalPages - 1 }"
                       v-on:click="pageChange(transactionTotalPages - 1, false)">
                      Last <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>

    </div>

</template>

<script>
  import Http from '../services/Http'
  import Constants from '../services/Constants'
  export default {
    name: 'MemberTransaction',
    props: [
      'id'
    ],
    data () {
      return {
        transactionQuery: {},
        transactions: {},
        transactionTotalPages: '',
        maxPaginationItem: '',
        serviceList: Constants
      }
    },
    methods: {
      init () {
        this.imageBaseUrl = Http.IMAGE_URL
        // Http call for basic information of the member with the 'id'
        this.transactionQuery = Object.assign({}, {
          pageNumber: 0,
          pageSize: 10,
          fromDate: 0,
          serviceID: null,
          toDate: new Date().getTime()
        })
        this.getTransactions()
      },
      resetTransactions () {
        this.init()
//        this.transactionQuery = Object.assign({}, {
//          pageNumber: 0,
//          pageSize: 10,
//          fromDate: null,
//          toDate: null
//        })
//        this.getTransactions()
      },
      filterTransactions () {
        // The adjustment is being made to avoid GMT issues.
//         let fromDate = this.transactionQuery.fromDate
//        let toDate = this.transactionQuery.toDate
        if (this.transactionQuery.fromDate !== null) {
          this.transactionQuery.fromDate = new Date(this.transactionQuery.fromDate).getTime() - 6 * 3600 * 1000
        } else {
          this.transactionQuery.fromDate = 0
        }
        if (this.transactionQuery.toDate !== null) {
          this.transactionQuery.toDate = new Date(this.transactionQuery.toDate).getTime() - 6 * 60 * 60 * 1000
        } else {
          this.transactionQuery.toDate = new Date().getTime() - 6 * 3600 * 1000
        }
        this.transactionQuery.pageNumber = 0
        console.log('transaction from: ', this.transactionQuery.fromDate, ' date: ',
          new Date(this.transactionQuery.fromDate), 'transaction to: ', this.transactionQuery.toDate)
        this.getTransactions()
      },

      getTransactions (key = 'member') {
        Http.GET(key, [this.id, 'transactions'], this.transactionQuery)
          .then(({data: transactions}) => {
            console.log('Success, got transactions: ', transactions)
            console.log('same transaction data: ')
            this.transactions = transactions
            this.transactionTotalPages = Math.ceil(
              this.transactions.totalCount / this.transactionQuery.pageSize)
          }, error => {
            console.error('Error in getting members: ', error)
          })
      },
      pageChange (number = 0, activeQuery = true) {
        if (!activeQuery && this.transactionQuery.pageNumber !== number) { // transaction query
          this.transactionQuery.pageNumber = number
          this.getTransactions()
        }
      }
    },
    created () {
      console.log('nav bar created::::')
      this.init()
    }
  }
</script>
