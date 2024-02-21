console.log("Loading.....")
const NUM_OF_DAYS = 5;
const NUM_OF_PERIODS = 6;

const changeTable = () => {
    // サイトのボタンからサイト名、リンクを取得
    const topnav = document.getElementById("topnav");
    const links = topnav.getElementsByClassName('link-container');
    const siteLinkButtons = topnav.getElementsByClassName('Mrphs-sitesNav__menuitem ');
    // buttonに時間割データを入れていく
    let buttonList = new Array(NUM_OF_DAYS).fill("").map(() => new Array(NUM_OF_PERIODS).fill(""));
    let noTimeDataSitesHTML = ""
    for (let i = 0; i < links.length; i++) {
            const siteName = links.item(i).title;
            const lectureData = makeLectureData(siteName);
            const tagBtnName = lectureData.title;
            const tag = "<a href=" + links.item(i).href + ">" + "<span>" + tagBtnName + "</span>" + "</a>"
            if(lectureData.time!=null){
                buttonList[lectureData.time[0][0]][lectureData.time[0][1]] = tag;
                // ２時間目もあったら
                if(lectureData.time[1]!=null){
                    buttonList[lectureData.time[1][0]][lectureData.time[1][1]] = tag;
                }
            }else{
                noTimeDataSitesHTML += siteLinkButtons.item(i).outerHTML;
            }
        }
        // HTMLの書き換え
        topnav.innerHTML = makeTable(buttonList) + noTimeDataSitesHTML;
        // cssの書き換え
        const table = document.getElementById("timeTable");
        applyCss(table);
    };

// サイト名から曜日・時限、授業名を取得
const makeLectureData = (siteName) => {
    const timeData = siteName.match(/\/.*\).*$/);
    const title = siteName.replace(/\(.+\).*$/, "");
    if (timeData === null || timeData[0] === "/その他)") {
        return {time: null, title: title};
    }
    let time = [[]];
    // 曜日・時限の変換
    switch (timeData[0][1]){
        case "月":
            time[0].push(0);
            break;
        case "火":
            time[0].push(1);
            break;
        case "水":
            time[0].push(2);
            break;
        case "木":
            time[0].push(3);
            break;
        case "金":
            time[0].push(4);
            break;
        case "土":
            time[0].push(5);
            break;
    }
    switch (timeData[0][2]){
        case "１":
            time[0].push(0);
            break;
        case "２":
            time[0].push(1);
            break;
        case "３":
            time[0].push(2);
            break;
        case "４":
            time[0].push(3);
            break;
        case "５":
            time[0].push(4);
            break;
        case "６":
            time[0].push(5);
            break;
    }
    // ２時間以上の処理
    if(timeData[0][4] === ","){
        time.push([]);
        switch (timeData[0][5]){
            case "月":
                time[1].push(0);
                break;
            case "火":
                time[1].push(1);
                break;
            case "水":
                time[1].push(2);
                break;
            case "木":
                time[1].push(3);
                break;
            case "金":
                time[1].push(4);
                break;
            case "土":
                time[1].push(5);
                break;
        }
        switch (timeData[0][6]){
            case "１":
                time[1].push(0);
                break;
            case "２":
                time[1].push(1);
                break;
            case "３":
                time[1].push(2);
                break;
            case "４":
                time[1].push(3);
                break;
            case "５":
                time[1].push(4);
                break;
            case "６":
                time[1].push(5);
                break;
        }
    }else{
        time.push(null);
    }
    return {time: time, title: title};
};

// 返す時間割表の作成
const makeTable = (buttonList) => {
    const headTable = (NUM_OF_DAYS === 5) ? "<div></div><div>月曜日</div><div>火曜日</div><div>水曜日</div><div>木曜日</div><div>金曜日</div>" : "<div></div><div>月曜日</div><div>火曜日</div><div>水曜日</div><div>木曜日</div><div>金曜日</div><div>土曜日</div>";
    let timeTable="";
    for(let i=0;i<NUM_OF_PERIODS;i++){
        timeTable += "<div>" + (i+1) + "限</div>";
        for (let j=0;j<NUM_OF_DAYS;j++){
            
            timeTable += "<div>" + buttonList[j][i] + "</div>";
        }
    }
    return "<div id=\"timeTable\">" + headTable + timeTable + "</div>";
};

// cssの適用
const applyCss = (table) =>{
    table.style.display = "grid";
    table.style.width = "100%";
    table.style.gridTemplateColumns = "30px repeat("+NUM_OF_DAYS+", 1fr)";
    table.style.marginBottom = "10px";

    const links = table.querySelectorAll('div');
    links.forEach(link => {
        link.style.webkitAlignItems = "center";
        link.style.alignItems = "center";
        link.style.textAlign = "center";
        link.style.border = "1px solid #ddd";
    });
    table.querySelectorAll('a').forEach(link => {
        
        link.style.textDecoration = "none";
        link.style.color = "#404040";
    });

};

changeTable();
