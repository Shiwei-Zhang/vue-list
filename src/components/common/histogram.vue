<template>
  <svg class="d3graph">
  </svg>
</template>
<script>
import * as d3 from 'd3'
export default {
  props: ['data', 'isDate'],
  data() {
    return {}
  },
  computed: {},
  methods: {
    axisFormater(asDate, d) {
      if (asDate) {
        try { return (new Date(d)).toISOString().replace(/([^T]+)T(\d\d:\d\d):(\d\d)(\.\d+)?Z(.*)/, asDate); } catch (e) { return d3.format('s')(d); }
      } else if (d >= 100000) {
        return d3.format('s')(d);
      } else if (d >= 100 || d <= -100) {
        return d.toString();
      } else {
        return d3.format('.2g')(d);
      }
    },
    reset() {
      /* eslint-disable no-unused-vars */
      d3.select(this.$el).selectAll('g').remove();
      var width = this.$el.clientWidth - 5,
        margin = { top: 20, right: 53, bottom: 30, left: 30 },
        // height = this.$el.clientWidth,
        height = 120,
        min = this.data.min,
        max = this.data.max,
        asDate = this.isDate,
        bottom = 40;
      for (var i in this.data.chistogram) {
        var val = this.data.chistogram[i];
        min = Math.min(min, val[0]);
        max = Math.max(max, val[1]);
      }

      if (asDate) {
        var days = (max - min) / 86400000;
        if (days / 24 <= 1) {
          asDate = '$2:$3';
          bottom = 50;
        } else if (days <= 2) { asDate = '$2'; } else {
          asDate = '$1';
          bottom = 50;
        }
      }

      // svg = svgElement(selector, width, height + bottom).append('g'),
      var xscale = d3.scale.linear().domain([min, max]).range([0, width]),
        yscale = d3.scale.linear().domain([0, this.data.longestHistogramBar]).range([0, height]),
        svg = d3.select(this.$el)
        .attr('width', width)
        .attr('height', height + 40)
        .style('margin-left', margin.left)
        // .style('padding-top', margin.top)
        .style('padding-right', margin.right)
        .style('margin-bottom', margin.bottom)

      var barWidth = width / this.data.chistogram.length;

      var tooltip = d3.select('body').append('div')
        // .attr('class', 'histogramtooltip')
        .style({
          'position': 'absolute',
          'text-align': 'center',
          'padding': '10px',
          'font': '12px sans-serif',
          'border': '1px #ccc solid',
          'background': '#eee',
          'border-radius': '8px',
          'pointer-events': 'none',
          'z-index': '4000'
        })
        .style('opacity', 0)
        .style('top', '0');

      /* Each datum is [lb, hb, value] */
      var entry = svg.selectAll('g.histogramentry').data(this.data.chistogram).enter()
        .append('g').attr('class', 'histogramentry')
      // .on('mouseover', function (d) {
      //     tooltip.transition().duration(400).style('opacity', 1);
      //     tooltip.html(`[${d[0].toFixed(2)} - ${d[1].toFixed(2)}] - ${Math.round(d[2])} rows`)
      //         .style('left', (d3.event.pageX) + 'px')
      //         .style('top', (d3.event.pageY - 28) + 'px');
      // })
      // .on('mouseout', function (d) {
      //     tooltip.transition().duration(500).style('opacity', 0);
      // });
      entry.append('rect').attr('class', 'histogrambar')
        .style('fill', 'rgb(173, 216, 230)')
        .attr('x', function (d) { return xscale(d[0]); })
        .attr('y', function (d) { return height - yscale(d[2]); })
        .attr('width', barWidth - 1)
        .attr('height', function (d) { return yscale(d[2]); });
      entry.append('rect').attr('class', 'histogramhover')
        .style('opacity', 0)
        .attr('x', function (d) { return xscale(d[0]); })
        .attr('y', 0)
        .attr('width', barWidth - 1)
        .attr('height', height);

      var drawnAxis = svg.append('g')
        .attr('class', 'x axis')
        .style('fill', '#999')
        .style('stroke', '#999')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.svg.axis().scale(xscale).orient('bottom')
          .tickFormat(this.axisFormater.bind(null, asDate)));
      drawnAxis.selectAll('text')
        .style('stroke', 'none')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-35)');
    }
  },
  mounted() {
    this.reset()
    window.addEventListener('resize', this.reset)
  },
  watch: {
    data: {
      handler: function (nv, ov) {
        if (nv !== ov) {
          this.reset()
        }
      },
      deep: true
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.reset)
  }
}

</script>
<style lang="scss" scoped>
.d3graph {
  width: 100%;
  height: 100%;
  .histogrambar,
  .histogramhover {
    fill: lightblue;
    stroke: transparent;
    stroke-width: 1px;
  }
  .histogramentry:hover .histogramhover {
    opacity: .2;
  }
  .histogramtooltip {
    position: absolute;
    text-align: center;
    width: 60px;
    height: 28px;
    padding: 10px;
    font: 12px sans-serif;
    border: 1px #ccc solid;
    background: #eee;
    border: 0px;
    border-radius: 8px;
    pointer-events: none;
    z-index: 4000;
  }
}

</style>
