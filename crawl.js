module.exports = {
    normalizeUrl
}

function normalizeUrl(u) {
    url = new URL(u)
    return url.host + url.pathname
}
