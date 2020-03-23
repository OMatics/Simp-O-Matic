import fetch, { Response } from 'node-fetch';
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
}

const WEATHER_URL = 'https://api.darksky.net/forecast';
const GEOCODE_URL = 'https://geocode-maps.yandex.ru/1.x/?format=json';

export default (home_scope: HomeScope) => {
	const { message, args, SECRETS, CONFIG } = home_scope;

	if (args[0] === 'set' && args.length > 1) {
		CONFIG.weather_locations[message.author.id] = args.tail().join(' ');
		return message.answer(`Your weather location has \
			been set to ${args.tail().join(' ')}`.squeeze());
	}

	const location = args[0]
		? args.join(' ')
		: CONFIG.weather_locations[message.author.id] || 'Cuckfield';

	const key = SECRETS.darksky.key;
	const geokey = SECRETS.yandex.geocoder.key;

	const error = (e: Response) => {
		message.answer(`Error getting weather\n\`\`\`${e}\`\`\``);
		return e;
	};

	fetch(`${GEOCODE_URL}&apikey=${geokey}&geocode=${location}&lang=en-US`)
	.catch(error)
	.then(res => res.json())
	.then(c => {
		let latlon = c.response.featureMember[0].GeoObject.Point.pos.split(' ')
		fetch(`${WEATHER_URL}/${key}/${latlon}?exclude=minutely,hourly,alerts,flags&units=si`)
			.catch(error)
			.then(res => res.json())
			.then(d => {
				const date = new Date(d.currently.time);
				const embed = d && d.currently
					? new MessageEmbed()
						.setTitle(`${d.currently.temperature}°C (feels like ${d.currently.apparentTemperature}°C)`)
						.setAuthor(`${ICONS[d.currently.icon]} ${date.getHours()}:${date.getMinutes()} ${c.response.featureMember[0].GeoObject.name}`)
						.setDescription(MOON_PHASES[Math.round(d.daily.data[0].moonPhase * 7)] + ' ' +d.currently.summary)
						.addFields(
							{ name: 'daytime',   value: d.daily.data[0].temperatureHigh + '°C', inline: true },
							{ name: 'nighttime', value: d.daily.data[0].temperatureLow + '°C', inline: true },
							{ name: 'humidity',  value: d.currently.humidity + '%', inline: true},
							{ name: 'wind', value: `${DIRECTIONS[Math.round(d.currently.windBearing / 45) % 8]} ${d.currently.windSpeed}㎧`, inline: true })
						.setFooter('Powered by Dark Sky', 'https://darksky.net/images/darkskylogo.png')
					: new MessageEmbed().setTitle(`Cannot get weather information from ${location}.`)

				message.channel.send(embed);
			}).catch(error);
		})
};
