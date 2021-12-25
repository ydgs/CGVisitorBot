const { chromium } = require("playwright");

let random = 0 //Math.floor(Math.random() * 30);

let search_terms = [
    {
        "Subject": "Camping Tents",
        "Query": "camping tents allcamping-gears.com",
        "navbar_dropdown": "//*[@id='menu-item-8696']/a",
        "navbar_dropdown_id": "#menu-item-8696",
        "navbar_dropdown_items": "//*[@id='menu-item-7456']",
        "navbar_dropdown_items_id": "#menu-item-7456",
        "page_link": "https://allcamping-gears.com/camping-tents/",
        "first_related_blog_items": "//*[@id='post-4358']/div/div/div/section/div/div/div/section/div/div[3]/div/div[2]/div/p/a[1]",
        "second_related_blog_items": "//*[@id='post-4358']/div/div/div/section/div/div/div/section/div/div[3]/div/div[3]/div/p/a"
    },
    {
        "Subject": "Camping Backpacks",
        "Query": "camping backpacks allcamping-gears.com",
        "navbar_dropdown": "//*[@id='menu-item-8692']/a",
        "navbar_dropdown_id": "#menu-item-8692",
        "navbar_dropdown_items": "//*[@id='menu-item-7459']/a",
        "navbar_dropdown_items_id": "#menu-item-7459",
        "page_link": "https://allcamping-gears.com/camping-backpacks/",
        "first_related_blog_items": "//*[@id='post-5954']/div/div/div/section/div/div/div/section/div/div[3]/div/div[3]/div/p/a",
        "second_related_blog_items": "//*[@id='post-5954']/div/div/div/section/div/div/div/section/div/div[3]/div/div[4]/div/p/a"
    },
    {
        "Subject": "Camping Stoves",
        "Query": "camping stoves allcamping-gears.com",
        "navbar_dropdown": "//*[@id='menu-item-8697']/a",
        "navbar_dropdown_id": "#menu-item-8697",
        "navbar_dropdown_items": "//*[@id='menu-item-7461']/a",
        "navbar_dropdown_items_id": "#menu-item-7461",
        "page_link": "https://allcamping-gears.com/camping-stoves/",
        "first_related_blog_items": "//*[@id='post-6179']/div/div/div/section/div/div/div/section/div/div[3]/div/div[2]/div/p/a",
        "second_related_blog_items": "//*[@id='post-6179']/div/div/div/section/div/div/div/section/div/div[3]/div/div[3]/div/p/a"
    },
    {
        "Subject": "Camping Tables",
        "Query": "camping tables allcamping-gears.com",
        "navbar_dropdown": "//*[@id='menu-item-8698']/a",
        "navbar_dropdown_id": "#menu-item-8698",
        "navbar_dropdown_items": "//*[@id='menu-item-7463']/a",
        "navbar_dropdown_items_id": "#menu-item-7463",
        "page_link": "https://allcamping-gears.com/camping-tables-and-chairs/",
        "first_related_blog_items": "//*[@id='post-6310']/div/div/div/section/div/div/div/section/div/div[3]/div/div[2]/div/p/a",
        "second_related_blog_items": "//*[@id='post-6310']/div/div/div/section/div/div/div/section/div/div[3]/div/div[3]/div/p/a"
    }
];

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    /* ------------------------------------------------------------------------ */

    const searchQuery = `${search_terms[random].Query}`;

    const url = req.query.url || "https://google.com/";

    const browser =  await chromium.launch({ headless: true });

    const page = await browser.newPage();

    await page.goto(url);

    await page.waitForSelector('input[aria-label="Search"]', {visible: true});

    await page.type('input[aria-label="Search"]', searchQuery);

    await Promise.all([
        page.waitForNavigation(),
        page.keyboard.press("Enter"),
    ]);

    //await page.waitForSelector(".LC20lb", { visible: true });

    let CGWebsiteSearched = null;

    await page.waitForSelector("cite.iUh30");
    
    let searchResults = await page.$$("cite.iUh30");

    for await (const result of searchResults) {
        let website = await result.innerText()

        if (website.includes("allcamping-gears.com")) {
            
            CGWebsiteSearched = result;
        }
    }

    if (CGWebsiteSearched != null) {

        await CGWebsiteSearched.click();

        await scrollUpDown(page);


        await page.hover(search_terms[random].navbar_dropdown_id);

        await page.click(search_terms[random].navbar_dropdown_items_id);

        if (page.url().includes("#google_vignette")) {
            await page.goBack();
        }

        await page.hover(search_terms[random].navbar_dropdown_id);

        await page.click(search_terms[random].navbar_dropdown_items_id);

        // let el = await page.xpath('//*[@id="menu-item-8696"]');

        // await page.hover(el);

        //*[@id="menu-item-8696"]

    }

    /* ------------------------------------------------------------------------ */

    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : `This ${page.url()} HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.`;

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}

async function scrollUpDown(page) {

    let bottom = page.locator("#block-39");

    await bottom.scrollIntoViewIfNeeded();

    await page.waitForTimeout(3000);

    //let top = page.locator("[data-id='d66ca90']");
    let top = page.locator("#menu-item-343");

    await top.scrollIntoViewIfNeeded();

    await page.waitForTimeout(3000);
}

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}