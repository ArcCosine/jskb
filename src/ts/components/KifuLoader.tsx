interface Dictionary {
    [index: string]: string;
}

interface BoardInfoObject {
    // startTime: string;
    // endTime: string;
    // event: string;
    // openning: string;
    // title: string;
    // timeLimit: string;
    // timeSpend: string;
    // site: string;
    // published: string;
    // remarks: string;
    // nameSente: string;
    // nameGote: string;
    // handicap: string;
    [index: string]: string;
}

export class KifuLoader {
    parseEvent(kif: string | null): Dictionary {
        const boardInfo: BoardInfoObject = {};

        const bordInfoNames: Dictionary = {
            // KIF , KI2
            開始日時: "startTime",
            終了日時: "endTime",
            棋戦: "event",
            戦型: "openning",
            表題: "title",
            持ち時間: "timeLimit",
            消費時間: "timeSpend",
            場所: "site",
            掲載: "published",
            備考: "remarks",
            先手: "nameSente",
            後手: "nameGote",
            上手: "nameSente",
            下手: "nameGote",
            先手省略名: "nameSenteAbbreviation",
            後手省略名: "nameGoteAbbreviation",
            手合割: "handicap",
            // CSA
            "N+": "nameSente",
            "N-": "nameGote",
            $EVENT: "event",
            $SITE: "site",
            $START_TIME: "startTime",
            $END_TIME: "endTime",
            $TIME_LIMIT: "timeLimit",
            $OPENING: "openning",
        };

        const kifArray: string[] = kif.split(/\r?\n/);
        kifArray.map(kifLine => {
            // Kif format
            if (kifLine.indexOf("：") > -1) {
                const info: string[] = kifLine.split("：");
                const keyName = bordInfoNames[info[0]];
                boardInfo[keyName] = info[1];
            }
            // Csa format
            if (kifLine.indexOf("$") > -1) {
                const info: string[] = kifLine.match(/^(\$.+?):(.+)$/);
                const keyName = bordInfoNames[info[1]];
                boardInfo[keyName] = info[2];
            }
            if( /N[+-]/.test(kifLine) ){
                const info: string[] = kifLine.match(/^(N[+-])(.+)$/);
                const keyName = bordInfoNames[info[1]];
                boardInfo[keyName] = info[2];
            }
        });

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

        return boardInfo;
    }
}
