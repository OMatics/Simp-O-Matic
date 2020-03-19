const drugs = {
	'alcohol': [10000, 100000],
	'amphetamine': [10, 20, 40, 60],
	'cocaine': [10, 20, 40, 60],
	'datura': [10000],
	'ketamine': [50, 100, 300, 500],
	'mescaline': [50, 100, 200, 400, 800],
	'psilocin': [5, 10, 20, 40],
	'lysergic acid diethylamide': [0.01, 0.1, 0.2, 0.3],
	'cannabis': [20, 30, 60, 100, 150],
	'MDMA': [20, 40, 80, 150, 200],
	'nicotine': [0.3, 0.5, 1, 2, 3],
	'codeine': [30, 50, 100, 150, 200],
	'alprazolam': [1, 2, 4, 6, 8],
	'clonazepam': [2, 4, 8, 16],
	'phenazepam': [1, 2, 4, 6, 8],
	'fentanyl': [0.1, 0.5, 0.7],
	'heroin': [5, 10, 20, 30, 50],
	'dimethyltryptamine': [2, 10, 20, 40, 60],
	'nitrous oxide': [20000],
	'salvia divinorum': [20000],
	'baclofen': [25, 50, 100],
	'diphenhydramine': [25, 100, 200, 500, 700, 1000],
	'dextromethorphan': [100, 200, 400, 800, 1000],
	'kratom': [1000, 5000, 10000],
	'memantine': [30, 60, 120, 180]
};

export default home_scope => {
	const { message } = home_scope;
	const drug = Object.keys(drugs)[Math.floor(25 * Math.random())];
	message.answer(`${drugs[drug][Math.floor(Math.random()
		* drugs[drug].length)]}mg ${drug}`);
};
