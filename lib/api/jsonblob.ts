import JSONBlobClient from 'jsonblob';

const JSONBLOB_ID = process.env['JSONBLOB_ID'];

const client = new JSONBlobClient(JSONBLOB_ID);

export const latest = () => new Promise((resolve, reject) => {
	client.getBlob(JSONBLOB_ID)
		.then(raw => resolve(raw))
		.catch(er => reject(er));
});

export const update = async (stringified : string) => {
	return await client.updateBlob(JSON.parse(stringified), JSONBLOB_ID);
};
