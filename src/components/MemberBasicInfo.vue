<template>

  <div class="gr-10 push-2" v-if="member">
      <br>
      <div class="gr-12"> <!--offset-md-1-->
        <div class="card"> <!-- class="card"-->
          <h3 class="card-header">
            <i class="fa fa-user" aria-hidden="true"></i> Member Information</h3>



          <div id = "nav-bar">
            <ul class="nav nav-tabs">
              <li class="gr-3 text-center" :class="{active: showBasicDetails}"
                  @click="setTab('basicDetails')"><a data-toggle="tab">Basic Details</a></li>
              <!--<li class="col-md-3 text-center" ng-click="setType('approved')"><a data-toggle="tab" >Approved</a></li>-->
              <li class="gr-3 text-center" :class="{active: showActivities}"
                  @click="setTab('activities')"><a data-toggle="tab">Activities</a></li>
              <li class="gr-3 text-center" :class="{active: showTransactions}"
                  @click="setTab('transactions')"><a data-toggle="tab">Transactions</a></li>
            </ul>
          </div>



          <div  v-if="showBasicDetails">
                <div v-if="member.basicInfo">
                  
                  <div class="row">
                    <div class="gr-2 push-6">
                      Balance: {{ member.basicInfo.accountCurrency || 'N/A'}} BDT
                    </div>
                  </div>
                  <br>
                  <div class="row">
                    
                    <div class="gr-2">
                      <img class="img-rounded"  :src="profilePicture(member.basicInfo.mmUserPictures[0].document.url)"
                                     data-holder-rendered="true" width="200" height="200">
                    </div>
                    <div class="gr-9 text-left push-.5">
                      <div class="gr-12">
                        <div class="gr-2">
                          <h5><b>Basic Information</b></h5>
                        </div>    
                        <div class="gr-2 push-6" v-if="!editBasicProfileMode">
                            <button class="button-md-edit" @click="editBasicInfo()"><i class="fa fa-pencil-square-o"></i> Edit </button>
                        </div>                
                      </div>
                      <div v-if="!editBasicProfileMode">
                        <div class="gr-2">
                          Name:                    
                        </div>
                        <div class="gr-4 text-left">
                          {{ member.basicInfo.name || 'N/A'}}                   
                        </div>
                        <div class="gr-2">
                          Mobile Number:                    
                        </div>
                        <div class="gr-4 text-left pull-.5">
                          {{ member.basicInfo.mobileNumber || 'N/A' }}                  
                        </div>
                        <div class="gr-2">
                          Email:           
                        </div>
                        <div class="gr-4 text-left">
                        {{  member.emails.length !== 0 ? member.emails[0].emailAddress: 'N/A' }}
                        </div>
                        <div class="gr-2">
                          Date of Birth:                  
                        </div>
                        <div class="gr-4 text-left pull-.5">
                        {{ member.basicInfo.dateOfBirth | date('MMM D, YYYY') || 'N/A' }}
                        </div>
                        <div class="gr-2">
                        Gender:
                        </div>
                        <div class="gr-4 text-left">
                        <i v-bind:class="{'fa fa-male':member.basicInfo.gender==='M','fa fa-female':member.basicInfo.gender==='F'}"></i>{{ !member.basicInfo.gender ? 'N/A' : '' }}
                        </div>
                        <div class="gr-2">
                        Occupation:
                        </div>
                        <div class="gr-4 text-left pull-.5">
                        {{ occupationName || 'N/A' }}
                        </div>

                        <div class="gr-2">
                        Verification Status:
                        </div>
                        <div class="gr-4 text-left">
                          {{ member.basicInfo.verificationStatus === null ? 'N/A': member.basicInfo.verificationStatus == 'VERIFIED' ? 'Verified':
                          member.basicInfo.verificationStatus == 'NOT_VERIFIED' ? 'Not Verified':
                          member.basicInfo.verificationStatus == 'IN_PROGRESS' ? 'In Progress':
                          'Rejected'}}                      
                        </div>
                        <div class="gr-2">
                        Member Since:
                        </div>
                        <div class="gr-4 text-left pull-.5">
                        {{ member.basicInfo.accountCreationDate | date('MMM D, YYYY') || 'N/A' }}
                        </div>
                        <div class="gr-2">
                        Organization Name:
                        </div>
                        <div class="gr-4 text-left pull-.5">
                        {{ member.basicInfo.organizationName || 'N/A' }}
                        </div>
                      </div>
                      <div v-else>
                        <form v-on:submit.prevent="updateMemberBasicProfile">

                        <div class="gr-2">
                          Name:                    
                        </div>
                        <div class="gr-4 text-left">
                          <input  name="memberName" class="input-sm" type="text" id="memberName" placeholder="Name"
                          v-model="member.basicInfo.name"/>                  
                        </div>
                        <div class="gr-2">
                          Mobile Number:                    
                        </div>
                        <div class="gr-4 text-left pull-.5">
                          {{ member.basicInfo.mobileNumber || 'N/A' }}                  
                        </div>
                        <br><br><br>
                        <div class="gr-2">
                          Email:           
                        </div>
                        <div class="gr-4 text-left">
                        <input  name="memberEmail" class="input-sm" type="email" id="memberEmail" placeholder="Email"
                          v-model="member.emails[0].emailAddress"/>
                        </div>
                        <div class="gr-2">
                          Date of Birth:                  
                        </div>
                        <div class="gr-4 text-left pull-.5">
                          <input type="date" class="input-sm" name="memberDOB" v-model="dob"/>
                        </div>
                        <div class="gr-2">
                        Gender:
                        </div>
                        <div class="gr-4 text-left">
                          <div class="select select-sm">
                            <select id="genderSelection"  v-model="member.basicInfo.gender">
                              <option value="">Select Gender</option>
                              <option value="M">Male</option>
                              <option value="F">Female</option>
                          </select>
                          </div>
                        </div>
                        <div class="gr-2">
                        Occupation:
                        </div>
                        <div class="gr-4 text-left pull-.5">
                          <div class="select select-sm">
                            <select id="occupationSelection" v-model="member.basicInfo.occupation">
                              <option value="">Select Occupation</option>
                              <option v-for="occupation in occupationList" :value="occupation.id">{{ occupation.name }}</option>
                          </select>
                          </div>
                        </div>

                        <div class="gr-2">
                        Verification Status:
                        </div>
                          <div class="gr-4 text-left">
                            <div class="select select-sm">
                              <select id="occupationSelection" v-model="member.basicInfo.verificationStatus" disabled>
                                <option value="">Select Status</option>
                                <option value="NOT_VERIFIED">Not Verified</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="VERIFIED">Verified</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                          </div>          
                        </div>
                        <div class="gr-2">
                        Member Since:
                        </div>
                        <div class="gr-4 text-left pull-.5">
                        {{ member.basicInfo.accountCreationDate | date('MMM D, YYYY') || 'N/A' }}
                        </div>

                        <div class="gr-2">
                        Organization Name:
                        </div>
                        <div class="gr-4 text-left pull-.5">
                          <input  name="memberOrganizationName" class="input-sm" type="text" id="memberOrganizationName" placeholder="Organization Name"
                          v-model="member.basicInfo.organizationName"/>                          
                        </div>

                        <div class="gr-4 push-4">
                          <div class="form-group">
                            <button type="submit" class="button-search">
                              <i class="fa fa-edit" aria-hidden="true"></i>
                              Update
                            </button>
                            <button type="reset" class="button-reset" @click="editBasicInfo()">
                              <i class="fa fa-times"></i>
                              Cancel
                            </button>
                          </div>
                        </div>
                      </form>
                      </div>
                      <hr>
                    <div class="gr-12">
                      <div class="gr-2">
                          <h5><b>Family Information</b></h5>
                        </div>    
                        <div class="gr-2 push-6">
                            <button class="button-md-edit" @click="editParents()"><i class="fa fa-pencil-square-o"></i> Edit </button>
                        </div>     
                    </div>
                    <div v-if="!editParentsMode">
                      <div class="gr-2">
                      Father Name:
                      </div>
                      <div class="gr-4 text-left">
                        {{ member.basicInfo.father || 'N/A' }}   
                                                            
                      </div>
                      <div class="gr-2">
                      Mother Name:
                      </div>
                      <div class="gr-4 text-left">
                        {{ member.basicInfo.mother || 'N/A' }}                                       
                      </div>
                      <div class="gr-2">
                      Father Mobile:
                      </div>
                      <div class="gr-4 text-left">
                        {{ member.basicInfo.fatherMobileNumber || 'N/A' }}                                       
                      </div>
                      <div class="gr-2">
                      Mother Mobile:
                      </div>
                      <div class="gr-4 text-left">
                        {{ member.basicInfo.motherMobileNumber || 'N/A' }}                                       
                      </div>
                    </div>

                    <div v-else>
                    <form v-on:submit.prevent="updateMemberParents">
                      <div class="gr-2">
                      Father Name:
                      </div>
                      <div class="gr-4 text-left">
                        <input  name="memberFather" class="input-sm" type="text" id="memberFather" placeholder="Father Name"
                          v-model="member.basicInfo.father"/>                                      
                      </div>
                      <div class="gr-2">
                      Mother Name:
                      </div>
                      <div class="gr-4 text-left">
                        <input  name="memberMother" class="input-sm" type="text" id="memberMother" placeholder="Mother Name"
                          v-model="member.basicInfo.mother"/>                                      
                      </div>
                      <div class="gr-2">
                      Father Mobile:
                      </div>
                      <div class="gr-4 text-left">
                        <input  name="memberFatherMobile" class="input-sm" type="text" id="memberFatherMobile" placeholder="Father Mobile Number"
                          v-model="member.basicInfo.fatherMobileNumber"/>                                      
                      </div>
                      <div class="gr-2">
                      Mother Mobile:
                      </div>
                      <div class="gr-4 text-left">
                        <input  name="memberMotherMobile" class="input-sm" type="text" id="memberMotherMobile" placeholder="Mother Mobile Number"
                          v-model="member.basicInfo.motherMobileNumber"/>                       
                      </div>
                      <div class="gr-4 push-4">
                          <div class="form-group">
                            <button type="submit" class="button-search">
                              <i class="fa fa-edit" aria-hidden="true"></i>
                              Update
                            </button>
                            <button type="reset" class="button-reset" @click="editBasicInfo()">
                              <i class="fa fa-times"></i>
                              Cancel
                            </button>
                          </div>
                        </div>
                    </form>
                    </div>
                    
                  </div>
                </div>

                <hr>
              </div>

                <div v-if="member.addresses">
                  <h3>Address</h3>
                  <br>
                  <div class="row justify-content-center">
                    <!-- ================================= Address 1 =============================================== -->

                    <div class="gr-5">
                      <h5 style="align: center;">Present</h5>
                      <br>
                      <div class="row text-left">
                        <div class="gr-2">
                          Line 1:
                        </div>
                        <div class="gr-3">
                          {{ member.addresses.length !== 0 ? member.addresses[0].addressLine1 : 'N/A' }}
                        </div>
                      </div>
                      <div class="row text-left">
                        <div class="gr-2">
                          Line 2:
                        </div>
                        <div class="gr-3 ">
                          {{ member.addresses.length !== 0 ? member.addresses[0].addressLine2 : 'N/A' }}
                        </div>
                      </div>
                      <div class="row text-left">
                        <div class="gr-2">
                          Thana:
                        </div>
                        <div class="gr-3">
                          {{ thanaNameFirst }}
                        </div>
                      </div>
                      <div class="row text-left">
                        <div class="gr-2">
                          District:
                        </div>
                        <div class="gr-3">
                          {{ districtNameFirst }}
                        </div>
                      </div>
                      <div class="row text-left">
                        <div class="gr-2">
                          Country:
                        </div>
                        <div class="gr-3">
                          {{ countryNameFirst }}
                        </div>
                      </div>
                    </div>

                    <!-- ================================= Address 2 =============================================== -->

                    <div class="gr-5">
                      <h5 style="align: center;">Parmanent</h5>
                      <br>
                      <div class="row text-left">
                        <div class="gr-2">
                          Line 1:
                        </div>
                        <div class="gr-3">
                          {{ member.addresses.length > 1 ? member.addresses[1].addressLine1 : 'N/A' }}
                        </div>
                      </div>
                      <div class="row text-left">
                        <div class="gr-2">
                          Line 2:
                        </div>
                        <div class="gr-3 ">
                          {{ member.addresses.length > 1 ? member.addresses[1].addressLine2 : 'N/A' }}
                        </div>
                      </div>
                      <div class="row text-left">
                        <div class="gr-2">
                          Thana:
                        </div>
                        <div class="gr-3">
                          {{ thanaNameSecond }}
                        </div>
                      </div>
                      <div class="row text-left">
                        <div class="gr-2">
                          District:
                        </div>
                        <div class="gr-3">
                          {{ districtNameSecond }}
                        </div>
                      </div>
                      <div class="row text-left">
                        <div class="gr-2">
                          Country:
                        </div>
                        <div class="gr-3">
                          {{ countryNameSecond }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr>
                </div>

                <div>
                  <div class="verification">
                    <div>

                      <div class="row justify-content-center">
                        <div class="gr-10">
                          <h3>Bank Info</h3>
                          <div v-if="bankAccounts.length === 0">N/A<br></div>
                          <div v-else-if="bankAccounts" class="pre-scrollable" style="height: 210px;">
                            <table class="table table-hover table-sm">
                              <thead class="thead-default">
                              <tr>
                                <th class = "text-center">Bank</th>
                                <th class = "text-center">A/C No</th>
                                <th class = "text-center">A/C Name</th>
                                <th class = "text-center">A/C Status</th>
                                <th class = "text-center">Verification</th>
                                <th class = "text-center">Added</th>
                              </tr>
                              </thead>
                              <tbody>
                              <tr v-for="item in bankAccounts">
                                <td>{{ item.bankName }}</td>
                                <td>{{ item.accountNumber }}</td>
                                <td>{{ item.accountName }}</td>
                                <td><span class="badge" :class="{'badge-success': true }">ACTIVE</span></td>
                                <td>{{ item.verificationStatus }}</td>
                                <td>{{ item.creationDate | date }}</td>
                              </tr>
                              </tbody>
                            </table>
                          </div>
                          <br>
                        </div>
                      </div>

                      <div class="row justify-content-center">
                        <div class="gr-10">
                          <h3>Identification Documents</h3>
                          <strong v-if="documents === null || documents.length === 0">N/A<br></strong>
                          <div v-else class="pre-scrollable" style="height: 210px;">
                            <table class="table table-hover table-sm">
                              <thead class="thead-default">
                              <tr>
                                <th class = "text-center">Name</th>
                                <th class = "text-center">Type</th>
                                <th class = "text-center">URL</th>
                                <th class = "text-center">Verification</th>
                              </tr>
                              </thead>
                              <tbody>
                              <tr v-for="item in documents">
                                <td>{{ item.documentName ? item.documentName : 'N/A' }}</td>
                                <td>{{ item.documentType ? item.documentType : 'N/A' }}</td>
                                <td>{{ item.documentUrl ? item.documentUrl : 'N/A'}}</td>
                                <td>{{ item.documentVerificationStatus | underscoreless }}</td>
                              </tr>
                              </tbody>
                            </table>
                          </div>
                          <br>
                        </div>
                      </div>



                      <div class="row justify-content-center" v-if="introducers">

                        <div class="gr-5">
                          <h5>Introduced by</h5>
                          <hr>
                          <strong v-if="introducers.length === 0">N/A</strong>
                          <div v-else class="pre-scrollable" style="height: 210px;">
                            <div class="row" v-for="item in introducers">
                              <div class="gr-3">
                                <img class="img-rounded mx-auto d-block" :src="profilePicture(item.profilePictureUrl)"
                                     data-holder-rendered="true" style="width: 50px;">
                              </div>
                              <div class="gr-9">
                                {{item.name}}<br>
                                {{item.mobileNumber}}
                                <hr>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div class="gr-5">
                          <h5>Has Introduced</h5>
                          <hr>
                          <strong v-if="introduced.length === 0">N/A</strong>
                          <div v-else class="pre-scrollable" style="height: 210px;">
                            <div class="row" v-for="item in introduced">
                              <div class="gr-3">
                                <img class="img-rounded mx-auto d-block" :src="profilePicture(item.profilePictureUrl)"
                                     data-holder-rendered="true" style="width: 50px;">
                              </div>
                              <div class="gr-9">
                                {{item.name}}<br>
                                {{item.mobileNumber}}
                                <hr>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
          </div>

          <div v-if="showActivities">

            <form @submit.prevent="filterActivities" @reset.prevent="resetActivities">
              <div class="form-group gr-12">
                <div  style="align-content: left;">
                  <label class="push-2"> Date Range From: </label>
                  <input  type="date" name="fromRDate" onfocus="(this.type='date')" v-model="activityQuery.fromDate"/>
                  <label class="push-0.5">To:</label>
                  <input type="date" name="toRange" onfocus="(this.type='date')" placeholder="to"
                         v-model="activityQuery.toDate"/>
                  <label class="push-0" for="search-key">Search with a Key</label>
                  <input id="search-key" v-model="activityQuery.searchKey"
                         placeholder="Key">
                </div>
              </div>
              <div class="form-group">
                <button type="submit">Filter</button>
                <button type="reset">Reset</button>
              </div>
            </form>

            <div>
              <table class="table table-hover table-sm ">
                <thead class="thead-default">
                <tr>
                  <th style="text-align: center;">Activity</th>
                  <th style="text-align: center;">Device Information</th>
                  <th style="text-align: center;">User Agent</th>
                  <th style="text-align: center;">Time</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="activity in activities.list" >
                  <td style="width: 200px;">{{ activity.description }}</td>
                  <td style="width: 200px;">{{ activity.deviceName }}, {{ activity.deviceOs }}  </td> <!--{{ activity.deviceBrowser }}-->
                  <td style="width: 500px;">{{ activity.userAgent }}</td>
                  <td>{{ activity.time | date('MMM D, YYYY') }}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <div class="card-footer text-muted" v-if="activities.totalElements > 0">
              <div class="row">
                <div class="gr-3">
                  <div style="margin-top: 0.2rem;" v-if="activities.list">
                    <small>Showing {{ parseInt(activityQuery.pageNumber * activityQuery.pageSize + 1)
                      }} to {{ parseInt(activityQuery.pageNumber * activityQuery.pageSize + activities.list.length)
                      }} out of {{ activities.totalElements }}
                    </small>
                  </div>
                </div>
                <div class="gr-9">
                  <div v-if="activities.totalPages <= maxPaginationItem">
                    <nav aria-label="ActivityPagination">
                      <ul class="pagination pagination-sm justify-content-end">
                        <li class="page-item " v-bind:class="{ disabled: activityQuery.pageNumber === 0 }">
                          <a class="page-link" v-on:click="pageChange(activityQuery.pageNumber - 1)" tabindex="-1">Previous</a>
                        </li>
                        <li class="page-item"
                            v-bind:class="{ active: activityQuery.pageNumber === (n - 1) }"
                            v-for="n in activities.totalPages">
                          <a class="page-link" v-on:click="pageChange(n - 1)" tabindex="-1">{{ n }}</a>
                        </li>
                        <li class="page-item" v-bind:class="{ disabled: activityQuery.pageNumber === activities.totalPages - 1 }">
                          <a class="page-link" v-on:click="pageChange(activityQuery.pageNumber + 1)" tabindex="-1">Next</a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                  <div class="pull-right" v-else>
                    <a class="btn btn-sm btn-secondary"
                       role="button"
                       v-bind:class="{ disabled: activityQuery.pageNumber === 0 }"
                       v-on:click="pageChange(0)">
                      <i class="fa fa-angle-double-left" aria-hidden="true"></i> First
                    </a>
                    <a class="btn btn-sm btn-secondary"
                       role="button"
                       v-bind:class="{ disabled: activityQuery.pageNumber === 0 }"
                       v-on:click="pageChange(activityQuery.pageNumber - 1)">
                      <i class="fa fa-angle-left" aria-hidden="true"></i> Previous
                    </a>
                    <small>Page {{ activityQuery.pageNumber + 1 }} of {{ activities.totalPages }}</small>
                    <a class="btn btn-sm btn-secondary"
                       role="button"
                       v-bind:class="{ disabled: activityQuery.pageNumber === activities.totalPages - 1 }"
                       v-on:click="pageChange(activityQuery.pageNumber + 1)">
                      Next <i class="fa fa-angle-right" aria-hidden="true"></i>
                    </a>
                    <a class="btn btn-sm btn-secondary"
                       role="button"
                       v-bind:class="{ disabled: activityQuery.pageNumber === activities.totalPages - 1 }"
                       v-on:click="pageChange(activities.totalPages - 1)">
                      Last <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div class="card-block" v-if="showTransactions">
            <form @submit.prevent="filterTransactions" @reset.prevent="resetTransactions">
              <div class="form-group gr-12">
                <div  style="align-content: left;">
                  <label class="push-1"> Date Range From: </label>
                  <input  type="date" name="fromRDate" onfocus="(this.type='date')" v-model="transactionQuery.fromDate"/>
                  <label class="push-0.5">To:</label>
                  <input type="date" name="toRange" onfocus="(this.type='date')" placeholder="to"
                         v-model="transactionQuery.toDate"/>
                  <select class="push-0.5" id="transaction-selector" v-model="transactionQuery.serviceID">
                    <option selected value=null disabled>Select Transaction Type</option>
                    <option v-for="service in serviceList" :value="service.id">{{ service.name  | underscoreless }}</option>
                  </select>
                </div>
              </div>
                
              <div class="form-group">
                <button type="submit">Filter</button>
                <button type="reset">Reset</button>
              </div>
            </form>
          <div>
              <table class="table table-hover table-sm ">
                <thead class="thead-default">
                <tr>
                  <th style="text-align: center;">Transaction Id</th>
                  <th style="text-align: center;">Date</th>
                  <th style="text-align: center;">Transaction Type</th>
                  <th style="text-align: center;">Description</th>
                  <th style="text-align: center;">Amount</th>
                  <th style="text-align: center;">Fee</th>
                  <th style="text-align: center;">Net Amount</th>
                  <th style="text-align: center;">Balance</th>
                  <th style="text-align: center;">Status</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="transaction in transactions.transactions" >
                  <td style="width: 200px;">{{ transaction.transactionID }}</td>
                  <td>{{ transaction.time | date('MMM D, YYYY') }}</td>
                  <td> {{ transaction.serviceID | static_mapper(serviceList) | underscoreless }}</td>
                  <td>{{ transaction.description }}</td>
                  <td>{{ transaction.amount }}</td>
                  <td>{{ transaction.fee }}</td>
                  <td>{{ transaction.netAmount }}</td>
                  <td>{{ transaction.balance }}</td>
                  <td>{{ transaction.statusCode == 200 ? 'Success' :
                        transaction.statusCode == 102 ? 'In Progress' : 'Fail'}}</td>
                </tr>
                </tbody>
              </table>
            </div>

          <div class="card-footer text-muted" v-if="transactions.totalCount > 0">
              <div class="row">
                <div class="gr-3">
                  <div style="margin-top: 0.2rem;" v-if="transactions.list">
                    <small>Showing {{ parseInt(transactionQuery.pageNumber * transactionQuery.pageSize + 1)
                      }} to {{ parseInt(transactionQuery.pageNumber * transactionQuery.pageSize + transactions.transactions.length)
                      }} out of {{ transactions.totalCount }}
                    </small>
                  </div>
                </div>
                <div class="gr-9">
                  <!-- Ticket Pagination -->
                  <div v-if="transactionTotalPages <= maxPaginationItem">
                    <nav aria-label="ActivityPagination">
                      <ul class="pagination pagination-sm justify-content-end">
                        <li class="page-item " v-bind:class="{ disabled: transactionQuery.pageNumber === 0 }">
                          <a class="page-link" v-on:click="pageChange(transactionQuery.pageNumber - 1, false)"
                             tabindex="-1">Previous</a>
                        </li>
                        <li class="page-item"
                            v-bind:class="{ active: transactionQuery.pageNumber === (n - 1) }"
                            v-for="n in transactionTotalPages">
                          <a class="page-link" v-on:click="pageChange(n - 1, false)" tabindex="-1">{{ n }}</a>
                        </li>
                        <li class="page-item" v-bind:class="{ disabled:
                        transactionQuery.pageNumber === activities.totalPages - 1 }">
                          <a class="page-link" v-on:click="pageChange(transactionQuery.pageNumber + 1, false)"
                             tabindex="-1">Next</a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                  <div class="pull-right" v-else>
                    <a class="btn btn-sm btn-secondary"
                       role="button"
                       v-bind:class="{ disabled: transactionQuery.pageNumber === 0 }"
                       v-on:click="pageChange(0, false)">
                      <i class="fa fa-angle-double-left" aria-hidden="true"></i> First
                    </a>
                    <a class="btn btn-sm btn-secondary"
                       role="button"
                       v-bind:class="{ disabled: transactionQuery.pageNumber === 0 }"
                       v-on:click="pageChange(transactionQuery.pageNumber - 1, false)">
                      <i class="fa fa-angle-left" aria-hidden="true"></i> Previous
                    </a>
                    <small>Page {{ transactionQuery.pageNumber + 1 }} of {{ transactionTotalPages }}</small>
                    <a class="btn btn-sm btn-secondary"
                       role="button"
                       v-bind:class="{ disabled: transactionQuery.pageNumber === transactionTotalPages - 1 }"
                       v-on:click="pageChange(transactionQuery.pageNumber + 1, false)">
                      Next <i class="fa fa-angle-right" aria-hidden="true"></i>
                    </a>
                    <a class="btn btn-sm btn-secondary"
                       role="button"
                       v-bind:class="{ disabled: transactionQuery.pageNumber === transactionTotalPages - 1 }"
                       v-on:click="pageChange(transactionTotalPages - 1, false)">
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
  import Constants from '../services/Constants'

  console.log('constants: ', Constants)

  export default {
    name: 'MemberBasicInfo',
    props: [
      'id'
    ],
    data () {
      return {
        member: {},
        introducers: {},
        introduced: {},
        activityQuery: {},
        transactionQuery: {},
        bankAccounts: {},
        activities: {},
        transactions: {},
        thanaNameFirst: '',
        districtNameFirst: '',
        countryNameFirst: '',
        thanaNameSecond: '',
        districtNameSecond: '',
        countryNameSecond: '',
        transactionTotalPages: '',
        maxPaginationItem: '',
        serviceList: Constants,
        documents: {},
        showBasicDetails: true,
        showActivities: false,
        showTransactions: false,
        occupationName: '',
        editBasicProfileMode: false,
        editParentsMode: false,
        dob: '',
        occupationList: {}
      }
    },
    created () {
      console.log('created member basic information..., member id iss: ', this.id)
      this.init()
    },
    methods: {
      init () {
        // Http call for basic information of the member with the 'id'
        this.activityQuery = Object.assign({}, {
          pageNumber: 0,
          pageSize: 10,
          searchKey: null,
          fromDate: null,
          toDate: null
        })
        this.transactionQuery = Object.assign({}, {
          pageNumber: 0,
          pageSize: 10,
          fromDate: 0,
          serviceID: null,
          toDate: new Date().getTime()
        })
        Http.GET('member', [this.id, 'basic-details'])
          .then(
            ({data: {data: member}}) => {
              this.member = member
              console.log('Got, member success::')
              console.log('member details: ', this.member)
              this.dob = this.$options.filters.date(member.basicInfo.dateOfBirth, 'YYYY-MM-DD')
              this.getStaticNames()
            },
            error => {
              console.log('Error occured getting details of the member, error: ', error)
            }
          )
        // // Http call for the introducers
        // Http.GET('member', [this.id, 'introducers'])
        //   .then(
        //     ({data: {data: introducers}}) => {
        //       this.introducers = introducers
        //       console.log('Got the list of introducers: ', introducers)
        //     },
        //     error => {
        //       console.log('Error in getting the list of introducers, error: ', error)
        //     }
        //   )
        // // Http call for the introduced list
        // Http.GET('member', [this.id, 'introduced'])
        //   .then(
        //     ({data: {data: introduced}}) => {
        //       this.introduced = introduced
        //       console.log('Got the list of introduced: ', introduced)
        //     },
        //     error => {
        //       console.log('Error in getting the list of introduced, error: ', error)
        //     }
        //   )
        // // Http call for affiliated bank accounts
        // Http.GET('member', [this.id, 'bank-accounts'])
        //   .then(
        //     ({data: {data: bankAccounts}}) => {
        //       this.bankAccounts = bankAccounts
        //       console.log('Got the list of bank accounts: ', bankAccounts)
        //     },
        //     error => {
        //       console.log('Error in getting the list of bank accounts, error: ', error)
        //     }
        //   )
        // // Http call for identification documEnts
        // Http.GET('member', [this.id, 'identification-documents'])
        //   .then(
        //     ({data: {data: documents}}) => {
        //       this.documents = documents
        //       console.log('Got the list of documents: ', this.documents, ' documents.length: ',
        //       this.documents.length)
        //     },
        //     error => {
        //       console.log('Error in getting list of identification documents, error: ', error)
        //     }
        //   )
      },
      updateMemberBasicProfile () {
        console.log('update basic profile info:')
        this.member.basicInfo.dateOfBirth = Date.parse(this.dob)
        console.log(this.member.basicInfo)
        this.member.basicInfo.dob = Date.parse(this.dob)
        Http.PUT('member', this.member.basicInfo, [this.member.basicInfo.accountId, 'basic-details'])
          .then(
            ({data: {data: memberUpdate}}) => {
              console.log('updated profile::', memberUpdate)
              this.init()
              this.editBasicInfo()
            },
            error => {
              console.log('Error in getting list of identification documents, error: ', error)
            }
          )
      },
      updateMemberParents () {
        Http.PUT('member', this.member.basicInfo, [this.member.basicInfo.accountId, 'basic-details'])
          .then(
            ({data: {data: memberUpdate}}) => {
              console.log('updated profile::', memberUpdate)
              this.init()
              this.editParents()
            },
            error => {
              console.log('Error in getting list of identification documents, error: ', error)
            }
          )
      },
      editBasicInfo () {
        if (this.editBasicProfileMode) {
          this.editBasicProfileMode = false
        } else {
          this.editBasicProfileMode = true
        }
      },
      editParents () {
        if (this.editParentsMode) {
          this.editParentsMode = false
        } else {
          this.editParentsMode = true
        }
      },
      resetTransactions () {
        this.transactionQuery = Object.assign({}, {
          pageNumber: 0,
          pageSize: 10,
          fromDate: null,
          toDate: null
        })
        this.getTransactions()
      },
      resetActivities () {
        this.activityQuery = Object.assign({}, {
          pageNumber: 0,
          pageSize: 10,
          fromDate: null,
          toDate: null,
          searchKey: null
        })
        this.getActivities()
      },
      filterTransactions () {
        // The adjustment is being made to avoid GMT issues.
//         let fromDate = this.transactionQuery.fromDate
//        let toDate = this.transactionQuery.toDate
        if (this.transactionQuery.fromDate !== null) {
          this.transactionQuery.fromDate = new Date(this.transactionQuery.fromDate).getTime() - 6 * 3600 * 1000
        } else {
          this.transactionQuery.fromDate = 0
        }
        if (this.transactionQuery.toDate !== null) {
          this.transactionQuery.toDate = new Date(this.transactionQuery.toDate).getTime() - 6 * 60 * 60 * 1000
        } else {
          this.transactionQuery.toDate = new Date().getTime() - 6 * 3600 * 1000
        }
        this.transactionQuery.pageNumber = 0
        console.log('transaction from: ', this.transactionQuery.fromDate, ' date: ',
          new Date(this.transactionQuery.fromDate), 'transaction to: ', this.transactionQuery.toDate)
        this.getTransactions()
      },
      filterActivities () {
        // The adjustment is being made to avoid GMT issues.
//         let fromDate = this.transactionQuery.fromDate
//        let toDate = this.transactionQuery.toDate
        if (this.activityQuery.fromDate !== null) {
          this.activityQuery.fromDate = new Date(this.activityQuery.fromDate).getTime() - 6 * 3600 * 1000
        } else {
          this.activityQuery.fromDate = 0
        }
        if (this.activityQuery.toDate !== null) {
          this.activityQuery.toDate = new Date(this.activityQuery.toDate).getTime() - 6 * 60 * 60 * 1000
        } else {
          this.activityQuery.toDate = new Date().getTime() - 6 * 3600 * 1000
        }
        this.activityQuery.pageNumber = 0
        this.getActivities()
      },
      getActivities (key = 'member') {
        Http.GET(key, [this.id, 'activities'], this.activityQuery)
          .then(({data: {data: activities}}) => {
            console.log('Success, got activities: ', activities)
            this.activities = activities
          }, error => {
            console.error('Error in getting members: ', error)
          })
      },
      getTransactions (key = 'member') {
        Http.GET(key, [this.id, 'transactions'], this.transactionQuery)
          .then(({data: transactions}) => {
            console.log('Success, got transactions: ', transactions)
            console.log('same transaction data: ')
            this.transactions = transactions
            this.transactionTotalPages = Math.ceil(
              this.transactions.totalCount / this.transactionQuery.pageSize)
          }, error => {
            console.error('Error in getting members: ', error)
          })
      },
      pageChange (number = 0, activeQuery = true) {
        if (activeQuery && this.activityQuery.pageNumber !== number) { // activity query
          this.activityQuery.pageNumber = number
          this.getActivities()
        }
        if (!activeQuery && this.transactionQuery.pageNumber !== number) { // transaction query
          this.transactionQuery.pageNumber = number
          this.getTransactions()
        }
      },
      setTab (tabName) {
        this.showBasicDetails = false
        this.showActivities = false
        this.showTransactions = false
        if (tabName === 'basicDetails') {
          this.showBasicDetails = true
        } else if (tabName === 'activities') {
          this.showActivities = true
          this.getActivities()
        } else {
          this.showTransactions = true
          this.getTransactions()
        }
      },
      getStaticNames () {
        console.log('district')
        // Address 0 resolution
        if (this.member.basicInfo.occupation) {
          this.occupationList = JSON.parse(localStorage.getItem('occupation'))
          this.occupationName = this.occupationList.find(x => x.id === this.member.basicInfo.occupation).name
        }
        if (this.member.addresses.length !== 0) {
          let thanaList = JSON.parse(localStorage.getItem('thana'))
          let districtList = JSON.parse(localStorage.getItem('district'))
//          let countryList = JSON.parse(localStorage.getItem('country'))
          this.thanaNameFirst = thanaList.find(x => x.id === this.member.addresses[0].thanaId).name
          this.districtNameFirst = districtList.find(x => x.id === this.member.addresses[0].districtId).name
          this.countryNameFirst = this.member.addresses[0].country
        } else {
          this.thanaNameFirst = 'N/A'
          this.districtNameFirst = 'N/A'
          this.countryNameFirst = 'N/A'
        }
        // Address 1 resolution
        if (this.member.addresses.length === 2) {
          let thanaList = JSON.parse(localStorage.getItem('thana'))
          let districtList = JSON.parse(localStorage.getItem('district'))
//          let countryList = JSON.parse(localStorage.getItem('country'))
          this.thanaNameSecond = thanaList.find(x => x.id === this.member.addresses[1].thanaId).name
          this.districtNameSecond = districtList.find(x => x.id === this.member.addresses[1].districtId).name
          this.countryNameSecond = this.member.addresses[1].country
        } else {
          this.thanaNameSecond = 'N/A'
          this.districtNameSecond = 'N/A'
          this.countryNameSecond = 'N/A'
        }
        console.log('Address 0, Thana name is: ', this.thanaNameFirst)
        console.log('Address 0, District name is: ', this.districtNameFirst)
        console.log('Address 1, Thana name is: ', this.thanaNameSecond)
        console.log('Address 1, District name is: ', this.districtNameSecond)
      },
      profilePicture (url) {
        if (url) {
          /* TODO: FTP URL is hard coded until manage development environment. */
          return Http.IMAGE_URL + url
        }
        return '/static/images/default-profile-180x180.png'
      }
    }
  }
</script>
