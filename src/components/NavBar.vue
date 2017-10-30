<!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">-->

<template>
  <div class="NavBar" >
    <!--<nav class="navbar navbar-toggleable-md fixed-top navbar-light bg-faded">-->
      <!--&lt;!&ndash;<button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse"&ndash;&gt;-->
              <!--&lt;!&ndash;data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"&ndash;&gt;-->
              <!--&lt;!&ndash;aria-label="Toggle navigation">&ndash;&gt;-->
        <!--&lt;!&ndash;<span class="navbar-toggler-icon"></span>&ndash;&gt;-->
      <!--&lt;!&ndash;</button>&ndash;&gt;-->
      <!--&lt;!&ndash;<a class="navbar-brand" @click="$router.push('/')" style="cursor: pointer;">&ndash;&gt;-->
        <!--&lt;!&ndash;<img src="/static/images/ipay-icon-72x72.png" width="30" height="30" class="d-inline-block align-top"&ndash;&gt;-->
             <!--&lt;!&ndash;alt="iPay CRM"> CRM&ndash;&gt;-->
      <!--&lt;!&ndash;</a>&ndash;&gt;-->

      <!--<div class="collapse navbar-collapse" id="navbarSupportedContent">-->
        <!--<ul class="navbar-nav mr-auto">-->
          <!--<li class="nav-item" :class="{ 'active': $route.name === 'UnsolvedTicketList' }">-->
            <!--&lt;!&ndash;<router-link class="nav-link" to="/home">Home <span class="sr-only">(current)</span></router-link>&ndash;&gt;-->
            <!--<a href="#">Home</a>-->
          <!--</li>-->
          <!--&lt;!&ndash; <li class="nav-item dropdown" :class="{ 'active': $route.name === 'AgentList' || $route.name === 'NewAgent' || $route.name === 'AgentDetails' }">-->
            <!--<a class="nav-link dropdown-toggle" href="#" id="agentDropdown"-->
               <!--data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">-->
              <!--Agents-->
            <!--</a>-->
            <!--<div class="dropdown-menu" aria-labelledby="agentDropdown">-->
              <!--<router-link class="dropdown-item" to="/agent/new"><i class="fa fa-user-plus" aria-hidden="true"></i> Create New Agent</router-link>-->
              <!--<router-link class="dropdown-item" to="/agent"><i class="fa fa-users" aria-hidden="true"></i> Agent List</router-link>-->
            <!--</div>-->
          <!--</li> &ndash;&gt;-->
          <!--<li v-restrict="'CRM_AGENT_GET_FILTERED_LIST'" class="nav-item" :class="{ 'active': $route.name === 'AgentList' || $route.name === 'AgentDetails' || $route.name === 'NewAgent' }">-->
            <!--&lt;!&ndash;<router-link class="nav-link" to="/agent">Agents</router-link>&ndash;&gt;-->
            <!--<a href="#">No way!</a>-->
          <!--</li>-->
          <!--&lt;!&ndash; <li class="nav-item dropdown" :class="{ 'active': $route.name === 'TeamList' || $route.name === 'NewTeam' || $route.name === 'TeamDetails' }">-->
            <!--<a class="nav-link dropdown-toggle" href="#" id="agentDropdown"-->
               <!--data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">-->
              <!--Teams-->
            <!--</a>-->
            <!--<div class="dropdown-menu" aria-labelledby="agentDropdown">-->
              <!--<router-link class="dropdown-item" to="/team/new"><i class="fa fa-plus" aria-hidden="true"></i> Create New Team</router-link>-->
              <!--<router-link class="dropdown-item" to="/team"><i class="fa fa-list" aria-hidden="true"></i> Team List</router-link>-->
            <!--</div>-->
          <!--</li> &ndash;&gt;-->
          <!--<li v-restrict="'CRM_TEAM_GET_ALL'" class="nav-item" :class="{ 'active': $route.name === 'TeamList' || $route.name === 'NewTeam' || $route.name === 'TeamDetails' }">-->
            <!--<router-link class="nav-link" to="/team">Teams</router-link>-->
          <!--</li>-->
          <!--&lt;!&ndash; <li class="nav-item dropdown" :class="{ 'active': $route.name === 'TicketList' || $route.name === 'NewTicket' || $route.name === 'TicketDetails' || $route.name === 'TicketSettings' }">-->
            <!--<a class="nav-link dropdown-toggle" href="#" id="ticketDropdown"-->
               <!--data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">-->
              <!--Tickets-->
            <!--</a>-->
            <!--<div class="dropdown-menu" aria-labelledby="ticketDropdown">-->
              <!--<router-link class="dropdown-item" to="/ticket/new"><i class="fa fa-plus" aria-hidden="true"></i> Create New Ticket</router-link>-->
              <!--<router-link class="dropdown-item" to="/ticket"><i class="fa fa-list" aria-hidden="true"></i> Ticket List</router-link>-->
              <!--<router-link class="dropdown-item" to="/ticket/settings"><i class="fa fa-cog" aria-hidden="true"></i> Ticket Settings</router-link>-->
            <!--</div>-->
          <!--</li> &ndash;&gt;-->
          <!--<li v-restrict="'CRM_GET_TICKET_FILTERED'" class="nav-item" :class="{ 'active': $route.name === 'TicketList' || $route.name === 'NewTicket' || $route.name === 'TicketDetails' || $route.name === 'TicketSettings' || $route.name === 'CustomerTicketList'}">-->
            <!--<router-link class="nav-link" to="/ticket">Tickets</router-link>-->
          <!--</li>-->
          <!--<li v-restrict="'CRM_IPAY_MEMBER_GET_IPAY_MEMBER_FILTERED_LIST'" class="nav-item" :class="{ 'active': $route.name === 'MemberList' || $route.name === 'MemberDetail' }">-->
            <!--<router-link class="nav-link" to="/members">Members</router-link>-->
          <!--</li>-->
          <!--<li class="nav-item">-->
            <!--<a class="nav-link disabled" href="#">Reporting</a>-->
          <!--</li>-->
        <!--</ul>-->
        <!--<ul v-restrict="'TicketSettings|MENU'" class="navbar-nav navbar-right" id="customSettings">-->
          <!--<li class="nav-item">-->
            <!--<router-link class="nav-link" to="/ticket/settings"><i class="fa fa-cog" aria-hidden="true"></i> Settings</router-link>-->
          <!--</li>-->
        <!--</ul>-->
        <!--<ul class="navbar-nav navbar-right" id="customLogout">-->
          <!--<li class="nav-item">-->
            <!--<a class="nav-link" @click="logout"><i class="fa fa-sign-out" aria-hidden="true"></i> Logout</a>-->
          <!--</li>-->
        <!--</ul>-->
        <!--&lt;!&ndash; <form class="form-inline my-2 my-lg-0">-->
          <!--<input class="form-control mr-sm-2" type="text" placeholder="Search">-->
          <!--<button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>-->
        <!--</form> &ndash;&gt;-->
      <!--</div>-->
    <!--</nav>-->

    <!--==============================================================================================-->
    <!--<div class="container">-->
    <!--<h2>Tabs</h2>-->
    <!--<p>The .nav-stacked class is used to create vertical navigation pills:</p>-->
    <!--<ul class="nav nav-pills nav-stacked" role="tablist">-->
      <!--<li class="active"><a href="#">Home</a></li>-->
      <!--<li><a href="#">nonhtml</a></li>-->
      <!--<li><a href="#">CSS</a></li>-->
      <!--<li><a href="#">About</a></li>-->
    <!--</ul>-->
    <!--</div>-->

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
        <li class="nav-item">
          <a class="nav-item nav-link" role="button" v-on:click="logout">Logout</a>
        </li>

      </ul>
    </nav>

    <!--============================================================================================di-->

    <!--<div class="navbar-collapse collapse sidebar-navbar-collapse">-->
      <!--<ul class="nav navbar-nav">-->
        <!--<li class="active"><a href="#">Menu Item 1</a></li>-->
        <!--<li><a href="#">Menu Item 2</a></li>-->
        <!--<li><a href="#">Menu Item 3</a></li>-->
        <!--<li><a href="#">Menu Item 4</a></li>-->
        <!--<li><a href="#">Reviews <span class="badge">1,118</span></a></li>-->
      <!--</ul>-->
    <!--</div>&lt;!&ndash;/.nav-collapse &ndash;&gt;-->


    <!--<p>Hello</p>-->
    <!--<ul class="nav nav-pills nav-stacked" role = "tablist">-->
      <!--<li class="active"><button>Home</button></li>-->
      <!--<li class="dropdown">-->
        <!--<button class="dropdown-toggle" data-toggle="dropdown" >Members</button>-->
        <!--<ul class="dropdown-menu">-->
          <!--<li><button href="#">Personal Members</button></li>-->
          <!--<li><button href="#">Business Members</button></li>-->
        <!--</ul>-->
      <!--</li>-->

      <!--<li><button>Logout</button></li>-->
    <!--</ul>-->

    <!--======================================================================================-->

    <!--Hello-->
      <!--<div class="navbar-collapse collapse navbar-right">-->
        <!--<ul class="nav navbar-nav">-->
          <!--<li>-->
            <!--<button @click="logout" class="xyz">Home</button>-->
          <!--</li> <br>-->
          <!--<li>-->
           <!--<button @click="logout" class="xyz">Logout</button>-->
          <!--</li>-->
        <!--</ul>-->
    <!--</div>-->
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
        route.push('/member/list')
      }
    }
  }
</script>

