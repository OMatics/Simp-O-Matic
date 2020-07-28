import http from 'http';
import { readFileSync as read_file } from 'fs';
import process from 'process';

const templater = (doc, vars): string => {
	let new_doc = doc.toString();
	for (const key of Object.keys(vars)) {
		const match = new RegExp(`{{\s*${key}\s*}}`, 'g');
		new_doc = new_doc
			.replace(match, vars[key]);
	}
	return new_doc;
};

//const PORT = Number(process.env.PORT) || 8080;
const PORT = 8181;  // This value is hardcoded now for the VPS.

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

		const url = req.url;
		const relative = `./web/${url}`;
		if (url.endsWith('.png')) {
			try {
				const content = read_file(relative);
				res.writeHead(200, {
					'Content-Type': 'image/png'
				});
				res.write(content);
				res.end();
			} catch {}
		} else if (url.endsWith('.svg')) {
			try {
				const content = read_file(relative);
				res.writeHead(200, {
					'Content-Head': 'application/svg+xml'
				});
				res.write(content);
				res.end();
			} catch {}
		} else if (url.endsWith('.xml')) {
			try {
				const content = read_file(relative);
				res.writeHead(200, {
					'Content-Type': ' application/xml'
				});
				res.write(content);
				res.end();
			} catch {}
		} else if (url.endsWith('.ico')) {
			try {
				const content = read_file(relative);
				res.writeHead(200, {
					'Content-Type': 'image/x-icon'
				});
				res.write(content);
				res.end();
			} catch {}
		} else if (url.endsWith('.webmanifest')) {
			try {
				const content = read_file(relative);
				res.writeHead(200, {
					'Content-Type': 'application/manifest+json'
				});
				res.write(content);
				res.end();
			} catch {}
		} else if (url.endsWith('.css')) {
			try {
				const content = read_file(relative);
				res.writeHead(200, {
					'Content-Type': 'text/css'
				});
				res.write(content);
				res.end();
			} catch {}
		}

		const favicons = read_file('./web/favicons.html');
		const logo_svg = read_file('./web/logo-notext.svg');

		switch (url) {
			case '/':
				res.writeHead(200, {
					'Content-Type': 'text/html'
				});

				const guild_count = Object
					.keys(GLOBAL_CONFIG.guilds)
					.length
					.toString();

				const index_contents = templater(
					read_file('./web/index.html'),
					{
						'LOGO_NOTEXT_SVG': logo_svg,
						'GUILD_COUNT': guild_count,
						'FAVICONS': favicons
					});
				res.write(index_contents);
				res.end();
				break;
			case '/config.json':
				res.writeHead(200, {
					'Content-Type': 'application/json'
				});
				res.write(JSON.stringify(GLOBAL_CONFIG, null, 4));
				res.end();
				break;
			default:
				res.writeHead(404, {
					'Content-Type': 'text/html'
				});
				res.write(templater(read_file('./web/404.html'), {
					'FAVICONS': favicons
				}));
				res.end();
		}
	};
	const server = http.createServer(request_listener);
	server.listen(PORT, '0.0.0.0', () => {
		console.log(`Web server started on http://0.0.0.0:${PORT}/`);
	});
};
