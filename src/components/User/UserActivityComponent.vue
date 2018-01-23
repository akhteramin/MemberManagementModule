 <template>
    <div>
        <form @submit.prevent="filterActivities" @reset.prevent="resetActivities">
            <div class="form-group gr-12">
            <div  style="align-content: left;">
              <br>
              <div class="gr-3">
                <label> From: </label>
                <input  type="date" name="fromRDate" placeholder=activityQuery.fromDate  v-model="searchFromDate"/>
              </div>
              <div class="gr-3">
                <label>To:</label>
                <input type="date" name="toRange"  placeholder=activityQuery.toDate v-model="searchToDate"/>
              </div>
              <div class="gr-4">
                <label class="justify-content-md-start" for="search-key">Description</label>
                <input id="search-key" v-model="activityQuery.searchKey"
                       placeholder="description" type="text">
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
                  <select v-model="activityQuery.pageSize" @change="triggerSearchActivities">
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
                <th style="text-align: center;">Activity</th>
                <th style="text-align: center;">Device Information</th>
                <th style="text-align: center;">Service ID</th>
                <th style="text-align: center;">Time</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="activity in activities.list" >
                <td style="width: 250px;">{{ activity.description }}</td>
                <td style="width: 300px; text-align: center;">{{ activity.deviceName }}, {{ activity.deviceOs }}  </td> <!--{{ activity.deviceBrowser }}-->
                <td style="width: 800px; text-align: center;">{{ activity.serviceId }}</td>
                <td style="text-align: center;">{{ activity.time | date('MMM D, YYYY') }}</td>
            </tr>
            </tbody>
            </table>
        </div>

        <div class="card-footer text-muted" v-if="activities.totalElements > 0 && activities.totalPages > 1">
            <div class="row">
            <div class="gr-3">
                <div style="margin-top: 0.2rem;" v-if="activities.list">
                <small>Showing {{ parseInt(activityQuery.pageNumber * activityQuery.pageSize + 1)
                    }} to {{ parseInt(activityQuery.pageNumber * activityQuery.pageSize + activities.list.length)
                    }} out of {{ activities.totalElements }}
                </small>
                </div>
            </div>
            <div class="gr-9">
                <div v-if="activities.totalPages <= maxPaginationItem">
                <nav aria-label="ActivityPagination">
                    <ul class="pagination pagination-sm justify-content-end">
                    <li class="page-item " v-bind:class="{ disabled: activityQuery.pageNumber === 0 }">
                        <a class="page-link" v-on:click="pageChange(activityQuery.pageNumber - 1)" tabindex="-1">Previous</a>
                    </li>
                    <li class="page-item"
                        v-bind:class="{ active: activityQuery.pageNumber === (n - 1) }"
                        v-for="n in activities.totalPages">
                        <a class="page-link" v-on:click="pageChange(n - 1)" tabindex="-1">{{ n }}</a>
                    </li>
                    <li class="page-item" v-bind:class="{ disabled: activityQuery.pageNumber === activities.totalPages - 1 }">
                        <a class="page-link" v-on:click="pageChange(activityQuery.pageNumber + 1)" tabindex="-1">Next</a>
                    </li>
                    </ul>
                </nav>
                </div>
                <div class="pull-right" v-else>
                <a class="btn btn-sm btn-secondary"
                    role="button"
                    v-bind:class="{ disabled: activityQuery.pageNumber === 0 }"
                    v-on:click="pageChange(0)">
                    <i class="fa fa-angle-double-left" aria-hidden="true"></i> First
                </a>
                <a class="btn btn-sm btn-secondary"
                    role="button"
                    v-bind:class="{ disabled: activityQuery.pageNumber === 0 }"
                    v-on:click="pageChange(activityQuery.pageNumber - 1)">
                    <i class="fa fa-angle-left" aria-hidden="true"></i> Previous
                </a>
                <small>Page {{ activityQuery.pageNumber + 1 }} of {{ activities.totalPages }}</small>
                <a class="btn btn-sm btn-secondary"
                    role="button"
                    v-bind:class="{ disabled: activityQuery.pageNumber === activities.totalPages - 1 }"
                    v-on:click="pageChange(activityQuery.pageNumber + 1)">
                    Next <i class="fa fa-angle-right" aria-hidden="true"></i>
                </a>
                <a class="btn btn-sm btn-secondary"
                    role="button"
                    v-bind:class="{ disabled: activityQuery.pageNumber === activities.totalPages - 1 }"
                    v-on:click="pageChange(activities.totalPages - 1)">
                    Last <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                </a>
                </div>
            </div>
            </div>
        </div>

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

    </div>
</template>

<script>
  import Http from '../../services/Http'
  export default {
    name: 'MemberActivity',
    props: [
      'id'
    ],
    data () {
      return {
        activities: {},
        maxPaginationItem: '',
        searchFromDate: null,
        searchToDate: null,
        showLoader: false
      }
    },
    methods: {
      init () {
        this.imageBaseUrl = Http.IMAGE_URL
        // Http call for basic information of the member with the 'id'
        this.activityQuery = Object.assign({}, {
          pageNumber: 0,
          pageSize: 10,
          searchKey: '',
          fromDate: null,
          toDate: null
        })
        this.getActivities()
      },
      resetActivities () {
        this.activityQuery = Object.assign({}, {
          pageNumber: 0,
          pageSize: 10,
          fromDate: null,
          toDate: null,
          searchKey: ''
        })
        this.searchFromDate = null
        this.searchToDate = null
        this.getActivities()
      },
      triggerSearchActivities () {
        this.activityQuery.pageNumber = 0
        console.log('trigger search activities method invoked.')
        this.filterActivities()
      },
      filterActivities () {
        // The adjustment is being made to avoid GMT issues.
//         let fromDate = this.transactionQuery.fromDate
//        let toDate = this.transactionQuery.toDate
        if (this.searchFromDate !== null) {
          this.activityQuery.fromDate = new Date(this.searchFromDate).getTime() - 6 * 3600 * 1000
        } else {
          this.activityQuery.fromDate = 0
        }
        if (this.searchToDate !== null) {
          this.activityQuery.toDate = new Date(this.searchToDate).getTime() - 6 * 60 * 60 * 1000
        } else {
          this.activityQuery.toDate = new Date().getTime() - 6 * 3600 * 1000
        }
        this.activityQuery.pageNumber = 0
        this.getActivities()
      },
      getActivities () {
        this.showLoader = true
        let paramData = '?pageNumber='+this.activityQuery.pageNumber+
        '&pageSize='+this.activityQuery.pageSize+'&toDate='+this.activityQuery.toDate+
        '&fromDate='+this.activityQuery.fromDate+'&userId='+this.id+
        '&description='+this.activityQuery.searchKey
        Http.GET('user', ['activity',paramData])
          .then(({data: {data: activities}}) => {
            this.showLoader = false
            console.log('Success, got activities: ', activities)
            this.activities = activities
          }, error => {
            this.showLoader = false
            console.error('Error in getting members: ', error)
          })
      },
      pageChange (number = 0, activeQuery = true) {
        if (number > 0 && number < this.activities.totalPages && activeQuery && this.activityQuery.pageNumber !== number) { // activity query
          this.activityQuery.pageNumber = number
          this.getActivities()
        }
      }
    },
    created () {
      console.log('nav bar created::::')
      this.init()
    }
  }
</script>


