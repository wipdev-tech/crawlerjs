module.exports = {
    normalizeURL,
    getURLsFromHTML,
    myCrawler,
    report
}

const { JSDOM } = require("jsdom")

/**
 * @param {string} u URL to normalize
 * @returns {string} Normalized URL
 */
function normalizeURL(u) {
    const url = new URL(u)
    return url.origin + url.pathname
}

/**
 * @param {string} htmlBody HTML body string
 * @param {string} baseURL Base URL of the site (will be prepended to relative URLs)
 * @returns {string[]} All found links as absolute URLs
 */
function getURLsFromHTML(htmlBody, baseURL) {
    function makeAbsoluteURL(url) {
        try {
            new URL(url)
            return url.replace(/\/+$/, "")
        } catch {
            return baseURL.replace(/\/+$/, "") + url.replace("about:blank", "");
        }
    }

    const dom = new JSDOM(htmlBody)
    const anchors = Array.from(dom.window.document.querySelectorAll('a'))
    return anchors.map(a => makeAbsoluteURL(a.href))
}


/**
 * @param {string} baseURL The base URL.
 * @returns {object} Counts of all crawled pages.
 */
async function myCrawler(baseURL) {
    const pages = {}

    pages[normalizeURL(baseURL)] = { count: 0, visited: false }

    let targetURL = baseURL
    let tryAgain = false

    do {
        tryAgain = false

        console.log(`Crawling URL ${targetURL}`)
        const URLs = await fetchURLs(targetURL, baseURL)
        pages[normalizeURL(targetURL)].visited = true

        // adding/incrementing URLs
        for (const u of URLs) {
            if (new URL(u).host != new URL(baseURL).host) {
                continue
            }

            const uNorm = normalizeURL(u)
            if (!pages.hasOwnProperty(uNorm)) {
                pages[uNorm] = { count: 0, visited: false }
            }

            pages[uNorm].count += 1
        }

        // checking if there is more URLs to crawl
        for (const page in pages) {
            if (!pages[page].visited) {
                tryAgain = true
                targetURL = page
                break
            }
        }

    } while (tryAgain)

    return pages
}

async function fetchURLs(targetURL, baseURL) {
    const fetchRes = await fetch(targetURL)

    if (!fetchRes.ok) {
        console.log("Error: could not fetch.")
    }
    if (!fetchRes.headers.get('content-type').includes('text/html')) {
        console.log("Error: response content type is not HTML")
    }

    const body = await fetchRes.text()
    const URLs = getURLsFromHTML(body, baseURL)

    return URLs
}


function report(pages) {
    const reportData = []

    for (p in pages) {
        reportData.push({ url: p, count: pages[p].count })
    }

    console.log("")
    console.log("---------- CRAWL REPORT ----------")
    console.log("")

    reportData
        .sort((a, b) => a.count > b.count ? -1 : 1)
        .forEach(({ url, count }) => {
            console.log(url)
            console.log(`${count} occurrences`)
            console.log("")
        })
}
