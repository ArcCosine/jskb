import { Translater } from "./Translater";

interface KifStatus {
    x: number;
    y: number;
    beforeX: number;
    beforeY: number;
    piece: string;
    status: string;
}

interface MoveHistory {
    history: KifStatus[];
}

interface boardInfo {
    [key: string]: string;
}

interface pieceStatus {
    [key: string]: number;
}

export class KifuLoader {
    board: string[][];
    pos: number;
    pieceSente: pieceStatus;
    pieceGote: pieceStatus;
    moves: MoveHistory;

    constructor() {
        this.initBoard();
        this.pieceGote = {};
        this.pieceSente = {};
        this.pos = -1;
    }

    initBoard(): void {
        this.board = [
            ["-KY", "-KE", "-GI", "-KI", "-OU", "-KI", "-GI", "-KE", "-KY"],
            ["*", "-HI", "*", "*", "*", "*", "*", "-KA", "*"],
            ["-FU", "-FU", "-FU", "-FU", "-FU", "-FU", "-FU", "-FU", "-FU"],
            ["*", "*", "*", "*", "*", "*", "*", "*", "*"],
            ["*", "*", "*", "*", "*", "*", "*", "*", "*"],
            ["*", "*", "*", "*", "*", "*", "*", "*", "*"],
            ["+FU", "+FU", "+FU", "+FU", "+FU", "+FU", "+FU", "+FU", "+FU"],
            ["*", "+KA", "*", "*", "*", "*", "*", "+HI", "*"],
            ["+KY", "+KE", "+GI", "+KI", "+OU", "+KI", "+GI", "+KE", "+KY"]
        ];
    }

    getBoard(): string[][] {
        return this.board;
    }

    getMoves(): MoveHistory {
        return this.moves;
    }

    getPieceSente(): pieceStatus {
        return this.pieceSente;
    }

    getPieceGote(): pieceStatus {
        return this.pieceGote;
    }

    getStatus(): string {
        return ( this.pos > -1 && this.moves["history"][this.pos].status ) ? this.moves["history"][this.pos].status : '';
    }


    updatePiece(boardPiece: string) : void {
        const translater = new Translater();

        const flatPiece = translater.reversePieceToTop(boardPiece.replace(/[-+]/, ""));
        if (boardPiece !== "*") {
            if (boardPiece.indexOf("-") > -1) {
                if (
                    typeof this.pieceSente[flatPiece] ===
                    "undefined"
                ) {
                    this.pieceSente[flatPiece] = 0;
                }
                this.pieceSente[flatPiece] = this.pieceSente[flatPiece] + 1;
            } else {
                if (
                    typeof this.pieceGote[flatPiece] === "undefined"
                ) {
                    this.pieceGote[flatPiece] = 0;
                }
                this.pieceGote[flatPiece] = this.pieceGote[flatPiece] + 1;
            }
        } 
    }


    movePiece(num: number): void {
        this.pos = this.pos + num;

        // initial status
        if (this.pos < -1) {
            this.pos = -1;
            return;
        }

        // end status
        if( this.pos > this.moves["history"].length -1){
            this.pos = this.pos - num;
            return;
        }

        if (num > 0) {
            // progress
            const moveData = this.moves["history"][this.pos];
            // console.error(moveData);
            const direction = this.pos % 2 !== 0 ? "-" : "+";
            if( moveData.x ){
                this.updatePiece(this.board[moveData.y - 1][9 - moveData.x]);
                this.board[moveData.y - 1][9 - moveData.x] =
                    direction + moveData.piece;
            }
            if( moveData.beforeX ){
                this.board[moveData.beforeY - 1][9 - moveData.beforeX] = "*";
            }
        } else {
            // back
            const moveData = this.moves["history"][this.pos + 1];
            // console.error(moveData);
            const direction = this.pos % 2 !== 0 ? "+" : "-";
            if( moveData.beforeX ){
                this.updatePiece(this.board[moveData.beforeY - 1][9 - moveData.beforeX]);
                this.board[moveData.beforeY - 1][9 - moveData.beforeX] =
                    direction + moveData.piece;
            }
            if( moveData.x ){
                this.board[moveData.y - 1][9 - moveData.x] = "*";
            }
            if( !moveData.beforeX ){
                // TODO
                console.log('Before Piece Prot');
            }
        }
    }

    loadKifu(kifText: string) {
        this.moves = this.parseMove(kifText);
        // console.log(this.moves);
    }

