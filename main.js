$.get("./song-list.csv").then((rawText) => {
    const list = rawText.split("\n").map(a => a.split(","));
    console.log(list);
    const songStyleSet = {};
    const songLangSet = {};
    let sum = 0;
    list.forEach((li, i) => {
        if (i === 0 || !li) {
            return;
        }
        const songName = li[0].trim();
        if (!songName || songName === '歌手') {
            return;
        }
        const singer = li[1].trim();
        const songStyle = li[2].trim();
        const songLang = li[3].trim();
        const songComment = li[4].trim();

        songStyleSet[songStyle] = true;
        songLangSet[songLang] = true;
        sum++;
    });
    $("#song-count").text(sum)
    const tagList = Object.keys(songLangSet).concat(Object.keys(songStyleSet));
    const $tagContainer = $("#search-tag-container");
    console.log('tagList', tagList);
    tagList.forEach((li) => {
        $tagContainer.append($(`<div class="search-tag" data-tag="${li}">${li}</div>`))
    });
    console.log(songStyleSet, songLangSet);
    const $search = $("#search");
    console.log($search);
    const $clear = $("#search-clear");
    function onKey() {
        const text = $search.val();
        console.log('onKey', text);
        if (text) {
            $clear.show();
        } else {
            $clear.hide();
        }
    }
    $clear.on('click', () => {
        $search.val("")
        onKey();
    });
    $search.on("input", onKey);
    $search.on("keyup", onKey);
});