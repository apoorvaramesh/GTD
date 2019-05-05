var dispatcher = d3.dispatch('clickYear');
var CLOSER_MODE_TRESHOLD = 4;

export class D3gtd_visblock {
  constructor(options) {
    this.container = d3
      .select('#' + options.column)
      .classed('d3gtc-container-vis', true)
      .style('overflow', 'hidden');

    this.donutContainer1 = d3
      .select('#' + options.donut1)
      .classed('d3gtc-donut1', true)
      .style('overflow', 'hidden');

    this.donutContainer1.append('svg');

    this.donutContainer2 = d3
      .select('#' + options.donut2)
      .classed('d3gtc-donut1', true)
      .style('overflow', 'hidden');

    this.donutContainer2.append('svg');

		this.container.append('div')
      .classed('d3gtc-charts', true)
			// .append('div')
			// .classed('d3gtc-charts-desc', true)
      // .text('Click on country to show more information');

		this.container.select('.d3gtc-charts')
			.append('div')
			.classed('d3gtc-linechart', true)
      .append("svg");

    this.container.select('.d3gtc-charts')
      .append('div')
      .classed('d3gtc-barchart', true)
      .append("svg");

    this.barchart = this.container.select('.d3gtc-barchart').select('svg');
    this.barchart
      .append('text')
      .text('Number of people killed in terrorist attacks per year')
      .attr('y', '22')
      .attr('x', this.container.node().getBoundingClientRect().width / 2)
      .attr('font-size', '14px')
      .attr('font-weight', '700')
      .attr('text-anchor', 'middle');
    this.barchart
      .append('text')
      .text('Deaths')
      .attr('y', '30')
      .attr('x', '34')
      .attr('font-size', '10px')
      .attr('font-weight', '700')
      .attr('text-anchor', 'middle');
    this.barchart
      .append('text')
      .text('Date')
      .attr('y', '257')
      .attr('x', this.container.node().getBoundingClientRect().width - 25)
      .attr('font-size', '10px')
      .attr('font-weight', '700')
      .attr('text-anchor', 'middle');
    this.linechart = this.container.select('.d3gtc-linechart').select('svg');
    this.linechart
      .append('text')
      .text('Incidents')
      .attr('y', '30')
      .attr('x', '34')
      .attr('font-size', '10px')
      .attr('font-weight', '700')
      .attr('text-anchor', 'middle');
    this.linechart
      .append('text')
      .text('Date')
      .attr('y', '257')
      .attr('x', this.container.node().getBoundingClientRect().width - 25)
      .attr('font-size', '10px')
      .attr('font-weight', '700')
      .attr('text-anchor', 'middle');
    this.linechart
      .append('text')
      .text('Number of terrorist attacks per year')
      .attr('y', '22')
      .attr('x', this.container.node().getBoundingClientRect().width / 2)
      .attr('font-size', '14px')
      .attr('font-weight', '700')
      .attr('text-anchor', 'middle');
    this.donutAttack = this.donutContainer1.select('svg');
    this.donutAttack
      .append('text')
      .text('10 most common types of attack')
      .attr('y', '22')
      .attr('x', this.donutContainer1.node().getBoundingClientRect().width / 2)
      .attr('font-size', '14px')
      .attr('font-weight', '700')
      .attr('text-anchor', 'middle');
    this.donutTarget = this.donutContainer2.select('svg');
    this.donutTarget
      .append('text')
      .text('10 most common types of targets')
      .attr('y', '22')
      .attr('x', this.donutContainer2.node().getBoundingClientRect().width / 2)
      .attr('font-size', '14px')
      .attr('font-weight', '700')
      .attr('text-anchor', 'middle');
    this.currentIndex = 0;
    this.data = [];
    this.countries = [];
  }

  toggleActive() {
    this.container.classed('active', !this.container.classed('active'));
  }

  setTimeInterval(timeInterval) {
    this.timeInterval = timeInterval;
    var isCloserMode = (this.timeInterval[1] - this.timeInterval[0]) / 1000 / 60 / 60 / 24 / 30 / 12 <= CLOSER_MODE_TRESHOLD;

    // set the ranges
    if (!this.x) {
      this.x = d3
        .scaleTime();
    }
    var start = new Date(timeInterval[0]);
    var end = new Date(timeInterval[1]);
    if (!isCloserMode) {
      start.setMonth(0);
      end.setMonth(0);
    }
    start.setDate(0);
    end.setDate(0);
    this.x
      .domain([start, end]);
    
    this.data = [];
    this.currentIndex = 0;
  }

