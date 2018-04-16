<template>
  <div>

    <div class="w3-header-card">
      <!-- ================================ Filter ============================== -->

      <form v-on:submit.prevent="filter" v-on:reset.prevent="init">
        <br>
        <!-- <div class="row"> -->
          <div class="gr-12">
            <div class="gr-2">
              <div class="form-group padding-5">
                <label> Mobile Number </label>
                <input  name="mobilenumber" type="text" id="mobilenumber"
                        v-model="query.searchNumber" placeholder="+8801XXXXXXXXX"
                        value=""/>
              </div>
            </div>
            <div class="gr-2">
              <div class="form-group padding-5">
                <label> Name </label>
                <input  name="queryName" type="text" id="queryName" placeholder="Name"
                        v-model="query.searchName"
                        value=""/>
              </div>
            </div>

            <div class="gr-2">
              <div class="form-group padding-5">
                <label class="push-0">iPay Account </label>
                <div class="push-0">
                  <div class="select select-sm">
                    <select  v-model="query.ipay">
                      <!--<option selected disabled>Select account type</option>-->
                      <option selected :value ="null">BOTH</option>
                      <option value=true>YES</option>
                      <option value=false>NO</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="gr-2">
              <div class="form-group padding-5">
                <label class="push-0"> Verified </label>
                <div class="push-0">
                  <div class="select select-sm">
                    <select id="verification-status" v-model="query.verified">
                      <option selected :value ="null">All</option>
                      <option value=true>YES</option>
                      <option value=false>NO</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

        <!-- </div> -->
        <!-- <div class="row"> -->
          <div class="gr-12">
            <div class="gr-4 push-4">
              <div class="form-group text-right">
                <button type="submit" class="button-search" :disabled="showLoader">
                  <i class="fa fa-search" aria-hidden="true"></i>
                  Search
                </button>
                <button type="reset" class="button-reset" :disabled="showLoader">
                  <i class="fa fa-undo" aria-hidden="true"></i>
                  Reset
                </button>
              </div>
            </div>
          </div>
        <!-- </div> -->
      </form>
      <!-- ================================ Filter ============================== -->
      <br>
      <table class="table ui celled" cellspacing="0" width="100%" v-if="friends.length > 0">
        <thead>
          <tr>
            <th>#</th>
            <th class="text-left">Name</th>
            <th class="text-center">Mobile Number</th>
            <th class="text-center">Verified</th>
            <th class="text-center">iPay Member</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry, index in friends">
            <td>{{ index + 1 }}</td>
            <td class="text-left">{{ entry.contactName }}</td>

            <td class="text-center">
              <span v-if="entry.iPayMember">
                <a class="pointer" @click="goToMember(entry.mobileNumber)">{{ entry.mobileNumber }}</a>
              </span>
              <span v-else>
                {{ entry.mobileNumber }}
              </span>
            </td>

            <td class="text-center">{{ entry.verified ? 'VERIFIED' : 'NOT VERIFIED'}}</td>

            <td class="text-center">{{ entry.iPayMember ? 'MEMBER' : 'NOT MEMBER' }}</td>

          </tr>
        </tbody>
      </table>
      <div v-else>
        <strong class="primary-font">NO ENTRIES FOUND</strong>
      </div>

      <div class="text-center"
        v-if="totalCount > query.pageNumber * query.pageSize">
        <a class="padding-5" role="button" @click="loadMore">
          <strong class="loadmore-color"> Load More </strong>
        </a>
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
    name: 'MemberFriendsComponent',
    props: [
      'mobileNumber'
    ],
    created () {
      this.init()
    },
    data () {
      return {
        friends: [],
        query: {},
        showLoader: false,
        totalCount: 1
      }
    },
    methods: {
      init () {
        this.query = Object.assign({}, {
          'mobileNumber': this.mobileNumber,
          'searchName': null,
          'searchNumber': null,
          'pageSize': 25,
          'pageNumber': 0,
          'ipay': null,
          'invited': null,
          'verified': null,
          'operatingOnAccountId': null
        })
        console.log('Component created with mobile num: ', this.mobileNumber)
        this.showLoader = true
        Http.GET('member', ['contacts'], this.query)
          .then(({data: friends}) => {
            this.showLoader = false
            this.totalCount = friends.totalCount
            this.friends = friends.contactList
            console.log('success in getting friends: ', this.friends)
          },
          error => {
            this.showLoader = false
            console.log('error in retrieving contact list: ', error)
          })
      },
      goToMember (mobileNumber) {
        Http.GET('mmAdminMember', {mobileNumber})
          .then(
            ({data}) => {
              console.log('found member::', data)
              window.open(`/member/profile/${data.accountId}/${data.accountType}`, '_blank')
            },
            error => {
              console.log(error)
            }
          )
      },
      loadMore () {
        this.query.pageNumber = this.query.pageNumber + 1
        console.log('loadMore, member friends component, query: ', this.query)
        this.showLoader = true
        Http.GET('member', ['contacts'], this.query)
          .then(({data: friends}) => {
            this.showLoader = false
            for (let indx in friends.contactList) {
              this.friends.push(friends.contactList[indx])
            }
            console.log('success in getting friends: ', this.friends)
          },
          error => {
            this.showLoader = false
            console.log('error in retrieving contact list: ', error)
          })
      },
      filter () {
        this.showLoader = true
        this.query.pageNumber = 0
        console.log('this.query: ', this.query)
        Http.GET('member', ['contacts'], this.query)
          .then(({data: friends}) => {
            this.showLoader = false
            this.totalCount = friends.totalCount
            this.friends = friends.contactList
            console.log('success in getting friends: ', this.friends)
          },
          error => {
            this.showLoader = false
            console.log('error in retrieving contact list: ', error)
          })
      }
    }
  }
</script>
