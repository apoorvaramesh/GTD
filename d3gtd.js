import { D3gtd_map as Geomap } from './d3gtd_geomap';
import { D3gtd_visblock as Visblock } from './d3gtd_visblock';

class D3gtd {
	constructor(options) {
		if (!d3) {
			throw "D3 js version 5 must be defined globally";
		}
		this.options = options;
		this.geomap = new Geomap(options);

		Promise.all([
			d3.json('./world.json'),	
			d3.json('./countryCodeMapping.json'),
			d3.csv('./gtdata_filter.csv')
		]).then(([world, countriesMapping, gt_data]) => {
			this.nonGroupedData = gt_data;
			this.groupedData = d3.group(gt_data, d => d.country);
			this.world = world.features;
			this.countriesMapping = countriesMapping;
			this.filterData();
			this.geomap.init(this.world, this.maxValue, this.dateInterval);
			this.visualisation = new Visblock({
				column:	options.column,
				donut1: options.donut1,
				donut2: options.donut2,
				dateInterval: this.dateInterval
			});
			this.visualisation.setTimeInterval(this.timeInterval);
			this.visualisation.setCountry({
				id: 'worldwide',
				properties: {
					name: 'worldwide'
				}
			}, this.patchupChartsData());
			this.acticeVisColumn = 0; // Only two countries can be select for vises
			this.visualisation.on('clickYear', (d) => {
				var start = new Date();
				start.setFullYear(parseInt(d))
				start.setMonth(0);
				start.setDate(1);
				var end = new Date();
				end.setFullYear(parseInt(d))
				end.setMonth(11);
				end.setDate(31);
				this.updateTimeInterval([start.getTime(), end.getTime()]);
				this.geomap.setSliderInterval([start.getTime(), end.getTime()]);
			});
		});

		this.geomap.on('clickCountry', (d) => {
			this.visualisation.setCountry(d, this.patchupChartsData(d));
			// this.visualisations[this.acticeVisColumn].setCountry(d, this.patchupChartsData(d));
			// this.acticeVisColumn = (this.acticeVisColumn + 1) % 2;
		});
		this.geomap.on('changeInterval', (values) => {
			this.updateTimeInterval(values);
		});
	}

	updateTimeInterval(values) {
		this.filterData([parseInt(values[0]), parseInt(values[1])]);
		this.geomap.update(this.world, this.maxValue);
		this.visualisation.setTimeInterval(this.timeInterval);
		var countries = this.visualisation.getCountries();
		countries.forEach(country => {
			country && this.visualisation.setCountry(country, this.patchupChartsData(country.id == 'worldwide' ? null : country));
		})
	}

	filterData(timeInterval) {
		if (!timeInterval) {
			this.dateInterval = [new Date(0), new Date(0)];
			this.groupedData.forEach((countryEvents) => {
				countryEvents.forEach(event => {
					var date = getDateFromEvent(event);
					this.dateInterval[0] = Math.min(this.dateInterval[0], date);
					this.dateInterval[1] = Math.max(this.dateInterval[1], date);
				});
			})
			timeInterval = this.dateInterval;
		}
		this.timeInterval = timeInterval;
		this.maxValue = 0;
		this.world.forEach(country => {
			var summ = 0;
			var summDeaths = 0;
			var countryCodes = this.countriesMapping[country.id.toLowerCase()];
			countryCodes && countryCodes.forEach(code => {
				var amount = this.groupedData.get(code.toString()).filter(event => {
					return timeInterval[0] <= getDateFromEvent(event) && timeInterval[1] >= getDateFromEvent(event)
				});
				summ += amount && amount.length;
				amount && amount.forEach(event => {
					summDeaths += event.nkill ? parseInt(event.nkill) : 0;
				})
			});
			country.count = summ;
			country.countDeaths = summDeaths;
			this.maxValue = Math.max(country.count, this.maxValue);
		});
	}

	patchupChartsData(d) {
		if(!d) {
			return this.nonGroupedData.filter(event => {
				return this.timeInterval[0] <= getDateFromEvent(event) && this.timeInterval[1] >= getDateFromEvent(event)
			}).map(event => {
				return Object.assign(event, { date: getDateFromEvent(event) })
			});
		}
		var countryCodes = this.countriesMapping[d.id.toLowerCase()];
		var events = [];
		countryCodes && countryCodes.forEach(code => {
			events = events.concat(this.groupedData.get(code.toString()).filter(event => {
				return this.timeInterval[0] <= getDateFromEvent(event) && this.timeInterval[1] >= getDateFromEvent(event)
			}).map(event => {
				return Object.assign(event, { date: getDateFromEvent(event) })
			}));
		});
		return events;
	}
}

// Create a new date from a string, return as a timestamp.
function timestamp(str) {
	return new Date(str).getTime();
}
// Create a list of day and month names.
var weekdays = [
	"Sunday", "Monday", "Tuesday",
	"Wednesday", "Thursday", "Friday",
	"Saturday"
];

function getDateFromEvent(event) {
	var date = new Date(event.iyear);
	date.setMonth(+event.imonth - 1);
	date.setDate(+event.iday);
	return date;
}


// Export globally
window.D3gtd = D3gtd;