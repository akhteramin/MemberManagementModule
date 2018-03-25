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

    <div class="gr-10 push-1">
      <br>
      <table class="table ui celled" cellspacing="0" width="100%">
        <thead>
          <tr>
            <th class="text-center">Issue</th>
            <th class="text-center">Description</th>
            <th class="text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in checklist">

            <td class="text-center">{{ entry.name }}</td>
            <td class="text-center">{{ entry.description }}
            <td class="text-center"><input type="checkbox" v-model="entry.status"/></td>

          </tr>
        </tbody>
      </table>
    </div>
    <div class="gr-4 push-4">
      <div class="form-group text-center">
        <button class="button-md-verify width-100" :disabled="showLoader"><i class="fa fa-pencil-square-o"></i> Update</button>
        <button class="button-md-verify width-100" :disabled="showLoader">Refresh <i class="fa fa-refresh"></i></button>
      </div>
    </div>

  </div>
</template>

<script>
  // import Http from '../../services/Http'
  export default {
    name: 'MemberVerificationChecklist',
    props: [
      'id'
    ],
    data () {
      return {
        checklist: [
          {
            name: 'Parent in Contact',
            description: 'Parent mobile no found in member contact list',
            status: true
          }
        ],
        showLoader: false
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        console.log('Hello')
      }
    }
  }
</script>
