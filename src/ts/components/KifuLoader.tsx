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

interface MoveInfoObject {
    [index: string]: string;
}

export class KifuLoader {
    transKifText (kifText: string |null, kifReg: RegExp, boardInfo : BoardInfoObject ): void {
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


        const info: string[] = kifText.match(kifReg);
        const keyName = bordInfoNames[info[1]];
        boardInfo[keyName] = info[2];

    }
    parseEvent(kif: string | null): Dictionary {
        const boardInfo: BoardInfoObject = {};

        const kifArray: string[] = kif.split(/\r?\n/);
        kifArray.map(kifLine => {
            // Kif, Ki2 format
            if (kifLine.indexOf("：") > -1) {
                this.transKifText( kifLine, /^(.+?)：(.+)$/, boardInfo );
            }
            // Csa format
            if (kifLine.indexOf("$") > -1) {
                this.transKifText( kifLine, /^(\$.+?):(.+)$/, boardInfo );
            }
            // Csa player name format
            if( /N[+-]/.test(kifLine) ){
                this.transKifText( kifLine, /^(N[+-])(.+)$/, boardInfo );
            }
        });

        return boardInfo;
    }

    fullWidthToNumber(text: string | null): number {
        return "０１２３４５６７８９".indexOf(text);
    }

    charactorToNumber(text: string | null): number {
        return "〇一二三四五六七八九".indexOf(text);
    }


    parseMove(kif: string | null): Dictionary {
        const kifArray: string[] = kif.split(/\r?\n/);
        const moveInfo: MoveInfoObject= {};

        kifArray.map(kifLine => {
            // Kif format
            if (/([１-９])/.test(kifLine)) {
                //<指し手> = [<手番>]<移動先座標><駒>[<装飾子>]<移動元座標>
                //７六歩(77) 
                //+7776FU
                const m = kifLine.match(/([１-９同])([一二三四五六七八九])([歩香桂銀金角飛王と成馬龍]+)\((\d\d)\)/);
                console.log(m[4]);
                console.log(kifLine);
            }
            // Csa format
            //if (kifLine.indexOf() > -1) {
                //先後("+"、または"-")の後、移動前、移動後の位置、移動後の駒名、で表す。
            //}
        });

        return moveInfo;
    }
}
