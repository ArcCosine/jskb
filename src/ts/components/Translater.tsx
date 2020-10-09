interface boardInfo {
    [key: string]: string;
};


export class Translater {
    numberToCharactor(num: number | null): string {
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

    charactorToNumber(text: string | null): number {
        return "〇一二三四五六七八九".indexOf(text);
    }

    numberToFullWidth(num: number | null): string {
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

    fullWidthToNumber(text: string | null): number {
        return "０１２３４５６７８９".indexOf(text);
    }

    reversePieceToTop(text: string | null): string {
        const charactorObject:{ [index: string]: string } ={
            TO: "FU",
            NY: "KY",
            NK: "KE",
            NG: "GI",
            UM: "KA",
            RY: "HI"
        };

        return typeof charactorObject[text] !== "undefined"
            ? charactorObject[text]
            : text;
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
            NY: "杏",
            NK: "圭",
            NG: "全",
            UM: "馬",
            RY: "龍",
            "*": ""
        };

        const key = /OU/.test(text) ? text : text.replace(/[+-]/, "");

        return typeof charactorObject[key] !== "undefined"
            ? charactorObject[key]
            : key;
    }

    pieceCharactorToAlphabet(text: string | null): string {
        let transText = text;
        // special case
        if( transText.indexOf("成") > 0){

            const charactorObject: { [index: string]: string } = {
                "歩成" : "と",
                "香成": "杏",
                "桂成": "圭",
                "銀成": "全",
                "角成": "馬",
                "飛成": "龍",
            }
            transText = typeof charactorObject[transText] !== "undefined"
                ? charactorObject[transText]
                : text
        }

        // special case 2
        if( transText.indexOf("打") > 0 ){
            transText = transText.replace(/打/,'');
        }

        const charactorObject: { [index: string]: string } = {
            歩: "FU",
            香: "KY",
            桂: "KE",
            銀: "GI",
            金: "KI",
            角: "KA",
            飛: "HI",
            王: "OU",
            玉: "OU",
            と: "TO",
            杏: "NY",
            圭: "NK",
            全: "NG",
            馬: "UM",
            龍: "RY"
        };

        return typeof charactorObject[transText] !== "undefined"
            ? charactorObject[transText]
            : text;
    }

    statusCharactorToAlphabet(text: string | null): string {
        let transText = text.replace(/ +/g,'');

        const charactorObject: { [index: string]: string } = {
            投了: "TORYO",
            中断: "CHUDAN",
            千日手: "SENNICHITE",
            手番側が時間切れで負け: "TIME_UP",
            "手番側の反則負け、反則の内容はコメントで記録する": "ILLEGAL_MOVE",
            "先手(下手)の反則行為により、後手(上手)の勝ち": "+ILLEGAL_ACTION",
            "後手(上手)の反則行為により、先手(下手)の勝ち": "-ILLEGAL_ACTION",
            持将棋: "JISHOGI",
            "(入玉で)勝ちの宣言": "KACHI",
            "(入玉で)引き分けの宣言": "HIKIWAKE",
            待った: "MATTA",
            詰み: "TSUMI",
            不詰: "FUZUMI",
            エラー: "ERROR"
        };
        return typeof charactorObject[transText] !== "undefined"
            ? charactorObject[transText]
            : transText;
    }

    statusAlphabetToCharactor(text: string | null): string {
        let transText = text.replace(/ +/g,'');

        const charactorObject: { [index: string]: string } = {
            "TORYO": "投了",
            "CHUDAN" : "中断",
            "SENNICHITE": "千日手",
            "TIME_UP" : "手番側が時間切れで負け",
            "ILLEGAL_MOVE" : "手番側の反則負け、反則の内容はコメントで記録する",
            "+ILLEGAL_ACTION" : "先手(下手)の反則行為により、後手(上手)の勝ち" ,
            "-ILLEGAL_ACTION" :"後手(上手)の反則行為により、先手(下手)の勝ち",
            "JISHOGI" : "持将棋",
            "KACHI":"(入玉で)勝ちの宣言" ,
            "HIKIWAKE" : "(入玉で)引き分けの宣言",
            "MATTA" :"待った",
            "TSUMI" : "詰み",
            "FUZUMI" : "不詰",
            "ERROR" :"エラー:"
        };
        return typeof charactorObject[transText] !== "undefined"
            ? charactorObject[transText]
            : transText;
    }


    transKifText(
        kifText: string | null,
        kifReg: RegExp,
        boardInfo: boardInfo
    ): void {
        const boardInfoNames:boardInfo = {
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
        boardInfo[boardInfoNames[info[1]]] = info[2];
    }
}
