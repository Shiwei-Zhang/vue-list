import d3 from 'd3'

var removeCookie = function (name) {
  var ckie = name + '=; ';
  ckie += 'expires=Fri,02-Jan-1970 00:00:00 GMT';
  ckie += 'path=/; ';
  // ckie += 'domain=' + document.location.host + '; ';
  document.cookie = ckie;
};

var getCookie = function (ckie) {
  var i, chunks;
  var cookies = document.cookie.split('; ');
  for (i = 0; i < cookies.length; i++) {
    chunks = cookies[i].split('=');
    if (chunks[0] === ckie) {
      // console.log(decodeURIComponent(chunks[1]))
      return decodeURIComponent(chunks[1]);
    }
  }
  return null;
};

var setCookie = function (name, value, lifeMinutes) {
  var ckie = name + '=' + encodeURIComponent(value) + '; ';
  var expr = new Date(new Date().getTime() + lifeMinutes * 60 * 1000);
  ckie += 'expires=' + expr.toGMTString() + '; ';
  ckie += 'path=/; ';
  // ckie += 'domain=' + document.location.host + '; ';
  document.cookie = ckie;
};

var randomString = function (len, charSet) {
  charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var randomString = '';
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
}

var basicChart = function (width, height, margins) {
  if (margins == null) {
    margins = { top: 20, right: 20, bottom: 50, left: 50 }
  }
  var chartWidth = width - margins.left - margins.right
  var chartHeight = height - margins.top - margins.bottom
  return {
    width: width - margins.left - margins.right,
    height: height - margins.top - margins.bottom,

    xscale: d3.scale.linear().range([0, chartWidth]),
    yscale: d3.scale.linear().range([chartHeight, 0]),

    makeTopG: function (sel) {
      return sel.style('width', width)
        .style('height', height)
        .append('g')
        .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');
    }
  }
}

var drawGrid = function (g, xscale, yscale, width, height, lastY) {
  var xticks = xscale.ticks()
  var lastX = xticks[xticks.length - 1]
  var yticks = yscale.ticks()
  lastY = (lastY == null) ? yticks[yticks.length - 1] : lastY;

  g.append('g').attr('class', 'vlines')
    .selectAll('.xline')
    .data(xticks)
    .enter().append('line')
    .attr('class', 'xline')
    .attr('x1', function (d) { return xscale(d) })
    .attr('x2', function (d) { return xscale(d) })
    .attr('y1', height)
    .attr('y2', yscale(lastY))
    .attr('stroke', '#cecece')
    .attr('opacity', 0.4);

  g.append('g').attr('class', 'hlines')
    .selectAll('.hline')
    .data(yticks)
    .enter().append('line')
    .attr('class', 'hline')
    .attr('y1', function (d) { return yscale(d) })
    .attr('y2', function (d) { return yscale(d) })
    .attr('x1', 0)
    .attr('x2', xscale(lastX))
    .attr('stroke', '#cecece')
    .attr('opacity', 0.4);
}

export default {
  removeCookie,
  getCookie,
  setCookie,
  randomString,
  basicChart,
  drawGrid
}
