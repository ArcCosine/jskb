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

}
