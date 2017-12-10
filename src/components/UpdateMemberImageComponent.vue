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
        <button class="update btn btn-sm btn-block btn-default btn-active-til"
        data-toggle="modal" data-target="#ChangePpModal" title="Change Profile Picture" data-backdrop="false">
            <i class="glyphicon glyphicon-camera">
            </i> Change
        </button>

        <div id="ChangePpModal" class="modal fade" role="dialog">
        <div class="modal-dialog  modal-md">
          <!-- Modal content-->

          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" >&times;</button>
              <h4 class="modal-title"> Change Your Profile Picture </h4>
            </div>
            <div class="modal-body">
              <div class="form-group">

                <div class="row">
                  <div class="col-md-3">
                    <label class="control-label">Image:</label>
                  </div>
                  <div class="col-md-8">
                    <div>
                      <img id="ppImage" v-if="member.basicInfo.mmUserPictures[0]"
                              :src="imageUrl || 'static/images/default-original.jpg'"
                              class="img-rounded img-responsive" width="250" height="250">

                        <img v-else src="static/images/default-original.jpg" class="img-rounded img-responsive"
                            alt="N/A" width="30" height="30">

                    </div>
                  </div>
                </div>
            <br>
                <div class="row">
                  <div class="col-md-4 col-md-offset-3">
                    <span>
                      <div class="fileUpload">
                        <!--<span>Browse</span>-->
                        <input id="uploadBtn3" type="file" class="btn btn-default" @change="onPPChange"/>
                      </div>
                      <!-- <input id="uploadFile3" placeholder="Choose File" disabled="disabled" /> -->
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">

              <button type="button" class="btn btn-sm btn-default btn-active-til" @click="uploadPP" data-dismiss="modal">Update</button>
              <button type="button" class="btn btn-sm btn-danger" data-dismiss="modal">Cancel</button>
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
    name: 'UpdateMemberImage',
    props: [
      'member',
      'id'
    ],
    data () {
      return {
        imageBaseUrl: '',
        imageUrl: '',
        profilePicture: '',
        showLoader: false
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
      init () {
        console.log('type::', this.id)
        this.imageBaseUrl = Http.IMAGE_URL
        if (this.member.basicInfo.mmUserPictures[0]) {
          this.imageUrl = this.imageBaseUrl + this.member.basicInfo.mmUserPictures[0].document.url
        } else {
          this.imageUrl = 'static/images/default-original.jpg'
        }
      },
      onPPChange (e) {
        var files = e.target.files || e.dataTransfer.files
        if (!files.length) {
          return
        }
        this.imageUrl = new Image()
        var reader = new FileReader()
        reader.onload = (e) => {
          this.imageUrl = e.target.result
        }
        reader.readAsDataURL(files[0])
        this.profilePicture = files[0]
        console.log(files[0])
      },
      uploadPP () {
        console.log(this.profilePicture)
        var fd = new FormData()
        fd.append('imageFile', this.profilePicture)
        this.showLoader = true
        Http.POST('member', fd, [this.id, 'profile-picture'])
        .then(
          ({data: propicData}) => {
            this.showLoader = false
            $.notify({
              // options
              title: '<strong>Success!</strong>',
              message: 'Profile picture uploaded successfully'
            }, {
              // settings
              type: 'success',
              delay: 3000
            })
            console.log('profile picture data: ', propicData)
            this.editProfilePic()
          },
          error => {
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
            console.log('Error in address update, error: ', error)
          }
        )
      },
      editProfilePic () {
        this.$emit('update', 'false')
      }
    },
    created () {
      this.init()
    }
}
</script>
