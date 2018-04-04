<template>
    <svg class="d3-scatter">
    </svg>
</template>
<style lang="scss">
.d3-scatter {
    width: 100%;
    height: calc(100% - 3px);
}
</style>
<script>
/* eslint-disable no-unused-vars,quotes,new-parens */
import * as d3 from 'd3'
export default {
    props: ['data'],
    data() {
        return {}
    },
    mounted() {
        this.render()
        window.addEventListener('resize', this.render)
    },
    destroyed() {
        window.removeEventListener('resize', this.render)
    },
    methods: {
        render() {
            var width = this.$el.clientWidth,
                height = this.$el.clientHeight,
                margin = { top: 60, right: 60, bottom: 60, left: 80 },
                fmt = d3.format('.3s'),
                domain = [this.data[0].min, this.data[0].max],
                tooltip = d3.select('.tooltip')
                .on('mouseover', function () {
                    d3.select(this).style('display', 'none')
                })

            var svg = d3.select(this.$el)
            svg.attr('width', width)
                .attr('height', height)
            svg.selectAll('*').remove()

            var h = height - margin.top - margin.bottom
            var w = width - margin.left - margin.right

            // x比例尺
            var xlinear = d3.scale.linear()
                .domain(domain)
                .range([0, w])
            var ylinear = d3.scale.linear()
                .domain(domain)
                .range([0, h])

            var y2linear = d3.scale.linear()
                .domain(domain)
                .range([h, 0])

            var xAxis = d3.svg.axis()
                .scale(xlinear)
                .orient('bottom')
                .outerTickSize(0)

            var gAxis1 = svg.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(' + margin.left + ',' + (height - margin.bottom) + ')')
                .call(xAxis)

            var yAxis = d3.svg.axis()
                .scale(y2linear)
                .orient('left')
                .outerTickSize(0)

            var gAxis2 = svg.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .call(yAxis)

            // dashline

            svg.append('line')
                .attr('stroke', 'LightCoral')
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', 5)
                .attr('x1', margin.left)
                .attr('y1', height - margin.bottom)
                .attr('x2', width - margin.right)
                .attr('y2', margin.top)

            // lableX
            svg.append('g')
                .attr('class', 'lableX')
                .attr('transform', 'translate(' + ((w / 2 + margin.left) - 20) + ',' + (height - margin.bottom / 3) + ')')
                .append('text')
                .text('Actual values')

            // lableY
            svg.append('g')
                .attr('class', 'lableY')
                .attr('transform', 'translate(' + (margin.left / 2) + ',' + (height / 2) + ')')
                .append('text')
                .attr('style', 'transform:rotate(-90deg)')
                .text('Predicted values')

            // y轴 网格
            svg.append('g')
                .selectAll('line')
                .data(y2linear.ticks(10))
                .enter()
                .append('line')
                .attr('stroke', '#e5e5e5')
                .attr('shape-rendering', 'crispEdges')
                .attr('x1', margin.left)
                .attr('x2', width - margin.right)
                .attr('y1', (d, i) => {
                    return y2linear(d) + margin.top
                })
                .attr('y2', (d, i) => {
                    return y2linear(d) + margin.top
                })

            // x轴 网格
            svg.append('g')
                .selectAll('line')
                .data(xlinear.ticks(10))
                .enter()
                .append('line')
                .attr('stroke', '#e5e5e5')
                .attr('shape-rendering', 'crispEdges')
                .attr('x1', d => xlinear(d) + margin.left)
                .attr('y1', margin.top)
                .attr('x2', d => xlinear(d) + margin.left)
                .attr('y2', height - margin.bottom)

            svg.selectAll('circle')
                .data(this.data[0].values)
                .enter()
                .append('circle')
                .attr('cx', d => xlinear(d.x) + margin.left)
                .attr('cy', d => h - ylinear(d.y) + margin.top)
                .attr('r', 2)
                .attr('fill', d => d.color)
                .on('mouseover', function (d, i) {
                    d3.select(this).attr('r', 5)
                    tooltip.html(`<p>Error = ${d.error.toFixed(1)}</p><p>Predicted ${d.x.toFixed(1)}</p><p>Actual ${d.y.toFixed(1)}</p>`)
                    tooltip.transition()
                        .style('left', d3.event.pageX + 20 + 'px')
                        .style('top', d3.event.pageY + 'px')
                        .style('display', 'block')
                })
                .on('mouseout', function (d, i) {
                    d3.select(this).attr('r', 2)
                })
        }
    }
}
</script>