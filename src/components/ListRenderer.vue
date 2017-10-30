<template>
  <div class="ListRenderer col-md-12">
    <div class="row justify-content-center">
      <br>
      <div class="col-md-11">
        <div class="card">
          <div class="card-header">
            <h3>
              <i class="fa fa-list" aria-hidden="true"></i> Member List
            </h3>
          </div>
          <div class="card-block">
            <!--<i  v-show="true" class="fa fa-spinner fa-spin"></i>-->
            <table class="table table-hover table-sm ">
              <thead class="thead-default">
              <tr>
                <th style="text-align: left;">#</th>
                <th style="text-align: center;">Name</th>
                <th style="text-align: center;">Mobile Number</th>
                <!--<th>Assignee</th>-->
                <!--<th>Team</th>-->
                <!--<th>Category</th>-->
                <!--<th>Subcategory</th>-->
                <!--<th>Priority</th>-->
                <!--<th>Status</th>-->
                <!--<th>Channel</th>-->
                <!--<th>Created Date</th>-->
                <!--<th>KPI</th>-->
                <!--<th>TAT</th>-->
              </tr>
              </thead>
              <tbody>
              <tr v-for="member in members.list"> <!--@click="openNewTab(ticket.id)"-->
                <!-- <tr v-for="ticket in tickets.list" @click="$router.push(`/ticket/${ticket.id}`)"> -->
                <th scope="row">{{ member.accountId }}</th>
                <td>{{ member.name }}</td>
                <td>{{ member.mobileNumber }}</td>
                <!--<td>{{ member.assignee ? ticket.assignee.name : '-' }}</td>-->
                <!--<td>{{ ticket.team ? ticket.team.name : '-' }}</td>-->
                <!--<td>{{ ticket.category.name }}</td>-->
                <!--<td>{{ ticket.subcategory.name }}</td>-->
                <!--<td>{{ ticket.priority.name }}</td>-->
                <!--<td>{{ ticket.status.name }}</td>-->
                <!--<td>{{ ticket.channel.name }}</td>-->
                <!--<td>{{ ticket.creationTime | date('MMM D, YYYY') }}</td>-->
                <!--<td>{{ ticket.kpi | date('MMM D - h:mm A') }}</td>-->
                <!--<td>{{ ticket.tat | date('MMM D - h:mm A') }}</td>-->
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
      init () {
        this.query = Object.assign({}, {
          pageNumber: 0,
          pageSize: 10
        })
        console.log('Okkokkkkk line 150')
        this.getMembers()
      }
    },
    created () {
      console.log('Member list component created::::')
      this.init()
    }
  }
</script>
