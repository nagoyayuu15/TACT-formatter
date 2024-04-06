console.log("Loading.....")
const NUM_OF_DAYS = 5;
const NUM_OF_PERIODS = 5;
document.documentElement.style.setProperty('--num-of-days', NUM_OF_DAYS);

topnav = document.getElementById("topnav");
topnavContainer = document.getElementById('topnav_container');
const main = () => {

    // timeTableに時間割データを入れていく
    const timeTableArray = makeTimeTableArray();

    createTableHTML(timeTableArray);
    // Comfortable Sakaiが勝手にサイトボタンを作らないようにtopnavのidを削除
    // topnav.setAttribute('id', '')
    return;
};

// サイト名から曜日・時限、授業名を取得
const makeLectureData = (siteName) => {
    const timeData = siteName.match(/\(\d\d\d\d年度(.+)\/(.+)\)/);
    // console.log(timeData);

    if (timeData === null) {
        return { term: null, time: null, title: siteName };
    }

    const termStr = timeData[1];
    let firstTerm = false;
    let secondTerm = false;
    if (termStr.length === 3) {
        switch (termStr[1]) {
            case "１":
                firstTerm = true;
                break;
            case "２":
                secondTerm = true;
                break;
        }
    } else {
        firstTerm = true;
        secondTerm = true;
    }
    if (timeData[2] === "その他") {
        return { term: { first: firstTerm, second: secondTerm }, time: null, title: siteName };
    }
    const title = siteName.replace(/\(\d\d\d\d年度.+\/.+$/, "");
    const time = timeData[2].split(",");
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
    return { term: { first: firstTerm, second: secondTerm }, time: timeProcessed, title: title };
};

const makeTimeTableArray = () => {
    let timeTableArray = new Array(2).fill(null).map(() => new Array(NUM_OF_DAYS).fill(null).map(() => new Array(NUM_OF_PERIODS).fill(null)));
    // サイトのボタンからサイト名、リンクを取得
    const links = topnav.getElementsByClassName('link-container');
    const siteLinkButtons = topnav.getElementsByClassName('Mrphs-sitesNav__menuitem ');
    // timeTableに時間割データを入れていく
    // サイトボタン削除の関係で逆順で処理
    let isTimeOverlap = false;
    for (let i = links.length - 1; i >= 0; i--) {
        const siteName = links.item(i).title;
        const lectureData = makeLectureData(siteName);
        // console.log(lectureData);
        const tagBtnName = lectureData.title;
        // 表に入れるボタンの作成
        const linkElement = document.createElement('a');
        linkElement.href = links.item(i).href;
        const spanElement = document.createElement('span');
        spanElement.textContent = tagBtnName;
        linkElement.appendChild(spanElement);
        if (lectureData.time != null) {
            let isAlready = false;
            if (lectureData.term.first) {
                for (let j = 0; j < lectureData.time.length; j++) {
                    // console.log(lectureData.time[j]);
                    if (timeTableArray[0][lectureData.time[j][0]][lectureData.time[j][1]] != null) {
                        isTimeOverlap = true;
                        isAlready = true;
                        continue;
                    }
                    timeTableArray[0][lectureData.time[j][0]][lectureData.time[j][1]] = linkElement.cloneNode(true);
                }


            }
            if (lectureData.term.second) {
                // 2期の場合は2期のボタンを作成
                for (let j = 0; j < lectureData.time.length; j++) {
                    // console.log(lectureData.time[j]);

                    if (timeTableArray[1][lectureData.time[j][0]][lectureData.time[j][1]] != null) {
                        isTimeOverlap = true;
                        isAlready = true;
                        continue;
                    }
                    timeTableArray[1][lectureData.time[j][0]][lectureData.time[j][1]] = linkElement.cloneNode(true);
                }

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
    return timeTableArray;
};

// 1/2期切り替えボタンの作成
const makePeriodButtons = (timeTableArray) => {
    const earlyPeriodButton = document.createElement('div');
    earlyPeriodButton.classList.add("periodButton");
    earlyPeriodButton.textContent = "1期";
    earlyPeriodButton.addEventListener('click', () => {
        // alert("1期");
        // データを保存
        chrome.storage.local.set({ isFirstTerm: true });

        updateTableHTML(timeTableArray);


    });
    const latePeriodButton = document.createElement('div');
    latePeriodButton.classList.add("periodButton");
    latePeriodButton.textContent = "2期";
    latePeriodButton.addEventListener('click', () => {
        // alert("2期");
        // データを保存
        chrome.storage.local.set({ isFirstTerm: false });

        updateTableHTML(timeTableArray);

    });
    chrome.storage.local.get(['isFirstTerm'], function (result) {
        if (result.isFirstTerm) {
            earlyPeriodButton.classList.add("periodButtonSelected");
        } else {
            latePeriodButton.classList.add("periodButtonSelected");
        }
    });
    const periodButtonContainer = document.createElement('div');
    periodButtonContainer.classList.add("periodButtonContainer");
    periodButtonContainer.appendChild(earlyPeriodButton);
    periodButtonContainer.appendChild(latePeriodButton);

    return periodButtonContainer;
};

// 返す時間割表HTMLの作成
const makeTableHTML = (timeTableArray, term) => {
    const table = document.createElement('div');
    table.id = "timeTable";
    const periodButtonContainer = makePeriodButtons(timeTableArray);
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
            if (timeTableArray[term][j][i]) {
                div.appendChild(timeTableArray[term][j][i].cloneNode(true));
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

const createTableHTML = (timeTableArray) => {
    const timeTableHTML = makeTableHTML(timeTableArray, 0);
    topnavContainer.style.display = "block";
    topnavContainer.insertBefore(timeTableHTML, topnav);
    addClass(timeTableHTML);
    return;
};

// 時間割表の更新するとき用
const updateTableHTML = (timeTableArray) => {
    // ここで時間割を更新する
    chrome.storage.local.get(['isFirstTerm'], function (result) {
        let term = 0;
        if (result.isFirstTerm) {
            term = 0;
        } else {
            term = 1;
        }
        console.log(term);

        // HTMLの書き換え
        const timeTableHTML = makeTableHTML(timeTableArray, term);
        const timeTable = document.getElementById("timeTable");
        timeTable.remove();
        topnavContainer.insertBefore(timeTableHTML, topnav);

        // Comfortable Sakaiがサイト名を読めるようにtableにclassを追加
        const table = document.getElementById("timeTable");
        addClass(table);
    });
    return;
};

main();
