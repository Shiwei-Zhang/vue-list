import Vue from 'vue'
import moment from 'moment'

Vue.filter('moment', function (time, val) {
  return moment(new Date(time)).format(val)
})

Vue.filter('number', function (input, num) {
  if (typeof input === 'number') {
    return Number(input.toFixed(num))
  }
})
