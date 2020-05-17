import http from 'http';
import { readFileSync as read_file } from 'fs';
import process from 'process';

const PORT = Number(process.env.PORT) || 8080;

export default (GLOBAL_CONFIG : Types.GlobalConfig, handle_post) => {
	const request_listener: http.RequestListener = (req, res) => {
		if (req.method === 'POST') {
			console.log('Web-hook:');

			let chunks = '';
			req.on('data', chunk => {
				chunks += chunk;
			});
			req.on('end', () => {
				console.log('Got whole body.')
				const body = JSON.parse(chunks);
				console.log(body);
				handle_post(body);
				res.writeHead(200);
				res.end();
			});
			return;
		}

		switch (req.url) {
			case '/':
				res.writeHead(200, {
					'Content-Type': 'text/html'
				});

				const guild_count = Object
					.keys(GLOBAL_CONFIG.guilds)
					.length
					.toString();

				const index_contents = read_file('./web/index.html')
					.toString()
					.replace(/{{\s*GUILD_COUNT\s*}}/g, guild_count);
				res.write(index_contents);
				res.end();
				break;
			default:
				res.writeHead(404, {
					'Content-Type': 'text/html'
				});
				res.write(`<!DOCTYPE html>
			<html>
			<body>
				<h1>404 - Not found.</h1>
			</body>
			</html>
		`);
				res.end();
		}
	};
	const server = http.createServer(request_listener);
	server.listen(PORT, '0.0.0.0', () => {
		console.log(`Web server started on http://0.0.0.0:8080/`);
	});
};
