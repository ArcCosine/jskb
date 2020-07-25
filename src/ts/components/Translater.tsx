export class Translater {

    counterNumberToCharactor(num: number | null): string {
        const numberCharactor = [
            "〇",
            "一",
            "二",
            "三",
            "四",
            "五",
            "六",
            "七",
            "八",
            "九"
        ];
        return typeof numberCharactor[num] !== "undefined"
            ? numberCharactor[num]
            : "";
    }

    counterNumberToFullWidth(num: number | null): string {
        const numberCharactor = [
            "０",
            "１",
            "２",
            "３",
            "４",
            "５",
            "６",
            "７",
            "８",
            "９"
        ];

        return typeof numberCharactor[num] !== "undefined"
            ? numberCharactor[num]
            : "";
    }

    pieceAlphabetToCharactor(text: string | null): string {

        const charactorObject: { [index: string]: string } = {
            FU: "歩",
            KY: "香",
            KE: "桂",
            GI: "銀",
            KI: "金",
            KA: "角",
            HI: "飛",
            "+OU": "王",
            "-OU": "玉",
            TO: "と",
            NY: "成香",
            NK: "成桂",
            NG: "成銀",
            UM: "馬",
            RY: "龍",
            "*" : ""
        };

        const key = /OU/.test(text) ? text : text.replace(/[+-]/,'');

        return typeof charactorObject[key] !== "undefined"
            ? charactorObject[key]
            : key;
    }

    fullWidthToNumber(text: string | null): number {
        return "０１２３４５６７８９".indexOf(text);
    }

    charactorToNumber(text: string | null): number {
        return "〇一二三四五六七八九".indexOf(text);
    }

    pieceCharactorToAlphabet(text:string | null): string {
        const charactorObject:{ [index: string]: string } = {
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
        const charactorObject:{ [index: string]: string } = {
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


}
