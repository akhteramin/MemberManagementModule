<template>

  <div>

          <form v-if="user" v-on:submit.prevent="updateUserMethod" v-on:reset.prevent="doNotUpdateUser">

            <div class="row">
              <div class="gr-6 push-3 text-left">


                <div class="gr-11">
                  <div class="gr-2">
                  </div>
                </div>
                <div class="gr-12">
                  <div class="gr-4 padding-5">
                    Name:
                  </div>
                  <div class="gr-8 text-left padding-5">
                    <input type="text" class="input-sm"  value="updateRequest.name" v-model="updateRequest.name"/>
                    <!--{{ user.name || 'N/A'}}-->
                  </div>
                  <br>
                  <div class="gr-4 padding-5">
                    Email:
                  </div>
                  <div class="gr-8 text-left padding-5">
                    {{ user.email || 'N/A' }}
                  </div>
                  <br>
                  <div class="gr-4 padding-5">
                    Designation:
                  </div>
                  <div class="gr-8 text-left padding-5">
                    <input type="text" class="input-sm" value="updateRequest.designation" v-model="updateRequest.designation"/>
                  </div>
                  <br>
                  <div class="gr-4 padding-5">
                    Status:
                  </div>
                  <div class="gr-8 padding-5">
                      {{updateRequest.status}}
                    <!--div class="select select-sm">
                      <select v-model="updateRequest.status">
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="SUSPENDED">SUSPENDED</option>
                      </select>
                    </div-->
                  </div>
                  <br>
                  <div class="gr-4 padding-5">
                    <i class="fa fa-clock-o" aria-hidden="true"></i> User since:
                  </div>
                  <div class="gr-8 padding-5 text-left">
                    {{ user.creationTime | date('MMM D, YYYY') || 'N/A' }}
                  </div>
                  <br>
                </div>
              </div>

              <div class="gr-10 push-5">
                <br>
                <button type="submit" class="button-search">
                  <i class="fa fa-refresh" aria-hidden="true"></i> Update</button>
                <button type="reset" class="button-reset">
                  <i class="fa fa-times" aria-hidden="true"></i> Cancel</button>
              </div>

            </div>
          </form>
        </div>

</template>

<script>
  import Http from '../../services/Http'
  export default {
    name: 'UpdateUserComponent',
    props: [
      'loginID'
    ],
    data () {
      return {
        user: {},
        updateRequest: {},
        updatingUserId: '',
        showLoader: false
      }
    },
    created () {
      console.log('created user edit  information..., user login id iss: ', this.loginID)
      this.init()
    },
    methods: {
      init () {
        // Http call for basic information of the member with the 'id'
        let query = {
          'name': null,
          'email': this.loginID,
          'designation': null,
          'status': null,
          'pageNumber': 0,
          'pageSize': 10
        }
        this.showLoader = true
        Http.GET('user', query)
          .then(
            ({data: {data: list}}) => {
              this.showLoader = false
              this.user = list.list[0]
              this.updatingUserId = this.user.id
              this.updateRequest.name = this.user.name
              this.updateRequest.designation = this.user.designation
              this.updateRequest.status = this.user.status
              console.log('Successfully got the user: ', this.user)
            },
            error => {
              this.showLoader = false
              console.log('Error occurred getting details of the user, error: ', error)
            }
          )
      },
      updateUserMethod () {
        console.log('in update user, id: ', this.updatingUserId)
        this.showLoader = true
        Http.PUT('user', this.updateRequest, [this.updatingUserId])
          .then(() => {
            this.showLoader = false
            $.notify({
              // options
              title: '<strong>Success!</strong>',
              message: 'Document Uploaded successfully'
            }, {
              // settings
              type: 'success',
              delay: 3000
            })
            console.log('User updated successfully.')
            this.$emit('update', true)
          }, error => {
            this.showLoader = false
            $.notify({
              // options
              title: '<strong>Failure!</strong>',
              message: error.response.data.message
            }, {
              // settings
              type: 'danger',
              delay: 3000
            })
            if (error.response) {
              if (error.response.status === 401) { // unauthorized, logging out.
                this.logout()
              }
            }
            this.$emit('update', false)
            console.error('Error in getting users: ', error)
          })
      },
      doNotUpdateUser () {
        console.log('cancel button clicked...')
        this.$emit('update', false)
      }
    }
  }
</script>

<style>
   {
    height: 40px;
    width: 240px;
    border-style: solid;
  }
</style>
