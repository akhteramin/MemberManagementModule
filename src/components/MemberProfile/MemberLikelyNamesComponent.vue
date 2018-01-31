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

    <div v-if="nameList.length > 0" class="gr-4 push-3">
      <br>
      <table class="table ui celled" cellspacing="0" width="100%">
        <thead>
          <tr>
            <th class="text-center">Name</th>
            <th class="text-center">Frequency</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in nameList">

            <td class="text-left">{{ entry.name }}</td>

            <td class="text-center">{{ entry.frequency }}</td>

          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="text-center">
      <h3><strong>NO LIKELY NAMES</strong> </h3>
    </div>

  </div>
</template>

<script>
  import Http from '../../services/Http'
  export default {
    name: 'MemberLikelyNamesComponent',
    props: [
      'mobileNumber'
    ],
    data () {
      return {
        nameList: {},
        showLoader: false
      }
    },
    created () {
      console.log('member likely names component created with mobileNumber: ', this.mobileNumber)
      this.init()
    },
    methods: {
      init () {
        console.log('Hello')
        this.showLoader = true
        let parameter = {
          'mobileNumber': this.mobileNumber
        }
        // parameter.mobileNumber = '+8801930236786'
        console.log('calling with mobileNumber: ', parameter)
        Http.GET('member', ['likely-names'], parameter)
          .then(({data: likely_names}) => {
            this.showLoader = false
            this.nameList = likely_names.data.likelyNameList
            console.log('Success, got likely names: ', this.nameList)
          }, error => {
            this.showLoader = false
            console.error('Error in getting likely names: ', error)
          })
      }
    }
  }
</script>
