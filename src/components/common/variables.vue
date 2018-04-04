<template>
    <svg class="d3-variables">
        <g class="axis"></g>
        <g class="label"></g>
        <g class="title"></g>
        <g class="grid"></g>
    </svg>
</template>
<style lang="scss">
.d3-variables {
    width: 100%;
    height: calc(100% - 3px);
}
</style>
<script>
/* eslint-disable no-unused-vars,quotes,new-parens */
import * as d3 from 'd3'
export default {
    props: ['data', 'nosort', 'num', 'margin'],
    data() {
        return {
            // num: 10 // 显示数据个数
        }
    },
    computed: {},
    methods: {
        reset() {
            var self = this
            var dataset = this.nosort ? this.data : this.data.sort((a, b) => b[1] - a[1]).slice(0, this.num)
            var width = this.$el.clientWidth,
                height = this.$el.clientHeight,
                margin = Object.assign({ top: 50, right: 50, bottom: 50, left: 150 }, this.margin)
            if (width - margin.left - margin.right < 20 || height - margin.top - margin.bottom < 20) {
                console.log(width, height, '可用区域太小了')
                return
            }
            var h = (height - margin.top - margin.bottom) / dataset.length,
                svg = d3.select(this.$el)
                .attr('width', width)
                .attr('height', height)

            // var color = d3.interpolate('rgba(31, 119, 180,0.7)', 'rgba(31, 119, 180, 0.3)')
            var color = d3.scale.category10()
            var W = width - margin.left - margin.right
            var tick
            var gridNum = function (num) {
                if (W / num < 60) {
                    num = num - 1
                    gridNum(num)
                } else {
                    tick = num
                }
            }
            gridNum(30)

            // x 轴比例尺
            var linear = d3.scale.linear()
                .domain([0, d3.max(dataset.map(x => x[1]))])
                .range([0, width - margin.left - margin.right])

            var xAxis = d3.svg.axis()
                .scale(linear)
                .orient('bottom')
                .ticks(tick)
                .tickFormat(d3.format('%'))

            // 绘制x轴
            svg.select('.axis')
                // .transition()
                .attr('transform', 'translate(' + margin.left + ',' + (height - margin.bottom) + ')')
                .call(xAxis)

            // 绘图
            var updateRect = svg.selectAll('rect').data(dataset)
            var enterRect = updateRect.enter()
            var exitRect = updateRect.exit()

            function renderRect(tar) {
                tar.attr('fill', (d, i) => color(i / self.num))
                    .attr('x', margin.left)
                    .attr('y', (d, i) => {
                        return margin.top + h * i + 0.05 * h
                    })
                    .transition()
                    .attr('height', h * 0.9)
                    .attr('width', d => linear(d[1]))
                // tar.on('mouseover', function (d, i) {
                //         d3.select(this).transition().attr('fill', 'rgba(31, 119, 180,.9)')
                //     })
                //     .on('mouseout', function (d, i) {
                //         d3.select(this).transition().attr('fill', color(i / self.num))
                //     })
            }

            renderRect(updateRect)
            renderRect(enterRect.append('rect'))
            exitRect.remove()

            // title
            var updateTitle = svg.select('.title').selectAll('text').data(dataset)
            var enterTitle = updateTitle.enter()
            var exitTitle = updateTitle.exit()

            var updateLabel = svg.select('.label').selectAll('text').data(dataset)
            var enterLabel = updateLabel.enter()
            var exitLabel = updateLabel.exit()
            // 栅格

            var updateGrid = svg.select('.grid').selectAll('line').data(linear.ticks(tick))
            var enterGrid = updateGrid.enter()
            var exitGrid = updateGrid.exit()

            function renderTitle(tar) {
                tar.attr('fill', 'black')
                    .attr('y', (d, i) => margin.top + h * i)
                    .transition()
                    .attr('x', d => {
                        return margin.left + linear(d[1])
                    })
                    .attr('dx', 5)
                    .attr('dy', h / 2 + 5)
                    .attr('text-anchor', 'start')
                    .text(d => {
                        return d3.format('0.2p')(d[1])
                    })
            }

            function renderLabel(tar) {
                tar.attr('fill', 'black')
                    .attr('y', (d, i) => margin.top + h * i)
                    .transition()
                    .attr('x', margin.left)
                    .attr('dx', -5)
                    .attr('dy', h / 2 + 5)
                    .attr('text-anchor', 'end')
                    .text(d => d[0])
            }

            function renderGrid(tar) {
                tar.attr('x1', (d, i) => {
                        return margin.left + linear(d)
                    })
                    .attr('y1', margin.top)
                    .attr('x2', (d, i) => margin.left + linear(d))
                    .attr('y2', height - margin.bottom)
                    .attr('stroke', '#ccc')
                    .attr('shape-rendering', 'crispEdges')
            }

            renderTitle(updateTitle)
            renderTitle(enterTitle.append('text'))
            exitTitle.remove()

            renderLabel(updateLabel)
            renderLabel(enterLabel.append('text'))
            exitLabel.remove()

            renderGrid(updateGrid)
            renderGrid(enterGrid.append('line'))
            exitGrid.remove()
        }
    },
    mounted() {
        console.log(JSON.stringify(this.data))
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