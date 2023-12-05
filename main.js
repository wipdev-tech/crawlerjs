const { crawlPage } = require('./crawl')

function main() {
    if (process.argv.length < 3) {
        console.log("Error: no arguments provided (need exactly 1)")
        return
    }

    if (process.argv.length > 3) {
        console.log("Error: too many arguments provided (need exactly 1)")
        return
    }

    const pages = crawlPage(process.argv[2], process.argv[2], {})
    console.log(pages)
}

main()
