<template>
  <div id="content">
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
    <div class="row gr-12 push-3 text-center">
      <div class="card gr-5 padding-10" style="width: 30rem; border:1px solid #ddd; border-radius:4px; margin: 8px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);">
        <div class="card-body margin-10">
          <h1 class="card-title margin-10" v-if="metricVerifiedData[0]">{{metricVerifiedData[0].value}}</h1>
          <div><h3 class="card-subtitle mb-2 text-muted margin-10" v-if="metricVerifiedData[0]">Verified {{metricVerifiedData[0].key}} Member</h3></div>
        </div>
      </div>
      <div class="card padding-10 gr-5" style="width: 30rem; border:1px solid #ddd; border-radius:4px; margin: 8px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);">
        <div class="card-body margin-10">
          <h1 class="card-title margin-10" v-if="metricVerifiedData[1]">{{metricVerifiedData[1].value}} </h1>
          <div><h3 class="card-subtitle mb-2 text-muted margin-10" v-if="metricVerifiedData[1]">Verified {{metricVerifiedData[1].key}} Member</h3></div>
        </div>
      </div>
    </div>
    <div class="gr-12 margin-10"></div>
    <div class="gr-12 margin-5"></div>

    <div class="row gr-10 push-1">
      <highcharts ref="highcharts" :options="memberMetricData"></highcharts>
    </div>
    <div class="gr-12 margin-10"></div>
    <div class="gr-12 margin-5"></div>
    <div class="row gr-10 push-1">
      <highcharts ref="highcharts" :options="memberAvailableData"></highcharts>
    </div>
    
  </div>
</template>

<script>
import Http from '../services/Http'
export default{
  name: 'Home',
  data () {
    return {
      showLoader: false,
      metricVerifiedData: {},
      memberMetricData: {
        chart: {
          type: 'column',
          height: '400px',
          events: {
            drilldown: function (e) {
              console.log(e.point.category)
                if (!e.seriesOptions) {

                    var chart = this,
                        drilldowns = {
                            '0': {
                                name: '0',
                                data: [
                                    ['Cows', 2],
                                    ['Sheep', 3]
                                ]
                            },
                            '25': {
                                name: '25',
                                data: [
                                    ['Apples', 5],
                                    ['Oranges', 7],
                                    ['Bananas', 2]
                                ]
                            },
                            '50': {
                                name: '50',
                                data: [
                                    ['Toyota', 1],
                                    ['Volkswagen', 2],
                                    ['Opel', 5]
                                ]
                            },
                            '75': {
                                name: '75',
                                data: [
                                    ['Toyota', 1],
                                    ['Volkswagen', 2],
                                    ['Opel', 5]
                                ]
                            },
                            '100': {
                                name: '10',
                                data: [
                                    ['Toyota', 1],
                                    ['Volkswagen', 2],
                                    ['Opel', 5]
                                ]
                            }
                        },
                        series = drilldowns[e.point.name];

                    // Show the loading label
                    chart.showLoading('Simulating Ajax ...');

                    setTimeout(function () {
                        chart.hideLoading();
                        chart.addSeriesAsDrilldown(e.point, series);
                    }, 1000);
                }

            }
          }
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
            groupPadding: 0,
            shadow: false,
            maxPointWidth: 100
          },
          series: {
            dataLabels: {
              enabled: true,
              color: '#000',
              style: {fontWeight: 'bolder'},
              formatter: function () {
                return this.y
              },
              inside: false
            },
            pointPadding: 0.1,
            groupPadding: 0
          }
        },
        tooltip: {
          formatter () {
            return `<span style="color:${this.color}">\u25CF</span> ${this.x}: <b>${this.y}</b><br/>`
          }
        },
        title: {
          text: 'Profile completion score vs No. of members.'
        },
        xAxis: {
          title: {
            text: 'Profile Completion Score'
          },
          labels: {
            enabled: true,
            style: {
              fontSize: '24px'
            }
          },
          // minorTickLength: 0,
          // tickLength: 0,
          categories: []
        },
        yAxis: {
          allowDecimals: false,
          min: 0,
          title: {
            text: 'No of Members'
          }
        },
        series: [],
         drilldown: {
            series: []
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        }
      },
      memberAvailableData: {
        chart: {
          type: 'column',
          height: '400px'
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
            groupPadding: 0,
            shadow: false,
            maxPointWidth: 100
          },
          series: {
            dataLabels: {
              enabled: true,
              color: '#000',
              style: {fontWeight: 'bolder'},
              formatter: function () {
                return this.y
              },
              inside: false
            },
            pointPadding: 0.1,
            groupPadding: 0
          }
        },
        tooltip: {
          formatter () {
            return `<span style="color:${this.color}">\u25CF</span> ${this.x}: <b>${this.y}</b><br/>`
          }
        },
        title: {
          text: 'Available Data Points vs No. of members.'
        },
        xAxis: {
          title: {
            text: 'Data Points'
          },
          labels: {
            enabled: true,
            style: {
              fontSize: '16px'
            }
          },
          // minorTickLength: 0,
          // tickLength: 0,
          categories: []
        },
        yAxis: {
          allowDecimals: false,
          min: 0,
          title: {
            text: 'No of Members'
          }
        },
        series: [],
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        }
      }
    }
  },
  created () {
    console.log('member likely names component created with id: ')
    this.init()
  },
  methods: {
    init () {
      console.log('Hello')
      this.showLoader = true
      Http.GET('memberVerificationMetrics', ['profileCompletion'])
        .then(({data: metricData}) => {
          this.showLoader = false
          console.log('Success, got metric list: ', metricData)
          if (metricData.data !== undefined) {
                
            var datam = metricData.data.map(function(el) {
              var o = Object.assign({}, el);
              o.drilldown = true;
              o.y = el.value;
              o.name = el.key; 
              return o;
            })
            console.log(datam)
            // this.memberMetricData.series.push({ data: datam.map(x => x.value)})
            this.memberMetricData.series=[{data:datam}]    
            console.log("hello there::",this.memberMetricData.series)        
            
          }
          this.memberMetricData.xAxis.categories = metricData.data.map(x => x.key)
        }, error => {
          this.showLoader = false
          console.error('Error in offers: ', error)
        })
      Http.GET('memberVerificationMetrics', ['availableData'])
        .then(({data: metricData}) => {
          this.showLoader = false
          console.log('Success, got metric list: ', metricData)
          if (metricData.data !== undefined) {
            this.memberAvailableData.series = []
            this.memberAvailableData.series.push({ data: metricData.data.map(x => x.value) })
          }
          this.memberAvailableData.xAxis.categories = metricData.data.map(x => x.key)
        }, error => {
          this.showLoader = false
          console.error('Error in offers: ', error)
        })

      Http.GET('memberVerificationMetrics', ['verification'])
        .then(({data: metricVerifiedData}) => {
          this.showLoader = false
          console.log('Success, got metric list: ', metricVerifiedData)
          this.metricVerifiedData = metricVerifiedData.data
          console.log(this.metricVerifiedData)
        }, error => {
          this.showLoader = false
          console.error('Error in offers: ', error)
        })
    }
  }
}
</script>

