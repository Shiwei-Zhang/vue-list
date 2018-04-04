<template>
    <svg class="pas-decision-chart">
        <g class="yAxis1 axis"></g>
        <g class="yAxis2 axis"></g>
        <g class="xAxis axis"></g>
        <g class="Scores">
            <text style="transform:rotate(-90deg);text-anchor: end;">Scores</text>
        </g>
        <g class="Cut-off">
            <text style="text-anchor: middle;">Cut-off</text>
        </g>
        <g class="Gain">
            <text style="transform:rotate(-90deg);text-anchor: end;fill:red;">Gain</text>
        </g>
        <g class="cut-line"></g>
        <g class="legend"></g>
        <g class="hover"></g>
        <g class="paths"></g>
    </svg>
</template>
<style lang="scss">
.pas-decision-chart {
    width: 100%;
    height: 100%;
    .yAxis2 text {
        fill: red
    }
    .spot {
        opacity: 0;
    }
    .show-spot .spot {
        opacity: 1;
    }
}
</style>
<script>
/* eslint-disable no-new,no-unused-vars */
import * as d3 from 'd3'
export default {
    props: ['data', 'cut'],
    data() {
        return {
            // legend: ['Precision', 'Recall', 'F1', 'Cost-matrix gain'],
            hideLine: [1, 1, 1, 1],
            pcd: {
                precision: {
                    name: 'Precision',
                    show: true
                },
                recall: {
                    name: 'Recall',
                    show: true
                },
                f1: {
                    name: 'F1',
                    show: true
                },
                cmg: {
                    name: 'Cost-matrix gain',
                    show: true
                }
            }
        }
    },
    computed: {
        legend() {
            var arr = []
            for (let i in this.pcd) {
                arr.push(this.pcd[i].name)
            }
            return arr
        }
    },
    watch: {
        '$parent.scope': {
            handler: function (nv, ov) {
                this.render()
            },
            deep: true
        },
        pcd: {
            handler: function (nv, ov) {
                this.render()
            },
            deep: true
        }
    },
    methods: {
        setColor() {
            var arr = [],
                c = d3.scale.category10()
            for (var i = 0; i < 4; i++) {
                arr.push(c(i))
            }
            return arr
        },
        render() {
            var self = this
            var tooltip = d3.select('#tooltip')
            var ys = [this.data.precision, this.data.recall, this.data.f1, this.data.cmg]
            var color = this.setColor()
            var width = this.$el.clientWidth
            var height = this.$el.clientHeight
            var margin = { top: 40, right: 60, bottom: 40, left: 60 }
            var H = height - margin.top - margin.bottom
            var W = width - margin.left - margin.right
            var tick = {}
            var hideLine = []
            self._.forEach(self.pcd, function (val, key) {
                hideLine.push(val.show)
            })
            var gridNum = function (d, n, num) {
                if (n / num < 50) {
                    num = num - 1
                    gridNum(d, n, num)
                } else {
                    tick[d] = num
                }
            }
            gridNum('H', H, 10)
            gridNum('W', W, 10)

            var dataset_ys = []
            for (var v = 0; v < ys[0].length; v++) {
                dataset_ys.push([ys[0][v], ys[1][v], ys[2][v], ys[3][v]])
            }

            var svg = d3.select(this.$el)

            // labels
            svg.select('.Scores')
                .attr('transform', `translate(${margin.left - 30},${margin.top + H / 2})`)
            svg.select('.Cut-off')
                .attr('transform', `translate(${margin.left + W / 2},${height - 10})`)
            svg.select('.Gain')
                .attr('transform', `translate(${width - margin.right + 45},${margin.top + H / 2})`)

            // y1比例尺
            var yScale1 = d3.scale.linear()
                .domain([0, 1])
                .range([H, 0])

            // y1坐标轴
            var yAxis1 = d3.svg.axis()
                .scale(yScale1)
                .orient('left')
                .ticks(tick.H)
            svg.select('.yAxis1').attr('transform', `translate(${margin.left}, ${margin.top})`)
                .call(yAxis1)
                .selectAll('.grid').remove()
            svg.selectAll('.yAxis1 .tick')
                .append('line')
                .attr('class', 'grid')
                .style('stroke', '#ccc')
                .style('shape-rendering', 'crispEdges')
                .attr('x2', W)
                .attr('y2', 0)

            // y2比例尺
            var yScale2 = d3.scale.linear()
                .domain(d3.extent(this.data.cmg))
                .range([H, 0])

            // y2坐标轴
            var yAxis2 = d3.svg.axis()
                .scale(yScale2)
                .orient('right')
                .ticks(tick.H * 2)
            svg.select('.yAxis2').attr('transform', `translate(${margin.left + W}, ${margin.top})`)
                .call(yAxis2)

            // x比例尺
            var xScale = d3.scale.linear()
                .domain([0, 1])
                .range([0, W])
            // x坐标轴
            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom')
                .ticks(tick.W)
            svg.select('.xAxis')
                .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)
                .call(xAxis)
                .selectAll('.grid').remove()
            svg.selectAll('.xAxis .tick')
                .append('line')
                .attr('class', 'grid')
                .style('stroke', (d, i) => {
                    return (i === 0 || i === tick.W) ? 'none' : '#ccc'
                })
                .style('shape-rendering', 'crispEdges')
                .attr('x2', 0)
                .attr('y2', -H)

            // cut-line
            svg.select('.cut-line').selectAll('*').remove()
            svg.select('.cut-line')
                .attr('transform', `translate(${xScale(this.cut) + margin.left},${margin.top})`)
                .append('line')
                .attr('class', 'mark')
                .style('stroke', '#9467bd')
                .style('shape-rendering', 'crispEdges')
                .style('stroke-dasharray', 3)
                .attr('x2', 0)
                .attr('y2', H)
            svg.select('.cut-line')
                .append('text')
                .style('fill', '#9467bd')
                .attr('text-anchor', 'middle')
                .attr('y', H + 17)
                .text(d => {
                    return xScale.ticks(tick.W).indexOf(this.cut) > 0 ? '' : this.cut
                })

            // legend
            var legendL = [0, 85, 65, 40]

            svg.select('.legend')
                .attr('transform', `translate(10,${10})`)
                .selectAll('*').remove()
            var series = svg.select('.legend').selectAll('.series')
                .data(['Precision', 'Recall', 'F1', 'Cost-matrix gain'])
                .enter()
                .append('g')
                .attr('class', 'series')
                .attr('transform', (d, i) => {
                    let left = legendL.slice(0, i + 1).reduce((a, b) => a + b)
                    return `translate(${margin.left + left},${10})`
                })
                .on('click', function (d, i) {
                    let tar = d3.select(this).select('.legend-symbol')
                    for (let g in self.pcd) {
                        if (self.pcd[g].name === d) {
                            self.pcd[g].show = !self.pcd[g].show
                        }
                    }
                })

            series.append('circle')
                .attr('class', 'legend-symbol')
                .attr('r', 5)
                .attr('fill', (d, i) => {
                    let emm
                    for (let g in self.pcd) {
                        if (self.pcd[g].name === d) {
                            emm = self.pcd[g].show
                        }
                    }
                    return emm ? color[i] : '#fff'
                })
                .attr('stroke-width', 2)
                .attr('stroke', (d, i) => color[i])
            series.append('text')
                .attr('dx', 10)
                .attr('dy', 5)
                .text(d => d)

            // hover
            var hoverData = []
            for (var j = 0; j < this.data.cmg.length; j++) {
                hoverData.push([j * 25 / 1000, dataset_ys])
            }
            // 重新绘制需要清空内容
            svg.select('.hover').selectAll('*').remove()
            var matrix = svg.select('.hover').selectAll('rect').data(hoverData)
                .enter()
                .append('g')
                .attr('transform', (d, i) => {
                    return `translate(${margin.left + xScale(0.025) * i - (i === 0 ? 0 : xScale(0.025) / 2)},${margin.top})`
                })
                .on('mouseover', function (d, i) {
                    var html = `<p style="padding-left:5px;font-size:16px;">${d[0]}</p>`
                    for (var s = 0; s < self.legend.length; s++) {
                        if (!hideLine[s]) continue
                        html += `<p><span class="h" style="background-color:${color[s]}"></span><span class="l">${self.legend[s]}</span>${d[1][i][s].toFixed(2)}</p>`
                    }
                    // 鼠标划过添加圆点
                    setSpots(d3.select(this), i)

                    d3.select(this).attr('class', 'show-spot')
                    tooltip.attr('class', 'show')
                    tooltip.html(html)
                        // .transition()
                        .style('left', d3.event.pageX + 20 + 'px')
                        .style('top', d3.event.pageY + 'px')
                })
                .on('mouseout', function (d, i) {
                    d3.select(this).attr('class', '')
                    tooltip.attr('class', '')
                })

            matrix.append('rect')
                .attr('height', H)
                .attr('width', (d, i) => {
                    return (i === 0 || i === 40) ? xScale(0.025) / 2 : xScale(0.025)
                })
                .attr('fill', 'rgba(0,200,0,0)')
            // 在每一列设置4个圆点
            function setSpots(tarr, index) { // index 是单条数据里面的索引
                tarr.selectAll('circle').data(hoverData[1][1][index])
                    .enter()
                    .append('circle')
                    .attr('class', 'spot c' + index)
                    .attr('r', 5)
                    .attr('fill', (D, I) => hideLine[I] ? color[I] : 'none') // I 是数据的索引
                    .attr('cx', (D, I) => {
                        if (index !== 0) return xScale(0.025) / 2
                    })
                    .attr('cy', (D, I) => {
                        return I === 3 ? yScale2(D) : yScale1(D)
                    })
            }
            // 绘制折线
            var linePath = d3.svg.line()
            var paths = svg.select('.paths')
                .attr('transform', `translate(${margin.left},${margin.top})`)
            // var lines = ['precision', 'recall', 'f1', 'cmg']
            var lines = Object.keys(self.pcd)

            function drewpath(data, cls, index, scale) {
                paths.select('.' + cls).remove()
                if (!hideLine[index]) return

                var formatData = []
                for (let b = 0; b < data.length; b++) {
                    formatData.push([xScale(b * 25 / 1000), scale(data[b])])
                }
                paths.append('path')
                    .attr('class', cls)
                    .attr('stroke', color[index])
                    .attr('stroke-width', '2px')
                    .attr('fill', 'none')
                    .transition()
                    .attr('d', linePath(formatData))
            }
            for (var m = 0; m < lines.length; m++) {
                drewpath(this.data[lines[m]], lines[m], m, m === 3 ? yScale2 : yScale1)
            }
        }
    },
    mounted() {
        this.render()
        window.addEventListener('resize', this.render)
    },
    destroyed() {
        window.removeEventListener('resize', this.render)
    }
}
</script>