interface boardInfoObject {
    start_time: string;
    end_time: string;
    event: string;
    openning: string;
    title: string;
    time_limit: string;
    time_spend: string;
    site: string;
    published: string;
    remarks: string;
    name_plus: string;
    name_minus: string;
    player_info: string;
    [index: string] : string;
}


interface Dictionary {
  [index: string]: string;
}


export class KifuLoader {
    parseEvent(kif: string | null): Dictionary {
        const result: Dictionary = {};
        let boardInfo: boardInfoObject;
        // console.log(boardInfo);

        const names: Dictionary = {
            開始日時: "start_time",
            終了日時: "end_time",
            棋戦: "event",
            戦型: "openning",
            表題: "title",
            持ち時間: "time_limit",
            消費時間: "time_spend",
            場所: "site",
            掲載: "published",
            備考: "remarks",
            先手: "name_plus",
            後手: "name_minus",
            上手: "name_plus",
            下手: "name_minus",
            先手省略名: "name_plus_abbreviation",
            後手省略名: "name_minus_abbreviation",
            手合割: "player_info"
        };

        const kifArray: string[] = kif.split(/\r?\n/);
        kifArray.map(kifLine => {
            // Kif format
            if (kifLine.indexOf("：") > -1) {
                const info: string[] = kifLine.split("：");
                const keyName = names[info[0]];
                result[keyName] = info[1];
            }
            // Csa format
            if(kifLine.indexOf("$") > -1 ){
                const info: string[] = kifLine.split(":");
                const keyName = names[info[0]];
                result[keyName] = info[1];
            }
        });


        console.log(result);
        // result.firstname = temp.firstname || temp.下手 || "";
        // result.backname = temp.backname || temp.上手 || "";
        // result.starturn = kifPlayer.analyzekif.starturn(
        //     temp.starturn,
        //     temp.handicap
        // );
        // result.lastturn = kifPlayer.analyzekif.lastturn(temp.lastturn);
        // result.handicap = kifPlayer.analyzekif.handicap(temp.handicap);
        // result.evaluation = temp.parsed
        //     ? kifPlayer.analyzekif.evaluation(temp.move)
        //     : [];
        // result.reader = temp.parsed
        //     ? kifPlayer.analyzekif.reader(temp.move)
        //     : ["-"];
        // result.initalaspect = {
        //     駒: kifPlayer.analyzekif.aspect(temp.aspect, result.handicap),
        //     firstPiece: kifPlayer.analyzekif.持駒(
        //         temp.firstPiece || temp.下手の持駒
        //     ),
        //     backPiece: kifPlayer.analyzekif.持駒(temp.backPiece || temp.上手の持駒)
        // };
        // result.totalmove = kifPlayer.analyzekif.move(temp.move, result.starturn);
        // result.totaleffort = result.totalmove[0].length - 1;
        // result.change = 0;

        return result;
    }
}
