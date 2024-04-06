console.log("Loading.....")
const NUM_OF_DAYS = 5;
const NUM_OF_PERIODS = 5;
document.documentElement.style.setProperty('--num-of-days', NUM_OF_DAYS);

const changeTable = () => {
    // サイトのボタンからサイト名、リンクを取得
    const topnav = document.getElementById("topnav");
    const links = topnav.getElementsByClassName('link-container');
    const siteLinkButtons = topnav.getElementsByClassName('Mrphs-sitesNav__menuitem ');
    // timeTableに時間割データを入れていく
    let timeTableArray = new Array(NUM_OF_DAYS).fill(null).map(() => new Array(NUM_OF_PERIODS).fill(null));
    // サイトボタン削除の関係で逆順で処理
    let isTimeOverlap = false;
    for (let i = links.length - 1; i >= 0; i--) {
        const siteName = links.item(i).title;
        const lectureData = makeLectureData(siteName);
        const tagBtnName = lectureData.title;
        // 表に入れるボタンの作成
        const linkElement = document.createElement('a');
        linkElement.href = links.item(i).href;
        const spanElement = document.createElement('span');
        spanElement.textContent = tagBtnName;
        linkElement.appendChild(spanElement);
        if (lectureData.time != null) {
            let isAlready = false;
            for (let j = 0; j < lectureData.time.length; j++) {
                if (timeTableArray[lectureData.time[j][0]][lectureData.time[j][1]] != null) {
                    isTimeOverlap = true;
                    isAlready = true;
                    continue;
                }
                timeTableArray[lectureData.time[j][0]][lectureData.time[j][1]] = linkElement;
            }
            if (isAlready) {
                continue;
            }
            siteLinkButtons.item(i).remove();
        }
    }
    if (isTimeOverlap) {
        // 重複してたらアラートしようかと思ったけど、リロードの毎に出たらうざいのでやめた
        // alert("Error: 時間が重複している講義があります！");
    }
    // HTMLの書き換え
    const topnavContainer = document.getElementById('topnav_container');
    topnavContainer.style.display = "block";
    const timeTableHTML = makeTableHTML(timeTableArray)
    topnavContainer.insertBefore(timeTableHTML, topnav);

    // Comfortable Sakaiがサイト名を読めるようにtableにclassを追加
    const table = document.getElementById("timeTable");
    addClass(table);
    // Comfortable Sakaiが勝手にサイトボタンを作らないようにtopnavのidを削除
    topnav.setAttribute('id', '')
    // // データを保存
    // chrome.storage.local.set({ key: 'value' }, function () {
    //     console.log('Value is set to ' + 'value');
    // });

    // // データを取得
    // chrome.storage.local.get(['key'], function (result) {
    //     console.log('Value currently is ' + result.key);
    // });
    return;
};

// サイト名から曜日・時限、授業名を取得
const makeLectureData = (siteName) => {
    const timeDataStr = siteName.match(/\/.*\).*$/)
    // console.log(timeDataStr);
    if (timeDataStr === null || timeDataStr[0] === "/その他)") {
        return { time: null, title: siteName };
    }
    const timeData = timeDataStr[0].slice(1, -1);
    // console.log(timeData);
    const title = siteName.replace(/\(.+\).*$/, "");
    const time = timeData.split(",");
    // 曜日・時限の変換
    let timeProcessed = [];
    for (let i = 0; i < time.length; i++) {
        const severalTime = time[i];
        timeProcessed.push([]);
        switch (severalTime[0]) {
            case "月":
                timeProcessed[i].push(0);
                break;
            case "火":
                timeProcessed[i].push(1);
                break;
            case "水":
                timeProcessed[i].push(2);
                break;
            case "木":
                timeProcessed[i].push(3);
                break;
            case "金":
                timeProcessed[i].push(4);
                break;
            case "土":
                timeProcessed[i].push(5);
                break;
        }
        switch (severalTime[1]) {
            case "１":
                timeProcessed[i].push(0);
                break;
            case "２":
                timeProcessed[i].push(1);
                break;
            case "３":
                timeProcessed[i].push(2);
                break;
            case "４":
                timeProcessed[i].push(3);
                break;
            case "５":
                timeProcessed[i].push(4);
                break;
            case "６":
                timeProcessed[i].push(5);
                break;
            case "７":
                timeProcessed[i].push(6);
                break;
        }
    }
    return { time: timeProcessed, title: title };
};

const makePeriodButtons = () => {
    const earlyPeriodButton = document.createElement('div');
    earlyPeriodButton.classList.add("periodButton");
    earlyPeriodButton.textContent = "1期";
    const latePeriodButton = document.createElement('div');
    latePeriodButton.classList.add("periodButton");
    latePeriodButton.textContent = "2期";
    const periodButtonContainer = document.createElement('div');
    periodButtonContainer.classList.add("periodButtonContainer");
    periodButtonContainer.appendChild(earlyPeriodButton);
    periodButtonContainer.appendChild(latePeriodButton);

    return periodButtonContainer;
};

// 返す時間割表HTMLの作成
const makeTableHTML = (timeTableArray) => {
    const table = document.createElement('div');
    table.id = "timeTable";
    const periodButtonContainer = makePeriodButtons();
    table.appendChild(periodButtonContainer);
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add("emptyDiv");
    table.appendChild(emptyDiv);
    const div = document.createElement('div');
    table.appendChild(div);
    for (let i = 1; i < NUM_OF_DAYS + 1; i++) {
        const WEEK_LIST = ["月", "火", "水", "木", "金", "土"];
        const div = document.createElement('div');
        div.textContent = WEEK_LIST[i - 1];
        table.appendChild(div);
    }
    for (let i = 0; i < NUM_OF_PERIODS; i++) {
        const div = document.createElement('div');
        div.textContent = (i + 1) + "限";
        table.appendChild(div);
        for (let j = 0; j < NUM_OF_DAYS; j++) {
            const div = document.createElement('div');
            if (timeTableArray[j][i]) {
                div.appendChild(timeTableArray[j][i].cloneNode(true));
            }
            table.appendChild(div);
        }
    }
    return table;
};

// classを変更
const addClass = (table) => {
    table.classList.add("Mrphs-sitesNav__menu");
    const links = table.querySelectorAll('div');
    links.forEach(link => {
        link.classList.add("Mrphs-sitesNav__menuitem");
    });
    table.querySelectorAll('a').forEach(link => {
        link.classList.add("link-container");
    });
};

changeTable();
