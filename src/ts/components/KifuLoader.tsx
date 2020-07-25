import { Translater } from "./Translater";

interface Dictionary {
    [index: string]: string;
}

interface KifStatus {
    x: number;
    y: number;
    beforeX: number;
    beforeY: number;
    piece: string;
    reverse: boolean;
    status: string;
}

interface MoveHistory {
    history: KifStatus[];
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
    pos: number;
    moves: MoveHistory;

    constructor() {
        this.initBoard();
        this.pos = -1;
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

    getMoves(): MoveHistory {
        return this.moves;
    }

    movePiece(num:number): void {
        this.pos = this.pos + num;
        const direction = (this.pos % 2 !== 0) ? '-' : '+'
        const moveData = this.moves["history"][this.pos];
        this.board[moveData.y-1][9-moveData.x] = direction + moveData.piece;
        this.board[moveData.beforeY-1][9-moveData.beforeX] = '*';
    }

    loadKifu( kifText:string ){
        this.moves = this.parseMove(kifText);
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


    parseMove(kif: string | null): MoveHistory {
        const kifArray: string[] = kif.split(/\r?\n/);
        const kifHistory: KifStatus[] = [];

        const translater = new Translater;

        kifArray.map(kifLine => {

            if( /^[△▲]/.test(kifLine) ){
            // Ki2 format
                const kifs: string[] = kifLine.split(' ');
                kifs.forEach( (kifText: string) =>{
                    const m = kifText.match(
                        /([１-９同])([一二三四五六七八九])([歩香桂銀金角飛王と成馬龍]+)/
                    );
                    if( m ){
                        const kifStatus: KifStatus = {
                            x: translater.fullWidthToNumber(m[1]),
                            y: translater.charactorToNumber(m[2]),
                            beforeX: null,
                            beforeY: null,
                            reverse: false,
                            piece: translater.pieceCharactorToAlphabet(m[3]),
                            status: null,
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
                    /([１２３４５６７８９同])([一二三四五六七八九　])([歩香桂銀金角飛玉王と馬龍][成打寄引上右左直]?)(\((\d)(\d)\))?/
                );
                const kifStatus: KifStatus = {
                    x: translater.fullWidthToNumber(m[1]),
                    y: translater.charactorToNumber(m[2]),
                    beforeX: typeof m[4] != 'undefined' ? parseInt(m[5],10) : null,
                    beforeY: typeof m[4] != 'undefined' ? parseInt(m[6],10) : null,
                    reverse: false,
                    piece: translater.pieceCharactorToAlphabet(m[3]),
                    status: null
                };
                kifHistory.push(kifStatus);
            } else if(/^\d+ (中断|投了|持将棋|千日手|詰み|切れ負け|反則勝ち|反則負け|入玉勝ち)/.test(kifLine)){
                // Kif format status
                const m = kifLine.match(
                    /^\d+ (.+) \(/
                );
                const kifStatus: KifStatus = {
                    x: null,
                    y: null,
                    beforeX: null,
                    beforeY: null,
                    reverse: null,
                    piece: null,
                    status: translater.statusCharactorToAlphabet(m[1])
                };
                kifHistory.push(kifStatus);

            } else if (/^[+-].+/.test(kifLine)) {
            // Csa format
                const m = kifLine.match(
                    /([+-])(\d)(\d)(\d)(\d)(\w+)/
                );
                const kifStatus: KifStatus = {
                    x: parseInt(m[4],10),
                    y: parseInt(m[5],10),
                    beforeX: parseInt(m[2],10),
                    beforeY: parseInt(m[3],10),
                    reverse: false,
                    piece: m[6],
                    status: null,
                };
                kifHistory.push(kifStatus);
            } else if( /^%.+/.test(kifLine) ){
                // Csa format status
                const m = kifLine.match(
                    /^%(.+)$/
                );
                const kifStatus: KifStatus = {
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
