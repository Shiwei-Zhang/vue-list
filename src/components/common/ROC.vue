<template>
  <div class="roc-box">
    <div class="tiptool"></div>
    <svg class="directive-roc">
      <g class="Xgrid"></g>
      <g class="Ygrid"></g>
      <g class="dash"></g>
      <g class="way"></g>
      <g class="scatter"></g>
    </svg>
  </div>
</template>
<style lang="scss">
.roc-box {
  width: 100%;
  height: 100%;
}

.tiptool {
  position: fixed;
  width: 110px;
  background-color: rgba(0, 0, 0, 0.5);
  display: none;
  border-radius: 3px;
  color: #fff;
  box-sizing: border-box;
  padding: 5px;
  p {
    line-height: 20px;
  }
}

.directive-roc {
  width: 100%;
  height: 100%;
  .Xgrid,
  .Ygrid {
    fill: none;
    stroke: #e5e5e5;
    shape-rendering: crispEdges;
  }
  .dash {
    line {
      stroke: lightcoral;
      stroke-width: 2;
      stroke-dasharray: 3;
    }
  }
}

</style>
<script>
/* eslint-disable no-unused-vars */
import * as d3 from 'd3'

export default {
  props: ['data'],
  data() {
    return {}
  },
  computed: {},
  watch: {
    data(nv, ov) {
      if (nv !== ov) {
        this.reset()
      }
    }
  },
  methods: {
    reset() {
      var width = this.$el.clientWidth
      var height = this.$el.clientHeight
      var tickX = 20
      var tickY = 20
      var margin = { top: 40, right: 40, bottom: 40, left: 60 }
      var w = width - margin.left - margin.right > 10 ? width - margin.left - margin.right : 10
      var h = height - margin.top - margin.bottom > 10 ? height - margin.top - margin.bottom : 10
      var loopX = function (measure, gap) {
        var m = measure / tickX
        if (m > 1 && m < gap) {
          tickX = tickX - 1
          loopX(measure, gap)
        }
      }
      var loopY = function (measure, gap) {
        var m = measure / tickY
        if (m > 1 && m < gap) {
          tickY = tickY - 1
          loopY(measure, gap)
        }
      }

      loopX(w, 60)
      loopY(h, 30)

      var tiptool = d3.select('.tiptool')
        .on('mouseover', function () {
          d3.select(this).style('display', 'none')
        })

      var svg = d3.select(this.$el).select('svg')
        .attr('width', width - margin.left - margin.right)
        .attr('height', height - margin.top - margin.bottom)

      var xlinear = d3.scale.linear()
        .domain([0, 1])
        .range([0, width - margin.left - margin.right])
      var xAxis = d3.svg.axis()
        .scale(xlinear)
        .ticks(tickX)
        .tickFormat(d3.format('%'))

      var ylinear = d3.scale.linear()
        .domain([0, 1])
        .range([height - margin.top - margin.bottom, 0])
      var yAxis = d3.svg.axis()
        .orient('left')
        .scale(ylinear)
        .ticks(tickY)
        .tickFormat(d3.format('%'))

      svg.select('.x').remove()
      svg.select('.y').remove()
      svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(' + margin.left + ',' + (height - margin.bottom) + ')')
        .call(xAxis)
      svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(yAxis)

      /* 栅格 */
      svg.select('.Xgrid')
        .selectAll('line').remove()
      svg.select('.Xgrid')
        .selectAll('line')
        .data(xlinear.ticks(tickX))
        .enter()
        .append('line')
        .attr('x1', d => {
          return margin.left + xlinear(d)
        })
        .attr('x2', d => {
          return margin.left + xlinear(d)
        })
        .attr('y1', margin.top)
        .attr('y2', margin.top + h)

      svg.select('.Ygrid')
        .selectAll('line').remove()
      svg.select('.Ygrid')
        .selectAll('line')
        .data(ylinear.ticks(tickY))
        .enter()
        .append('line')
        .attr('y1', d => {
          return margin.top + ylinear(d)
        })
        .attr('y2', d => {
          return margin.top + ylinear(d)
        })
        .attr('x1', margin.left)
        .attr('x2', margin.left + w)

      svg.select('.dash').selectAll('line').remove()
      svg.select('.dash').append('line')
        .attr('x1', margin.left)
        .attr('y1', height - margin.bottom)
        .attr('x2', width - margin.right)
        .attr('y2', margin.top)

      var linePath = d3.svg.line()
        .x(d => xlinear(d.x))
        .y(d => ylinear(d.y))
      // .interpolate('cardinal');

      svg.select('.way').selectAll('path').remove()
      svg.select('.way').append('path').datum(this.data[0])
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('d', d => {
          return linePath(d)
        })
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 2)

      svg.select('.scatter').selectAll('circle').remove()
      svg.select('.scatter').selectAll('circle').data(this.data[0])
        .enter()
        .append('circle')
        .attr('cx', d => {
          return xlinear(d.x) + margin.left
        })
        .attr('cy', d => ylinear(d.y) + margin.top)
        .attr('r', d => 5)
        .attr('fill', 'rgba(70,130,180,0)')
        .attr('stroke', 'rgba(70,130,180,0)')
        .attr('stroke-width', 20)
        .on('mouseover', function (d) {
          d3.select(this)
            .attr('fill', 'rgba(70,130,180,1)')
          tiptool.transition()
            .style('top', d3.event.pageY - 20 + 'px')
            .style('left', d3.event.pageX + 25 + 'px')
          tiptool.html('<p>At p = ' + d.p.toFixed(2) + '</p><p>' + d3.format('%')(d.y) + ' true positive</p><p>' + d3.format('%')(d.x) + ' false positive</p>')
            .style('display', 'block')
        })
        .on('mouseout', function (d) {
          d3.select(this)
            .attr('fill', 'rgba(70,130,180,0)')
          tiptool.style('display', 'none')
        })

      svg.select('.legendX').remove()
      svg.append('g')
        .attr('class', 'legendX')
        .attr('transform', 'translate(' + width / 2 + ',' + (height - 5) + ')')
        .append('text')
        .attr('text-anchor', 'middle')
        .text('False Positive Rate')

      svg.select('.legendY').remove()
      svg.append('g')
        .attr('class', 'legendY')
        .attr('transform', 'translate(' + 10 + ',' + (margin.top + height / 2) + ')')
        .append('text')
        .attr('style', 'transform:rotate(-90deg)')
        .text('True Positive Rate')
    }
  },
  mounted() {
    this.reset()
    window.addEventListener('resize', this.reset)
  },
  destroyed() {
    window.removeEventListener('resize', this.reset)
  }
}

</script>
