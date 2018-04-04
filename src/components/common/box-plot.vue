<template>
    <svg class="d3graph">
    </svg>
</template>
<script>
import * as d3 from 'd3'
export default {
    props: ['data'],
    data() {
        return {

        }
    },
    computed: {},
    methods: {
        reset() {
            /* eslint-disable no-unused-vars */
            var width = this.$el.clientWidth - 5,
                height = this.$el.clientHeight,
                // height = 25,
                fill = '#ADD8E6',
                stroke = '#000';

            // margin = { top: 50, right: 150, bottom: 50, left: 150 }
            // if (width - margin.left - margin.right < 20 || height - margin.top - margin.bottom < 20) {
            //     console.log(width, height, '可用区域太小了')
            //     return
            // }
            // var h = (height - margin.top - margin.bottom) / dataset.length,
            var svg = d3.select(this.$el)
                .style('padding-left', 26)
            var x1 = d3.scale.linear()
                .domain([this.data.min, this.data.max])
                .range([0, width]);

            var center = svg.selectAll('line.center')
                .data([this.data])
                .enter().insert('svg:line', 'rect')
                .attr('class', 'center')
                .attr('x1', function (d) { return x1(d.lowWhisker); })
                .attr('y1', height / 2)
                .attr('x2', function (d) { return x1(d.highWhisker); })
                .attr('y2', height / 2)
                .style('opacity', 1)
                .style('stroke', stroke);

            var box = svg.selectAll('rect.box').data([this.data])
                .enter().append('svg:rect')
                .attr('class', 'box')
                .attr('x', function (d) { return x1(d.quartiles[0]); })
                .attr('y', 0) // Avoid margin issues
                .attr('width', function (d) { return x1(d.quartiles[2]) - x1(d.quartiles[0]); })
                .attr('height', height) // Avoid margin issues
                .attr('fill', fill)
                // .attr("stroke", fill)
                .style('opacity', '1');

            var median = svg.selectAll('line.median').data([this.data])
                .enter().append('svg:line')
                .attr('class', 'median')
                .attr('y1', 0)
                .attr('x1', function (d) { return x1(d.median); })
                .attr('y2', height)
                .attr('x2', function (d) { return x1(d.median); })
                .style('stroke', stroke);

            var whiskers = svg.selectAll('line.whisker').data([this.data.lowWhisker, this.data.highWhisker])
                .enter().append('svg:line')
                .attr('class', 'whisker')
                .attr('y1', height * 0.3)
                .attr('x1', function (d) { return x1(d); })
                .attr('y2', height * 0.7)
                .attr('x2', function (d) { return x1(d); })
                .style('stroke', stroke);

            svg.selectAll('text.whisker').data([this.data.lowWhisker, this.data.highWhisker])
                .enter().append('svg:text')
                .attr('class', 'whisker')
                .attr('dy', '.3em')
                .attr('dx', 6)
                .attr('x', width)
                .attr('y', x1).style('font-size', '12px')
            // .text(function (d) { return d.toPrecision(3); });

            svg.selectAll('text.box').data(this.data.quartiles)
                .enter().append('svg:text')
                .attr('class', 'box')
                .attr('dy', '.3em')
                .attr('dx', function (d, i) { return i & 1 ? 6 : -6; })
                .attr('x', function (d, i) { return i & 1 ? width : 0; })
                .attr('text-anchor', function (d, i) { return i & 1 ? 'start' : 'end'; })
                .attr('y', x1).style('font-size', '12px')
            // .text(function (d) { return d.toPrecision(3); });
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
    height: 25px;
    position: absolute;
    top: 0px;
    bottom: 0px;
}
</style>