import fetch, { Response } from 'node-fetch';
import { MessageEmbed } from 'discord.js';

const directions = [
	'north',
	'north east',
	'east',
	'south east',
	'south',
	'south west',
	'west',
	'north west'
];

const moonPhases = ['🌑', '🌒️', '🌓', '🌔️', '🌕', '🌖️', '🌗', '🌘️'];

const icons = {
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
const GEOCODE_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

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
	const geokey = SECRETS.mapbox.key;
	const error = (e: Response) => {
		message.answer(`Error getting weather\n\`\`\`${e}\`\`\``);
		return e;
	};
	fetch(`${GEOCODE_URL}/${location}.json?access_token=${geokey}&limit=1&language=en`)
	.catch(error)
	.then(res => res.json())
	.then(c => {
		fetch(`${WEATHER_URL}/${key}/${c.features[0].center[0]},${c.features[0].center[1]}?exclude=minutely,hourly,alerts,flags&units=si`)
			.catch(error)
			.then(res => res.json())
			.then(d => {
				const date = new Date(d.currently.time);
				const embed = d.main
					? new MessageEmbed()
						.setTitle(`${d.currently.temperature}°C (feels like ${d.currently.apparentTemperature}°C)`)
						.setAuthor(`${icons[d.currently.icon]} ${date.getHours()}:${date.getMinutes()} ${c.features[0].place_name}`)
						.setDescription(moonPhases[Math.round(d.daily.data[0].moonPhase * 7)] + d.currently.summary)
						.addFields(
							{ name: 'daytime',   value: d.daily.data[0].temperatureHigh + '°C', inline: true },
							{ name: 'nighttime', value: d.daily.data[0].temperatureLow + '°C', inline: true },
							{ name: 'humidity',  value: d.currently.humidity + '%', inline: true},
							{ name: 'wind', value: `${directions[Math.round(d.currently.windBearing / 45) % 8]} ${d.currently.windSpeed}㎧`, inline: true })
						.setFooter('Powered by Dark Sky(R)');
					: new MessageEmbed().setTitle(`Cannot get weather information from ${location}.`)

				message.channel.send(embed);
			}).catch(error);
		})
};
