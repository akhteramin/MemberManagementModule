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

      <br>
      <form @submit.prevent="filterTransactions" @reset.prevent="resetTransactions">
          <div class="gr-12">
            <div class="gr-2">
              <div class="form-group padding-5">
                <label> Date Range From </label>
                <input type="date" :max="searchDateTo !== null && searchDateTo !== '' ?
                new Date(searchDateTo).toISOString().substring(0,10)
                : new Date().toISOString().substring(0,10)" name="fromRDate"  v-model="searchDateFrom" />
              </div>
            </div>
            <div class="gr-2">
              <div class="form-group padding-5">
                <label>To</label>
                <input type="date" :min="new Date(searchDateFrom).toISOString().substring(0,10)" :max="new Date().toISOString().substring(0,10)" name="toRange"  placeholder="to"
                      v-model="searchDateTo" />
              </div>
            </div>



            <div class="gr-2"> <!-- #8b9eb6; -->
              <div class="form-group padding-5">
                <label>Service Type </label>
                <div>
                  <div class="select select-sm">
                    <select id="sort-by-select" v-model="transactionQuery.serviceID">
                      <!--<select class="push-0.5" id="transaction-selector" v-model="transactionQuery.serviceID">-->
                      <option value=null disabled selected>Select Service Type</option>
                      <option v-for="service in serviceList" :value="service.id">{{ service.name  | underscoreless }}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="gr-2"> <!-- #8b9eb6; -->
              <div class="form-group padding-5">
                <label>Type </label>
                <div>
                  <div class="select select-sm">
                    <select id="sort-by-select" v-model="transactionQuery.isPending">
                      <!--<select class="push-0.5" id="transaction-selector" v-model="transactionQuery.serviceID">-->
                      <option value="false" selected>Completed</option>
                      <option value="true" >Pending</option>
                      
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>



          <div class="gr-12">
            <div class="gr-2 push-6">
              <div class="form-group text-right">
                <button type="submit" class="button-search" :disabled="showLoader">
                  <i class="fa fa-search" aria-hidden="true"></i> Search</button>
                <button type="reset" class="button-reset" :disabled="showLoader">
                  <i class="fa fa-undo" aria-hidden="true"></i> Reset</button>
              </div>
            </div>

            <div class="gr-1 push-9">
              <div class="select select-sm">
                <select v-model="transactionQuery.pageSize">
                  <option disabled>Number of Entries</option>
                  <option selected value=10>10</option>
                  <option value=20>20</option>
                  <option value=30>30</option>
                  <option value=50>50</option>
                </select>
              </div>
            </div>
          </div>


      </form>
      <div class="table-responsive gr-12">
            <table class="table ui celled" cellspacing="0" width="100%" v-if="transactions.list && transactions.list.length > 0">
                <thead class="thead-default">
                    <tr>
                        <th class="text-center">Transaction Id</th>
                        <th class="text-center">Date</th>
                        <th class="text-center">Transaction Type</th>
                        <th class="text-center">Description</th>
                        <th class="text-right">Amount</th>
                        <th class="text-right">Fee</th>
                        <th class="text-right">Net Amount</th>
                        <th class="text-right">Balance</th>
                        <th class="text-center">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="transaction in transactions.list" >
                        <td class="width-200">{{ transaction.transactionID }}</td>
                        <td>{{ transaction.time | date('MMM D, YYYY - HH:mm:ss a') }}</td>
                        <td> {{ transaction.serviceID | static_mapper(serviceList) | underscoreless }}</td>
                        <td>{{ transaction.description }}</td>
                        <td class="text-right">{{ transaction.amount }}</td>
                        <td class="text-right">{{ transaction.fee }}</td>
                        <td class="text-right">{{ transaction.currencyFilter }}{{ transaction.netAmount }}</td>
                        <td class="text-right">{{ transaction.balance }}</td>
                        <td class="text-right">{{ transaction.statusCode == 200 ? 'Success' :
                            transaction.statusCode == 102 ? 'In Progress' : 'Fail'}}</td>
                    </tr>
                </tbody>
            </table>
            <div v-else>
              <strong class="primary-font">NO ENTRIES FOUND</strong>
            </div>
        </div>

      <div class="card-footer text-muted" v-if="transactions.totalElements > 0">
              <div class="row">
                <div class="gr-3">
                  <div class="margin-top-rem" v-if="transactions.list">
                    <small>Showing {{ parseInt(transactionQuery.pageNumber * transactionQuery.pageSize + 1)
                      }} to {{ parseInt(transactionQuery.pageNumber * transactionQuery.pageSize + transactions.list.length)
                      }} out of {{ transactions.totalElements }}
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
                    <a class="btn btn-sm btn-default btn-active-til"
                       role="button"
                       v-bind:class="{ disabled: transactionQuery.pageNumber === 0 }"
                       v-on:click="pageChange(0, false)">
                      <i class="fa fa-angle-double-left" aria-hidden="true"></i> First
                    </a>
                    <a class="btn btn-sm btn-default btn-active-til"
                       role="button"
                       v-bind:class="{ disabled: transactionQuery.pageNumber === 0 }"
                       v-on:click="pageChange(transactionQuery.pageNumber - 1, false)">
                      <i class="fa fa-angle-left" aria-hidden="true"></i> Previous
                    </a>
                    <small>Page {{ transactionQuery.pageNumber + 1 }} of {{ transactionTotalPages }}</small>
                    <a class="btn btn-sm btn-default btn-active-til"
                       role="button"
                       v-bind:class="{ disabled: transactionQuery.pageNumber === transactionTotalPages - 1 }"
                       v-on:click="pageChange(transactionQuery.pageNumber + 1, false)">
                      Next <i class="fa fa-angle-right" aria-hidden="true"></i>
                    </a>
                    <a class="btn btn-sm btn-default btn-active-til"
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
  import Http from '../../services/Http'
  import Constants from '../../services/Constants'
  export default {
    name: 'MemberTransaction',
    props: [
      'id',
      'mobileNumber'
    ],
    data () {
      return {
        transactionQuery: {},
        transactions: {},
        transactionTotalPages: '',
        maxPaginationItem: '',
        searchDateFrom: null,
        searchDateTo: null,
        serviceList: Constants,
        showLoader: false
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
          toDate: new Date().getTime(),
          isPending: 'false'
        })
        this.searchDateFrom = null
        this.searchDateTo = null
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
      triggerSearchTransactions () {
        this.transactionQuery.pageNumber = 0
        this.filterTransactions()
      },
      filterTransactions () {
        // The adjustment is being made to avoid GMT issues.
//         let fromDate = this.transactionQuery.fromDate
//        let toDate = this.transactionQuery.toDate
        if (this.searchDateFrom !== null) {
          this.transactionQuery.fromDate = new Date(this.searchDateFrom).getTime() - 6 * 3600 * 1000
        } else {
          this.transactionQuery.fromDate = 0
        }
        if (this.searchDateTo !== null) {
          this.transactionQuery.toDate = new Date(this.searchDateTo).getTime() - 6 * 60 * 60 * 1000 + (1000 * 60 * 60 * 24 * 1 - 1)
        } else {
          this.transactionQuery.toDate = new Date().getTime() - 6 * 3600 * 1000 + (1000 * 60 * 60 * 24 * 1 - 1)
        }
        this.transactionQuery.pageNumber = 0
        console.log('transaction from: ', this.transactionQuery.fromDate, ' date: ',
          new Date(this.transactionQuery.fromDate), 'transaction to: ', this.transactionQuery.toDate)
        this.getTransactions()
      },

      getTransactions (key = 'member') {
        this.showLoader = true
        Http.GET(key, [this.id, 'transactions'], this.transactionQuery)
          .then(({data: {data: transactions}}) => {
            this.showLoader = false
            console.log('Success, got transactions: ', transactions)
            console.log('same transaction data: ')
            this.transactions = transactions
            let transactionHistory = transactions.list
            this.transactions.list = this.processForCurrencyFilter(transactionHistory)
            console.log('transaction history', this.transactions)
            this.transactionTotalPages = this.transactions.totalPages
          }, error => {
            this.showLoader = false
            console.error('Error in getting members: ', error)
          })
      },
      processForCurrencyFilter (transactions) {
        const LENGTH = transactions.length
        if (LENGTH > 0) {
          let service

          for (let i = 0; i < LENGTH; i++) {
            service = transactions[i].serviceID
            switch (service) {
              case 1001:
                transactions[i].currencyFilter = '+ '
                transactions[i].serviceName = 'Transaction Service'
                break
              case 1:
                transactions[i].serviceName = 'Send Money'
                if (transactions[i].originatingMobileNumber === this.mobileNumber) {
                  transactions[i].currencyFilter = '- '
                } else if (transactions[i].receiverInfo === this.mobileNumber) {
                  transactions[i].currencyFilter = '+ '
                } else {
                  transactions[i].currencyFilter = '+ '
                }
                break
              case 3001:
                transactions[i].serviceName = 'Add Money'
                transactions[i].currencyFilter = '+ '
                break
              case 963001:
                transactions[i].serviceName = 'Add Money Revert'
                transactions[i].currencyFilter = '- '
                break
              case 3002:
                transactions[i].serviceName = 'Withdraw Money'
                transactions[i].currencyFilter = '- '
                break
              case 2001:
                transactions[i].serviceName = 'Top Up'
                transactions[i].currencyFilter = '- '
                break
              case 2002:
                transactions[i].serviceName = 'Top Up Rollback'
                transactions[i].currencyFilter = '+ '
                break
              case 6001:
                transactions[i].serviceName = 'Request Money'
  
                if (transactions[i].statusCode !== 200 && transactions[i].statusCode !== 102) {
                  transactions[i].currencyFilter = ' '
                } else if (transactions[i].originatingMobileNumber === this.mobileNumber) {
                  transactions[i].currencyFilter = '+ '
                } else {
                  transactions[i].currencyFilter = '- '
                }

                break

              case 6002:
                transactions[i].serviceName = 'Payment'
                if (transactions[i].originatingMobileNumber === this.mobileNumber) {
                  transactions[i].currencyFilter = '- '
                } else if (transactions[i].receiverInfo === this.mobileNumber) {
                  transactions[i].currencyFilter = '+ '
                } else {
                  transactions[i].currencyFilter = '+ '
                }
                break
              case 6003:

                transactions[i].serviceName = 'Invoice'
                if (transactions[i].originatingMobileNumber === this.mobileNumber) {
                  transactions[i].currencyFilter = '- '
                } else if (transactions[i].receiverInfo === this.mobileNumber) {
                  transactions[i].currencyFilter = '+ '
                } else {
                  transactions[i].currencyFilter = '+ '
                }
                break
              case 8001:

                transactions[i].serviceName = 'Education'
                if (transactions[i].originatingMobileNumber === this.mobileNumber) {
                  transactions[i].currencyFilter = '- '
                } else if (transactions[i].receiverInfo === this.mobileNumber) {
                  transactions[i].currencyFilter = '+ '
                } else {
                  transactions[i].currencyFilter = '+ '
                }
                break
              case 7001:
                transactions[i].serviceName = 'Internal Balance Transfer'
                transactions[i].currencyFilter = '+'
                if (transactions[i].additionalInfo.isReceiver == true) {
                  transactions[i].currencyFilter = '-'
                }
                break
              case 6003:

                transactions[i].serviceName = 'Invoice'
                if (transactions[i].originatingMobileNumber === $scope.FormData.mobileNumber) {
                  transactions[i].currencyFilter = '- '
                } else if (transactions[i].receiverInfo === $scope.FormData.mobileNumber) {
                  transactions[i].currencyFilter = '+ '
                } else {
                  transactions[i].currencyFilter = '+ '
                }
                break
              case 8001:

                transactions[i].serviceName = 'Education'
                if (transactions[i].originatingMobileNumber === $scope.FormData.mobileNumber) {
                  transactions[i].currencyFilter = '- '
                } else if (transactions[i].receiverInfo === $scope.FormData.mobileNumber) {
                  transactions[i].currencyFilter = '+ '
                } else {
                  transactions[i].currencyFilter = '+ '
                }
                break
              case 7001:
                transactions[i].serviceName = 'Internal Balance Transfer'
                transactions[i].currencyFilter = '+'
                if (transactions[i].additionalInfo.isReceiver == true) {
                  transactions[i].currencyFilter = '-'
                }
                break
              case 1100:
                transactions[i].serviceName = 'Offer'
                transactions[i].currencyFilter = '+'
                if (transactions[i].additionalInfo.isReceiver == true) {
                  transactions[i].currencyFilter = '-'
                }
                break
              default:
                transactions[i].serviceName = 'N/A'
                transactions[i].currencyFilter = '+ '
                break
            }
          }
        }
        return transactions || []
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
