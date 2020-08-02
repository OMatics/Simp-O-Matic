import fetch from 'node-fetch';
import { MessageEmbed } from 'discord.js';

const DIRECTIONS = [
	'north', 'north east',
	'east', 'south east',
	'south', 'south west',
	'west', 'north west'
];

const MOON_PHASES = ['🌑', '🌒️', '🌓', '🌔️', '🌕', '🌖️', '🌗', '🌘️'];

const ICONS = {
	'clear-day': '🌞',
	'clear-night': '🌚',
	'rain': '🌧️',
	'snow': '❄️',
	'sleet': '🌨️',
	'wind': '💨',
	'fog': '🌫️',
	'cloudy': '🌥️',
	'partly-cloudy-day': '⛅',
	'partly-cloudy-night': '⛅'
};

const WEATHER_URL = 'https://api.met.no/weatherapi/locationforecast/2.0/compact';
const GEOCODE_URL = 'https://geocode-maps.yandex.ru/1.x/?format=json';

export default async (home_scope: HomeScope) => {
	const { message, args, SECRETS, CONFIG } = home_scope;

	if (args[0] === 'set' && args.length > 1) {
		CONFIG.weather_locations[message.author.id] = args.tail().join(' ');
		return message.answer(`Your weather location has \
			been set to ${args.tail().join(' ')}`.squeeze());
	}

	const location = args[0]
		? args.join(' ')
		: CONFIG.weather_locations[message.author.id] || 'Cuckfield';

	const geokey = SECRETS.yandex.geocoder.key;

	const error = (e: Error) => {
		message.answer(`Error getting weather\n\`\`\`${e.message}\`\`\``);
		return e;
	};

	let geocoder_json, weather_info, geo_object;
	try {
		const geocoder = await fetch(`${GEOCODE_URL}&apikey=${geokey}`
			+`&geocode=${location}&lang=en-US`);

		geocoder_json = await geocoder.json();
		geo_object = geocoder_json.response
			.GeoObjectCollection
			.featureMember[0].GeoObject;

		const lon_lat = geo_object.Point.pos.split(' ');
		weather_info = await fetch(
			`${WEATHER_URL}?lat=${lon_lat[1]}&lon=${lon_lat[0]}`);
	} catch (e) {
		return error(e);
	}

	const d = await weather_info.json();
	const { properties } = d;
	const date_string = properties.meta.updated_at.substr(11,5);
	const temps = [...Array(24)].map((_, n) =>
		properties.timeseries[n].data.instant.details.air_temperature);

	const embed = new MessageEmbed()
		.setTitle(`Cannot get weather information from ${location}.`);

	if (properties && properties.meta) embed
		.setTitle(
			`${properties.timeseries[0].data.instant.details.air_temperature}°C`)
		.setAuthor(`${date_string}`
			+` ${geo_object.name},`
			+` ${geo_object.description}`)
		.setThumbnail(
			`https://api.met.no/images/weathericons/svg/${properties.timeseries[0].data.next_1_hours}.svg`)
		.addFields(
			{ name: 'daytime',
			  value: Math.max(...temps) + '°C',
			  inline: true },
			{ name: 'nighttime',
			  value: Math.min(...temps) + '°C',
			  inline: true },
			{ name: 'humidity',
			  value: properties.timeseries[0].data.instant.details.relative_humidity + '%',
			  inline: true },
			{ name: 'wind',
			  value: `${DIRECTIONS[Math.round(properties.timeseries[0].data.instant.details.wind_from_direction / 45) % 8]}`
				+ ` ${properties.timeseries[0].data.instant.details.wind_speed} ㎧`,
			  inline: true })
		.setFooter(
			'https://0x0.st/ixdO.png',
			'Data provided by meteorologisk institutt');

	message.channel.send(embed);
};