  setCountry(d, patchedUpChartsData) {
    this.countries[this.currentIndex] = d;
    this.data[this.currentIndex] = {
      country: d,
      data: patchedUpChartsData
    };
    // this.container.select('.d3gtc-charts-desc').text('Selected country: ' + d.properties.name);
    this.container.select('.d3gtc-barchart').classed('active', true);
    this.container.select('.d3gtc-linechart').classed('active', true);
    this.donutContainer1.classed('active', true);
    this.container.select('.d3gtc-donut2').classed('active', true);
    this.updateCharts();
    this.currentIndex = (this.currentIndex + 1) % 2;
  }

  getCountries() {
    return this.countries;
  }

  updateCharts() {
    this.updateLinechart();
    this.updateBarchart();
    this.updateDonutAttackType();
    this.updateDonutTargetType();
  }

  updateLinechart() {
    var widthBasis = this.container.select('.d3gtc-linechart').node().getBoundingClientRect().width;
    var heightBasis = widthBasis / 1.5;
    var margin = { top: 40, right: 40, bottom: 80, left: 40 },
      width = widthBasis - margin.left - margin.right,
      height = heightBasis - margin.top - margin.bottom;

    this.container.select('.d3gtc-linechart').select('g').remove();

    this.container.select('.d3gtc-linechart').select('g').remove();

    var linechartG = this.linechart
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    var maxValue = 0;
    var isCloserMode = (this.timeInterval[1] - this.timeInterval[0]) / 1000 / 60 / 60 / 24 / 30 / 12 <= CLOSER_MODE_TRESHOLD; 
    
    var linechartData = this.data.map(lineData => {
      if (!isCloserMode) {
        var data = d3
          .nest()
          .key(function (d) { return d.iyear; })
          .rollup((d) => d.length)
          .entries(lineData.data);
        maxValue = Math.max(maxValue, d3.max(data, function (d) { return d.value; }));
        return data.map(d => Object.assign(d, {
          date: parseDate(d.key),
          country: lineData.country.properties.name
        }));
      } else {
        var data = d3
          .nest()
          .key(function (d) { return d.iyear + '-' + d.imonth; })
          .sortKeys((a, b) => {
            if (parseInt(a.split('-')[0]) != parseInt(b.split('-')[0])) {
              return parseInt(a.split('-')[0]) >= parseInt(b.split('-')[0]) ? 1 : -1;
            } else {
              return parseInt(a.split('-')[1]) >= parseInt(b.split('-')[1]) ? 1 : -1;
            }
          })
          .rollup((d) => d.length)
          .entries(lineData.data);
        maxValue = Math.max(maxValue, d3.max(data, function (d) { return d.value; }));
        return data.map(d => Object.assign(d, {
          date: parseDateMonth(d.key),
          country: lineData.country.properties.name
        }));
      }
    })

    // Add 0-values
    linechartData.forEach(lineData => {
      if (!isCloserMode) {
        var minYear = new Date(this.timeInterval[0]).getFullYear();
        var maxYear = new Date(this.timeInterval[1]).getFullYear();
        for (var i = minYear; i <= maxYear; i++) {
          var found = false;
          for (var j = 0; j < lineData.length; j++) {
            if (lineData[j].key == i) {
              found = true;
              break;
            }
          }
          if (!found) {
            lineData.push({
              key: i + "",
              country: this.data[0].country.properties.name,
              date: parseDate(i),
              value: 0
            })
          }
        }
        lineData.sort((a, b) => {
          return a.key >= b.key ? 1 : -1;
        })
      } else {
        var minYear = new Date(this.timeInterval[0]).getFullYear();
        var minMonth = new Date(this.timeInterval[0]).getMonth();
        var maxYear = new Date(this.timeInterval[1]).getFullYear();
        var maxMonth = new Date(this.timeInterval[1]).getMonth();
        for (var i = minYear; i <= maxYear; i++) {
          var startMonth = minYear == i ? 0 : minMonth;
          var endMonth = maxYear == i ? 11 : maxMonth;
          for (var m = startMonth; m <= endMonth; m++) {
            var found = false;
            for (var j = 0; j < lineData.length; j++) {
              if (lineData[j].key == i + '-' + (m+1)) {
                found = true;
                break;
              }
            }
            if (!found) {
              lineData.push({
                key: i + '-' + (m + 1),
                country: this.data[0].country.properties.name,
                date: parseDateMonth(i),
                value: 0
              })
            }
          }
        }
        lineData.sort((a, b) => {
          if (parseInt(a.key.split('-')[0]) != parseInt(b.key.split('-')[0])) {
            return parseInt(a.key.split('-')[0]) >= parseInt(b.key.split('-')[0]) ? 1 : -1;
          } else {
            return parseInt(a.key.split('-')[1]) >= parseInt(b.key.split('-')[1]) ? 1 : -1;
          }
        })
      }
    });
    // if (linechartData[1] && linechartData[0].length != linechartData[1].length){
    //   var biggerIndex = linechartData[0].length >= linechartData[1].length ? 0
    // }
    this.x.range([0, width])

    var y = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, maxValue]);

    var xAxis = d3.axisBottom(this.x);
    if (!isCloserMode) {
      xAxis.tickFormat(d3.timeFormat("%Y"));
    } else {
      xAxis.tickFormat(d3.timeFormat("%b %Y"));
    }

    var yAxis = d3.axisLeft(y)
      .ticks(10);

    linechartG.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)");

    linechartG.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Value ($)");

    var colors = ['steelblue', '#fdbb84'];

    var line = d3.line()
      .x((d) => this.x(new Date(d.key)))
      .y(function (d) { return y(d.value); }) // set the y values for the line generator 
      .curve(d3.curveMonotoneX) // apply smoothing to the line

    linechartData.forEach((el, i) => {

      linechartG.append("path")
        .datum(el) // 10. Binds data to the line 
        .attr('fill', 'none')
        .attr('stroke', colors[i])
        .attr("class", "line") // Assign a class for styling 
        .attr("d", line); // 11. Calls the line generator 

      linechartG.selectAll(".dot"+i)
        .data(el)
        .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("fill", colors[i]) // Assign a class for styling
        .attr("cx", (d) => this.x(new Date(d.key)))
        .attr("cy", function (d) { return y(d.value); })
        .attr("r", 3)
        .on('click', (d) => {
          dispatcher.call("clickYear", this, d.key);
          clearTolltips();
        })
        .on('mouseover', (d) => {
          showTooltip(d);
        })
        .on('mousemove', (d) => {
          updateTooltipPosition(d);
        })
        .on('mouseleave', (d) => {
          clearTolltips();
        });
    });

    var tooltip = null;

    var tooltipMarkup = function (data) {
      var year = data.key.split('-')[1] ? data.key.split('-')[0] : data.key;
      return '<div style="border: 1px solid #eee; background-color: rgba(255, 255, 255, 0.90); padding: 8px 11px; border-radius: 3px"> \
                <div class="d3gtd-tooltip__name" style="font-weight: 700; font-style: italic; font-size: 13px; margin-bottom: 3px">' + data.country + '</div> \
                <div class="d3gtd-tooltip__name" style="font-seight: 400; font-size: 13px;"> \
                    Year: <span>' + year + '</span> \
                </div> \
                <div class="d3gtd-tooltip__name" style="font-seight: 400; font-size: 13px;"> \
                    Number of incidents: <span>' + data.value + '</span> \
                </div> \
              </div>';
    };

    var showTooltip = (d => {
      if (!tooltipMarkup) return;
      tooltip = this.container
        .append('div')
        .attr('class', 'donut-tooltip')
        .html(tooltipMarkup(d))
        .style('position', 'fixed')
        .style('top', d3.event.clientY + 'px')
        .style('left', d3.event.clientX + 'px')
        .style('transform', 'translate(-50%, 20px)')
        .style('z-index', 100);
    });

    var updateTooltipPosition = (data) => {
      tooltip
        .style('top', d3.event.clientY + 'px')
        .style('left', d3.event.clientX + 'px');
    }

    var clearTolltips = () => {
      tooltip && tooltip.remove();
    };

    var legendContainer = this.container.select('.d3gtc-linechart').select('.d3gtc-linechart--legend');
    if (legendContainer.size() == 0) {
      legendContainer = this.container.select('.d3gtc-linechart')
        .style('position', 'relative')
        .append('div')
        .attr('class', 'd3gtc-linechart--legend')
        .style('position', 'absolute')
        .style('left', '50%')
        .style('bottom', '18px')
        .style('transform', 'translateX(-50%)');
    }
    
    legendContainer.selectAll('.legend')
      .remove();
    console.dir(this.countries);
    
    legendContainer.selectAll('.legend')
      .data(this.countries)
      .enter()
      .append('div')
      .attr('class', 'legend')
      .style('position', 'relative')
      .style('display', 'inline-block')
      .style('margin', '0 12px')
      .style('padding-left', '15px')
      .each(function (d, i) {
        d3.select(this).append('div')
          .attr('class', 'legend-marker')
          .style('position', 'absolute')
          .style('width', '10px')
          .style('height', '10px')
          .style('left', '0')
          .style('top', '2px')
          .style('background', colors[i]);

        d3.select(this).append('div')
          .attr('class', 'legend-text')
          .style('font-size', '12px')
          .text(d => d.properties.name);
      })
    
  }

  updateBarchart() {
    var widthBasis = this.container.select('.d3gtc-barchart').node().getBoundingClientRect().width;
    var heightBasis = widthBasis / 1.5;
    var margin = { top: 40, right: 40, bottom: 80, left: 40 },
      width = widthBasis - margin.left - margin.right,
      height = heightBasis - margin.top - margin.bottom;

    this.container.select('.d3gtc-barchart').select('g').remove();

    this.container.select('.d3gtc-barchart').select('g').remove();

    var linechartG = this.barchart
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    var maxValue = 0;
    var isCloserMode = (this.timeInterval[1] - this.timeInterval[0]) / 1000 / 60 / 60 / 24 / 30 / 12 <= CLOSER_MODE_TRESHOLD;

    var linechartData = this.data.map(lineData => {
      if (!isCloserMode) {
        var data = d3
          .nest()
          .key(function (d) { return d.iyear; })
          .rollup(function (d) {
            return d3.sum(d, function (d) { return d.nkill; })
          })
          .entries(lineData.data);
        maxValue = Math.max(maxValue, d3.max(data, function (d) { return d.value; }));
        return data.map(d => Object.assign(d, {
          date: parseDate(d.key),
          country: lineData.country.properties.name
        }));
      } else {
        var data = d3
          .nest()
          .key(function (d) { return d.iyear + '-' + d.imonth; })
          .sortKeys((a, b) => {
            if (parseInt(a.split('-')[0]) != parseInt(b.split('-')[0])) {
              return parseInt(a.split('-')[0]) >= parseInt(b.split('-')[0]) ? 1 : -1;
            } else {
              return parseInt(a.split('-')[1]) >= parseInt(b.split('-')[1]) ? 1 : -1;
            }
          })
          .rollup(function (d) {
            return d3.sum(d, function (d) { return d.nkill; })
          })
          .entries(lineData.data);
        maxValue = Math.max(maxValue, d3.max(data, function (d) { return d.value; }));
        return data.map(d => Object.assign(d, {
          date: parseDateMonth(d.key),
          country: lineData.country.properties.name
        }));
      }
    })

    // Add 0-values
    linechartData.forEach(lineData => {
      if (!isCloserMode) {
        var minYear = new Date(this.timeInterval[0]).getFullYear();
        var maxYear = new Date(this.timeInterval[1]).getFullYear();
        for (var i = minYear; i <= maxYear; i++) {
          var found = false;
          for (var j = 0; j < lineData.length; j++) {
            if (lineData[j].key == i) {
              found = true;
              break;
            }
          }
          if (!found) {
            lineData.push({
              key: i + "",
              country: this.data[0].country.properties.name,
              date: parseDate(i),
              value: 0
            })
          }
        }
        lineData.sort((a, b) => {
          return a.key >= b.key ? 1 : -1;
        })
      } else {
        var minYear = new Date(this.timeInterval[0]).getFullYear();
        var minMonth = new Date(this.timeInterval[0]).getMonth();
        var maxYear = new Date(this.timeInterval[1]).getFullYear();
        var maxMonth = new Date(this.timeInterval[1]).getMonth();
        for (var i = minYear; i <= maxYear; i++) {
          var startMonth = minYear == i ? 0 : minMonth;
          var endMonth = maxYear == i ? 11 : maxMonth;
          for (var m = startMonth; m <= endMonth; m++) {
            var found = false;
            for (var j = 0; j < lineData.length; j++) {
              if (lineData[j].key == i + '-' + (m + 1)) {
                found = true;
                break;
              }
            }
            if (!found) {
              lineData.push({
                key: i + '-' + (m + 1),
                country: this.data[0].country.properties.name,
                date: parseDateMonth(i),
                value: 0
              })
            }
          }
        }
        lineData.sort((a, b) => {
          if (parseInt(a.key.split('-')[0]) != parseInt(b.key.split('-')[0])) {
            return parseInt(a.key.split('-')[0]) >= parseInt(b.key.split('-')[0]) ? 1 : -1;
          } else {
            return parseInt(a.key.split('-')[1]) >= parseInt(b.key.split('-')[1]) ? 1 : -1;
          }
        })
      }
    });
    // if (linechartData[1] && linechartData[0].length != linechartData[1].length){
    //   var biggerIndex = linechartData[0].length >= linechartData[1].length ? 0
    // }
    this.x.range([0, width])

    var y = d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, maxValue]);

    var xAxis = d3.axisBottom(this.x);
    if (!isCloserMode) {
      xAxis.tickFormat(d3.timeFormat("%Y"));
    } else {
      xAxis.tickFormat(d3.timeFormat("%b %Y"));
    }

    var yAxis = d3.axisLeft(y)
      .ticks(10);

    linechartG.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)");

    linechartG.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Value ($)");

    var colors = ['steelblue', '#fdbb84'];

    var line = d3.line()
      .x((d) => this.x(new Date(d.key)))
      .y(function (d) { return y(d.value); }) // set the y values for the line generator 
      .curve(d3.curveMonotoneX) // apply smoothing to the line

    linechartData.forEach((el, i) => {

      linechartG.append("path")
        .datum(el) // 10. Binds data to the line 
        .attr('fill', 'none')
        .attr('stroke', colors[i])
        .attr("class", "line") // Assign a class for styling 
        .attr("d", line); // 11. Calls the line generator 

      linechartG.selectAll(".dot" + i)
        .data(el)
        .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("fill", colors[i]) // Assign a class for styling
        .attr("cx", (d) => this.x(new Date(d.key)))
        .attr("cy", function (d) { return y(d.value); })
        .attr("r", 3)
        .on('click', (d) => {
          dispatcher.call("clickYear", this, d.key);
          clearTolltips();
        })
        .on('mouseover', (d) => {
          showTooltip(d);
        })
        .on('mousemove', (d) => {
          updateTooltipPosition(d);
        })
        .on('mouseleave', (d) => {
          clearTolltips();
        });
    });

    var tooltip = null;

    var tooltipMarkup = function (data) {
      var year = data.key.split('-')[1] ? data.key.split('-')[0] : data.key;
      return '<div style="border: 1px solid #eee; background-color: rgba(255, 255, 255, 0.90); padding: 8px 11px; border-radius: 3px"> \
                <div class="d3gtd-tooltip__name" style="font-weight: 700; font-style: italic; font-size: 13px; margin-bottom: 3px">' + data.country + '</div> \
                <div class="d3gtd-tooltip__name" style="font-seight: 400; font-size: 13px;"> \
                    Year: <span>' + year + '</span> \
                </div> \
                <div class="d3gtd-tooltip__name" style="font-seight: 400; font-size: 13px;"> \
                    Number of deaths: <span>' + data.value + '</span> \
                </div> \
              </div>';
    };

    var showTooltip = (d => {
      if (!tooltipMarkup) return;
      tooltip = this.container
        .append('div')
        .attr('class', 'donut-tooltip')
        .html(tooltipMarkup(d))
        .style('position', 'fixed')
        .style('top', d3.event.clientY + 'px')
        .style('left', d3.event.clientX + 'px')
        .style('transform', 'translate(-50%, 20px)')
        .style('z-index', 100);
    });

    var updateTooltipPosition = (data) => {
      tooltip
        .style('top', d3.event.clientY + 'px')
        .style('left', d3.event.clientX + 'px');
    }

    var clearTolltips = () => {
      tooltip && tooltip.remove();
    };


    var legendContainer = this.container.select('.d3gtc-barchart').select('.d3gtc-linechart--legend');
    if (legendContainer.size() == 0) {
      legendContainer = this.container.select('.d3gtc-barchart')
        .style('position', 'relative')
        .append('div')
        .attr('class', 'd3gtc-linechart--legend')
        .style('position', 'absolute')
        .style('left', '50%')
        .style('bottom', '18px')
        .style('transform', 'translateX(-50%)');
    }

    legendContainer.selectAll('.legend')
      .remove();

    legendContainer.selectAll('.legend')
      .data(this.countries)
      .enter()
      .append('div')
      .attr('class', 'legend')
      .style('position', 'relative')
      .style('display', 'inline-block')
      .style('margin', '0 12px')
      .style('padding-left', '15px')
      .each(function (d, i) {
        d3.select(this).append('div')
          .attr('class', 'legend-marker')
          .style('position', 'absolute')
          .style('width', '10px')
          .style('height', '10px')
          .style('left', '0')
          .style('top', '2px')
          .style('background', colors[i]);

        d3.select(this).append('div')
          .attr('class', 'legend-text')
          .style('font-size', '12px')
          .text(d => d.properties.name);
      })
  }

  updateDonutAttackType() {
    var widthBasis = this.donutContainer1.node().getBoundingClientRect().width;
    var heightBasis = widthBasis / 1.5;
    var margin = { top: 60, right: 20, bottom: 20, left: 20 },
      width = widthBasis,
      height = heightBasis;

    this.donutAttack.selectAll('g').remove();
    const maxLegendAmount = 10;
    var donutData = d3
      .nest()
      .key(function (d) { return d.attacktype1_txt; })
      .rollup(d => d.length)
      .entries(this.data[(this.currentIndex) % 2].data)
      .slice(0, maxLegendAmount)
      .sort((a, b) => b.value - a.value);

    // a circle chart needs a radius
    var radius = width / 4 - margin.left;

    // legend dimensions
    var legendRectSize = 5; // defines the size of the colored squares in legend
    var legendSpacing = 10; // defines spacing between squares

    // define color scale
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    // more color scales: https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9

    var svg = this.donutAttack
      .attr('width', width) // set the width of the svg element we just added
      .attr('height', height) // set the height of the svg element we just added
      .append('g') // append 'g' element to the svg element
      .attr("transform",
        "translate(" + (margin.left + radius) + "," + (margin.top + radius) + ")");

    var arc = d3.arc()
      .innerRadius(0) // none for pie chart
      .outerRadius(radius); // size of overall chart

    var pie = d3.pie() // start and end angles of the segments
      .value(function (d) { return d.value; }) // how to extract the numerical data from each entry in our dataset
      .sort(null); // by default, data sorts in oescending value. this will mess with our animation so we set it to null

    // creating the chart
    var path = svg.selectAll('path') // select all path elements inside the svg. specifically the 'g' element. they don't exist yet but they will be created below
      .data(pie(donutData)) //associate dataset wit he path elements we're about to create. must pass through the pie function. it magically knows how to extract values and bakes it into the pie
      .enter() //creates placeholder nodes for each of the values
      .append('path') // replace placeholders with path elements
      .attr('d', arc) // define d attribute with arc function above
      .attr('fill', function (d) { return color(d.data.key); }) // use color scale to define fill of each label in dataset
      .each(function (d) { this._current - d; })
      .on('mouseover', (d) => {
        showTooltip(d);
      })
      .on('mousemove', (d) => {
        updateTooltipPosition(d);
      })
      .on('mouseleave', (d) => {
        clearTolltips();
      });

    var tooltip = null;
    var _this = this;

    var tooltipMarkup = function (data) {
      return '<div style="border: 1px solid #eee; background-color: rgba(255, 255, 255, 0.90); padding: 8px 11px; border-radius: 3px"> \
                <div class="d3gtd-tooltip__name" style="font-weight: 700; font-style: italic; font-size: 13px; margin-bottom: 3px">' + _this.data[(_this.currentIndex + 1) % 2].country.properties.name + '</div> \
                <div class="d3gtd-tooltip__name" style="font-seight: 400; font-size: 13px;"> \
                    Type of attack: <span>' + data.data.key + '</span> \
                </div> \
                <div class="d3gtd-tooltip__name" style="font-seight: 400; font-size: 13px;"> \
                    Number of incidents: <span>' + data.value + '</span> \
                </div> \
              </div>';
    };

    var showTooltip = (d => {
      if (!tooltipMarkup) return;
      tooltip = this.container
        .append('div')
        .attr('class', 'donut-tooltip')
        .html(tooltipMarkup(d))
        .style('position', 'fixed')
        .style('top', d3.event.clientY + 'px')
        .style('left', d3.event.clientX + 'px')
        .style('transform', 'translate(-50%, 20px)')
        .style('z-index', 100);
    });

    var updateTooltipPosition = (data) => {
      tooltip
        .style('top', d3.event.clientY + 'px')
        .style('left', d3.event.clientX + 'px');
    }

    var clearTolltips = () => {
      tooltip.remove();
    };
    

    // define legend
    var legend = svg.selectAll('.legend') // selecting elements with class 'legend'
      .data(color.domain().slice(0, maxLegendAmount)) // refers to an array of labels from our dataset
      .enter() // creates placeholder
      .append('g') // replace placeholders with g elements
      .attr('class', 'legend') // each g is given a legend class
      .attr('transform', function (d, i) {
        var height = legendRectSize + legendSpacing; // height of element is the height of the colored square plus the spacing      
        var offset = height * color.domain().slice(0, maxLegendAmount).length / 2; // vertical offset of the entire legend = height of a single element & half the total number of elements  
        var horz = margin.left + radius + 0.01 * width; // the legend is shifted to the left to make room for the text
        var vert = i * height - offset; // the top of the element is hifted up or down from the center using the offset defiend earlier and the index of the current element 'i'               
        return 'translate(' + horz + ',' + vert + ')'; //return translation       
      });

    // adding colored squares to legend
    legend.append('rect') // append rectangle squares to legend                                   
      .attr('width', legendRectSize) // width of rect size is defined above                        
      .attr('height', legendRectSize) // height of rect size is defined above                      
      .style('fill', color) // each fill is passed a color
      .style('stroke', color);

    // adding text to legend
    legend.append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize + legendSpacing / 2 - 4)
      .style('font-size', 10)
      .text(function (d) { return d.replace(/ *\([^)]*\) */g, ""); }); // return label
  }

  updateDonutTargetType() {
    var widthBasis = this.donutContainer2.node().getBoundingClientRect().width;
    var heightBasis = widthBasis / 1.5;
    var margin = { top: 60, right: 20, bottom: 20, left: 20 },
      width = widthBasis,
      height = heightBasis;

    this.donutTarget.selectAll('g').remove();
    const maxLegendAmount = 10;

    var donutData = d3
      .nest()
      .key(function (d) { return d.targtype1_txt; })
      .rollup(d => d.length)
      .entries(this.data[(this.currentIndex) % 2].data)
      .slice(0, maxLegendAmount)
      .sort((a, b) => b.value - a.value);

    // a circle chart needs a radius
    var radius = width / 4 - margin.left;

    // legend dimensions
    var legendRectSize = 5; // defines the size of the colored squares in legend
    var legendSpacing = 10; // defines spacing between squares

    // define color scale
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    // more color scales: https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9

    var svg = this.donutTarget
      .attr('width', width) // set the width of the svg element we just added
      .attr('height', height) // set the height of the svg element we just added
      .append('g') // append 'g' element to the svg element
      .attr("transform",
        "translate(" + (margin.left + radius) + "," + (margin.top + radius) + ")");

    var arc = d3.arc()
      .innerRadius(0) // none for pie chart
      .outerRadius(radius); // size of overall chart

    var pie = d3.pie() // start and end angles of the segments
      .value(function (d) { return d.value; }) // how to extract the numerical data from each entry in our dataset
      .sort(null); // by default, data sorts in oescending value. this will mess with our animation so we set it to null

    // creating the chart
    var path = svg.selectAll('path') // select all path elements inside the svg. specifically the 'g' element. they don't exist yet but they will be created below
      .data(pie(donutData)) //associate dataset wit he path elements we're about to create. must pass through the pie function. it magically knows how to extract values and bakes it into the pie
      .enter() //creates placeholder nodes for each of the values
      .append('path') // replace placeholders with path elements
      .attr('d', arc) // define d attribute with arc function above
      .attr('fill', function (d) { return color(d.data.key); }) // use color scale to define fill of each label in dataset
      .each(function (d) { this._current - d; })
      .on('mouseover', (d) => {
        showTooltip(d);
      })
      .on('mousemove', (d) => {
        updateTooltipPosition(d);
      })
      .on('mouseleave', (d) => {
        clearTolltips();
      });

    var tooltip = null;
    var _this = this;

    var tooltipMarkup = function (data) {
      console.dir(data);
      console.dir(_this.currentIndex);
      console.dir(_this.data);
      
      return '<div style="border: 1px solid #eee; background-color: rgba(255, 255, 255, 0.90); padding: 8px 11px; border-radius: 3px"> \
                <div class="d3gtd-tooltip__name" style="font-weight: 700; font-style: italic; font-size: 13px; margin-bottom: 3px">' + _this.data[(_this.currentIndex + 1) % 2].country.properties.name + '</div> \
                <div class="d3gtd-tooltip__name" style="font-seight: 400; font-size: 13px;"> \
                    Type of attack: <span>' + data.data.key + '</span> \
                </div> \
                <div class="d3gtd-tooltip__name" style="font-seight: 400; font-size: 13px;"> \
                    Number of incidents: <span>' + data.value + '</span> \
                </div> \
              </div>';
    };

    var showTooltip = (d => {
      if (!tooltipMarkup) return;
      tooltip = this.container
        .append('div')
        .attr('class', 'donut-tooltip')
        .html(tooltipMarkup(d))
        .style('position', 'fixed')
        .style('top', d3.event.clientY + 'px')
        .style('left', d3.event.clientX + 'px')
        .style('transform', 'translate(-50%, 20px)')
        .style('z-index', 100);
    });

    var updateTooltipPosition = (data) => {
      tooltip
        .style('top', d3.event.clientY + 'px')
        .style('left', d3.event.clientX + 'px');
    }

    var clearTolltips = () => {
      tooltip.remove();
    };


    // define legend
    var legend = svg.selectAll('.legend') // selecting elements with class 'legend'
      .data(color.domain().slice(0, maxLegendAmount)) // refers to an array of labels from our dataset
      .enter() // creates placeholder
      .append('g') // replace placeholders with g elements
      .attr('class', 'legend') // each g is given a legend class
      .attr('transform', function (d, i) {
        var height = legendRectSize + legendSpacing; // height of element is the height of the colored square plus the spacing      
        var offset = height * color.domain().slice(0, maxLegendAmount).length / 2; // vertical offset of the entire legend = height of a single element & half the total number of elements  
        var horz = margin.left + radius + 0.01 * width; // the legend is shifted to the left to make room for the text
        var vert = i * height - offset; // the top of the element is hifted up or down from the center using the offset defiend earlier and the index of the current element 'i'               
        return 'translate(' + horz + ',' + vert + ')'; //return translation       
      });

    // adding colored squares to legend
    legend.append('rect') // append rectangle squares to legend                                   
      .attr('width', legendRectSize) // width of rect size is defined above                        
      .attr('height', legendRectSize) // height of rect size is defined above                      
      .style('fill', color) // each fill is passed a color
      .style('stroke', color);

    // adding text to legend
    legend.append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize + legendSpacing / 2 - 4)
      .style('font-size', 10)
      .text(function (d) { return d.replace(/ *\([^)]*\) */g, ""); }); // return label
  }

  on() {
    var value = dispatcher.on.apply(dispatcher, arguments);
    return value === dispatcher ? this : value;
  }
}

// Parse the date / time
var parseDate = d3.timeParse("%Y");

var parseDateMonth = d3.timeParse("%Y-%m");