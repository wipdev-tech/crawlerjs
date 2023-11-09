module.exports = {
    normalizeUrl,
    getUrlsFromHTML,
    crawlPage
}

const { JSDOM } = require("jsdom")

function normalizeUrl(u) {
    const url = new URL(u)
    return url.host + url.pathname
}

function getUrlsFromHTML(htmlBody, baseURL) {
    const dom = new JSDOM(htmlBody)
    const anchors = Array.from(dom.window.document.querySelectorAll('a'))
    return anchors.map(a => baseURL + a.href.replace("about:blank", ""))
}

function crawlPage(baseURL) {
    fetch(baseURL)
        .then(resp => {
            if (!resp.ok) {
                console.log("Error: could not fetch.")
                return
            }

            if (!resp.headers.get('content-type').includes('text/html')) {
                console.log("Error: response content type is not HTML")
                return
            }

            return resp.text()
        })
        .then(console.log)
        .catch("Something went wrong with fetching")
}
