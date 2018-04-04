<template>
  <svg class="d3graph">
  </svg>
</template>
<script>
import d3 from 'd3'
export default {
  data() {
    return {}
  },
  props: ['data', 'count'],
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
      var self = this
      d3.select(this.$el).selectAll('g').remove();
      var baseHeight = 180
      var count = Math.min(this.data.counts.length, this.count || 7),
        height = count * baseHeight / this.count,
        width = this.$el.clientWidth,
        // height = this.$el.clientHeight,
        svg = d3.select(this.$el).attr('width', width).attr('height', height + 40).append('g'),
        // svg = svgElement(selector, width, height + 40).append('g'),
        max = Math.max.apply(Math, this.data.counts.slice(0, count)),
        xscale = d3.scale.linear().domain([0, max]).range([0, width]),
        yscale = d3.scale.linear().domain([0, count]).range([0, height]),
        perCent = d3.format('.1%'),
        barHeight = height / count,
        ti = 0;
      svg.selectAll('rect').data(this.data.counts.slice(0, count)).enter().append('rect')
        .style('fill', 'rgb(173, 216, 230)')
        .attr('x', 0)
        .attr('y', function (d, i) { return yscale(i); })
        .attr('width', function (d) { return xscale(d); })
        .attr('height', barHeight - 1);

      svg.append('g').attr('transform', 'translate(10, 3)')
        .selectAll('text').data(this.data.counts.slice(0, count)).enter().append('text')
        .text(function (d, i) {
          return [self.data.values[i],
            ' (', perCent(self.data.percentages[i]), ')'
          ].join('');
        })
        .style('font-size', '11')
        .style('font-weight', '500')
        .attr('x', 0)
        .attr('y', function (d, i) { return yscale(i) + barHeight / 2; });

      var drawnAxis = svg.append('g')
        .attr('class', 'x axis')
        .style('fill', '#999')
        .style('stroke', '#999')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.svg.axis().scale(xscale).orient('bottom')
          .tickFormat(this.axisFormater.bind(null, false)));
      drawnAxis.selectAll('text')
        .style('stroke', 'none')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-35)');
    }
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
  mounted() {
    this.reset()
    window.addEventListener('resize', this.reset)
  },
  destroyed() {
    window.removeEventListener('resize', this.reset)
  }
}

</script>
<style lang="scss" scoped>
.d3graph {
  width: 100%;
}

</style>
