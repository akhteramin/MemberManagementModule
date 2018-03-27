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
            <th class="text-center">#</th>
            <th class="text-center">Tag</th>
            <th class="text-center">Remark</th>
            <th class="text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry,index in checklist">
            <td class="text-center" style="vertical-align: middle;"><strong>{{ index + 1 }}</strong></td>
            <td class="text-center" style="vertical-align: middle;">{{ entry.tag }}</td>
            <td class="text-center" style="white-space: pre-line; vertical-align: middle;">
              <div id="remark">{{ entry.remark || 'N/A' }}</div>
            </td>
            <!-- <td class="text-center"><input type="checkbox" @click.prevent.stop v-model="entry.status"/></td> -->
            <td class="text-center" style="vertical-align: middle;">
              <span :style="{'color': entry.status ? 'green' : 'red'}">
                <i class="fa" :class="{'fa-check': entry.status, 'fa-times': !entry.status }"></i>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="gr-4 push-4">
      <div class="form-group text-center">
        <!-- <button class="button-md-verify width-100" :disabled="showLoader"><i class="fa fa-pencil-square-o"></i> Update</button> -->
        <button class="button-md-verify width-100" :disabled="showLoader" @click="init()">Refresh <i class="fa fa-refresh"></i></button>
      </div>
    </div>

  </div>
</template>

<script>
  import Http from '../../services/Http'
  export default {
    name: 'MemberVerificationChecklist',
    props: [
      'id'
    ],
    data () {
      return {
        checklist: [],
        showLoader: false
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.showLoader = true
        Http.GET('member', [this.id, 'verification-criteria'])
          .then(
            ({data: {criteriaTagItems: list}}) => {
              console.log('criteria::', list)
              this.checklist = list
              this.showLoader = false
            },
            error => {
              console.log(error)
            }
          )
      },
      update () {
        this.showLoader = true
        Http.POST('member', [this.id, 'verification-criteria'], {criteriaTagItems: this.checklist})
          .then(
            ({data}) => {
              $.notify({
                // options
                title: '<strong>Success!</strong>',
                message: 'verification Checklist Updated Successfully.'
              }, {
                // settings
                type: 'success',
                delay: 3000
              })
            },
            error => {
              console.log(error)
              $.notify({
              // options
                title: '<strong>Updating Verification Checklist Failed!</strong>',
                message: 'Please try again.'
              }, {
                // settings
                type: 'danger',
                delay: 3000
              })
            }
          )
      }
    }
  }
</script>

<style>
  #remark {
    /* width: 350px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap; */
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
  }

  #remark:hover {
    /* width: auto;
    overflow: visible;
    white-space: pre-line; */
    overflow : visible;
    display: -webkit-box;
    -webkit-line-clamp: 100;
    -webkit-box-orient: vertical;
  }
</style>
