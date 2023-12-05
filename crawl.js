module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}

const { JSDOM } = require("jsdom")

/**
 * @param {string} u URL to normalize
 * @returns {string} Normalized URL
 */
function normalizeURL(u) {
    const url = new URL(u)
    return url.host + url.pathname
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
 * @param {string} currentURL The current URL.
 * @param {object} pages The pages object.
 * @returns {object} Counts of all crawled pages.
 */
function crawlPage(baseURL, currentURL, pages) {
    if (new URL(baseURL).host != new URL(currentURL).host) {
        return pages
    }

    const current = currentURL.replace(/\/+$/, "")
    const baseNorm = normalizeURL(baseURL)
    const currentNorm = normalizeURL(current)

    if (pages.hasOwnProperty(currentNorm)) {
        pages[currentNorm]++
        return pages
    } else if (currentNorm != baseNorm) {
        pages[currentNorm] = 1
    } else {
        pages[currentNorm] = 0
    }

    console.log(`Crawling URL ${currentNorm}`)

    try {
        fetch(current)
            .then(resp => {
                if (!resp.ok) {
                    console.log("Error: could not fetch.")
                } else if (!resp.headers.get('content-type').includes('text/html')) {
                    console.log("Error: response content type is not HTML")
                } else {
                    return resp.text()
                }
            })
            .then(body => {
                const URLs = getURLsFromHTML(body, baseURL)

                URLs.forEach(url => {
                    pages = crawlPage(baseURL, url, pages)
                })
            })
    } catch (error) {
        console.log("Error while fetching :( -- ", error.message)
    } finally {
        return pages
    }
}
