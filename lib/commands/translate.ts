import fetch from 'node-fetch';
export default async (homescope: HomeScope) => {
	const { message, args, SECRETS, CONFIG } = homescope, lang = String(args[0])[2] == '-' ? args.shift() : 'en'; // handle undefined
	args[0] ? fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${SECRETS.yandex.translate.key}&text=${encodeURIComponent(args.join(' '))}&lang=${lang}`).catch(console.log).then((res: any) => res.json()).then(tr => message.channel.send([,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,false,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,'api key missing','blocked api key',,'limit reached',,,,,,,,,'text too long (shouldnt happen)',,,,,,,,,'untranslatable.',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,'unsupported'][tr.code] || tr.text[0])) : message.reply('.translate [from-to] words \n default: auto-en');
};

// P.S.  If you're reading this code, and wondering why
//  it looks like that; it's because Danny wrote it.
//  Danny is on drugs.
