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
    
    <div class="gr-12 w3-card w3-padding-16">
      <div class="gr-6">
        <div class="gr-12">
            <label class="container"><h3><b>Business</b></h3>
              <input type="checkbox" @click="checkAddressTypeData('Business')" v-model="addressTypeB">
              <span class="checkmark"></span>
            </label>
        </div>
        <div class="row">
          <div class="gr-2">
            Address:
          </div>
          <div class="gr-3">
            {{ businessAddress.addressLine1 }}
            <!--{{ member.addresses.length > 1 ? member.addresses[1].addressLine1 : 'N/A' }}-->
          </div>
        </div>
        <div class="row text-left">
          <div class="gr-2">
          </div>
          <div class="gr-3 ">
            {{ businessAddress.addressLine2 }}
            <!--{{ member.addresses.length > 1 ? member.addresses[1].addressLine2 : 'N/A' }}-->
          </div>
        </div>
        <div class="row text-left">
          <div class="gr-2">
            District:
          </div>
          <div class="gr-3">
            {{ districtNameBusiness }}
          </div>
        </div>
        <div class="row text-left">
          <div class="gr-2">
            Thana:
          </div>
          <div class="gr-3">
            {{ thanaNameBusiness }}
          </div>
        </div>
        <div class="row text-left">
          <div class="gr-2">
            Country:
          </div>
          <div class="gr-3">
            {{ countryNameBusiness === 'BD' ? 'Bangladesh' : countryNameBusiness }}
          </div>
        </div>
      </div>

      <div class="gr-6">
        <div class="gr-12">
          <div class="gr-2">
            <label class="container"><h3><b>Present</b></h3>
              <input type="checkbox" @click="checkAddressTypeData('Personal')" v-model="addressTypeP">
              <span class="checkmark"></span>
            </label>

          </div>
        </div>
        <div class="row text-left">
          <div class="gr-2">
            Address:
          </div>
          <div class="gr-3">
            {{ personalAddress.addressLine1 }}
            <!--{{ member.addresses.length > 1 ? member.addresses[1].addressLine1 : 'N/A' }}-->
          </div>
        </div>
        <div class="row text-left">
          <div class="gr-2">
          </div>
          <div class="gr-3 ">
            {{ personalAddress.addressLine2 }}
            <!--{{ member.addresses.length > 1 ? member.addresses[1].addressLine2 : 'N/A' }}-->
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


      <div class="gr-12 padding-10" style="padding-bottom:20px;">
        <h2>Search and add a pin</h2>
        
          <div class="gr-6">
              <gmap-autocomplete
              @place_changed="setPlace">
              </gmap-autocomplete>
          </div>
          <div class="gr-6">
          <button type="button" class="btn btn-md btn-default" @click="addMarker">Place Marker</button>
  
          <button v-restrict="'MS_MM_USER_ADD_BUSINESS_LOCATION'" type="button" class="btn btn-md btn-default" @click="sendGeoLocation">Save</button>
          
          </div>

      </div>
      <br>
      <div class="gr-12">
          <gmap-map
          :center="center"
          :zoom="12"
          style="width:100%;  height: 400px;"
          >
          <gmap-marker
              :key="index"
              v-for="(m, index) in markers"
              :position="m.position"
              :clickable="true"
              :draggable="true"
              @click="center=m.position"
              @dragend="getCurrentMarkerPosition($event.latLng)"
          ></gmap-marker>
          </gmap-map>
      </div>
    </div>
  </div>
</template>

