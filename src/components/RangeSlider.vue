<template>
</template>

<script>
  import vueSlider from 'vue-slider-component'

  export default {
    name: 'CustomRangeSlider',
//    props: ['value'],
    data () {
      return {
        value: [
          20,
          50
        ],
        min: 0,
        max: 100
      }
    },
    components: {
      vueSlider
    }
  }
</script>

<style>
  .slider {
    /* overwrite slider styles */
    width: 200px;
  }
</style>
