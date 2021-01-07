const cheerio = require('cheerio');
const got = require('got');
const { CookieJar } = require('tough-cookie');
const { promisify } = require('util');

const main = async () => {
    try {
        if (process.argv.length < 3) {
            console.log('Please input fund name');
            return;
        }

        const fundName = process.argv[2].trim();
        const url = 'https://codequiz.azurewebsites.net';
        const cookieJar = new CookieJar();
        const setCookie = promisify(cookieJar.setCookie.bind(cookieJar));
        await setCookie('hasCookie=true', url);

        const response = await got(url, { cookieJar });
        const $ = cheerio.load(response.body)

        const btn = $('input[type=button]');
        if (btn.val() != 'Logout') {
            throw new Error("Something go wrong")
        }

        let fundNav = {};
        $('table > tbody > tr').each((index, element) => {
            const tds = $(element).find('td');
            const name = $(tds[0]).text().trim();
            const nav = $(tds[1]).text();
            fundNav[name] = nav;
        });

        const value = fundNav[fundName];
        console.log(value);

    } catch (error) {
        console.log(error);
    }
}

main();