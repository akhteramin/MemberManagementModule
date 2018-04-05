<template>
  <div id = "list">


    <div id="IdentificationDocumentModal" class="modal fade" role="dialog">
      <div class="modal-dialog modal-md">
        <div class="modal-content width-800">
          <div class="modal-header text-center">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h3><i class="fa fa-file" aria-hidden="true"></i> Identification Documents</h3>
          </div>

          <div class="modal-body">

            <table id="identification-documents-table" class="table ui celled" cellspacing="0" width="100%">
              <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Type</th>
                <th>Id No.</th>
                <th class="text-center">URL</th>
                <th class="text-center">Verification Status</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="document,index in identificationDocuments">
                <td>{{ index + 1 }}</td>
                <td>{{ document.documentName ? document.documentName : 'N/A' }}</td>
                <td>{{ (document.documentType ? document.documentType : 'N/A') | underscoreless }}</td>
                <td>{{ document.documentIdNumber ? document.documentIdNumber : 'N/A' }}</td>
                <td class="text-center">
                  <img default-src="/static/images/default-document-icon.png"
                       v-if="!isPdf(document.documentUrl)"
                       :src="imageBaseUrl + document.documentUrl"
                       alt="Document"
                       height="50"
                       width="auto"
                       class="img-rounded"
                      onerror="onerror=null;
                      this.src='/static/images/default-document-icon.png'">
                  <i v-if="isPdf(document.documentUrl)"
                     class="fa fa-file-pdf-o font-size-50"
                     aria-hidden="true"></i>
                </td>
                <td class="text-center">
                  {{ document.documentVerificationStatus ? document.documentVerificationStatus : 'N/A' }}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>

    <div id="BankDocumentModal" class="modal fade" role="dialog">
      <div class="modal-dialog modal-md">
        <div class="modal-content width-800">
          <div class="modal-header text-center">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h3><i class="fa fa-bank" aria-hidden="true"></i> Bank Information</h3>
          </div>

          <div class="modal-body">

            <table id="bank-documents-table" class="table ui celled" cellspacing="0" width="100%">
              <thead>
              <tr>
                <th>#</th>
                <th>Account Name</th>
                <th>Account No.</th>
                <th>Bank Name</th>
                <th>Branch Name</th>
                <th class="text-center">Verification Status</th>
                <th class="text-center">Verified Date</th>
              </tr>
              </thead>
              <tbody>
              <!--bank documents are: {{ bankDocuments }}-->
              <tr v-for="bank,index in bankDocuments" class="height-10">
                <td>{{ index + 1 }}</td>
                <td>{{ bank.accountName ? bank.accountName : 'N/A' }}</td>
                <td>{{ bank.accountNumber ? bank.accountNumber : 'N/A' }}</td>
                <td>{{ bank.bankName ? bank.bankName : 'N/A' }}</td>
                <td>{{ bank.branchName ? bank.branchName : 'N/A' }}</td>
                <td class="text-center">{{ bank.verificationStatus ? bank.verificationStatus : 'N/A' }}</td>
                <td>
                  <div v-if="bank.verifiedDate">
                    {{ bank.verifiedDate | date('MMM D, YYYY')}}
                  </div>
                  <div v-else>
                    N/A
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>

    <div id="CardDocumentModal" class="modal fade" role="dialog">
      <div class="modal-dialog modal-md">
        <div class="modal-content width-800">
          <div class="modal-header text-center">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h3><i class="fa fa-credit-card" aria-hidden="true"></i> Card Information</h3>
          </div>

          <div class="modal-body">

            <table id="card-documents-table" class="table ui celled" cellspacing="0" width="100%">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Issuer</th>
                  <th>Info</th>
                  <!-- <th>Level</th> -->
                  <!-- <th>Bin Number</th> -->
                  <!-- <th>Type</th> -->
                  <!-- <th>Network Company</th> -->
                  <th class="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
              <tr v-for="card,index in cards" class="height-10">
                <td>{{ index + 1 }}</td>
                <td>
                  <span v-if="card.cardInfo.substring(0,1) === '4'">
                    <i class="fa fa-lg fa-2x fa-cc-visa"></i>
                  </span>
                  <span v-else-if="card.cardInfo.substring(0,2) === '34' || card.cardInfo.substring(0,2) === '37'">
                    <i class="fa fa-lg fa-2x fa-cc-amex"></i>
                  </span>
                  <span v-else-if="card.cardInfo.substring(0,2) === '51' || card.cardInfo.substring(0,2) === '51'
                                || card.cardInfo.substring(0,2) === '53' || card.cardInfo.substring(0,2) === '54'
                                || card.cardInfo.substring(0,2) === '55'">
                    <i class="fa fa-lg fa-2x fa-cc-mastercard"></i>
                  </span>
                  <span v-else-if="card.cardInfo.substring(0,4) === '6011'">
                    <i class="fa fa-lg fa-2x fa-cc-discover"></i>
                  </span>
                  <span v-else-if="card.cardInfo.substring(0,3) === '300' || card.cardInfo.substring(0,3) === '301'
                                || card.cardInfo.substring(0,3) === '302' || card.cardInfo.substring(0,3) === '303'
                                || card.cardInfo.substring(0,3) === '304' || card.cardInfo.substring(0,3) === '305'
                                || card.cardInfo.substring(0,2) === '36' || card.cardInfo.substring(0,2) === '54'">
                    <i class="fa fa-lg fa-2x fa-cc-diners-club"></i>
                  </span>
                  <span v-else>
                    <i class="fa fa-lg fa-2x fa-credit-card"></i>
                  </span>
                </td>
                <td>{{ card.cardInfo ? card.cardInfo : 'N/A' }}</td>
                <!-- <td>{{ card.cardLevel ? card.cardLevel : 'N/A' }}</td>
                <td>{{ card.binNumber ? card.binNumber : 'N/A' }}</td>
                <td>{{ card.cardType ? card.cardType : 'N/A' }}</td>
                <td>{{ card.networkCompany ? card.networkCompany : 'N/A' }}</td> -->
                <td class="text-center">{{ card.cardStatus ? card.cardStatus : 'N/A' }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>



    <div class="gr-6 push-5">
      <h1>Members</h1>
    </div>
    <div class="gr-12">
            <hr>
    </div>
    <h1 v-if="menuComponent.data().collapseMenuComponent"></h1>
    
    <form v-on:submit.prevent="filter"
          v-on:reset.prevent="init">
        <div id="seachFilter" class="row">
          <div class="gr-12">
           <div class="gr-2">
              <div class="form-group padding-5">
                <label> Mobile Number </label>
                <input  name="mobilenumber" type="text" id="mobilenumber"
                        v-model="query.mobileNumber" placeholder="+8801XXXXXXXXX"
                        value=""/>
              </div>
            </div>
            <div class="gr-2">
              <div class="form-group padding-5">
                <label class="push-0"> Name </label>
                <input class="push-0" name="queryName" type="text" id="queryName" placeholder="Name"
                        v-model="query.name"
                        value=""/>
              </div>
            </div>

            <!-- <div class="gr-2">
              <div class="form-group padding-5">
                <label> Business Name: </label>
                <input  name="queryBusinessName" type="text" id="queryBusinessName" placeholder="BusinessName"
                        v-model="query.businessName"
                        value=""/>
              </div>
            </div> -->

            <div class="gr-2">
              <div class="form-group padding-5">
                <label class="push-0">Account Type </label>
                <div class="push-0">
                  <div class="select select-sm">
                    <select id="personal-business-select"  v-model="query.accountType">
                      <!--<option selected disabled>Select account type</option>-->
                      <option selected value = "">All</option>
                      <option value="1">Personal</option>
                      <option value="2">Business</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="gr-2">
              <div class="form-group padding-5">
                <label class="push-0"> Verification Status </label>
                <div class="push-0">
                  <div class="select select-sm">
                    <select id="verification-status" v-model="query.verificationStatus">
                      <option selected value = "">All</option>
                      <option value="VERIFIED">Verified</option>
                      <option value="NOT_VERIFIED">Not Verified</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>

          </div>


        <div v-if="doAdvancedSearch">
          <br>
          <div class="gr-12">

            <div class="gr-2">
              <div class="form-group padding-5">
                <label>Signup From </label>
                <input type="date" :max="new Date().toISOString().substring(0,10)" v-model="signUpDateFrom"/>
              </div>
            </div>
            <div class="gr-2">
              <div class="form-group padding-5">
                <label>Signup To </label>
                <input type="date" :max="new Date().toISOString().substring(0,10)" v-model="signUpDateTo"/>
              </div>
            </div>

            <div class="gr-2">
              <div class="form-group padding-5">
                <label class="push-0">Sort by </label>
                <div class="push-0">
                  <div class="select select-sm">
                    <select id="sort-by-select"  v-model="query.sort">
                      <!--<option selected disabled>Select account type</option>-->
                      <option selected value="PROFILE_COMPLETION_SCORE">Profile Completion Score</option>
                      <option value = "DOCUMENT_UPLOAD">Document Upload Date</option>
                      <option value="CREATION_DATE">Account Creation Date</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="gr-2">
              <div class="form-group padding-5">
                <label class="push-0">Order by </label>
                <div class="push-0">
                  <div class="select select-sm">
                    <select id="order-by-select"  v-model="query.order">
                      <!--<option selected disabled>Select account type</option>-->
                      <option selected value = "DESC">DESC</option>
                      <option value="ASC">ASC</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>


          </div>
          <div class="gr-12">
            <div class="gr-6 push-2 text-center">
              <br>
                <label> Profile Completion Range </label>
                <vue-slider ref="slider" v-model="value" :width="'100%'"></vue-slider>
            </div>
          </div>  
        </div>
        <div class="gr-12">
          <br v-if="doAdvancedSearch">
          <div class="gr-2 pointer">
            <span class="advanced-search"></span>
            <a @click="toggleAdvancedSearch">
              <i class="fa fa-search-plus" aria-hidden="true" v-if="!doAdvancedSearch"></i>
              <i class="fa fa-search-minus" aria-hidden="true" v-if="doAdvancedSearch"></i>
              Advanced Search</a>
          </div>
          <div class="gr-2 push-4">
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

          <div class="gr-1 push-7">
            <div class="select select-sm">
              <select v-model="query.pageSize" @change="filter">
                <option disabled>Number of Entries</option>
                <option selected value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>

        </div>



      </div>
    </form>

          <!--========================================= my filters ==================================================-->     
    <div class="table-responsive gr-12">
      <br>
      <strong v-if="members.list && members.list.length > 0">Sorted by {{sortParam}} in {{orderParam}} order</strong>
      <table id="memberlist-table" class="table ui celled" cellspacing="0" width="80%" v-if="members.list && members.list.length > 0">
        <thead>
          <tr>
            <th>#</th>
            <th class="width-250">Name</th>
            <!-- <th v-if="showBusinessOwner">Business Owner Name</th> -->
            <th>Basic Info</th>
            <!--<th>Mother</th>-->
            <!-- <th class="text-center">A/C Type</th> -->
            <th class="text-center">Identification Documents</th>
            <th class="text-center">Bank Info</th>
            <th class="text-center">Card Info</th>
            <th class="text-center" v-if="listType === 'default'">
              Verification
            </th>
            <th class="text-center">Profile Completed</th>
            <th class="text-center"
                v-if="listType === 'default'">Account Status</th>
            <!--th v-else class="text-center">
              Action
              <input type="checkbox" @click="allMemberSelectAndDeselect"
                v-model="headerCheckBox"/>
            </th-->
          </tr>
        </thead>
        <tbody>
        <tr v-for="member,index in members.list" class="height-10">
          <td>{{query.pageNumber * query.pageSize + index + 1}}</td>

          <td class="member-name">
            <div class="gr-2">
              <span  v-if="member.userPictureResponses[0]">
                <img :src="imageBaseUrl+member.userPictureResponses[0].url" class="img-circle"
                    width="30" height="30"
                    onerror="onerror=null; this.src='/static/images/default-profile-180x180.png'">
                  <!--<img :src="imageBaseUrl+member.mmUserPictures[0].document.url" class="img-circle" alt="N/A"-->
                  <!--width="30" height="30">-->
              </span>
              <span v-else>
                <img src="/static/images/default-original.jpg" class="img-circle" alt="N/A" width="30" height="30"
                    onerror="onerror=null; this.src='/static/images/default-profile-180x180.png'">
              </span>
            </div>
            <div class="gr-10">
              <span v-restrict="'MS_MM_USER_BASIC_DETAILS'">
                <a class="pointer" @click="memberDetails(member.accountId,member.accountType)">
                  <!-- <span v-if="member.accountType == 1">
                    {{ member.name }}
                  </span>
                  <span v-if="member.accountType == 2">
                    {{ member.businessName }}
                  </span> -->
                  <span>
                    {{ member.name }}
                  </span>
                </a>
                <i class="fa fa-external-link" aria-hidden="true" @click="loadProfile(member)"></i>
                <small>
                  <br>
                  {{ member.mobileNumber }}
                  <!-- <span v-if="member.accountType == 1" class="fa-stack fa-sm">
                    <i class="fa fa-circle-thin fa-stack-2x" aria-hidden="true"></i>
                    <i class="fa fa-user fa-2 fa-stack-1x" aria-hidden="true"></i>
                  </span>
                  <span v-else class="fa-stack fa-sm">
                    <i class="fa fa-circle-thin fa-stack-2x" aria-hidden="true"></i>
                    <i class="fa fa-briefcase fa-2 fa-stack-1x" aria-hidden="true"></i>
                  </span> -->
                  <span v-if="member.accountType == 1">
                    <i class="fa fa-user fa-2" aria-hidden="true"></i>
                  </span>
                  <span v-else>
                    <i class="fa fa-briefcase fa-2" aria-hidden="true"></i>
                  </span>
                </small>
              </span>
              <span v-if="!containsPermission('MS_MM_USER_BASIC_DETAILS')">{{ member.name }}</span>
            </div>
          </td>
          <!-- <td v-if="showBusinessOwner">{{member.businessName ? member.name : 'N/A'}}</td> -->
          <td>
            {{ getStaticNames(member.occupation) }}
            <br>
            <small>{{ member.organizationName }}</small>
          </td>
          <!-- <td class="text-center">
            <span v-if="member.accountType == 1">
              <i class="fa fa-user fa-2" aria-hidden="true"></i>
            </span>
            <span v-else>
              <i class="fa fa-briefcase fa-2" aria-hidden="true"></i>
            </span>
          </td> -->
          <td class="text-center">
            <div v-if="member.identificationDocuments.length > 0">
              <a @click="showIdentificationDocumentsModal(member.identificationDocuments)"
                class="pointer">
                <!-- {{ member.identificationDocuments.length }} documents -->
                {{ identificationDocumentList(member.identificationDocuments) | underscoreless }}
              </a>
            </div>
            <div v-else>
              No document
            </div>
          </td>

          <td class="text-center">
            <div v-if="member.userBanks.length > 0">
              <a @click="showBankDocumentsModal(member.userBanks)"
                 class="pointer">
                {{ member.userBanks.length }} banks
              </a>
            </div>
            <div v-else>
              No bank
            </div>
          </td>

          <td class="text-center">
            <div v-if="member.userCards.length > 0">
              <a @click="showCardsModal(member.userCards)"
                 class="pointer">
                <!-- {{ member.userCards.length }} cards -->
                <span v-for="card in member.userCards">
                  <span v-if="card.cardInfo.substring(0,1) === '4'">
                    <i class="fa fa-lg fa-cc-visa"></i> <i v-if="card.cardStatus==='VERIFIED'" class="fa fa-check"></i>
                  </span>
                  <span v-else-if="card.cardInfo.substring(0,2) === '34' || card.cardInfo.substring(0,2) === '37'">
                    <i class="fa fa-lg fa-cc-amex"></i> <i v-if="card.cardStatus==='VERIFIED'" class="fa fa-check"></i>
                  </span>
                  <span v-else-if="card.cardInfo.substring(0,2) === '51' || card.cardInfo.substring(0,2) === '51'
                                || card.cardInfo.substring(0,2) === '53' || card.cardInfo.substring(0,2) === '54'
                                || card.cardInfo.substring(0,2) === '55'">
                    <i class="fa fa-lg fa-cc-mastercard"></i> <i v-if="card.cardStatus==='VERIFIED'" class="fa fa-check"></i>
                  </span>
                  <span v-else-if="card.cardInfo.substring(0,4) === '6011'">
                    <i class="fa fa-lg fa-cc-discover"></i> <i v-if="card.cardStatus==='VERIFIED'" class="fa fa-check"></i>
                  </span>
                  <span v-else-if="card.cardInfo.substring(0,3) === '300' || card.cardInfo.substring(0,3) === '301'
                                || card.cardInfo.substring(0,3) === '302' || card.cardInfo.substring(0,3) === '303'
                                || card.cardInfo.substring(0,3) === '304' || card.cardInfo.substring(0,3) === '305'
                                || card.cardInfo.substring(0,2) === '36' || card.cardInfo.substring(0,2) === '54'">
                    <i class="fa fa-lg fa-cc-diners-club"></i> <i v-if="card.cardStatus==='VERIFIED'" class="fa fa-check"></i>
                  </span>
                  <span v-else>
                    <i class="fa fa-lg fa-2x fa-credit-card"></i> <i v-if="card.cardStatus==='VERIFIED'" class="fa fa-check"></i>
                  </span>
                  <br>
                </span>
              </a>
            </div>
            <div v-else>
              No card
            </div>
          </td>

          <td class="text-center" v-if="listType === 'default'">
            {{ member.verificationStatus | underscoreless }}
          </td>
          <td class="text-center">{{ member.profileCompletionScore }}%</td>
          <td v-if="listType === 'default'">
            <div class="select">
              <select id="order-by-select"  v-model="member.accountStatus" @change="statusChange( member.accountId,member.accountStatus)">
                <option value = "1">Active</option>
                <option value = "2">Suspended</option>
              </select>
            </div>

          </td>
          <!--td v-else class="text-center">
            <input type="checkbox" @change="verificationBoxClicked(member, index)"
              v-model="checkBoxTicked[index]"> <!-- member.uncheckVerificationActionBox -->
          <!--/td-->

        </tr>
        </tbody>
      </table>
      <div v-else>
        <strong class="primary-font">NO ENTRIES FOUND</strong>
      </div>
    </div>
    <div class="gr-12" v-if="members.totalElements > 0">
            <div class="row">
              <div class="gr-3">
                <div v-if="members.list">
                  <small>Showing {{ parseInt(query.pageNumber * query.pageSize + 1)
                    }} to {{ parseInt(query.pageNumber * query.pageSize + members.list.length)
                    }} out of {{ members.totalElements }} entries
                  </small>
                </div>
              </div>
              <div class="gr-9">
                <!-- Member Pagination -->
                <div v-if="members.totalPages <= maxPaginationItem">
                  <nav aria-label="MemberPagination">
                    <ul class="pagination pagination-sm justify-content-end">
                      <li class="page-item " v-bind:class="{ disabled: query.pageNumber === 0 }">
                        <a class="page-link" v-on:click="pageChange(query.pageNumber - 1)" tabindex="-1">Previous</a>
                      </li>
                      <li class="page-item"
                          v-bind:class="{ active: query.pageNumber === (n - 1) }"
                          v-for="n in members.totalPages">
                        <a class="page-link" v-on:click="pageChange(n - 1)" tabindex="-1">{{ n }}</a>
                      </li>
                      <li class="page-item" v-bind:class="{ disabled: query.pageNumber === members.totalPages - 1 }">
                        <a class="page-link" v-on:click="pageChange(query.pageNumber + 1)" tabindex="-1">Next</a>
                      </li>
                    </ul>
                  </nav>
                </div>
                <div class="pull-right" v-else>
                  <a class="btn btn-sm btn-default btn-active-til"
                     role="button"
                     v-bind:class="{ disabled: query.pageNumber === 0 }"
                     v-on:click="pageChange(0)">
                    <i class="fa fa-angle-double-left" aria-hidden="true"></i> First
                  </a>
                  <a class="btn btn-sm btn-default btn-active-til"
                     role="button"
                     v-bind:class="{ disabled: query.pageNumber === 0 }"
                     v-on:click="pageChange(query.pageNumber - 1)">
                    <i class="fa fa-angle-left" aria-hidden="true"></i> Previous
                  </a>
                  <small>Page {{ query.pageNumber + 1 }} of {{ members.totalPages }}</small>
                  <a class="btn btn-sm btn-default btn-active-til"
                     role="button"
                     v-bind:class="{ disabled: query.pageNumber === members.totalPages - 1 }"
                     v-on:click="pageChange(query.pageNumber + 1)">
                    Next <i class="fa fa-angle-right" aria-hidden="true"></i>
                  </a>
                  <a class="btn btn-sm btn-default btn-active-til"
                     role="button"
                     v-bind:class="{ disabled: query.pageNumber === members.totalPages - 1 }"
                     v-on:click="pageChange(members.totalPages - 1)">
                    Last <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

    <div id="VerifyOrApproveMemberModal"
         class="modal fade" role="dialog">
      <div class="modal-dialog  modal-md">
        <!-- Modal content-->

        <div class="modal-content min-height-width">
          <div class="modal-header text-center">
            <button type="button" class="close" data-dismiss="modal"
                    @click="$('#VerifyOrApproveMemberModal').modal('hide')">&times;</button>
            <h3><i class="fa fa-check" aria-hidden="true"></i> Member Verification</h3>
          </div>

          <div class="modal-body">
            <form role="form" @submit.prevent="verifyOrApproveMembers('VERIFIED')"
                  @reset.prevent="verifyOrApproveMembers('REJECTED')"
                  id="verificationForm">

              <div class="small-scrollable">
                <table class="table ui celled" cellspacing="0">
                  <thead>
                    <tr>
                      <th>Member</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="name, index in memberListForVerificationNames">
                      <td>{{ name }}</td>
                    </tr>
                  </tbody>
                </table>
                <hr>
              </div>


              <div class="form-group">
                <br>
                <label for="comment">Comment</label>
                <textarea type="email" class="form-control height-150-no-resize" id="comment" placeholder="Enter comment"
                        required v-model="verificationComment">
                </textarea>
              </div>

              <div class="push-3">
                <button type="submit" class="button-md-verify width-100"
                  :disabled="this.disableModalVerificationAndRejectionButton">
                  <i class="fa fa-check"></i> {{ listType === 'waiting-verification'? 'Verify': 'Approve' }}
                </button>
                <button type="reset" class="button-reset"
                  :disabled="this.disableModalVerificationAndRejectionButton">
                  <i class="fa fa-times"></i> Reject
                </button>
              </div>


            </form>
          </div>
        </div>
      </div>
    </div>


    <!--div class="gr-10 push-5" v-if="listType !== 'default'">
      <form v-on:submit.prevent="showVerificationModal">
        <button type="submit" class="button-md-verify width-100"
        :disabled="memberVerificationListEmpty">
          <i class="fa fa-check" aria-hidden="true"></i>
          {{listType === 'waiting-verification' ? 'Verify' : 'Approve'}}
        </button>
      </form>
    </div-->
      <!--========================================= slider ==================================================-->
    <member-list-slider  v-if="sliderShow"
      :id = "memberProfile.id"
      :memberBasicDetails = "loadMemberBasicDetails"
      :memberProfile="memberProfile"
      :memberDocuments="memberDocuments"
      :memberIntroducers="memberIntroducers"
      :memberMissingInfo="memberMissingInfo"
      @update="hideProfile">

      </member-list-slider>

    <div id="MemberAccountStatusModal" class="modal fade" role="dialog">
            <div class="modal-dialog  modal-md">
            <!-- Modal content-->

            <div class="modal-content">
                <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" >&times;</button>
                <h4 class="modal-title">Change Account Status </h4>
                </div>
                <div class="modal-body">
                <div class="form-group">
                  <div class="row">
                    <div class="col-md-12" v-if="memberSuspensionHistory.list">
                      <div class="col-md-12 comment" v-for="history in memberSuspensionHistory.list">
                        <ul class="chat">
                          <li class="left clearfix"><span class="chat-img pull-left">
                              <!--img src="http://placehold.it/50/55C1E7/fff&text=U" alt="User Avatar" class="img-circle" /-->
                              </span>
                                  <div class="chat-body clearfix">
                                      <div class="header">
                                          <strong class="primary-font">{{history.suspensionStatus}}</strong> by <strong class="primary-font">{{history.adminUserDetails ? history.adminUserDetails.name : 'Legacy Admin User'}}  </strong> <small class="pull-right text-muted">
                                              <span class="glyphicon glyphicon-time"></span>{{history.createdAt | date('MMM D, YYYY')}}</small>
                                      </div>
                                      <p>
                                          {{history.description}}
                                      </p>
                                  </div>
                              </li>
                          </ul>
                      </div>
                    </div>
                    <div class="col-md-8 col-md-offset-2">
                        <span>
                        <div class="comment">
                            <!--<span>Browse</span>-->
                            Comment:
                            <textarea id="comment" rows="4" cols="50" v-model="memberComment"></textarea>
                        </div>
                        <!-- <input id="uploadFile3" placeholder="Choose File" disabled="disabled" /> -->
                        </span>
                    </div>
                    </div>
                </div>
                </div>
                <div class="modal-footer">

                <button v-if="memberAccountStatus==2" type="button" class="btn btn-sm btn-default btn-active-til" data-dismiss="modal" @click="changeAccountStatus(2)">Suspend</button>
                <button v-if="memberAccountStatus==1" type="button" class="btn btn-sm btn-default btn-active-til" data-dismiss="modal" @click="changeAccountStatus(1)">Activate</button>

                <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal" @click="init">Cancel</button>
                </div>
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
  import MemberListSlider from './MemberListSliderComponent.vue'
  import MemberIdentificationDocument from '../MemberProfile/MemberIdentificationDocumentComponent.vue'
  import MenuComponent from '../MenuComponent.vue'

  export default {
    name: 'MemberList',
    props: [
      'listType'
    ],
    components: {
      'member-list-slider': MemberListSlider,
      'member-identification-document': MemberIdentificationDocument,
      MenuComponent
    },
    watch: {
      listType: function () {
        this.init()
      }
    },
    data () {
      return {
        menuComponent: MenuComponent,
        members: [],
        query: {},
        memberProfile: {},
        memberDocuments: {},
        memberIntroducers: {},
        memberMissingInfo: {},
        memberListForVerification: {},
        memberListForVerificationNames: [],
        showBusinessOwner: true,
        memberVerificationListEmpty: true,
        uncheckVerificationActionBox: null,
        allMembersSelected: null,
        disableModalVerificationAndRejectionButton: false,
        checkBoxTicked: [],
        headerCheckBox: false,
        verificationComment: '',
        imageBaseUrl: '',
        identificationDocuments: null,
        bankDocuments: null,
        cards: null,
        sortParam: '',
        orderParam: '',
        value: [
          0,
          100
        ],
        sliderShow: false,
        maxPaginationItem: '',
        memberAccountStatus: 0,
        memberComment: '',
        memberAccountID: '',
        doAdvancedSearch: false,
        signUpDateFrom: null,
        signUpDateTo: null,
        memberSuspensionHistory: {},
        loadMemberBasicDetails: {},
        accessControlList: {},
        showLoader: false,
        occupationList: {}
      }
    },
    computed: {
      doCollapseOrNot () {
        return MenuComponent.data().collapseMenuComponent
      }
    },
    methods: {
      containsPermission (permission) {
        return this.accessControlList.indexOf(permission) > -1
      },
      identificationDocumentList (docList) {
        if (docList.length === 0) return ''
        var viewString = ''
        console.log('Array:: ', docList)
        docList.forEach((item, index) => {
          console.log(item.documentType, index)
          if (index === 0) viewString += item.documentType
          else {
            viewString += ', '
            viewString += item.documentType
          }
        })
        console.log('String:: ', viewString)
        return viewString
      },
      isPdf (fileName) {
        if (fileName) {
          var ext = fileName.substr(fileName.lastIndexOf('.') + 1)
          if (ext === 'pdf') {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      },
      showBankDocumentsModal (bankDocuments) {
        this.bankDocuments = bankDocuments
        console.log('bank documents: ', this.bankDocuments)
        $('#BankDocumentModal').modal({backdrop: false})
      },
      showCardsModal (cards) {
        this.cards = cards
        console.log('cards: ', this.cards)
        $('#CardDocumentModal').modal({backdrop: false})
      },
      showIdentificationDocumentsModal (identificationDocuments) {
        this.identificationDocuments = identificationDocuments
        $('#IdentificationDocumentModal').modal({backdrop: false})
      },
      toggleAdvancedSearch () {
        if (this.doAdvancedSearch) {
          this.doAdvancedSearch = false
        } else {
          this.doAdvancedSearch = true
        }
      },
      showVerificationModal () {
        this.memberListForVerificationNames = []
        this.verificationComment = null
        for (let key in this.memberListForVerification) {
          this.memberListForVerificationNames.push(this.memberListForVerification[key])
        }
        if (this.memberListForVerificationNames.length === this.members.list.length) {
          this.headerCheckBox = 'checked'
        }
        console.log('total selected items: ', this.memberListForVerificationNames.length)
        $('#VerifyOrApproveMemberModal').modal({backdrop: false})
      },
      allMemberSelectAndDeselect () {
        let counter = 0
        for (let key in this.memberListForVerification) {
          counter++
        }
        console.log('counter: ', counter, ' member list length: ', this.members.list.length)
        if (counter < this.members.list.length) { // select all members in the display
          this.memberListForVerification = {}
          for (let idx in this.members.list) {
            console.log('member.accountId: ', this.members.list[idx].accountId,
              ' member.name: ', this.members.list[idx].name)
            this.memberListForVerification[this.members.list[idx].accountId] = this.members.list[idx].name
            this.memberVerificationListEmpty = false
          }
          for (let i = 0; i < 100; i++) {
            this.checkBoxTicked[i] = 'checked'
          }
        } else {
          this.memberListForVerification = {}
          this.memberVerificationListEmpty = true
          this.allMembersSelected = false
          this.headerCheckBox = false
          for (let i = 0; i < 100; i++) {
            this.checkBoxTicked[i] = false
          }
        }
        console.log('all members selected? ', this.allMembersSelected)
      },
      verifyOrApproveMembers (status) {
        this.disableModalVerificationAndRejectionButton = true
        console.log('verify button clicked::::')
        let request = {
          'message': this.verificationComment,
          'verificationStatus': status
        }
        let totalSelected = this.memberListForVerificationNames.length
        console.log('total selected: ', totalSelected)
        for (let key in this.memberListForVerification) {
          console.log('verification requesting for: ', this.memberListForVerification[key])
          if (this.listType === 'waiting-verification') {
            Http.PUT('verification', request, [key])
              .then(
                ({data: {data: verificationResponse}}) => {
                  totalSelected -= 1
                  if (totalSelected < 1) {
                    $('#VerifyOrApproveMemberModal').modal('hide')
                    this.filter()
                  }
                  $.notify({
                    title: '<strong>Success!</strong>',
                    message: 'Verification successful.'
                  }, {
                    // settings
                    type: 'success',
                    delay: 1500
                  })
                  console.log('verification request response::', verificationResponse)
                },
                error => {
                  totalSelected -= 1
                  if (totalSelected < 1) {
                    $('#VerifyOrApproveMemberModal').modal('hide')
                    this.filter()
                  }
                  $.notify({
                    // options
                    title: '<strong>Verification failed!</strong>',
                    message: 'Please try again.'
                  }, {
                    // settings
                    type: 'danger',
                    delay: 1500
                  })
                  console.log('Error in putting verification request, error: ', error)
                }
              )
          } else {
            Http.PUT('verification', request, [key, 'approve'])
              .then(
                ({data: approvalResponse}) => {
                  totalSelected -= 1
                  if (totalSelected < 1) {
                    $('#VerifyOrApproveMemberModal').modal('hide')
                    this.filter()
                  }
                  $.notify({
                    // options
                    title: '<strong>Success!</strong>',
                    message: 'Account approved.'
                  }, {
                    // settings
                    type: 'success',
                    delay: 1500
                  })
                  console.log('approval request response::', approvalResponse)
                },
                error => {
                  totalSelected -= 1
                  if (totalSelected < 1) {
                    $('#VerifyOrApproveMemberModal').modal('hide')
                    this.filter()
                  }
                  $.notify({
                    // options
                    title: '<strong>Member approval failed!</strong>',
                    message: 'Please try again.'
                  }, {
                    // settings
                    type: 'danger',
                    delay: 1500
                  })
                  console.log('Error in putting approval request, error: ', error)
                }
              )
          }
        }
      },
      verificationBoxClicked: function (member, index) {
        if (this.memberListForVerification.hasOwnProperty(member.accountId)) {
          delete this.memberListForVerification[member.accountId]
          console.log('unchecked accountId: ', member.accountId)
          this.memberVerificationListEmpty = true
          for (let v in this.memberListForVerification) {
            this.memberVerificationListEmpty = false
          }
          this.checkBoxTicked[index] = false
          this.headerCheckBox = false
        } else {
          this.memberListForVerification[member.accountId] = member.name
          this.memberVerificationListEmpty = false
          this.checkBoxTicked[index] = 'checked'
          console.log('checked accountId: ', member.accountId)
          let count = 0
          for (let _ in this.memberListForVerification) {
            count += 1
          }
          if (count === this.members.list.length) {
            this.headerCheckBox = 'checked'
          }
        }
        console.log('verification list empty? ', this.memberVerificationListEmpty)
      },
      loadProfile: function (member) {
        console.log('accountID:', member)

        if (this.sliderShow === true && this.memberProfile.accountId === member.accountId) {
          this.sliderShow = false
        } else {
          this.memberProfile = member
          if (!this.containsPermission('MS_MM_USER_GET_IDENTIFICATION_DOCUMENTS')) {
            this.memberDocuments = null
          } else {
            this.showLoader = true
            Http.GET('member', [member.accountId, 'identification-documents'])
              .then(
                ({data: {list: documents}}) => {
                  this.showLoader = false
                  this.memberDocuments = documents
                  console.log('Got the list of documents: ', this.memberDocuments, ' documents.length: ',
                    this.memberDocuments.length)
                },
                error => {
                  this.showLoader = false
                  console.log('Error in getting list of identification documents, error: ', error)
                }
              )
          }
          if (!this.containsPermission('MS_MM_USER_GET_INTRODUCER_LIST')) {
            this.memberIntroducers = null
          } else {
            // Http call for the introducers
            this.showLoader = true
            Http.GET('member', [member.accountId, 'introducers'])
              .then(
                ({data: {introducerList: introducers}}) => {
                  this.showLoader = false
                  this.memberIntroducers = introducers
                  console.log('Got the list of introducers: ', this.memberIntroducers)
                },
                error => {
                  this.showLoader = false
                  console.log('Error in getting the list of introducers, error: ', error)
                }
              )
          }
          if (!this.containsPermission('MS_MM_USER_IS_VERIFIABLE')) {
            this.memberMissingInfo = null
          } else {
            // Http call for the missing information
            this.showLoader = true
            Http.GET('member', [member.accountId, 'is-verifiable'])
              .then(
                ({data: {data: missingData}}) => {
                  this.showLoader = false
                  this.memberMissingInfo = missingData
                  console.log('Got the list of missing: ', this.memberMissingInfo)
                },
                error => {
                  this.showLoader = false
                  console.log('Error in getting the list of missing, error: ', error)
                }
              )
          }
          if (!this.containsPermission('MS_MM_USER_BASIC_DETAILS')) {
            this.loadMemberBasicDetails = null
          } else {
            this.showLoader = true
            Http.GET('member', [member.accountId, 'basic-details'])
              .then(
                ({data: {data: member}}) => {
                  this.showLoader = false
                  console.log('In member list component, member basic details: ', member)
                  this.loadMemberBasicDetails = member
                },
                error => {
                  this.showLoader = false
                  console.log('Error in loading member basic details for slider... ', error)
                }
              )
          }
          this.sliderShow = true
        }
      },
      hideProfile: function (param = 'false') {
        this.sliderShow = false
        // this.init()
        this.getMembers()
      },
      getMembers: function (key = 'member') {
        this.checkBoxTicked = []
        for (let i = 0; i < 100; i++) {
          this.checkBoxTicked.push(false)
        }
        this.showLoader = true
        Http.GET(key, this.query)
          .then(({data: {data}}) => {
            console.log('sortParam: ', this.query.sort, 'orderParam: ', this.query.order)
            if (this.query.sort === 'PROFILE_COMPLETION_SCORE') {
              this.sortParam = 'PROFILE COMPLETION SCORE'
            } else if (this.query.sort === 'DOCUMENT_UPLOAD') {
              this.sortParam = 'DOCUMENT UPLOAD'
            } else if (this.query.sort === 'CREATION_DATE') {
              this.sortParam = 'ACCOUNT CREATION DATE'
            }
            if (this.query.order === 'DESC') {
              this.orderParam = 'DESC'
            } else if (this.query.order === 'ASC') {
              this.orderParam = 'ASC'
            }
            this.showLoader = false
            console.log('Success, got members: ', data)
            this.members = data
            if (this.query.accountType === '1') this.showBusinessOwner = false
            else this.showBusinessOwner = true
          }, error => {
            this.showLoader = false
            console.error('Error in getting members: ', error)
          })
      },
      getStaticNames (id) {
        let occupationName = this.occupationList.find(x => x.id === id)
        if (occupationName) {
          return occupationName.name
        }
        return 'N/A'
      },
      statusChange: function (accountID, accountStatus) {
        console.log(accountStatus)
        this.memberAccountStatus = accountStatus
        this.memberAccountID = accountID
        let paramData = Object.assign({}, {
          order: 'DESC',
          pageNumber: 0,
          pageSize: 3
        })
        this.showLoader = true
        Http.GET('member', [accountID, 'suspension-history'], paramData)
          .then(({data}) => {
            this.showLoader = false
            console.log('Success, got members: ', data)
            this.memberSuspensionHistory = data
          }, error => {
            this.showLoader = false
            console.error('Error in getting members: ', error)
          }
        )
        $('#MemberAccountStatusModal').modal({backdrop: false})
      },
      changeAccountStatus: function (accountStatus) {
        let paramData = {
          'message': this.memberComment,
          'effectiveFrom': new Date().getTime().toString()
        }
        this.showLoader = true
        Http.PUT('mmAdminMember', paramData, [this.memberAccountID, 'status', accountStatus])
        .then(
          ({data: statusData}) => {
            this.showLoader = false
            $.notify({
              // options
              title: '<strong>Success!</strong>',
              message: 'Account Status changed successfully.'
            }, {
              // settings
              type: 'success',
              delay: 3000
            })
            console.log('document data::', statusData)
            this.init()
          },
          error => {
            this.showLoader = false
            $.notify({
              // options
              title: '<strong>Changing Account Status failed!</strong>',
              message: 'Please try again.'
            }, {
              // settings
              type: 'danger',
              delay: 3000
            })
            console.log('Error vrification of document: ', error)
          }
        )
      },
      pageChange (number = 0) {
        if (number >= 0 && number < this.members.totalPages && this.query.pageNumber !== number) {
          this.memberListForVerification = {}
          this.memberListForVerificationNames = []
          this.memberVerificationListEmpty = true
          this.disableModalVerificationAndRejectionButton = false
          this.query.pageNumber = number
          this.headerCheckBox = false
          this.sliderShow = false
          this.getMembers()
        }
      },
      memberDetails (value, accntType) {
        console.log('Okay, I am doing it now!!!, value: ', value, accntType)
//        router.push(`./member/${value}`)
//        router.push({
//          name: 'MemberIndividualComponent',
//          params: {id: value, accountType: accntType}
//        })
        console.log('window')
        let path = window.location.href.split('/')
        path = path[path.length - 2]
        console.log('opening path is: ', path)
        window.open(`/member/profile/${value}/${accntType}`, '_blank')
      },
      init () {
        this.sliderShow = false
        this.memberComment = ''
        this.imageBaseUrl = Http.IMAGE_URL
        this.query = Object.assign({}, {
          name: '', // string
          businessName: '',
          mobileNumber: '', // string
          accountType: '', // int: 1 = personal, 2 = business
          verificationStatus: '', // string: VERIFIED, NOT_VERIFIED
          profileCompletionScoreStartRange: '',
          profileCompletionScoreEndRange: '',
          startSignUpDate: '',
          endSignUpDate: '',
          sort: 'PROFILE_COMPLETION_SCORE',
          order: 'DESC',
          pageNumber: 0,
          pageSize: 10
        })
        this.occupationList = JSON.parse(localStorage.getItem('occupation'))
        this.checkBoxTicked = []
        for (let i = 0; i < 100; i++) {
          this.checkBoxTicked.push(false)
        }
        this.memberListForVerification = {}
        this.memberListForVerificationNames = []
        this.memberVerificationListEmpty = true
        this.disableModalVerificationAndRejectionButton = false
        console.log('this.listType: ', this.listType)
        if (this.listType === 'waiting-verification') {
          this.query.verificationStatus = 'NOT_VERIFIED'
        } else if (this.listType === 'waiting-approval') {
          this.query.verificationStatus = 'IN_PROGRESS'
        }
        this.accessControlList = localStorage.getItem('accessControlList')
        this.accessControlList = this.accessControlList.split(',')
        // this.containsPermission()
        this.value = [0, 100]
        this.signUpDateFrom = null
        this.signUpDateTo = null
        this.getMembers()
        console.log('Menu component appList value: ', MenuComponent.data().appList)
      },
      filter (key = 'member') {
        this.sliderShow = false
        this.query.pageNumber = 0
        this.query.profileCompletionScoreStartRange = this.value[0]
        this.query.profileCompletionScoreEndRange = this.value[1]
        this.checkBoxTicked = []
        this.headerCheckBox = false
        for (let i = 0; i < 100; i++) {
          this.checkBoxTicked.push(false)
        }
        console.log('mobile number: ' + this.query.mobileNumber + ' accountType: ' + this.query.accountType +
          ' verified: ' + this.query.verificationStatus)
        if (this.signUpDateFrom !== null && this.signUpDateFrom.length > 0) {
          this.query.startSignUpDate = new Date(this.signUpDateFrom).getTime()
        } else {
          this.query.startSignUpDate = 0
        }
        if (this.signUpDateTo !== null && this.signUpDateTo.length > 0) {
          this.query.endSignUpDate = new Date(this.signUpDateTo).getTime() + (1000 * 60 * 60 * 24 * 1 - 1)
        } else {
          this.query.endSignUpDate = new Date().getTime() + (1000 * 60 * 60 * 24 * 1 - 1)
        }
        console.log('query, signup from date: ', this.query.startSignUpDate, ' to date: ',
          this.query.endSignUpDate)
        this.showLoader = true
        Http.GET('member', this.query)
          .then(({data: {data}}) => {
            console.log('sortParam: ', this.query.sort, 'orderParam: ', this.query.order)
            if (this.query.sort === 'PROFILE_COMPLETION_SCORE') {
              this.sortParam = 'PROFILE COMPLETION SCORE'
            } else if (this.query.sort === 'DOCUMENT_UPLOAD') {
              this.sortParam = 'DOCUMENT UPLOAD'
            } else if (this.query.sort === 'CREATION_DATE') {
              this.sortParam = 'ACCOUNT CREATION DATE'
            }
            if (this.query.order === 'DESC') {
              this.orderParam = 'DESC'
            } else if (this.query.order === 'ASC') {
              this.orderParam = 'ASC'
            }
            this.showLoader = false
            console.log('Success in getting filtered results, data: ', data)
            this.members = data
            this.memberListForVerification = {}
            this.memberListForVerificationNames = []
            this.memberVerificationListEmpty = true
            this.disableModalVerificationAndRejectionButton = false
            if (this.query.accountType === '1') this.showBusinessOwner = false
            else this.showBusinessOwner = true
          }, error => {
            console.log('Error in getting filtered results: ', error)
          })
      }
    },
    created () {
      console.log('Member list component created::::')
      this.init()
    }
  }
</script>
