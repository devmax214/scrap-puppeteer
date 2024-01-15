import puppeteer from 'puppeteer';

const URL = 'https://huckberry.com/store/neru-design-works/category/p/84284-ono-kezuru';
const WAIT_SELECTOR = ".ProductHero.contained";
const QUERY = {
    category1: {
        "name_function": "querySelector",
        "content_function": ".ProductHero__breadcrumbs ul>li:first-child",
        "name_attribute": "innerText",
        "content_attribute": null,
        "structure": [],
    },
    category2: {
        "name_function": "querySelector",
        "content_function": ".ProductHero__breadcrumbs ul>li:nth-child(3)",
        "name_attribute": "innerText",
        "content_attribute": null,
        "structure": [],
    },
};

const run = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    const page = await browser.newPage();

    await page.goto(URL, {
        waitUntil: "domcontentloaded",
    });

    await page.waitForSelector(WAIT_SELECTOR);

    const result = await page.evaluate((query) => {
        const fetchQuery = (config) => {
            let value = '';
            try {
                const element = document[config.name_function](config.content_function);
                const attr = element[config.name_attribute];
                if (config.content_attribute) {
                    value = attr[config.content_attribute]();
                } else {
                    value = attr;
                }
            } catch (err) {
                console.log(err);
            }
            return value;
        };

        const category1 = fetchQuery(query.category1);
        const category2 = fetchQuery(query.category2);

        return { category1, category2 };
    }, QUERY);

    console.log(result);

    await browser.close();
};

run();