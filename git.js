const git = require('nodegit');
const path = require('path');

const info = async dir => {
	const repo = await git.Repository.open(dir);
	const master = await repo.getMasterCommit();
	const history = master.history(git.Revwalk.SORT.TIME);

	let count = 0;
	history.on("commit", commit => {
		if (count++ >= Infinity) return;
		console.log(`\`${commit.sha().slice(0, 7)}\` — `
			+ `${commit.message().trim()}`
			+ ` (by ${commit.author().name()})`);
	});
	console.log('Start history:');
	history.start();
	history.on("end", () => {
	console.log('hi');
	});
};

info(path.resolve(process.cwd(), "./.git"));