    parseEvent(kif: string | null): object {
        const translater = new Translater();

        const boardInfo: boardInfo = {};

        const kifArray: string[] = kif.split(/\r?\n/);
        kifArray.map(kifLine => {
            // Kif, Ki2 format
            if (kifLine.indexOf("：") > -1) {
                translater.transKifText(kifLine, /^(.+?)：(.+)$/, boardInfo);
            }
            // Csa format
            if (kifLine.indexOf("$") > -1) {
                translater.transKifText(kifLine, /^(\$.+?):(.+)$/, boardInfo);
            }
            // Csa player name format
            if (/N[+-]/.test(kifLine)) {
                translater.transKifText(kifLine, /^(N[+-])(.+)$/, boardInfo);
            }
        });

        return boardInfo;
    }

    parseMove(kif: string | null): MoveHistory {
        const kifArray: string[] = kif.split(/\r?\n/);
        const kifHistory: KifStatus[] = [];

        const translater = new Translater();

        kifArray.map(kifLine => {
            if (/^[△▲]/.test(kifLine)) {
                // Ki2 format
                const kifs: string[] = kifLine.split(" ");
                kifs.forEach((kifText: string) => {
                    const m = kifText.match(
                        /([１-９同])([一二三四五六七八九])([歩香桂銀金角飛王と成馬龍不]+)/
                    );
                    if (m) {
                        const kifStatus: KifStatus = {
                            x: translater.fullWidthToNumber(m[1]),
                            y: translater.charactorToNumber(m[2]),
                            beforeX: null,
                            beforeY: null,
                            piece: translater.pieceCharactorToAlphabet(m[3]),
                            status: null
                        };
                        kifHistory.push(kifStatus);
                    }
                });
            } else if (/[１-９同][一二三四五六七八九　]/.test(kifLine)) {
                // Kif format
                //<指し手> = [<手番>]<移動先座標><駒>[<装飾子>]<移動元座標>
                //７六歩(77)
                //+7776FU
                const m = kifLine.match(
                    /([１２３４５６７８９同])([一二三四五六七八九　])([歩香桂銀金角飛玉王と馬龍][不成打寄引上右左直]?) {0,}(\((\d)(\d)\))?/
                );

                let x = 0,
                    y = 0;

                if (m[1] === "同") {
                    x = kifHistory[kifHistory.length - 1].x;
                    y = kifHistory[kifHistory.length - 1].y;
                    const board = this.getBoard();
                    const boardPiece = board[y - 1][9 - x];
                    if (boardPiece !== "*") {
                        if (boardPiece.indexOf("-") > -1) {
                            const flatPiece = boardPiece.replace(/[-]/, "");
                            if (
                                typeof this.pieceSente[flatPiece] ===
                                "undefined"
                            ) {
                                this.pieceSente[flatPiece] = 0;
                            }
                            this.pieceSente[flatPiece] + 1;
                        } else {
                            const flatPiece = boardPiece.replace(/[+]/, "");
                            if (
                                typeof this.pieceGote[flatPiece] === "undefined"
                            ) {
                                this.pieceGote[flatPiece] = 0;
                            }
                            this.pieceGote[flatPiece] + 1;
                        }
                    }
                } else {
                    x = translater.fullWidthToNumber(m[1]);
                    y = translater.charactorToNumber(m[2]);
                }

                const kifStatus: KifStatus = {
                    x: x,
                    y: y,
                    beforeX:
                        typeof m[4] != "undefined" ? parseInt(m[5], 10) : null,
                    beforeY:
                        typeof m[4] != "undefined" ? parseInt(m[6], 10) : null,
                    piece: translater.pieceCharactorToAlphabet(m[3]),
                    status: null
                };
                kifHistory.push(kifStatus);
            } else if (
                /\d+ (中断|投了|持将棋|千日手|詰み|切れ負け|反則勝ち|反則負け|入玉勝ち)/.test(
                    kifLine
                )
            ) {
                // Kif format status
                const m = kifLine.match(/\d+ (.+) \(/);
                const kifStatus: KifStatus = {
                    x: null,
                    y: null,
                    beforeX: null,
                    beforeY: null,
                    piece: null,
                    status: translater.statusCharactorToAlphabet(m[1])
                };
                kifHistory.push(kifStatus);
            } else if (/^[+-].+/.test(kifLine)) {
                // Csa format
                const m = kifLine.match(/([+-])(\d)(\d)(\d)(\d)(\w+)/);
                const kifStatus: KifStatus = {
                    x: parseInt(m[4], 10),
                    y: parseInt(m[5], 10),
                    beforeX: parseInt(m[2], 10),
                    beforeY: parseInt(m[3], 10),
                    piece: m[6],
                    status: null
                };
                kifHistory.push(kifStatus);
            } else if (/^%.+/.test(kifLine)) {
                // Csa format status
                const m = kifLine.match(/^%(.+)$/);
                const kifStatus: KifStatus = {
                    x: null,
                    y: null,
                    beforeX: null,
                    beforeY: null,
                    piece: null,
                    status: m[1]
                };
                kifHistory.push(kifStatus);
            }
        });

        return {
            history: kifHistory
        };
    }
}
