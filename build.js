const fs = require("fs-extra");

async function main() {
    let raw = (await fs.readFile("./index0.html")).toString();
    raw = raw.replace(`{{csv}}`, (await fs.readFile("./song-list.csv")).toString())
    const indexTPL = raw.replace("./res/bg-hd.jpg", "https://ooo.0x0.ooo/2024/03/08/OyjoKN.jpg")
        .replace("./res/bg.jpg", "https://ooo.0x0.ooo/2024/03/08/OyjqSC.jpg");
    const indexTPLSingle = raw;

    await fs.writeFile("./index-tpl.html", indexTPL);
    await fs.writeFile("./index-tpl-single.html", indexTPLSingle);
}
main();
