import unirest from 'unirest';

export const search = options => new Promise((resolve, reject) => {
    console.log('Searching the web, with options: ', options);

    let api = 'WebSearchAPI';
    switch (options.type) {
        case 'image':
            api = 'ImageSearchAPI';
            break;
        case 'web':
            api = 'WebSearchAPI';
            break;
        case 'news':
            api = 'NewsSearchAPI';
            break;
    }
    const url = `https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/${api}`;

    const req = unirest('GET', url);

    req.query({
        "autoCorrect": "false",
        "pageNumber": "1",
        "pageSize": "10",
        "q": options.query,
        "safeSearch": "false"
    });

    req.headers({
        "x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
        "x-rapidapi-key": options.key
    });

    req.end(res => {
        if (res.error) return reject(res.error);
        return resolve(res.body);
    });
});
