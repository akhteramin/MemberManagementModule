<template>
  <div>
    <div class="col-md-4 col-md-offset-5 ">
      <div class="box">
        <h2>iPay Member Service</h2>
        <form role="form" @submit.prevent="createNewMember" id="loginForm">

          <div class="divider-form"></div>

          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" class="form-control" id="name" placeholder="Your name" v-model="name" required>
          </div>

          <div class="divider-form"></div>

          <div class="form-group">
            <label for="designation">Designation</label>
            <input type="text" class="form-control" id="designation" placeholder="Your designation" v-model="designation"
            required>
          </div>

          <div class="divider-form"></div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" class="form-control" id="email" placeholder="Your email" v-model="email" required>
          </div>

          <div class="divider-form"></div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" id="password"
                   required placeholder="Choose a password" v-model="password">
          </div>

          <div class="divider-form"></div>

          <div class="form-group">
            <label for="retypePassword">Retype Password</label>
            <input type="password" class="form-control" id="retypePassword" placeholder="Retype password"
                   required v-model="passwordReTyped">
          </div>

          <div class="divider-form"></div>


          <button type="submit" class="btn-block btn btn-lg btn-primary">Create User</button>

        </form>
      </div>
    </div>


    <div id="MemberAccountCreationResponse" class="modal fade" role="dialog">
      <div class="modal-dialog  modal-md">
        <!-- Modal content-->

        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" >&times;</button>
            <h4 class="modal-title">Change Account Status </h4>
          </div>
          <div class="modal-body" style="text-align: center;">
            <div v-if="accountCreationSuccessful">
              <i class="fa fa-check" aria-hidden="true" style="color: greenyellow;"></i> Account Created.
            </div>
            <div v-else>
              <i class="fa fa-ban" aria-hidden="true" style="color: red;"></i> Error in account creation. Try again.
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
  import Http from '../services/Http'
  import route from '../router'

  export default {
    name: 'CreateNewMemberComponent',
    created () {
      console.log('create member component created:::')
    },
    data () {
      return {
        name: '',
        designation: '',
        email: '',
        password: '',
        passwordReTyped: '',
        accountCreationSuccessful: false
      }
    },
    methods: {
      logout () {
        Http.GET('logout')
          .then(
            ({data: list}) => {
              console.log(list)
              console.log('hey')
              // auth.setAccessControl(list)
              localStorage.removeItem('token')
              route.push('/')
            }
          )
      },
      createNewMember () {
        if (this.password !== this.passwordReTyped) {
          alert('Passwords mismatched.')
          return
        }
        let createNewMemberRequest = {
          'name': this.name,
          'designation': this.designation,
          'email': this.email,
          'password': this.password
        }
        Http.POST('user', createNewMemberRequest)
          .then(({data}) => {
            console.log('Member created, response: ', data)
            this.accountCreationSuccessful = true
            $('#MemberAccountCreationResponse').modal({backdrop: false})
          },
          error => {
            if (error.response) {
              if (error.response.status === 401) { // unauthorized, logging out.
                this.logout()
              }
            }
            this.accountCreationSuccessful = false
            console.log('Error in member creation, error: ', error)
            $('#MemberAccountCreationResponse').modal({backdrop: false})
          })
      }
    }
  }
</script>
