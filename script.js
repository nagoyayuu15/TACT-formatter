console.log("Loading.....")
const NUM_OF_DAYS = 5;
const NUM_OF_PERIODS = 6;

const changeTable = () => {
    // サイトのボタンからサイト名、リンクを取得
    const topnav = document.getElementById("topnav");
    const links = topnav.getElementsByClassName('link-container');
    const siteLinkButtons = topnav.getElementsByClassName('Mrphs-sitesNav__menuitem ');
    const siteLinkButtonsList = Array.from(siteLinkButtons);
    // timeTableに時間割データを入れていく
    let timeTable = new Array(NUM_OF_DAYS).fill(null).map(() => new Array(NUM_OF_PERIODS).fill(null));
    // サイトボタン削除の関係で逆順で処理
    for (let i = links.length-1; i >= 0; i--) {
        const siteName = links.item(i).title;
        const lectureData = makeLectureData(siteName);
        const tagBtnName = lectureData.title;
        // 表に入れるボタンの作成
        const linkElement = document.createElement('a');
        linkElement.href = links.item(i).href;
        const spanElement = document.createElement('span');
        spanElement.textContent = tagBtnName;
        linkElement.appendChild(spanElement);
        if(lectureData.time!=null){
            timeTable[lectureData.time[0][0]][lectureData.time[0][1]] = linkElement;
            // ２時間目もあったら
            if(lectureData.time[1]!=null){
                timeTable[lectureData.time[1][0]][lectureData.time[1][1]] = linkElement;
            }
            siteLinkButtons.item(i).remove();
        }
        
    }
    
    // HTMLの書き換え
    topnav.insertBefore(makeTableHTML(timeTable),topnav.firstChild);
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

// 返す時間割表HTMLの作成
const makeTableHTML = (timeTable) => {
    const table = document.createElement('li');
    table.id = "timeTable";
    for(let i=0;i<NUM_OF_PERIODS;i++){
        const li = document.createElement('li');
        li.textContent = (i+1) + "限";
        table.appendChild(li);
        for (let j=0;j<NUM_OF_DAYS;j++){
            const li = document.createElement('li');
            if(timeTable[j][i]){
                li.appendChild(timeTable[j][i]);
            }
            table.appendChild(li);
        }
    }
return table;
};

// cssの適用
const applyCss = (table) =>{
    // table.className = "Mrphs-sitesNav__menuitem";
    
    table.style.display = "grid";
    table.style.width = "100%";
    table.style.gridTemplateColumns = "30px repeat("+NUM_OF_DAYS+", 1fr)";
    table.style.marginBottom = "10px";
    table.style.webkitAlignItems = "stretch";
    table.style.backgroundColor = "white";

    const links = table.querySelectorAll('li');
    links.forEach(link => {
        // link.className = "Mrphs-sitesNav__menuitem";
        link.style.webkitAlignItems = "center";
        link.style.alignItems = "center";
        link.style.textAlign = "center";
        link.style.border = "1px solid #ddd";
    });
    table.querySelectorAll('a').forEach(link => {
        // link.className = "link-container";
        
        link.style.textDecoration = "none";
        link.style.color = "#404040";
    });

};

changeTable();
