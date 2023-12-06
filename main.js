$.get("./song-list.csv").then((rawText) => {
    const list = rawText.split("\n").map(a => a.split(","));

    // console.log(list);
    const songStyleSet = {};
    const songLangSet = {};
    let sum = 0;
    const fullList = [];
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
        let songComment = li[4].trim();
        let isNew = '';
        if (songComment.startsWith('new')) {
            songComment = songComment.replace("new", "");
            isNew = 'new';
        }
        fullList.push([songName, singer, songStyle, songLang, songComment, isNew]);
        songStyleSet[songStyle] = true;
        songLangSet[songLang] = true;
        sum++;
    });
    // const fullMap={};
    // fullList.forEach((li,i)=>{
    //     if(fullMap[li[0]]){
    //         console.log('repeat',i,fullMap[li[0]]);
    //     }
    //     fullMap[li[0]]=i;
    // });
    // console.log('fullMap',fullMap);
    shuffleArray(fullList);
    const upperCaseFullList = fullList.map((li) => {
        return li.map(a => a.toUpperCase());
    });
    // console.log('upperCaseFullList', upperCaseFullList);
    $("#song-count").text(sum)
    const tagList = Object.keys(songLangSet).concat(Object.keys(songStyleSet));
    const $tagContainer = $("#search-tag-container");
    tagList.forEach((li) => {
        $tagContainer.append($(`<div class="search-tag" data-tag="${li}">${li}</div>`))
    });
    // console.log(songStyleSet, songLangSet);
    const $search = $("#search");
    // console.log($search);
    const $clear = $("#search-clear");
    let searchKeyword;
    let searchKind;
    function onKey() {
        const text = $search.val().trim().toUpperCase();
        console.log('onKey', text);
        searchKeyword = text;
        if (text) {
            $clear.show();
        } else {
            $clear.hide();
        }
        filterList();
    }
    $clear.on('click', () => {
        $search.val("")
        onKey();
    });
    $search.on("input", onKey);
    $search.on("keyup", onKey);
    const $tbody = $("#song-list");

    function renderList(list) {
        $tbody.empty();
        const subList1 = [];
        const subList2 = [];
        list.forEach((li) => {
            if (li[5]) {
                subList1.push(li);//new
            } else {
                subList2.push(li);//new
            }
        });
        const finalList = subList1.concat(subList2);
        if (!list.length) {
            $tbody.append($(`<tr>
            <td style="text-align: center;
            font-size: 30px;" 
            colspan="6">歌单里没有诶～但还是可以去直播间点一下试试！
            </td>
            </tr>`))
            return;
        }
        console.log('finalList', finalList);
        finalList.forEach((li) => {
            $tbody.append($(`<tr class="song"><td>${li[5] ? '<span class="new-tag">NEW</span>' : ''}</td><td class="song-name">${li[0]}</td><td>${li[1]}</td><td>${li[2]}</td><td>${li[3]}</td><td>${li[4]}</td></tr>`))
        });
        console.log('subList1', subList1);
    }
    renderList(fullList);
    // console.log('fullList',fullList);
    $(".search-tag").on("click", function () {
        const $this = $(this);

        if ($this.hasClass("active")) {
            if ($this.hasClass("all")) {
                return;
            }
            $this.removeClass("active");
            $(".search-tag.all").addClass("active");
            searchKind = ''
        } else {
            $(".search-tag").removeClass('active');
            $this.addClass('active');
            searchKind = $this.data('tag');
        }



        filterList();

    });
    function filterList() {
        let currentList = fullList;
        if (searchKeyword) {
            const searchResultList = []
            upperCaseFullList.forEach((li, i) => {
                const found = li.some((section) => {
                    return section.includes(searchKeyword);
                });
                if (found) {
                    searchResultList.push(i);
                }
            });
            currentList = searchResultList.map(i => fullList[i])
        }
        if (searchKind) {
            currentList = currentList.filter((li) => {
                return li[2] === searchKind || li[3] === searchKind
            });
        }
        renderList(currentList);
    }
    $("body").on("click", ".song", function () {
        const songName = $(this).find("td.song-name").text()
        copySong(songName);
    });
    $("#random-song").on('click', () => {
        copySong(fullList[Math.floor(Math.random() * fullList.length)][0]);
    });
    function copySong(songName) {
        copyTextToClipboard('点歌 ' + songName)
        toast(`“${songName}”成功复制到剪贴板！`)
    }
});
function toast(content) {
    Toastify({
        text: content,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: isPC ? 'center' : "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function () { } // Callback after click
    }).showToast();
}
function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}