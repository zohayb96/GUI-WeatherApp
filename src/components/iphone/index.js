// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';
import style_iphone from '../button/style_iphone';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';

export default class Iphone extends Component {
	//var Iphone = React.createClass({
	parseResponse = parsed_json => {
		var location = parsed_json['name'];
		var temp_c = parsed_json['main']['temp'];
		var conditions = parsed_json['weather']['0']['description'];
		var temp_min = parsed_json['main']['temp_min'];
		var temp_max = parsed_json['main']['temp_max'];
		var clouds = parsed_json['clouds']['all'];
		var sunrise = parsed_json['sys']['sunrise'];
		var sunset = parsed_json['sys']['sunset'];
		var rain = 0;

		// set states for fields so they could be rendered later on
		this.setState({
			locate: location,
			temp: temp_c,
			cond: conditions,
			low: temp_min,
			high: temp_max,
			cloud: clouds,
			message: '',
			forecast: [],
			rainPercentage: rain,
			sunriseTime: sunrise,
			sunsetTime: sunset,
		});
	};

	parseWeekResponse = parsed_json => {
		var dayOne = Math.round(parsed_json['list']['1']['main']['temp']);
		var dayTwo = Math.round(parsed_json['list']['2']['main']['temp']);
		var dayThree = Math.round(parsed_json['list']['3']['main']['temp']);
		var dayFour = Math.round(parsed_json['list']['4']['main']['temp']);
		var dayFive = Math.round(parsed_json['list']['5']['main']['temp']);
		var daySix = Math.round(parsed_json['list']['6']['main']['temp']);
		this.setState({
			dayOne: dayOne,
			dayTwo: dayTwo,
			dayThree: dayThree,
			dayFour: dayFour,
			dayFive: dayFive,
			daySix: daySix,
		});
	};

	// a constructor with initial set states
	constructor(props) {
		super(props);
		// temperature state
		this.state.temp = '';
		this.state.locate = '';
		this.state.cond = '';
		this.state.low = '';
		this.state.high = '';
		this.state.clouds = '';
		this.state.message = '';
		this.state.forecast = '';
		this.state.rainPercentage = '';
		this.state.sunriseTime = '';
		this.state.sunsetTime = '';

		// DAYS OF THE WEEK
		this.state.dayOne = 0;
		this.state.dayTwo = 0;
		this.state.dayThree = 0;
		this.state.dayFour = 0;
		this.state.dayFive = 0;
		this.state.daySix = 0;
		this.state.value = 'London';
		// button display state
		this.setState({ display: true });

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		this.setState({ value: event.target.value });
	}

	handleSubmit(event) {
		this.fetchAllData(this.state.value);
		event.preventDefault();
	}

	// a call to fetch weather data via wunderground
	fetchWeatherData = city => {
		// API URL with a structure of : ttp://api.wunderground.com/api/key/feature/q/country-code/city.json
		var url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=a9ab5f92919286301907695dec776ea7`;
		$.ajax({
			url: url,
			dataType: 'jsonp',
			success: this.parseResponse,
			error: function(req, err) {
				console.log('API call failed ' + err);
			},
		});
		// once the data grabbed, hide the button
		this.setState({ display: false });
	};

	fetchWeeklyWeatherData = city => {
		var weeklyurl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=a9ab5f92919286301907695dec776ea7`;
		$.ajax({
			url: weeklyurl,
			dataType: 'jsonp',
			success: this.parseWeekResponse,
			error: function(req, err) {
				console.log('API call failed ' + err);
			},
		});
		// once the data grabbed, hide the button
		this.setState({ display: false });
	};

	fetchAllData = city => {
		this.fetchWeeklyWeatherData(city);
		this.fetchWeatherData(city);
	};

	// the main render method for the iphone component
	render() {
		console.log(this.state);
		// check if temperature data is fetched, if so add the sign styling to the page
		const tempStyles = this.state.temp
			? `${style.temperature} ${style.filled}`
			: style.temperature;

		// CONVERT DATA
		var sunriseTimeFormat = new Date(this.state.sunriseTime * 1000);
		var sunsetTimeFormat = new Date(this.state.sunsetTime * 1000);
		var sunriseDateHours = sunriseTimeFormat.getHours();
		var sunriseDateMinutes = sunriseTimeFormat.getMinutes();
		sunriseDateMinutes =
			sunriseDateMinutes > 9 ? sunriseDateMinutes : '0' + sunriseDateMinutes;
		var sunsetDateHours = sunsetTimeFormat.getHours();
		var sunseteDateMinutes = sunsetTimeFormat.getMinutes();
		sunseteDateMinutes =
			sunseteDateMinutes > 9 ? sunseteDateMinutes : '0' + sunseteDateMinutes;
		var sunriseTime = sunriseDateHours + ':' + sunseteDateMinutes;
		var sunsetTime = sunsetDateHours + ':' + sunseteDateMinutes;
		var low = Math.round(this.state.low) + '°';
		var high = Math.round(this.state.high) + '°';
		var temp = Math.round(this.state.temp);
		let todaysDay = [
			'Sunday',
			'Monday',
			'Tueday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
		][new Date().getDay()];

		// display all weather data
		return (
			<div class={style.container}>
				<div class={style.details} />
				<div class={style_iphone.container}>
					{this.state.display ? (
						<div>
							<Button
								class={style_iphone.button}
								clickFunction={this.fetchAllData(this.state.value)}
							/>
						</div>
					) : (
						<div class={style.header}>
							<div class={style.city}>{this.state.locate}</div>
							<div class={style.details}>{todaysDay}</div>
							<div class={style.conditions}>{this.state.cond}</div>
							<div class={tempStyles}>{temp}</div>
							<div class={style.details}>Low: {low}</div>
							<div class={style.details}>High: {high}</div>
							<div class={style.details}>Cloud Cover: {this.state.cloud} %</div>
							<div class={style.details}>
								Chance of rain: {this.state.rainPercentage} %
							</div>
							<div class={style.details}>Sunrise: {sunriseTime}</div>
							<div class={style.details}>Sunset: {sunsetTime}</div>
							<div class={style.days}>
								<div class={style.day}>+3 Hr: {this.state.dayOne}°</div>
								<div class={style.day}>+6 Hr: {this.state.dayTwo}°</div>
								<div class={style.day}>+9 Hr: {this.state.dayThree}°</div>
								<div class={style.day}>+12 Hr: {this.state.dayFour}°</div>
								<div class={style.day}>+15 Hr: {this.state.dayFive}°</div>
								<div class={style.day}>+18 Hr: {this.state.daySix}°</div>
							</div>
						</div>
					)}
				</div>
				<div />
				<form onSubmit={this.handleSubmit}>
					<label>
						City:
						<input
							type="text"
							value={this.state.value}
							onChange={this.handleChange}
						/>
					</label>
					<input type="submit" value="Search" />
				</form>
			</div>
		);
	}
}
