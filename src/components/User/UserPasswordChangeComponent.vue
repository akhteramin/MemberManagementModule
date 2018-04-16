<template>
  <div id="content" style="width:100%">
    <div class="gr-6 push-5">
        <h1>Change Password</h1>
    </div>
    <div class="gr-12">
      <hr>
      <div class="row">
        <div class="gr-6 push-3 w3-header-card w3-panel w3-border-top w3-border-bottom w3-border-left w3-round">
          <form @submit.prevent="changePassword">
            <br>
            <div class="row">
              <div class="form-group">
                <div class="col-md-6 text-right">
                  <label class="control-label">Login ID:</label>
                </div>
                <div class="col-md-6 text-left">
                  <h4>{{loginID}}</h4>
                </div>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="form-group">
                <div class="col-md-6 text-right">
                  <label class="control-label">Old Password:</label>
                </div>
                <div class="col-md-4 text-left">
                  <input type="password" v-model="oldPassword" required minlength="8"/>
                </div>
              </div>
            </div>
            <br>
            <div class="row">
              <div class="form-group">
                <div class="col-md-6 text-right">
                  <label class="control-label">New Password:</label>
                </div>
                <div class="col-md-4 text-left">
                  <input type="password" v-model="password" required minlength="8"/>
                </div>
              </div>
            </div>
            <br>
            <div class="row">
              <div class="form-group">
                <div class="col-md-6 text-right">
                  <label class="control-label">Retype New Password:</label>
                </div>
                <div class="col-md-4 text-left">
                  <input type="password" v-model="rePassword" required minlength="8"/>
                </div>
              </div>
            </div>
            <br>
            <div class="gr-3 push-6">
              <div class="form-group text-left">
                <button type="submit" class="button-search" :disabled="showLoader" style="margin-left: 5px;">
                  <i class="fa fa-refresh" aria-hidden="true"></i> UPDATE
                </button>
              </div>
            </div>
          </form>
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
    name: 'UserPasswordChangeComponent',
    data () {
      return {
        oldPassword: '',
        password: '',
        rePassword: '',
        loginID: '',
        showLoader: false
      }
    },
    created () {
      const user = JSON.parse(localStorage.getItem('user'))
      this.loginID = user.loginID
      console.log(user, this.loginID)
    },
    methods: {
      changePassword (key = 'set') {
        if (this.password !== this.rePassword) {
          // passwords don't match
          $.notify({
            // options
            title: `<strong>Passwords don't match!</strong>`,
            message: 'Please try again.'
          }, {
            // settings
            type: 'danger',
            delay: 3000
          })
        } else {
          // make POST call
          this.showLoader = true
          const param = Object.assign({}, {
            loginID: this.loginID,
            old_password: this.oldPassword,
            new_password: this.password,
            appID: 6
          })
          console.log(param)
          Http.PUT('changePassword', param)
            .then(
              response => {
                this.showLoader = false
                console.log(response)
                $.notify({
                  // options
                  title: `<strong>Success!</strong>`,
                  message: 'Password successfully changed.'
                }, {
                  // settings
                  type: 'success',
                  delay: 3000
                })
              },
              error => {
                this.showLoader = false
                console.log(error)
                $.notify({
                  // options
                  title: `<strong>Password change failed!</strong>`,
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
  }
</script>
