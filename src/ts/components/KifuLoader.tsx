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
    board: string[][];

    constructor() {
        this.initBoard();
    }

    initBoard(): void {
        this.board  = 
        [
            ["-KY","-KE","-GI","-KI","-OU","-KI","-GI","-KE","-KY"],
            ["*","-HI","*","*","*","*","*","-KA","*"],
            ["-FU","-FU","-FU","-FU","-FU","-FU","-FU","-FU","-FU"],
            ["*","*","*","*","*","*","*","*","*"],
            ["*","*","*","*","*","*","*","*","*"],
            ["*","*","*","*","*","*","*","*","*"],
            ["+FU","+FU","+FU","+FU","+FU","+FU","+FU","+FU","+FU"],
            ["*","+KA","*","*","*","*","*","+HI","*"],
            ["+KY","+KE","+GI","+KI","+OU","+KI","+GI","+KE","+KY"],
        ]
    }

    getBoard(): string[][] {
        return this.board;
    }

    transKifText(
        kifText: string | null,
        kifReg: RegExp,
        boardInfo: BoardInfoObject
    ): void {
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
            $OPENING: "openning"
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
                this.transKifText(kifLine, /^(.+?)：(.+)$/, boardInfo);
            }
            // Csa format
            if (kifLine.indexOf("$") > -1) {
                this.transKifText(kifLine, /^(\$.+?):(.+)$/, boardInfo);
            }
            // Csa player name format
            if (/N[+-]/.test(kifLine)) {
                this.transKifText(kifLine, /^(N[+-])(.+)$/, boardInfo);
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

    pieceCharactorToAlphabet(text:string | null): string {
        const charactorObject:Dictionary = {
            "歩" : "FU",
            "香" : "KY",
            "桂" : "KE",
            "銀" : "GI",
            "金" : "KI",
            "角" : "KA",
            "飛" : "HI",
            "王" : "OU",
            "玉" : "OU",
            "と" : "TO",
            "成香" : "NY",
            "成桂" : "NK",
            "成銀" : "NG",
            "馬" : "UM",
            "龍" : "RY"
        };

        return ( typeof charactorObject[text] !== 'undefined') ? charactorObject[text] : text;

    }

    statusCharactorToAlphabet(text:string | null): string {
        const charactorObject:Dictionary = {
            "投了" : "TORYO",
            "中断" :"CHUDAN",
            "千日手" : "SENNICHITE",
            "手番側が時間切れで負け" : "TIME_UP",
            "手番側の反則負け、反則の内容はコメントで記録する" : "ILLEGAL_MOVE",
            "先手(下手)の反則行為により、後手(上手)の勝ち":"+ILLEGAL_ACTION",
            "後手(上手)の反則行為により、先手(下手)の勝ち" :"-ILLEGAL_ACTION",
            "持将棋":"JISHOGI",
            "(入玉で)勝ちの宣言" : "KACHI",
            "(入玉で)引き分けの宣言" : "HIKIWAKE",
            "待った" : "MATTA",
            "詰み":"TSUMI",
            "不詰" : "FUZUMI",
            "エラー" : "ERROR"
        };
        return ( typeof charactorObject[text] !== 'undefined') ? charactorObject[text] : text;
    }

    parseMove(kif: string | null): Object {
        const kifArray: string[] = kif.split(/\r?\n/);
        const kifHistory: Object[] = [];

        kifArray.map(kifLine => {

            if( /^[△▲]/.test(kifLine) ){
            // Ki2 format
                const kifs: string[] = kifLine.split(' ');
                kifs.forEach( (kifText: string) =>{
                    const m = kifText.match(
                        /([１-９同])([一二三四五六七八九])([歩香桂銀金角飛王と成馬龍]+)/
                    );
                    if( m ){
                        const kifStatus: Object = {
                            x: this.fullWidthToNumber(m[1]),
                            y: this.charactorToNumber(m[2]),
                            beforeX: null,
                            beforeY: null,
                            reverse: false,
                            piece: this.pieceCharactorToAlphabet(m[3]),
                        };
                        kifHistory.push(kifStatus);
                    }
                })
            } else if (/[１-９同][一二三四五六七八九　]/.test(kifLine)) {
            // Kif format
                //<指し手> = [<手番>]<移動先座標><駒>[<装飾子>]<移動元座標>
                //７六歩(77)
                //+7776FU
                const m = kifLine.match(
                    /([１-９同])([一二三四五六七八九　])([歩香桂銀金角飛王と馬龍][成打寄引上右左直]?)\((\d)(\d)\)/
                );
                const kifStatus: Object = {
                    x: this.fullWidthToNumber(m[1]),
                    y: this.charactorToNumber(m[2]),
                    beforeX: parseInt(m[4],10),
                    beforeY: parseInt(m[5],10),
                    reverse: false,
                    piece: this.pieceCharactorToAlphabet(m[3]),
                };
                kifHistory.push(kifStatus);
            } else if(/^\d+ (中断|投了|持将棋|千日手|詰み|切れ負け|反則勝ち|反則負け|入玉勝ち)/.test(kifLine)){
                // Kif format status
                const m = kifLine.match(
                    /^\d+ (.+) \(/
                );
                const kifStatus: Object = {
                    x: null,
                    y: null,
                    beforeX: null,
                    beforeY: null,
                    reverse: null,
                    piece: null,
                    status: this.statusCharactorToAlphabet(m[1])
                };
                kifHistory.push(kifStatus);

            } else if (/^[+-].+/.test(kifLine)) {
            // Csa format
                const m = kifLine.match(
                    /([+-])(\d)(\d)(\d)(\d)(\w+)/
                );
                const kifStatus: Object = {
                    x: parseInt(m[4],10),
                    y: parseInt(m[5],10),
                    beforeX: parseInt(m[2],10),
                    beforeY: parseInt(m[3],10),
                    reverse: false,
                    piece: m[6],
                };
                kifHistory.push(kifStatus);
            } else if( /^%.+/.test(kifLine) ){
                // Csa format status
                const m = kifLine.match(
                    /^%(.+)$/
                );
                const kifStatus: Object = {
                    x: null,
                    y: null,
                    beforeX: null,
                    beforeY: null,
                    reverse: null,
                    piece: null,
                    status: m[1] 
                };
                kifHistory.push(kifStatus);
            }
        });

        return {
            history:kifHistory 
        };
    }
}
