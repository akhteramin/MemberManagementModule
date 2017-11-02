<!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">-->

<template>
  <div class="NavBar" >

   
    <nav class="navbar navbar-toggleable-md navbar-light bg-faded">
       <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
         <span class="navbar-toggler-icon"></span>
       </button>
       <a class="navbar-brand" href="#">Member Service</a>
       <ul class="navbar-nav mr-auto">
 
         <li class="nav-item">
           <a class="nav-item nav-link" role="button" v-on:click="goHome">Home</a>
         </li>
         <li class="nav-item">
           <a class="nav-item nav-link" role="button" v-on:click="goToMemberList">Member List</a>
         </li>
        </ul>
        <ul class="navbar-nav" style="padding-right:20px">
          <li>
            <a class="nav-item nav-link" role="button" v-on:click="logout">Logout</a>
          </li>
        </ul>
   </nav>
   
  </div>
</template>



<script>
  import route from '../router'
  import Http from '../services/Http'

  export default {
    name: 'NavBar',
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
      goHome () {
        route.push('/home')
      },
      goToMemberList () {
        route.push('/member')
      }
    }
  }
</script>

