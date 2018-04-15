<template>

    <div id="content" class="member-list" v-if="member">
        <br>
        <div class="gr-12"> <!--offset-md-1-->
          <div class="card"> <!-- class="card"-->
            <h3 class="card-header">
              <i class="fa fa-user" aria-hidden="true"></i> Member Information</h3>
            <div class="w3-header-card w3-panel w3-border-top w3-border-bottom w3-border-left w3-round">
              <div class="gr-12">
                <div class="gr-5 margin-5">
                  <div class="gr-2 margin-5">
                    <img v-if="member.profilePictures && member.profilePictures[0]"
                                :src="imageBaseUrl+member.profilePictures[0].url || '/static/images/default-original.jpg'"
                                class="img-circle img-responsive" width="80" height="80"
                              onerror="onerror=null; src='/static/images/default-profile-180x180.png'">
                    <img v-else src="/static/images/default-original.jpg" class="img-circle img-responsive"
                        alt="N/A" width="70" height="70"
                          onerror="onerror=null; src='/static/images/default-profile-180x180.png'">
                  </div>
                  <div class="gr-8 padding-5 text-left">
                    <span class="margin-bottom-5">
                      <span v-if="member.verificationHistory && member.verificationHistory.length > 0 && member.verificationHistory[0].verificationStatus === 'VERIFIED'">
                        <span class="label" style="color: teal">VERIFIED</span>
                      </span>
                      <span v-else-if="member.verificationHistory && member.verificationHistory.length > 0 && member.verificationHistory[0].verificationStatus === 'IN_PROGRESS'">
                        <span class="label label-warning">IN PROGRESS</span>
                      </span>
                      <span v-else-if="member.verificationHistory && member.verificationHistory.length > 0 && member.verificationHistory[0].verificationStatus === 'REJECTED'">
                        <span class="label label-danger">REJECTED</span>
                      </span>
                      <span v-else-if="member.verificationHistory && member.verificationHistory.length > 0 && member.verificationHistory[0].verificationStatus === 'NOT_VERIFIED'">
                        <span class="label label-default">NOT VERIFIED</span>
                      </span>
                      <span v-else>
                        <span v-if="member.basicInfo.verificationStatus === 'VERIFIED'">
                          <span class="label" style="background-color: teal">VERIFIED</span>
                        </span>
                        <span v-else-if="member.basicInfo.verificationStatus === 'IN_PROGRESS'">
                          <span class="label label-warning">IN PROGRESS</span>
                        </span>
                        <span v-else-if="member.basicInfo.verificationStatus === 'REJECTED'">
                          <span class="label label-danger">REJECTED</span>
                        </span>
                        <span v-else-if="member.basicInfo.verificationStatus === 'NOT_VERIFIED'">
                          <span class="label label-default">NOT VERIFIED</span>
                        </span>
                      </span>
                    </span>
                    <br>
                    <span>
                      <b v-if="member.basicInfo && member.basicInfo.accountType === 1">
                        {{member.basicInfo.name}}
                      </b>
                      <b v-else-if="member.basicInfo && member.basicInfo.accountType === 2">
                        {{member.businessDetails.businessBasicInfo.businessName}}
                      </b>
                    </span>
                    <br>
                    <span><b>{{member.basicInfo.mobileNumber}}</b></span>
                    <br>
                    <span><b>{{member.basicInfo.profileCompletionScore}}%</b></span>
                    <br>
                    <div v-restrict="'MS_MM_USER_CHANGE_ACCOUNT_STATUS'" class="width-150">
                      <div class="select select-sm push-0">
                        <select id="order-by-select"  v-model="member.basicInfo.accountStatus" @change="statusChange(id, member.basicInfo.accountStatus)">
                          <option value = "1">Active</option>
                          <option value = "2">Suspended</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="gr-6 push-1 margin-5 text-right">
                  <p><b><h3>
                  <span v-if="balance">Current Balance: {{ balance.balance }} BDT </span>
                  <span v-else>Current Balance: N/A </span>
                  </h3></b></p>
                </div>
              </div>
              <div class="btn-group btn-group-sm padding-5 margin-5">
                <button type="button" class="btn btn-default" :class="{'btn-active-til': showBasicDetails}"
                @click="setTab('basicDetails')">Basic Details</button>
                <button v-if="containsPermission('MS_MM_USER_GET_ACTIVITIES')" type="button" class="btn btn-default" 
                :class="{'btn-active-til': showActivities}" @click="setTab('activities')">Activities</button>
                <button v-if="containsPermission('MS_USER_GET_ACTIVITY')" type="button" class="btn btn-default" 
                :class="{'btn-active-til': showAdminActivities}" @click="setTab('adminActivities')">Admin Activities</button>
                <button v-if="containsPermission('MS_MM_USER_GET_TRANSACTION_HISTORY')" type="button" class="btn btn-default"
                :class="{'btn-active-til': showTransactions}" @click="setTab('transactions')">Transactions</button>
                <button v-if="containsPermission('MS_MM_USER_SUSPENSION_HISTORY')" type="button" class="btn btn-default"
                :class="{'btn-active-til': showSuspensionHistory}" @click="setTab('suspensionHistory')">Suspension History</button>
                <button v-if="containsPermission('MS_MM_USER_GET_LIKELY_NAMES')" type="button" class="btn btn-default"
                :class="{'btn-active-til': showLikelyNames}" @click="setTab('likelyNames')">Likely Names</button>
                <button v-if="containsPermission('MS_MM_USER_GET_CONTACTS')" type="button" class="btn btn-default"
                :class="{'btn-active-til': showFriends}" @click="setTab('friends')">Friends</button>
                <button v-if="member.basicInfo && member.basicInfo.accountType==2" type="button" class="btn btn-default"
                :class="{'btn-active-til': showOffer}" @click="setTab('offers')">Offers</button>
                <button v-if="containsPermission('MS_IPAY_ACL_CHANGE_SERVICE_ACCESS_LEVEL')" type="button" class="btn btn-default"
                :class="{'btn-active-til': showAccessControl}" @click="setTab('accessControl')">Access Control</button>
                <button v-if="containsPermission('MS_MM_USER_GET_MANUAL_VERIFICATION_CRITERIA')" type="button" class="btn btn-default"
                :class="{'btn-active-til': showVerificationChecklist}" @click="setTab('verificationChecklist')">Verification Checklist</button>
                <button v-if="containsPermission('MS_MM_USER_SEND_SMS')" type="button" class="btn btn-default"
                :class="{'btn-active-til': showMemberSMS}" @click="setTab('memberSms')">Message</button>
              
              </div>
            </div>
            
            <div v-if="showBasicDetails">
              <div class="w3-header-card" v-if="member.basicInfo">
                    <div class="row">

                      <div class="gr-2 text-center margin-top-10">
                        <img v-if="member.profilePictures && member.profilePictures[0]" @click="imagePreview(imageBaseUrl+member.profilePictures[0].url)"
                              :src="imageBaseUrl+member.profilePictures[0].url || '/static/images/default-original.jpg'"
                              class="img-rounded img-responsive" width="250" height="250"
                             onerror="onerror=null; src='/static/images/default-profile-180x180.png'">

                        <img v-else src="/static/images/default-original.jpg" class="img-rounded img-responsive"
                            alt="N/A" width="250" height="250"
                             onerror="onerror=null; src='/static/images/default-profile-180x180.png'">
                        <update-member-image
                          :member="member"
                          :id="id"
                          @update="editProfilePic"
                          v-if="containsPermission('MS_MM_USER_UPLOAD_PROFILE_PIC')">
                        </update-member-image>
                        <div class="text-center">
                          <b v-if="member.basicInfo.accountType == 1">{{member.basicInfo.name}}</b>
                          <b v-if="member.basicInfo.accountType == 2">{{member.businessDetails.businessBasicInfo.businessName}}</b>
                          <span class="banner-text" v-if="member.basicInfo.accountType == 1">(Personal)</span>
                          <span class="banner-text" v-else>(Business)</span>
                        </div>
                        <div class="text-center">
                          {{member.basicInfo.mobileNumber}}
                        </div>
                        <div class="text-center">
                          <span>{{member.basicInfo.profileCompletionScore}}%</span>
                        </div>
                        <div class="text-center gr-10 push-1 margin-5" v-if="containsPermission('MS_MM_USER_CHANGE_ACCOUNT_CLASS')">
                          <div class="select" @change="showAccClassChangeModal()">
                            <select v-model="memberAccountClass">
                              <option v-for="item in classes" :value="item.id">{{ item.name }}</option>
                            </select>
                          </div>
                        </div>
                        <div class="margin-5" v-else>
                              <b v-for="item in classes"><span v-if="item.id===memberAccountClass">{{ item.name }}</span></b>
                        </div>

                        <div id="MemberClassChangeModal" class="modal fade" role="dialog">
                          <div class="modal-dialog  modal-md">
                            <!-- Modal content-->

                            <div class="modal-content">
                              <div class="modal-header">
                                <button type="button" class="close" @click="cancelChangingAccountClass" data-dismiss="modal" >&times;</button>
                                <h4 class="modal-title"> Change account class of the Member? </h4>
                              </div>
                              <div class="modal-body">
                                <div class="form-group">
                                  <div class="row">
                                    <div class="col-md-10 col-md-offset-1">
                                      <span>
                                        <div class="comment">
                                          <!--<span>Browse</span>-->
                                          <b>Member's account class will be changed by this action. Do you want to make this change?</b>
                                        </div>
                                        <!-- <input id="uploadFile3" placeholder="Choose File" disabled="disabled" /> -->
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="modal-footer">
                                <button type="button" class="btn btn-sm btn-default btn-active-til" @click="changeAccountClass" data-dismiss="modal">Yes</button>
                                <button type="button" class="btn btn-sm btn-danger" @click="cancelChangingAccountClass" data-dismiss="modal">No</button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                      </div>

                      <div class="gr-10 text-left">
                        
                        <div class="gr-12 panel-label margin-5">
                          <div class="gr-2">
                            <label class="text-label"><b>Basic Information</b></label>
                          </div>
                          <div class="gr-2 push-7" v-if="!editBasicProfileMode && containsPermission('MS_MM_USER_UPDATE_BASIC_DETAILS')">
                              <button class="button-md-verify" @click="editBasicInfo()"><i class="fa fa-pencil-square-o"></i> Edit </button>
                          </div>
                        </div>
                        <div class="gr-10" v-if="!editBasicProfileMode">
                          <div class=row>
                            <div class="gr-2">
                              Name:
                            </div>
                            <div class="gr-4 text-left">
                              {{ member.basicInfo.name || 'N/A'}}
                            </div>
                          <!-- </div>
                          <div class="row"> -->
                            <div class="gr-2">
                              Ipay Number:
                            </div>
                            <div class="gr-4 text-left pull-.5">
                              {{ member.basicInfo.mobileNumber || 'N/A' }}
                            </div>
                          </div>
                          <div class=row>
                            <div class="gr-2">
                            Gender:
                            </div>
                            <div class="gr-4 text-left">
                            <i v-bind:class="{'fa fa-male':member.basicInfo.gender==='M','fa fa-female':member.basicInfo.gender==='F'}"></i>{{ !member.basicInfo.gender ? 'N/A' : '' }}
                            </div>
                            <div class="gr-2">
                              Date of Birth:
                            </div>
                            <div class="gr-4 text-left pull-.5">
                            {{ member.basicInfo.dob | date('MMM D, YYYY') || 'N/A' }}
                            </div>
                          </div>
                          <div class=row>
                            <div class="gr-2">
                            Verification Status:
                            </div>
                            <div class="gr-4 text-left">
                              {{ member.basicInfo.verificationStatus === null ? 'N/A': member.basicInfo.verificationStatus == 'VERIFIED' ? 'Verified':
                              member.basicInfo.verificationStatus == 'NOT_VERIFIED' ? 'Not Verified':
                              member.basicInfo.verificationStatus == 'IN_PROGRESS' ? 'In Progress':
                              'Rejected'}}
                            </div>
                          <!-- </div>
                          <div class=row> -->
                            <div class="gr-2">
                            Occupation:
                            </div>
                            <div class="gr-4 text-left pull-.5">
                            {{ occupationName || 'N/A' }}
                            </div>
                          </div>
                          <div class=row>
                            <div class="gr-2">
                            Organization Name:
                            </div>
                            <div class="gr-4 text-left pull-.5">
                            {{ member.basicInfo.organizationName || 'N/A' }}
                            </div>
                          <!-- </div>
                          <div class=row> -->
                            <div class="gr-2">
                            Member Since:
                            </div>
                            <div class="gr-4 text-left pull-.5">
                            {{ member.basicInfo.accountCreationDate | date('MMM D, YYYY') || 'N/A' }}
                            </div>
                          </div>
                          <div class=row>
                          </div>
                        </div>
                        <div class="gr-12" v-else>
                          <member-basic-info-update
                            :member="member"
                            :occupationList="occupationList"
                            @update="editBasicInfo">
                          </member-basic-info-update>
                        </div>

                        <!--<hr>-->
                        <div v-if="member.basicInfo.accountType===1">
                          <div class="gr-12 panel-label margin-5">
                            <div class="gr-2">
                                <label class="text-label"><b>Family Information</b></label>
                              </div>
                              <div class="gr-2 push-7"
                                  v-if="!editParentsMode && containsPermission('MS_MM_USER_UPDATE_BASIC_DETAILS')">
                                  <button class="button-md-verify" @click="editParents()">
                                    <i class="fa fa-pencil-square-o"></i> Edit </button>
                              </div>
                          </div>
                          <div v-if="!editParentsMode" class="gr-10">
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
                          <div class="gr-12" v-else>
                            <update-member-parents
                                :member="member"
                                @update="editParents">
                            </update-member-parents>
                          </div>
                        </div>
                        <div class="gr-12" v-if="member.basicInfo.accountType===2">
                          <div class="row">
                            <div class="gr-1 text-center margin-top-10">
                              <img v-if="member.businessDetails.businessOwnerPictures[0]" @click="imagePreview(imageBaseUrl+member.businessDetails.businessOwnerPictures[0].url)"
                                  :src="imageBaseUrl+member.businessDetails.businessOwnerPictures[0].url"
                                  class="img-rounded img-responsive" onerror="this.onerror=null; this.src='/static/images/default-original.jpg';" width="80" height="70">
                              <!-- <span v-else> -->
                              <img v-else src="/static/images/default-original.jpg" class="img-rounded" alt="N/A" width="80" height="70">
                              <!-- </span> -->
                              <update-member-business-image
                                :member="member"
                                :id="id"
                                @update="editProfilePic">
                              </update-member-business-image>
                            </div>
                            <div class="gr-10">
                              <div class="gr-12 panel-label margin-5">

                                <div class="gr-3">
                                  <label class="text-label"><b>Business Information</b></label>
                                </div>

                              </div>
                              <div class="margin-10">
                                <div class=row>
                                  <div class="gr-2">
                                  Business Name:
                                  </div>
                                  <div class="gr-4 text-left">
                                    {{ member.businessDetails.businessBasicInfo.businessName || 'N/A' }}

                                  </div>
                                  <div class="gr-2">
                                  Business Type:
                                  </div>
                                  <div class="gr-4 text-left">
                                    {{ businessType || 'N/A' }}
                                  </div>
                                </div>
                                <div class=row>
                                  <div class="gr-2">
                                  Email:
                                  </div>
                                  <div class="gr-4 text-left">
                                    {{ member.businessDetails.businessBasicInfo.email || 'N/A' }}
                                  </div>
                                  <div class="gr-2">
                                  Ipay Number:
                                  </div>
                                  <div class="gr-4 text-left">
                                    {{ member.businessDetails.businessBasicInfo.mobileNumber || 'N/A' }}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div v-if="containsPermission('MS_MM_USER_IS_VERIFIABLE') && (member.basicInfo.verificationStatus !== 'VERIFIED' || (member.basicInfo.verificationStatus === 'VERIFIED' && memberMissingInfo && !memberMissingInfo.isVerifiable) )">
                            <div class="gr-12 panel-label margin-5">
                              <label class="text-label"><b>Missing Information</b></label>
                            </div>
                            <hr>
                            <div class="gr-12 text-center" v-if="memberMissingInfo && memberMissingInfo.isVerifiable">
                                No missing Information.This Member is <b>Verifiable</b>.
                            </div>
                            <div class="gr-12" v-else-if="memberMissingInfo">
                                <div class="gr-6" v-for="missingInfo in memberMissingInfo.missingInformation">
                                    <span class="text-ash">
                                        -{{missingInfo | underscoreless}}
                                    </span>
                                </div>

                            </div>
                        </div>
                    </div>
                  </div>

              </div>


              <div id="addresses" class="gr-12 w3-header-card" v-if="containsPermission('MS_MM_USER_BASIC_DETAILS')">
                <div class="gr-12 panel-label">
                  <label class="text-label"><b>Address</b></label>
                </div>
                <!--<div class="gr-2 push-6" v-if="!editAddressMode">-->
                  <!--<button class="button-md-edit" @click="editAddress"><i class="fa fa-pencil-square-o"></i> Edit </button>-->
                <!--</div>-->

                <!--<br>-->
                <div class="justify-content-left">
                  <!-- ================================= present address =============================================== -->

                  <div class="gr-6" v-if="!editPresentAddressMode">
                    <div class="gr-12">
                      <div class="gr-2">
                        <h3><b>Present</b></h3>
                      </div>
                      <div class="gr-2 push-6"
                            v-if="!editPresentAddressMode && containsPermission('MS_MM_USER_UPDATE_ADDRESS')">
                        <button class="button-md-verify" @click="editPresentAddress">
                          <i class="fa fa-pencil-square-o"></i> Edit </button>
                      </div>
                    </div>
                    <div class="row text-left">
                      <div class="gr-2">
                        Address:
                      </div>
                      <div class="gr-3">
                        {{ memberPresentAddress.addressLine1 }}
                      </div>
                    </div>
                    <div class="row text-left">
                      <div class="gr-2">
                      </div>
                      <div class="gr-3 ">
                        {{ memberPresentAddress.addressLine2 }}
                      </div>
                    </div>
                    <div class="row text-left">
                      <div class="gr-2">
                        District:
                      </div>
                      <div class="gr-3">
                        {{ districtNamePresent }}
                      </div>
                    </div>
                    <div class="row text-left">
                      <div class="gr-2">
                        Thana:
                      </div>
                      <div class="gr-3">
                        {{ thanaNamePresent }}
                      </div>
                    </div>
                    <div class="row text-left">
                      <div class="gr-2">
                        Country:
                      </div>
                      <div class="gr-3">
                        {{ countryNamePresent === 'BD' ? 'Bangladesh' : countryNamePresent }}
                      </div>
                    </div>
                  </div>

                  <div v-else id="editPresentAddress" v-else-if="containsPermission('MS_MM_USER_UPDATE_ADDRESS')">
                    <update-member-address
                          :id= "id"
                          :memberPresentAddress="memberPresentAddress"
                          :thanaList= "thanaList"
                          :districtList= "districtList"
                          @update="editPresentAddress">
                    </update-member-address>
                  </div>

                  <!-- ================================= permanent address =============================================== -->

                  <div class="gr-6" v-if="!editPermanentAddressMode" >
                    <div class="gr-12">
                      <div class="gr-2">
                        <h3 v-if="member.basicInfo && member.basicInfo.accountType===1"><b>Permanent</b></h3>
                        <h3 v-if="member.basicInfo && member.basicInfo.accountType===2"><b>Business</b></h3>

                      </div>
                      <div class="gr-2 push-6"
                            v-if="!editPermanentAddressMode && containsPermission('MS_MM_USER_UPDATE_ADDRESS')">
                        <button class="button-md-verify" @click="editPermanentAddress">
                          <i class="fa fa-pencil-square-o"></i> Edit </button>
                      </div>
                    </div>
                    <div class="row text-left">
                      <div class="gr-2">
                        Address:
                      </div>
                      <div class="gr-3">
                        {{ memberPermanentAddress.addressLine1 }}
                        <!--{{ member.addresses.length > 1 ? member.addresses[1].addressLine1 : 'N/A' }}-->
                      </div>
                    </div>
                    <div class="row text-left">
                      <div class="gr-2">
                      </div>
                      <div class="gr-3 ">
                        {{ memberPermanentAddress.addressLine2 }}
                        <!--{{ member.addresses.length > 1 ? member.addresses[1].addressLine2 : 'N/A' }}-->
                      </div>
                    </div>
                    <div class="row text-left">
                      <div class="gr-2">
                        District:
                      </div>
                      <div class="gr-3">
                        {{ districtNamePermanent }}
                      </div>
                    </div>
                    <div class="row text-left">
                      <div class="gr-2">
                        Thana:
                      </div>
                      <div class="gr-3">
                        {{ thanaNamePermanent }}
                      </div>
                    </div>
                    <div class="row text-left">
                      <div class="gr-2">
                        Country:
                      </div>
                      <div class="gr-3">
                        {{ countryNamePermanent === 'BD' ? 'Bangladesh' : countryNamePermanent }}
                      </div>
                    </div>
                  </div>
                  <div v-else id="editPermanentAddress" v-else-if="containsPermission('MS_MM_USER_UPDATE_ADDRESS')">
                    <update-member-address
                          :id= "id"
                          :memberPermanentAddress="memberPermanentAddress"
                          :thanaList= "thanaList"
                          :districtList= "districtList"
                          @update="editPermanentAddress">
                    </update-member-address>
                  </div>
                </div>
              </div>
              
              <div id="email" class="gr-12 w3-header-card" v-if="containsPermission('MS_MM_USER_BASIC_DETAILS')">
                <div class="gr-12 panel-label">
                  <label class="text-label"><b>Email</b></label>
                </div>

                <div class="gr-11 padding-5">
        
                  <div class="text-center" v-if="member.emails && member.emails.length === 0">No Email Added<br></div>
                  <div v-else-if="member.emails" class="small-scrollable height-210">
                    <table class="table ui celled" cellspacing="0" width="100%">
                      <thead class="thead-default">
                      <tr>
                        <th class = "text-center">Email Address</th>
                        <th class = "text-center">Type</th>
                        <th class = "text-center">Status</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr class="text-center" v-for="item in member.emails">
                        <td>{{ item.emailAddress }}</td>
                        <td>{{ item.primary ? 'Primary' : 'Not Primary' }}</td>
                        <td>{{ item.verificationStatus | underscoreless }}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div>
                <div class="verification">
                  <div>
                    <div class="gr-12 w3-header-card" v-if="containsPermission('MS_MM_USER_GET_IDENTIFICATION_DOCUMENTS')">
                      <member-identification-document
                        :id="id" :accountType="accountType" :boom="2">
                      </member-identification-document>
                    </div>

                    <div class="gr-12 w3-header-card" v-if="containsPermission('MS_MM_USER_GET_BANK_LIST')">
                      <member-bank-account :id="id">
                      </member-bank-account>
                    </div>

                    <div class="gr-12 w3-header-card">
                      <member-bank-card :id="id">
                      </member-bank-card>
                    </div>


                    <div class="gr-12 justify-content-center w3-header-card"
                         v-if="containsPermission('MS_MM_USER_GET_INTRODUCER_LIST')">
                      <member-introduced-by :id="id">
                      </member-introduced-by>

                      <member-has-introduced :id="id">
                      </member-has-introduced>
                    </div>

                    <div class="gr-12 w3-header-card" v-if="containsPermission('MS_MM_USER_GET_INVITERS')">
                      <member-invited-by :id="id">
                      </member-invited-by>
                    </div>

                  </div>

                  <div class="justify-content-center"
                       v-if="containsPermission('MS_MM_USER_VERIFICATION_VERIFY') || containsPermission('MS_MM_USER_VERIFICATION_APPROVE')">
                    <member-verify-and-approve :id="id" :member="member">
                    </member-verify-and-approve>

                  </div>
                </div>
              </div>
            </div>
            <member-activity v-if="showActivities" :id="id"></member-activity>
            <member-admin-activity v-if="showAdminActivities" :id="id"></member-admin-activity>
            <member-transaction v-if="showTransactions" :id="id"></member-transaction>
            <member-suspension-history v-if="showSuspensionHistory" :id="id"></member-suspension-history>
            <member-likely-names v-if="showLikelyNames" :mobileNumber="member.basicInfo.mobileNumber"></member-likely-names>
            <member-offer v-if="showOffer" :id="id"></member-offer>
            <member-access-control v-if="showAccessControl" :id="id"></member-access-control>
            <member-friends v-if="showFriends" :mobileNumber="member.basicInfo.mobileNumber"></member-friends>
            <member-verification-checklist v-if="showVerificationChecklist" :id="id"></member-verification-checklist>
            <member-sms-send v-if="showMemberSMS" :id="id"></member-sms-send>
            
        </div>
      </div>

      <div id="ImagePreviewModal" class="modal fade" role="dialog">
        <div class="modal-dialog modal-lg" style="width: 45%">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" >&times;</button>
              <!-- <h4 class="modal-title"> Document {{ document.documentType }} </h4> -->
            </div>
            <div class="modal-body">
              <div class="form-group">

                <div class="row">
                  <!-- <div class="col-md-3">
                    <label class="control-label">Document</label>
                  </div> -->
                  <div class="col-md-12">
                    <div class="text-center">
                        <img id="ppImage" v-if="imagePreviewUrl"
                              :src="imagePreviewUrl"
                              onerror="onerror=null; src='/static/images/default-profile-180x180.png'"
                              class="img-rounded" width="90%" height="auto">

                        <img v-else src="/static/images/default-profile-180x180.png" class="img-rounded"
                            width="90%" height="auto">
                        
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

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
                                          <strong class="primary-font">{{history.suspensionStatus}}</strong> by <strong class="primary-font">{{ history.adminLoginId ? history.adminLoginId : (history.verifierId === -1 ? 'Auto Verification' : 'Legacy Admin User') }}  </strong> <small class="pull-right text-muted">
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
  import Constants from '../../services/Constants'
  import MemberSuspensionHistory from './MemberSuspensionHistoryComponent.vue'
  import MemberActivity from './MemberActivityComponent.vue'
  import MemberAdminActivity from './MemberAdminActivityComponent.vue'
  import MemberTransaction from './MemberTransactionComponent.vue'
  import MemberIdentificationDocument from './MemberIdentificationDocumentComponent.vue'
  import MemberIntroducedBy from './MemberIntroducedByComponent.vue'
  import MemberHasIntroduced from './MemberHasIntroducedComponent.vue'
  import MemberBankAccount from './MemberBankAccountComponent.vue'
  import MemberBasicInfoUpdate from './UpdateMemberBasicInfoComponent.vue'
  import MemberLikelyNamesComponent from './MemberLikelyNamesComponent.vue'
  import MemberFriendsComponent from './MemberFriendsComponent.vue'
  import UpdateMemberFamilyInfo from './UpdateMemberFamilyInfoComponent.vue'
  import UpdateMemberAddress from './UpdateMemberAddressComponent.vue'
  import UpdateMemberImage from './UpdateMemberImageComponent.vue'
  import MemberVerifyAndApproveComponent from './MemberVerifyAndApproveComponent.vue'
  import MemberOffer from './MemberOfferComponent.vue'
  import UpdateMemberBusinessImage from './UpdateMemberBusinessImageComponent.vue'
  import MemberAccessControl from './MemberAccessControlComponent.vue'
  import MemberBankCard from './MemberBankCardComponent.vue'
  import MemberVerificationChecklist from './MemberVerificationChecklistComponent.vue'
  import MemberSMSSend from './MemberSMSSendComponent.vue'
  import MemberInvitedBy from './MemberInvitedByComponent.vue'

  export default {
    name: 'MemberIndividualComponent',
    props: [
      'id',
      'accountType'
    ],
    components: {
      'member-suspension-history': MemberSuspensionHistory,
      'member-activity': MemberActivity,
      'member-admin-activity': MemberAdminActivity,
      'member-transaction': MemberTransaction,
      'member-identification-document': MemberIdentificationDocument,
      'member-introduced-by': MemberIntroducedBy,
      'member-likely-names': MemberLikelyNamesComponent,
      'member-friends': MemberFriendsComponent,
      'member-has-introduced': MemberHasIntroduced,
      'member-bank-account': MemberBankAccount,
      'member-basic-info-update': MemberBasicInfoUpdate,
      'member-verify-and-approve': MemberVerifyAndApproveComponent,
      'update-member-parents': UpdateMemberFamilyInfo,
      'update-member-address': UpdateMemberAddress,
      'update-member-image': UpdateMemberImage,
      'update-member-business-image': UpdateMemberBusinessImage,
      'member-offer': MemberOffer,
      'member-access-control': MemberAccessControl,
      'member-bank-card': MemberBankCard,
      'member-verification-checklist': MemberVerificationChecklist,
      'member-sms-send': MemberSMSSend,
      'member-invited-by': MemberInvitedBy
    },
    data () {
      return {
        member: {},
        imagePreviewUrl: '',
        balance: '',
        thanaNamePresent: '',
        districtNamePresent: '',
        countryNamePresent: '',
        thanaNamePermanent: '',
        districtNamePermanent: '',
        countryNamePermanent: '',
        serviceList: Constants,
        showBasicDetails: true,
        showActivities: false,
        showAdminActivities: false,
        showAccessControl: false,
        showTransactions: false,
        showSuspensionHistory: false,
        showLikelyNames: false,
        showFriends: false,
        showOffer: false,
        showVerificationChecklist: false,
        showMemberSMS: false,
        occupationName: null,
        businessType: null,
        editBasicProfileMode: false,
        editParentsMode: false,
        editPresentAddressMode: false,
        editPermanentAddressMode: false,
        imageBaseUrl: '',
        thanaList: {},
        districtList: {},
        profilePicture: {},
        accessControlList: [],
        memberAccountClass: 1,
        memberAccountID: '',
        memberAccountStatus: '',
        memberComment: '',
        memberPresentAddress: {
          addressLine1: 'N/A',
          addressLine2: '',
          country: 1,
          districtId: 'N/A',
          postalCode: 'N/A',
          status: 'N/A',
          thanaId: 'N/A',
          type: 'PRESENT'
        },
        memberPermanentAddress: {
          addressLine1: 'N/A',
          addressLine2: '',
          country: 1,
          districtId: 'N/A',
          postalCode: 'N/A',
          status: 'N/A',
          thanaId: 'N/A',
          type: 'PERMANENT'
        },
        memberSuspensionHistory: [],
        showLoader: false,
        memberMissingInfo: null,
        accountClassMapper: {},
        classes: []
      }
    },
    created () {
//      console.log('created member basic information..., member id iss: ', this.id)
      this.init()
    },
    methods: {
      containsPermission (permission) {
        return this.accessControlList.indexOf(permission) > -1
      },
      init () {
        this.imageBaseUrl = Http.IMAGE_URL
        // Http call for basic information of the member with the 'id'
        this.memberPresentAddress = {
          addressLine1: 'N/A',
          addressLine2: '',
          country: 'Bangladesh',
          districtId: 'N/A',
          postalCode: 'N/A',
          status: 'N/A',
          thanaId: 'N/A',
          type: 'PRESENT'
        }
        this.memberPermanentAddress = {
          addressLine1: 'N/A',
          addressLine2: '',
          country: 'Bangladesh',
          districtId: 'N/A',
          postalCode: 'N/A',
          status: 'N/A',
          thanaId: 'N/A',
          type: 'PERMANENT'
        }
        this.accessControlList = localStorage.getItem('accessControlList')
        this.accessControlList = this.accessControlList.split(',')
        this.showLoader = true
        Http.GET('member', [this.id, 'basic-details'])
          .then(
            ({data: {data: member}}) => {
              this.showLoader = false
              this.member = member
              console.log('Got, member success::')
              console.log('member basic info: ', this.member.basicInfo,
                ' member verification history: ', this.member.verificationHistory)
              // this.member.basicInfo.dob = this.$options.filters.date(this.member.basicInfo.dob, 'YYYY-MM-DD')
              // check for address

              for (let indx in this.member.addresses) {
                let address = this.member.addresses[indx]
                if (address.type === 'PRESENT') {
                  this.memberPresentAddress = address
                } else if (address.type === 'PERMANENT') {
                  this.memberPermanentAddress = address
                } else if (address.type === 'OFFICE') {
                  this.memberPermanentAddress = address
                }
              }
              console.log('this.memberPresentAddress: ', this.memberPresentAddress)
              console.log('this.memberPermanentAddress: ', this.memberPermanentAddress)
              console.log('response addresses: ', this.member.addresses)
              this.memberAccountClass = member.basicInfo.accountClass
              this.getStaticNames()
            },
            error => {
              this.showLoader = false
              console.log('Error occurred getting details of the member, error: ', error)
            }
          )
//         Http call for balance
        this.showLoader = true
        Http.GET('member', [this.id, 'balance'])
          .then(
            ({data}) => {
              this.showLoader = false
              this.balance = data.data
//              console.log('balance is: ', this.balance)
            },
            error => {
              this.showLoader = false
              console.log('Error in retrieving balance... ', error)
            }
          )
        if (!this.containsPermission('MS_MM_USER_IS_VERIFIABLE')) {
          this.memberMissingInfo = null
        } else {
            // Http call for the missing information
          this.showLoader = true
          Http.GET('member', [this.id, 'is-verifiable'])
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
      },
      imagePreview (url) {
        this.imagePreviewUrl = url
        console.log(this.imagePreviewUrl)
        $('#ImagePreviewModal').modal({backdrop: false})
      },
      editBasicInfo (param = '') {
        if (this.editBasicProfileMode) {
          this.editBasicProfileMode = false
          this.init()
        } else {
          this.editBasicProfileMode = true
        }
      },
      editParents (param = '') {
        if (this.editParentsMode) {
          this.editParentsMode = false
          this.init()
        } else {
          this.editParentsMode = true
        }
      },
      editProfilePic () {
        this.init()
      },
      editPresentAddress (param = '') {
//        console.log('edit button of PRESENT address clicked... it was: ', this.editPresentAddressMode)
        if (this.editPresentAddressMode) {
          this.init()
          this.editPresentAddressMode = false
        } else {
          this.editPresentAddressMode = true
        }
        console.log('now editAddressMode is: ', this.editPresentAddressMode)
      },
      editPermanentAddress (param = '') {
//        console.log('edit button of PARMANENT address clicked... it was: ', this.editPermanentAddressMode)
        if (this.editPermanentAddressMode) {
          this.editPermanentAddressMode = false
          this.init()
        } else {
          this.editPermanentAddressMode = true
        }
//        console.log('now edit Parmanent AddressMode is: ', this.editPermanentAddressMode)
      },
      showAccClassChangeModal () {
        console.log(this.memberAccountClass)
        $('#MemberClassChangeModal').modal('show')
      },
      changeAccountClass () {
        this.showLoader = true
        Http.PUT('mmAdminMember', {}, [this.id, 'class', this.memberAccountClass])
        .then(
          ({data: classChanged}) => {
            this.showLoader = false
            this.member.basicInfo.accountClass = this.memberAccountClass
            $.notify({
              // options
              title: '<strong>Success!</strong>',
              message: 'Account Class Has been Changed Successfully.'
            }, {
              // settings
              type: 'success',
              delay: 3000
            })
          },
          error => {
            this.showLoader = false
            console.log('Error in getting the list of missing, error: ', error)
            $.notify({
              // options
              title: '<strong>Changing Account Class failed!</strong>',
              message: 'Please try again.'
            }, {
              // settings
              type: 'danger',
              delay: 3000
            })
          }
        )
      },
      cancelChangingAccountClass () {
        this.memberAccountClass = this.member.basicInfo.accountClass
      },
      setTab (tabName) {
        this.showBasicDetails = false
        this.showActivities = false
        this.showAdminActivities = false
        this.showTransactions = false
        this.showSuspensionHistory = false
        this.showLikelyNames = false
        this.showFriends = false
        this.showOffer = false
        this.showAccessControl = false
        this.showVerificationChecklist = false
        this.showMemberSMS = false
        if (tabName === 'basicDetails') {
          this.showBasicDetails = true
        } else if (tabName === 'activities') {
          this.showActivities = true
        } else if (tabName === 'adminActivities') {
          this.showAdminActivities = true
        } else if (tabName === 'transactions') {
          this.showTransactions = true
        } else if (tabName === 'suspensionHistory') {
          this.showSuspensionHistory = true
        } else if (tabName === 'likelyNames') {
          this.showLikelyNames = true
        } else if (tabName === 'friends') {
          this.showFriends = true
        } else if (tabName === 'offers') {
          this.showOffer = true
        } else if (tabName === 'accessControl') {
          this.showAccessControl = true
        } else if (tabName === 'verificationChecklist') {
          this.showVerificationChecklist = true
        } else if (tabName === 'memberSms') {
          this.showMemberSMS = true
        }
      },
      getStaticNames () {
        Http.GET('resource', ['account-class'])
          .then(
            ({data: {data: classes}}) => {
              this.classes = classes
              console.log('successfully got account class list: ', classes)
              this.classes.forEach(item => {
                this.accountClassMapper[item.id] = item.name
              })
            },
            error => {
              console.log('error getting service list', error)
            }
          )

        this.businessTypeList = JSON.parse(localStorage.getItem('businessType'))
        if (this.member.businessDetails && this.member.businessDetails.businessBasicInfo.businessType) {
          this.businessType = this.businessTypeList.find(x => x.id === this.member.businessDetails.businessBasicInfo.businessType).name
        }
        this.occupationList = JSON.parse(localStorage.getItem('occupation'))
        if (this.member.basicInfo.occupation) {
          this.occupationName = this.occupationList.find(x => x.id === this.member.basicInfo.occupation).name
        }
        this.thanaList = JSON.parse(localStorage.getItem('thana'))
        this.districtList = JSON.parse(localStorage.getItem('district'))
        this.thanaNamePresent = this.thanaList.find(x => x.id === this.memberPresentAddress.thanaId)
        if (this.thanaNamePresent) {
          this.thanaNamePresent = this.thanaNamePresent.name
        } else {
          this.thanaNamePresent = 'N/A'
        }
        this.districtNamePresent = this.districtList.find(x => x.id === this.memberPresentAddress.districtId)
        if (this.districtNamePresent) {
          this.districtNamePresent = this.districtNamePresent.name
        } else {
          this.districtNamePresent = 'N/A'
        }
        this.countryNamePresent = this.memberPresentAddress.country

//        console.log('Line 1322, thana id: ', this.thanaNamePermanent.thanaId)
        this.thanaNamePermanent = this.thanaList.find(x => x.id === this.memberPermanentAddress.thanaId)
        if (this.thanaNamePermanent) {
          this.thanaNamePermanent = this.thanaNamePermanent.name
//          console.log('Line 1325, thana name permanent: ', this.thanaNamePermanent)
        } else {
          this.thanaNamePermanent = 'N/A'
//          console.log('Line 1328, thana name permanent: ', this.thanaNamePermanent)
        }
        this.districtNamePermanent = this.districtList.find(x => x.id === this.memberPermanentAddress.districtId)
        if (this.districtNamePermanent) {
          this.districtNamePermanent = this.districtNamePermanent.name
        } else {
          this.districtNamePermanent = 'N/A'
        }
        this.countryNamePermanent = this.memberPermanentAddress.country
//        if (this.countryNamePermanent) {
//          this.countryNamePermanent = this.countryNamePermanent.name
//        } else {
//          this.countryNamePermanent = 'N/A'
//        }
      },
      statusChange (accountID, accountStatus) {
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
            console.log('Success, got suspension history: ', data)
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
              message: 'Account Status changed.'
            }, {
              // settings
              type: 'success',
              delay: 3000
            })
            console.log('account status data::', statusData)
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
            console.log('Error account status change: ', error)
          }
        )
      }
    }
  }
</script>
