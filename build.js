const fs = require("fs-extra");

async function main() {
    let raw = (await fs.readFile("./index0.html")).toString();
    const songList = (await fs.readFile("./song-list.csv")).toString();
    raw = raw.replace(`{{csv}}`, songList);
    const indexTPL = raw.replace("./res/bg-hd.jpg", "https://ooo.0x0.ooo/2024/03/08/OyjoKN.jpg")
        .replace("./res/bg.jpg", "https://ooo.0x0.ooo/2024/03/08/OyjqSC.jpg");
    const indexTPLSingle = raw;

    await fs.writeFile("./index-tpl.html", indexTPL);
    await fs.writeFile("./index-tpl-single.html", indexTPLSingle);
    function replace(input){
        return input.replace(/<pre [\s\S]+?pre>/, `<pre id="csv" style="display:none;">${songList}</pre>`);
    }
    await fileReplace("./index.html",replace);
    await fileReplace("./index-single.html",replace);
}
async function fileReplace(filename, cb) {
    let raw = (await fs.readFile(filename)).toString();
    const result = cb(raw);
    await fs.writeFile(filename, result);
}
main();
