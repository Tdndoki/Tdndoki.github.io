const fs = require("fs-extra");

async function main() {
    let raw = (await fs.readFile("./index0.html")).toString();
    const songList = (await fs.readFile("./song-list.csv")).toString();
    const bulletin = (await fs.readFile("./bulletin.txt")).toString().replace(/\n/g,'<br\/>');
    const replaceList = [replaceSonglist, replaceBulletin];
    raw = replaceMultiple(raw, replaceList);
    const indexTPL = raw.replace("./res/bg-hd.jpg", "https://ooo.0x0.ooo/2024/03/08/OyjoKN.jpg")
        .replace("./res/bg.jpg", "https://ooo.0x0.ooo/2024/03/08/OyjqSC.jpg");
    const indexTPLSingle = raw;

    await fs.writeFile("./index-tpl.html", indexTPL);
    await fs.writeFile("./index-tpl-single.html", indexTPLSingle);
    function replaceSonglist(input) {
        return input.replace(/<pre [\s\S]+?pre>/, `<pre id="csv" style="display:none;">${songList}</pre>`);
    }
    function replaceBulletin(input) {
        return input.replace(/<div id="intro-right">[\s\S]+?div>/, `<div id="intro-right">${bulletin}</div>`);
    }
    await fileReplace("./index.html", replaceList);
    await fileReplace("./index-single.html", replaceList);
}
async function fileReplace(filename, cbs) {
    let raw = (await fs.readFile(filename)).toString();
    raw = replaceMultiple(raw, cbs);
    await fs.writeFile(filename, raw);
}
function replaceMultiple(input, cbs) {
    cbs.forEach((cb) => {
        input = cb(input);
    });
    return input;
}
main();
