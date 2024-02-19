console.log("Loading.....")

const changeTable = () => {
    // サイトのボタンからサイト名、リンクを取得
    const topnavContainer = document.getElementById("topnav-container");
    const topnav = document.getElementById("topnav");
    const links = topnav.getElementsByClassName('link-container');
    // buttonに時間割を入れていく
    let button = new Array(5).fill("").map(() => new Array(5).fill(""));
        for (let i = 0; i < links.length; i++) {
            const siteName = links.item(i).title;
            const lectureData = makeLectureData(siteName);
            const tagBtnName = lectureData.title;
            const tag = "<a href=" + links.item(i).href + ">" + "<span>" + tagBtnName + "</span>" + "</a>"
            if(lectureData.time!=null){
                button[lectureData.time[0][0]][lectureData.time[0][1]] = tag;
                if(lectureData.time[1]!=null){
                    button[lectureData.time[1][0]][lectureData.time[1][1]] = tag;
                }
            }
        }
        // HTMLの書き換え
        topnav.innerHTML = makeTable(button);
        // cssの書き換え
        const tablecss = document.querySelector(".timeTable");
        tablecss.style.display = "grid";
        tablecss.style.gridTemplateColumns = "repeat(5, 1fr)";


    };

// 返すhtmlの作成
const makeTable = (button) => {
    const headTable = "<div>月曜日</div><div>火曜日</div><div>水曜日</div><div>木曜日</div><div>金曜日</div>";
    let timeTable="";
    for(let i=0;i<5;i++){
        for (let j=0;j<5;j++){
            timeTable += "<div>" + button[j][i] + "</div>";
        }
    }

    return "<div class=\"timeTable\">" + headTable + timeTable + "</div>";
};

// サイト名から曜日・時限、授業名を取得
const makeLectureData = (siteName) => {
    const timeData = siteName.match(/\/.*\)$/);
    const title = siteName.replace(/\(.+\)$/, "");
    console.log(title);
    if (timeData === null || timeData[0] === "/その他)") {
        console.log("No TimeData");
        return [null, title];
    }
    console.log(timeData[0]);
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
        }
    }else{
        time.push(null);
    }
    return {time: time, title: title};
};

changeTable();