<script>
  import Http from '../../services/Http'
  export default {
    name: 'MemberIpayHere',
    props: [
      'id',
      'businessAddress',
      'personalAddress',
      'thanaNamePresent',
      'districtNamePresent',
      'countryNamePresent',
      'thanaNameBusiness',
      'districtNameBusiness',
      'countryNameBusiness'
    ],
    data() {
        return {
            // default to Montreal to keep it simple
            // change this to whatever makes sense
            center: { lat: 23.8103, lng: 90.4125 },
            markers: [],
            places: [],
            currentPlace: null,
            showLoader: false,
            finalMarker:{},
            memberLocation:{},
            addressTypeB: false,
            addressTypeP:false
        }
    },
    mounted() {
        this.geolocate();
        this.init();
    },
    created () {
      this.init()
    },
    methods: {
        // receives a place object via the autocomplete component
      setPlace(place) {
        this.currentPlace = place;
      },
      checkAddressTypeData(type) {
        if(type=="Business")
        {
          console.log("business",this.addressTypeB)
          if(!this.addressTypeB)
          {
            this.addressTypeP=false
          }
          else{
            this.addressTypeP=true
          }
        } 
        else{
          if(!this.addressTypeP)
          {
            this.addressTypeB=false
          }
          else{
            this.addressTypeB=true
          }
        }
        
      },
      addMarker() {
        if (this.currentPlace) {
            const marker = {
            lat: this.currentPlace.geometry.location.lat(),
            lng: this.currentPlace.geometry.location.lng()
            };
            this.finalMarker={}
            this.finalMarker=this.currentPlace.geometry.location
            console.log("marker:",this.finalMarker)
            this.markers = []
            this.places = []
            this.markers.push({ position: marker });
            this.places.push(this.currentPlace);
            this.center = marker;
            this.currentPlace = null;
            console.log(marker.lat)
            console.log(marker.lng)
            
            
        }
      },
      getCurrentMarkerPosition(marker) {
        console.log(marker.lat(), marker.lng())
        this.finalMarker={}
        this.finalMarker=marker
          
      },
      sendGeoLocation(){
        let officeAddressId=this.businessAddress.id
        let dataToSend={}
        console.log(this.finalMarker)
        if(this.addressTypeP)
        {
          officeAddressId = this.personalAddress.id
        }
        if(typeof this.finalMarker.lat !== "function")
        {
          dataToSend={
            "coordinate":{
              "latitude": this.finalMarker.lat,
              "longitude": this.finalMarker.lng
            },
            "officeAddressId": officeAddressId
          }
        }
        else if(this.finalMarker.lat())
        {
          dataToSend={
            "coordinate":{
              "latitude": this.finalMarker.lat(),
              "longitude": this.finalMarker.lng()
            },
            "officeAddressId": officeAddressId
          }
        }
        
        if(this.memberLocation.businessAddressLocation ==null)
        {
          Http.POST('memberLocation', dataToSend, [this.id])
          .then(({data: message}) => {
            this.showLoader = false
            $.notify({
                // options
              title: '<strong>Success!</strong>',
              message: 'Address has been added successfully'
            }, {
              // settings
              type: 'success',
              delay: 3000
            })
            this.memberMSG = ''
            this.init()
          }, error => {
            this.showLoader = false
            console.error('Error in offers: ', error)
            $.notify({
              // options
              title: '<strong>Fail!</strong>',
              message: 'Address addition failed'
            }, {
              // settings
              type: 'danger',
              delay: 3000
            })
          })
        }
        else
        {
          Http.PUT('memberLocation', dataToSend, [this.id])
          .then(({data: message}) => {
            this.showLoader = false
            $.notify({
                // options
              title: '<strong>Success!</strong>',
              message: 'Address has been added successfully'
            }, {
              // settings
              type: 'success',
              delay: 3000
            })
            this.memberMSG = ''
            this.init()
          }, error => {
            this.showLoader = false
            console.error('Error in offers: ', error)
            $.notify({
              // options
              title: '<strong>Fail!</strong>',
              message: 'Address addition failed'
            }, {
              // settings
              type: 'danger',
              delay: 3000
            })
          })
        }
      },
      geolocate: function() {
        console.log("hello there")
        navigator.geolocation.getCurrentPosition(position => {
            this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
            };
        });
      },
      checkAddressType () {
        if(this.memberLocation.businessAddressLocation!=null)
        {
          if(this.memberLocation.businessAddressLocation.officeAddressId == this.businessAddress.id){
            this.addressTypeB=true
          }
          else{
            this.addressTypeP=true
          }
        }
        console.log(this.addressTypeB)
      },
      init () {
        console.log(this.personalAddress)
        console.log(this.businessAddress)

        this.showLoader = true
        Http.GET('memberLocation', [this.id])
          .then(({data: location}) => {
            this.showLoader = false
            console.log(location)
            if(location.businessAddressLocation != null)
            {
              const marker ={
                lat: location.businessAddressLocation.coordinate.latitude,
                lng: location.businessAddressLocation.coordinate.longitude
              };
              this.finalMarker={}
              this.finalMarker=marker
              this.markers=[]
              this.markers.push({ position: marker });
              this.center= { lat: location.businessAddressLocation.coordinate.latitude, lng: location.businessAddressLocation.coordinate.longitude }
            }
            
            this.memberLocation= location
            this.checkAddressType()
            
          }, error => {
            this.showLoader = false
            console.error('Error in offers: ', error)
          })
      }
    }
  }
</script>
<style>
label{
  color: black;
}
/* The container */
.container {
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

/* Hide the browser's default checkbox */
.container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
}

/* Create a custom checkbox */
.checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #eee;
}

/* On mouse-over, add a grey background color */
.container:hover input ~ .checkmark {
    background-color: #ccc;
}

/* When the checkbox is checked, add a blue background */
.container input:checked ~ .checkmark {
    background-color: #2196F3;
}

/* Create the checkmark/indicator (hidden when not checked) */
.checkmark:after {
    content: "";
    position: absolute;
    display: none;
}

/* Show the checkmark when checked */
.container input:checked ~ .checkmark:after {
    display: block;
}

/* Style the checkmark/indicator */
.container .checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
}
</style>