import _ from 'lodash'
import btnLoading from './btnLoading'
import pageLoading from './pageLoading'
import ROC from './ROC'
import variables from './variables'
import decisionChart from './decisionChart'
import scatter from './scatter'
import barChart from './bar-chart'
import boxPlot from './box-plot'
import histogram from './histogram'
const common = {}

common.install = function (Vue, options) {
  Vue.prototype._ = _
  Vue.component('btn-loading', Vue.extend(btnLoading))
  Vue.component('page-loading', Vue.extend(pageLoading))
  Vue.component('d3-roc', Vue.extend(ROC))
  Vue.component('d3-variables', Vue.extend(variables))
  Vue.component('d3-decision-chart', Vue.extend(decisionChart))
  Vue.component('d3-scatter', Vue.extend(scatter))
  Vue.component('d3-bar-chart', Vue.extend(barChart))
  Vue.component('d3-box-plot', Vue.extend(boxPlot))
  Vue.component('d3-histogram', Vue.extend(histogram))
}
export default common
