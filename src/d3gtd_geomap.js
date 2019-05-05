import noUiSlider from 'nouislider';

var dispatcher = d3.dispatch('clickCountry', 'changeInterval', 'mouseover', 'mousemove', 'mouseleave');

export class D3gtd_map {
  constructor(options) {
    this.options = options;
    this.container = d3
      .select('#' + options.mapId)
      .classed('d3gtc-container', true)
      .style('position', 'relative')
      .style('overflow', 'hidden');

    this.width = this.container.node().getBoundingClientRect().width;
    this.height = this.width / 1.85;
    this.world = undefined; // Contains visible data
    var scale0 = this.width / 2 / Math.PI;

    this.projection = d3.geoMercator()
      .scale(scale0)
      .translate([this.width / 2, this.height / 1.55]);

    this.container
      .append('div')
      .classed('d3gtc-geomap', true)
      .style('border', '1px solid #eee')
      .style('overflow', 'hidden')
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);

    this.container
      .append('div')
      .style('padding-right', '20px')
      .style('padding-left', '20px')
      .classed('d3gtc-slider', true);

    this.geomap = this.container.select('.d3gtc-geomap').select('svg');
    this.legendContainer = this.container
      .select('.d3gtc-geomap')
      .append('div')
      .classed('d3gtc-geomapLegend', true)
      .style('position', 'absolute');
    this.legendContainer
      .append('div')
      .classed('d3gtc-geomapLegend-title', true)
      .style('font-size', '12px')
      .style('margin-bottom', '6px')
      .text('Number of attacks');

  }

  init(world, maxValue, dateInterval) {
    this.update(world, maxValue);
    this.initSlider(dateInterval);
  }

  update(world, maxValue) {
    var strokeOpacuty = 0.5;
    var hoverStrokeOpacuty = 1;
    var strokeColor = '#eee';
    var hoverStrokeColor = '#eee';
    var colorScale = d3.scaleQuantize()
      .domain([0, maxValue*0.3, maxValue])
      .range(['#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#990000']);
    // var colorScale = d3.scaleLinear()
    //   .domain([0, maxValue])
    //   .range(["#4cd137", "#c23616"]);
    var countries = this.geomap.selectAll('path').data(world);
    var tooltip = null;
    var tooltipMarkup = function (data) {
      return '<div style="border: 1px solid #eee; background-color: rgba(255, 255, 255, 0.90); padding: 8px 11px; border-radius: 3px"> \
                <div class="d3gtd-tooltip__name" style="font-weight: 700; font-style: italic; font-size: 13px; margin-bottom: 3px">' + data.properties.name + '</div> \
                <div class="d3gtd-tooltip__name" style="font-seight: 400; font-size: 13px;"> \
                    Number of attacks: <span>' + data.count + '</span> \
                </div> \
                <div class="d3gtd-tooltip__name" style="font-seight: 400; font-size: 13px;"> \
                    Number of deaths: <span>' + data.countDeaths + '</span> \
                </div> \
              </div>';
    };
    countries
      .enter()
      .append("path")
      // draw each country
      .attr("d", d3.geoPath(this.projection))
      .attr("stroke", strokeColor)
      .attr('stroke-opacity', strokeOpacuty)
      .style('cursor', 'pointer')
      .on('mouseover', function (d) {
        d3.select(this)
          .attr('stroke-opacity', hoverStrokeOpacuty)
          .attr("stroke", hoverStrokeColor);
      })
      .on('mouseleave', function (d) {
        d3.select(this)
          .attr('stroke-opacity', strokeOpacuty)
          .attr("stroke", strokeColor);
      })
      .on('click', (d) => {
        dispatcher.call("clickCountry", this, d);
      })
      .on('mouseover', (d) => {
        showTooltip(d);
      })
      .on('mousemove', (d) => {
        updateTooltipPosition(d);
      })
      .on('mouseleave', (d) => {
        clearTolltips();
      })
      .merge(countries)
      .transition()
      .duration(500)
      .attr("fill", d => colorScale(d.count));

    this.updateLegend(world, maxValue, colorScale);

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
  }

  updateLegend(world, maxValue, colorScale) {
    var range = colorScale.range();
    var thresholds = colorScale.thresholds();
    range = range.map((el, i) => {
      var rObj = {};
      rObj.color = el;
      rObj.minValue = i === 0 ? 0 : thresholds[i-1];
      rObj.maxValue = i === range.length - 1 ? maxValue : thresholds[i];
      return rObj;
    });
    var legendLines = this.legendContainer.selectAll('.d3gtc-geomapLegend-line').data(range);
    legendLines
      .enter()
      .append("div")
      .classed('d3gtc-geomapLegend-line', true)
      .style('position', 'relative')
      .style('padding-left', '15px')
      .each(function(d) {
        d3.select(this)
          .append('div')
          .classed('d3gtc-geomapLegend-line-color', true)
          .style('position', 'absolute')
          .style('left', '0')
          .style('top', '1px')
          .style('width', '10px')
          .style('height', '10px')
          .style('background', (d) => d.color);
        d3.select(this)
          .append('div')
          .classed('d3gtc-geomapLegend-line-text', true)
          .style('font-size', '12px')
          .html(d => {
            return Math.floor(d.minValue) + ' &ndash; ' + Math.floor(d.maxValue)
          });
      });
    legendLines
      .each(function (d) {
        d3.select(this)
          .select('.d3gtc-geomapLegend-line-text')
          .html(d => {
            return Math.floor(d.minValue) + ' &ndash; ' + Math.floor(d.maxValue)
          });
      });
  }

  initSlider(dateInterval) {
    this.dateSlider = this.container.select('.d3gtc-slider').node();

    noUiSlider.create(this.dateSlider, {
      // Create two timestamps to define a range.
      range: {
        min: dateInterval[0],
        max: dateInterval[1]
      },
      connect: true,

      // Steps of one week
      step: 7 * 24 * 60 * 60 * 1000,

      // Two more timestamps indicate the handle starting positions.
      start: [dateInterval[0], dateInterval[1]],

      // No decimals
      // format: wNumb({
      // 	decimals: 0
      // })
    });

    var dateValuesDisplay = [
      document.getElementById(this.options.startDateTextId),
      document.getElementById(this.options.endDateTextId),
    ];

    this.dateSlider.noUiSlider.on('update', (values, handle) => {
      d3.select(dateValuesDisplay[handle]).text(formatDate(new Date(+values[handle])));
    });
    this.dateSlider.noUiSlider.on('change', (values, handle) => {
      dispatcher.call("changeInterval", this, values);
    });
  }

  setSliderInterval(timeInterval) {
    this.dateSlider.noUiSlider.set(timeInterval);
  }

  on() {
    var value = dispatcher.on.apply(dispatcher, arguments);
    return value === dispatcher ? this : value;
  }
}

var months = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
];

// Create a string representation of the date.
function formatDate(date) {
  return date.getDate() + nth(date.getDate()) + " " +
    months[date.getMonth()] + " " +
    date.getFullYear();
}

// Append a suffix to dates.
// Example: 23 => 23rd, 1 => 1st.
function nth(d) {
  if (d > 3 && d < 21) return 'th';
  switch (d % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}