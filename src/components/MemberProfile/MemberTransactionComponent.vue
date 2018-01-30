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
      <form @submit.prevent="filterTransactions" @reset.prevent="resetTransactions"  @change="triggerSearchTransactions">
          <div class="form-group gr-12">
            <div class="gr-3">
              <label> Date Range From: </label>
              <input  type="date" name="fromRDate"  v-model="searchDateFrom" />
            </div>
            <div class="gr-3">
              <label>To:</label>
              <input type="date" name="toRange"  placeholder="to"
                     v-model="searchDateTo" />
            </div>



            <div class="gr-4"> <!-- #8b9eb6; -->
              <div class="form-group">
                <label>Type: </label>
                <div>
                  <div class="select select-sm">
                    <select id="sort-by-select" v-model="transactionQuery.serviceID">
                      <!--<select class="push-0.5" id="transaction-selector" v-model="transactionQuery.serviceID">-->
                      <option value=null disabled selected>Select Transaction Type</option>
                      <option v-for="service in serviceList" :value="service.id">{{ service.name  | underscoreless }}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>



          <div class="form-group push-4">
            <div class="gr-4">
              <button type="submit" class="button-search">
                <i class="fa fa-search" aria-hidden="true"></i> Search</button>
              <button type="reset" class="button-reset">
                <i class="fa fa-undo" aria-hidden="true"></i> Reset</button>
            </div>

            <div class="gr-1 push-3">
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
      <div>
            <table class="table ui celled" cellspacing="0" width="100%">
                <thead class="thead-default">
                    <tr>
                        <th style="text-align: center;">Transaction Id</th>
                        <th style="text-align: center;">Date</th>
                        <th style="text-align: center;">Transaction Type</th>
                        <th style="text-align: center;">Description</th>
                        <th style="text-align: right;">Amount</th>
                        <th style="text-align: right;">Fee</th>
                        <th style="text-align: right;">Net Amount</th>
                        <th style="text-align: right;">Balance</th>
                        <th style="text-align: center;">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="transaction in transactions.transactions" >
                        <td style="width: 200px;">{{ transaction.transactionID }}</td>
                        <td>{{ transaction.time | date('MMM D, YYYY - HH:mm:ss a') }}</td>
                        <td> {{ transaction.serviceID | static_mapper(serviceList) | underscoreless }}</td>
                        <td>{{ transaction.description }}</td>
                        <td style="text-align: right;">{{ transaction.amount }}</td>
                        <td style="text-align: right;">{{ transaction.fee }}</td>
                        <td style="text-align: right;">{{ transaction.currencyFilter }}{{ transaction.netAmount }}</td>
                        <td style="text-align: right;">{{ transaction.balance }}</td>
                        <td style="text-align: center;">{{ transaction.statusCode == 200 ? 'Success' :
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
  import Http from '../../services/Http'
  import Constants from '../../services/Constants'
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
          toDate: new Date().getTime()
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
          this.transactionQuery.toDate = new Date(this.searchDateTo).getTime() - 6 * 60 * 60 * 1000
        } else {
          this.transactionQuery.toDate = new Date().getTime() - 6 * 3600 * 1000
        }
        this.transactionQuery.pageNumber = 0
        console.log('transaction from: ', this.transactionQuery.fromDate, ' date: ',
          new Date(this.transactionQuery.fromDate), 'transaction to: ', this.transactionQuery.toDate)
        this.getTransactions()
      },

      getTransactions (key = 'member') {
        this.showLoader = true
        Http.GET(key, [this.id, 'transactions'], this.transactionQuery)
          .then(({data: transactions}) => {
            this.showLoader = false
            console.log('Success, got transactions: ', transactions)
            console.log('same transaction data: ')
            this.transactions = transactions
            let transactionHistory = transactions.transactions
            this.transactions.transactions = this.processForCurrencyFilter(transactionHistory)
            console.log('transaction histor',this.transactions)
            this.transactionTotalPages = Math.ceil(
              this.transactions.totalCount / this.transactionQuery.pageSize)
          }, error => {
            this.showLoader = false
            console.error('Error in getting members: ', error)
          })
      },
      processForCurrencyFilter (transactions)
      {
          const LENGTH = transactions.length;
          if (LENGTH > 0) {
              
              let service

              for (let i = 0; i < LENGTH; i++) {
                  service = transactions[i].serviceID
                  switch (service) {
                      case 1001:
                          transactions[i].currencyFilter = '+ '
                          transactions[i].serviceName="Transaction Service"
                          break
                      case 1:
                          transactions[i].serviceName="Send Money"
                          if (transactions[i].originatingMobileNumber === $scope.FormData.mobileNumber) {
                              transactions[i].currencyFilter = '- '
                          } else if (transactions[i].receiverInfo === $scope.FormData.mobileNumber) {
                              transactions[i].currencyFilter = '+ '
                          } else {
                              transactions[i].currencyFilter = '+ '
                          }
                          break
                      case 3001:
                          transactions[i].serviceName="Add Money"
                          transactions[i].currencyFilter = '+ '
                          break
                      case 963001:
                          transactions[i].serviceName="Add Money Revert"
                          transactions[i].currencyFilter = '- '
                          break
                      case 3002:
                          transactions[i].serviceName="Withdraw Money"
                          transactions[i].currencyFilter = '- '
                          break
                      case 2001:
                          transactions[i].serviceName="Top Up"
                          transactions[i].currencyFilter = '- '
                          break
                      case 2002:
                          transactions[i].serviceName="Top Up Rollback"
                          transactions[i].currencyFilter = '+ '
                          break
                      case 6001:
                          transactions[i].serviceName="Request Money"
                          
                          if(transactions[i].statusCode!==200 && transactions[i].statusCode!==102)
                          {
                              transactions[i].currencyFilter = ' '
                          }
                          else if(transactions[i].originatingMobileNumber === $scope.FormData.mobileNumber)
                          {
                              transactions[i].currencyFilter = '+ '
                          }
                          else
                          {
                              transactions[i].currencyFilter = '- '
                          }

                          break

                      case 6002:
                          transactions[i].serviceName="Payment"
                          if (transactions[i].originatingMobileNumber === $scope.FormData.mobileNumber) {
                              transactions[i].currencyFilter = '- '
                          } else if (transactions[i].receiverInfo === $scope.FormData.mobileNumber) {
                              transactions[i].currencyFilter = '+ '
                          } else {
                              transactions[i].currencyFilter = '+ '
                          }
                          break
                      case 6003:

                          transactions[i].serviceName="Invoice"
                          if (transactions[i].originatingMobileNumber === $scope.FormData.mobileNumber) {
                              transactions[i].currencyFilter = '- '
                          } else if (transactions[i].receiverInfo === $scope.FormData.mobileNumber) {
                              transactions[i].currencyFilter = '+ '
                          } else {
                              transactions[i].currencyFilter = '+ '
                          }
                          break
                      case 8001:

                          transactions[i].serviceName="Education"
                          if (transactions[i].originatingMobileNumber === $scope.FormData.mobileNumber) {
                              transactions[i].currencyFilter = '- '
                          } else if (transactions[i].receiverInfo === $scope.FormData.mobileNumber) {
                              transactions[i].currencyFilter = '+ '
                          } else {
                              transactions[i].currencyFilter = '+ '
                          }
                          break
                      case 7001:
                          transactions[i].serviceName="Internal Balance Transfer"
                          transactions[i].currencyFilter = '+'
                          if(transactions[i].additionalInfo.isReceiver == true)
                          {
                              transactions[i].currencyFilter = '-'
                          }
                          break;
                      case 1100:
                          transactions[i].serviceName="Offer"
                          transactions[i].currencyFilter = '+'
                          if(transactions[i].additionalInfo.isReceiver == true)
                          {
                              transactions[i].currencyFilter = '-'
                          }
                          break
                      default:
                          transactions[i].serviceName="N/A"
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
