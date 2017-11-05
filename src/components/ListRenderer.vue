<template>
  <div id = "list" class="ListRenderer col-md-12">
    <div class="row justify-content-center">
      <br>
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h3>
              <i class="fa fa-list" aria-hidden="true"></i> Member List
            </h3>
          </div>
          <!--========================================= my filters ==================================================-->

            <form v-on:submit.prevent="filter">
              <div class="row">
                <div class="col-3">
                  <div class="form-group">
                    <label> Name: </label>
                    <input  name="queryName" type="tel" id="queryName" placeholder="John Doe"
                            v-model="query.name" style="width:180px;"
                            value=""/>
                  </div>
                </div>

                <!--placeholder="+8801XXXXXXXXX" -->
                <div class="col-3">
                  <div class="form-group">
                    <label> Mobile Number: </label>
                    <input  name="mobilenumber" type="tel" id="mobilenumber"
                            v-model="query.mobileNumber" style="width:150px;" placeholder="+8801XXXXXXXXX"
                            value=""/>
                  </div>
                </div>

                <div class="col-3"> <!--col-2.5-->
                  <div class="form-group">
                    <label>Account Type: </label>
                    <select id="personal-business-select"  v-model="query.accountType">
                      <!--<option selected disabled>Select account type</option>-->
                      <option selected value = "">Both</option>
                      <option value="Personal">Personal</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                </div>

                <div class="col-3"> <!--2-->
                  <div class="form-group">
                    <label> Verified: </label>
                    <select id="verification-status" v-model="query.verificationStatus">
                      <option selected value = "">All</option>
                      <option value="VERIFIED">Verified</option>
                      <option value="NOT_VERIFIED">Not Verified</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </div>


                <div class="form-group offset-1">
                  <label> Profile Completion Range: </label>
                  <input  type="number" name="fromRange" placeholder="from" style="width: 55px;"
                          min="0" max="99" maxlength="2" v-model="query.profileCompletionScoreStartRange"/>
                  <input type="number" name="toRange" placeholder="to"
                         style="width: 55px;" min="1" max="100" v-model="query.profileCompletionScoreEndRange"/>
                </div>

                <div class="form-group offset-1">
                  <label>Sort by: </label>
                  <select id="sort-by-select"  v-model="query.sort">
                    <!--<option selected disabled>Select account type</option>-->
                    <option selected value = "DOCUMENT_UPLOAD">Document Upload Date</option>
                    <option value="CREATION_DATE">Creation Date</option>
                  </select>
                </div>
                <div class="form-group offset-1">
                  <label>Order by: </label>
                  <select id="order-by-select"  v-model="query.order">
                    <!--<option selected disabled>Select account type</option>-->
                    <option selected value = "DESC">Descending</option>
                    <option value="ASC">Ascending</option>
                  </select>
                </div>





                <div class="col-12">
                  <div class="form-group">
                    <button type="submit" >Search</button>
                    <button @click="init">Reset</button>
                  </div>
                </div>

              </div>
            </form>
          </div>

          <!--========================================= my filters ==================================================-->
          <div class="card-block">
            <!--<i  v-show="true" class="fa fa-spinner fa-spin"></i>-->
            <table class="table table-hover table-sm ">
              <thead class="thead-default">
              <tr>
                <th style="text-align: left;">#</th>
                <th style="text-align: center;">Name</th>
                <th style="text-align: center;">Mobile Number</th>
                <th style="text-align: center;">Account Type</th>
                <th style="text-align: center;">Verification</th>
                <th style="text-align: center;">Profile Completed</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="member in members.list" @click="openNewTab(member.accountId)">
                <th scope="row">{{ member.accountId }}</th>
                <td>{{ member.name }}</td>
                <td>{{ member.mobileNumber }}</td>
                <td>{{ member.accountType == 1 ? 'Personal' : 'Business' }}</td>
                <td>{{ member.verificationStatus }}</td>
                <td>{{ member.profileCompletionScore }}%</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="card-footer text-muted" v-if="members.totalElements > 0">
            <div class="row">
              <div class="col-3">
                <div style="margin-top: 0.2rem;" v-if="members.list">
                  <small>Showing {{ parseInt(query.pageNumber * query.pageSize + 1)
                    }} to {{ parseInt(query.pageNumber * query.pageSize + members.list.length)
                    }} out of {{ members.totalElements }}
                  </small>
                </div>
              </div>
              <div class="col-9">
                <!-- Ticket Pagination -->
                <div v-if="members.totalPages <= maxPaginationItem">
                  <nav aria-label="MemberPagination">
                    <ul class="pagination pagination-sm justify-content-end">
                      <li class="page-item " v-bind:class="{ disabled: query.pageNumber === 0 }">
                        <a class="page-link" v-on:click="pageChange(query.pageNumber - 1)" tabindex="-1">Previous</a>
                      </li>
                      <li class="page-item"
                          v-bind:class="{ active: query.pageNumber === (n - 1) }"
                          v-for="n in members.totalPages">
                        <a class="page-link" v-on:click="pageChange(n - 1)" tabindex="-1">{{ n }}</a>
                      </li>
                      <li class="page-item" v-bind:class="{ disabled: query.pageNumber === members.totalPages - 1 }">
                        <a class="page-link" v-on:click="pageChange(query.pageNumber + 1)" tabindex="-1">Next</a>
                      </li>
                    </ul>
                  </nav>
                </div>
                <div class="pull-right" v-else>
                  <a class="btn btn-sm btn-secondary"
                     role="button"
                     v-bind:class="{ disabled: query.pageNumber === 0 }"
                     v-on:click="pageChange(0)">
                    <i class="fa fa-angle-double-left" aria-hidden="true"></i> First
                  </a>
                  <a class="btn btn-sm btn-secondary"
                     role="button"
                     v-bind:class="{ disabled: query.pageNumber === 0 }"
                     v-on:click="pageChange(query.pageNumber - 1)">
                    <i class="fa fa-angle-left" aria-hidden="true"></i> Previous
                  </a>
                  <small>Page {{ query.pageNumber + 1 }} of {{ members.totalPages }}</small>
                  <a class="btn btn-sm btn-secondary"
                     role="button"
                     v-bind:class="{ disabled: query.pageNumber === members.totalPages - 1 }"
                     v-on:click="pageChange(query.pageNumber + 1)">
                    Next <i class="fa fa-angle-right" aria-hidden="true"></i>
                  </a>
                  <a class="btn btn-sm btn-secondary"
                     role="button"
                     v-bind:class="{ disabled: query.pageNumber === members.totalPages - 1 }"
                     v-on:click="pageChange(members.totalPages - 1)">
                    Last <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  import Http from '../services/Http'

  export default {
    name: 'ListRenderer',
    data () {
      return {
        members: [],
        query: {},
        maxPaginationItem: 10
      }
    },
    methods: {
      getMembers: function (key = 'member') {
        Http.GET(key, this.query)
          .then(({data: {data}}) => {
            console.log('Success, got members: ', data)
            this.members = data
          }, error => {
            console.error('Error in getting members: ', error)
          })
      },
      pageChange (number = 0) {
        if (this.query.pageNumber !== number) {
          this.query.pageNumber = number
          this.getMembers()
        }
      },
      openNewTab (value) {
        console.log('Okay, I am doing it now!!!, value: ', value)
        window.open(`${window.location.href}/${value}`, '_blank')
      },
      init () {
        this.query = Object.assign({}, {
          name: '', // string
          mobileNumber: '', // string
          accountType: '', // int: 1 = personal, 2 = business
          verificationStatus: '', // string: VERIFIED, NOT_VERIFIED
          profileCompletionScoreStartRange: '',
          profileCompletionScoreEndRange: '',
          sort: 'DOCUMENT_UPLOAD',
          order: 'DESC',
          pageNumber: 0,
          pageSize: 10
        })

        console.log('Okkokkkkk line 150')
        this.getMembers()
      },
      filter: function (key = 'member') {
        if (this.query.accountType === 'Personal') {
          this.query.accountType = 1
        } else if (this.query.accountType === 'Business') {
          this.query.accountType = 2
        }
        console.log('mobile number: ' + this.query.mobileNumber + ' accountType: ' + this.query.accountType +
          ' verified: ' + this.query.verificationStatus)
        Http.GET('member', this.query)
          .then(({data: {data}}) => {
            console.log('Success in getting filtered results, data: ', data)
            this.members = data
          }, error => {
            console.log('Error in getting filtered results: ', error)
          })
      }
    },
    created () {
      console.log('Member list component created::::')
      this.init()
    }
  }
</script>
