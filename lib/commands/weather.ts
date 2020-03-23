import fetch, { Response } from 'node-fetch';
import { MessageAttachment, MessageEmbed } from 'discord.js';

const WEATHER_URL = 'http://api.openweathermap.org/data/2.5/weather';

export default (home_scope: HomeScope) => {
	const { message, args, SECRETS, CONFIG } = home_scope;

	if (args[0] === 'set' && args.length > 1){
		CONFIG.weather_locations[message.author.id] = args.tail().join(' ');
		message.answer(`Your weather location has \
			been set to ${args.tail().join(' ')}`.squeeze());
	} else {
		const location = args[0]
			? args.join(' ')
			: CONFIG.weather_locations[message.author.id] || 'Cuckfield';
		const key = SECRETS.openweather.key;

		const error = (e: Response) => {
			message.answer(`Error getting weather\n\`\`\`${e}\`\`\``);
			return e;
		};

		fetch(`${WEATHER_URL}?q=${location}&appid=${key}&units=metric`)
			.catch(error)
			.then(res => res.json())
			.then(d => {
				const date = new Date();
				const tz = d.timezone / 3600; // Now in hours.
				const tz_frac = tz % 1; // Fractional part.

				if (tz_frac === 0)
					date.setMinutes(date.getMinutes() + tz_frac * 60);

				const hour = (24 + date.getUTCHours() + tz - tz_frac) % 24;
				const country = !d.sys ? 'somewhere' : d.sys.country;

				const embed = d.main
					? new MessageEmbed()
						.setTitle(`${d.main.temp}°C (feels like ${d.main.feels_like}°C)`)
						.setAuthor(`${hour}:${date.getMinutes()} ${d.name}, ${country}`)
						.setDescription(d.weather[0].description)
						.setThumbnail(`https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`)
						.addFields(
							{ name: 'day temp', value: d.main.temp_max + '°C', inline: true },
							{ name: 'night temp', value: d.main.temp_min + '°C', inline: true })
				: new MessageEmbed()
					.setTitle(`Cannot get weather information from ${location}.`);

				message.channel.send(embed);
			}).catch(error);
	}
};
