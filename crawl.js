module.exports = {
    normalizeUrl,
    getUrlsFromHTML
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

