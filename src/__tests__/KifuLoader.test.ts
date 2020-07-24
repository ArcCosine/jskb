import { KifuLoader } from "../ts/components/KifuLoader";

const loader = new KifuLoader();

it("fullWidthToNumber test", ()=>{
    expect(loader.fullWidthToNumber("０")).toEqual(0);
    expect(loader.fullWidthToNumber("９")).toEqual(9);
    expect(loader.fullWidthToNumber("あああ")).toEqual(-1);
})


it("charactorToNumber test", ()=>{
    expect(loader.charactorToNumber("〇")).toEqual(0);
    expect(loader.charactorToNumber("九")).toEqual(9);
    expect(loader.charactorToNumber("あああ")).toEqual(-1);
})

it("pieceCharactorToAlphabet test", ()=>{
    expect(loader.pieceCharactorToAlphabet("歩")).toEqual("FU");
    expect(loader.pieceCharactorToAlphabet("金")).toEqual("KI");
    expect(loader.pieceCharactorToAlphabet("成銀")).toEqual("NG");
    expect(loader.pieceCharactorToAlphabet("あああ")).toEqual("あああ");
})


it("statusCharactorToAlphabet test", ()=>{
    expect(loader.statusCharactorToAlphabet("投了")).toEqual("TORYO");
    expect(loader.statusCharactorToAlphabet("中断")).toEqual("CHUDAN");
    expect(loader.statusCharactorToAlphabet("持将棋")).toEqual("JISHOGI");
    expect(loader.statusCharactorToAlphabet("あああ")).toEqual("あああ");
})


it("Kif Format Test", () => {
    const withLineBreak = `# ---- Kifu for Windows95 V3.53 棋譜ファイル ----
開始日時：1999/07/15(木) 19:07:12
終了日時：1999/07/15(木) 19:07:17
手合割：平手
先手：先手の対局者名
後手：後手の対局者名
手数----指手---------消費時間-- # この行は、なくてもいい
1 ７六歩(77) ( 0:16/00:00:16)
2 ３四歩(33) ( 0:00/00:00:00)
3 中断 ( 0:03/ 0:00:19)`;
    expect(loader.parseEvent(withLineBreak)).toEqual({
        startTime: "1999/07/15(木) 19:07:12",
        endTime: "1999/07/15(木) 19:07:17",
        handicap: "平手",
        nameSente: "先手の対局者名",
        nameGote: "後手の対局者名"
    });

    expect(loader.parseMove(withLineBreak)).toEqual({
        history: [
            {
                x: 7,
                y: 6,
                beforeX: 7,
                beforeY: 7,
                reverse: false,
                piece: "FU"
            },
            {
                x: 3,
                y: 4,
                beforeX: 3,
                beforeY: 3,
                reverse: false,
                piece: "FU"
            },
            {
                x: null,
                y: null,
                beforeX: null,
                beforeY: null,
                reverse: null,
                piece: null,
                status: "CHUDAN"
            }
        ]
    });
});

/*it("Ki2 File Format Test", () => {
    const withLineBreak = `開始日時：2020/06/22 10:00:00
終了日時：2020/06/22 20:10:00
棋戦：竜王戦
場所：東京・将棋会館
持ち時間：５時間
消費時間：20▲211△277
手合割：平手
先手：居飛車先手
後手：居飛車後手
戦型：角換わりその他

▲２六歩 △８四歩 ▲２五歩 △８五歩 ▲７六歩 △３二金 ▲７七角 △３四歩 ▲６八銀 △７七角成
▲同　銀 △２二銀 ▲４八銀 △６二銀 ▲３六歩 △３三銀 ▲７八金 △６四歩 ▲６八玉 △６三銀
▲投了
まで20手で後手の勝ち`;
    expect(loader.parseEvent(withLineBreak)).toEqual({
        startTime: "2020/06/22 10:00:00",
        endTime: "2020/06/22 20:10:00",
        event: "竜王戦",
        site: "東京・将棋会館",
        timeLimit: "５時間",
        timeSpend: "20▲211△277",
        handicap: "平手",
        nameSente: "居飛車先手",
        nameGote: "居飛車後手",
        openning: "角換わりその他"
    });

    expect(loader.parseMove(withLineBreak)).toEqual({
        history: [
            {
                x: 2,
                y: 6,
                beforeX: 2,
                beforeY: 7,
                reverse: false,
                piece: "FU"
            },
            {
                x: 8,
                y: 4,
                beforeX: 8,
                beforeY: 3,
                reverse: false,
                piece: "FU"
            },
            {
                x: 2,
                y: 5,
                beforeX: 2,
                beforeY: 6,
                reverse: false,
                piece: "FU"
            },
            {
                x: 8,
                y: 5,
                beforeX: 8,
                beforeY: 4,
                reverse: false,
                piece: "FU"
            },
            {
                x: 7,
                y: 6,
                beforeX: 7,
                beforeY: 7,
                reverse: false,
                piece: "FU"
            },
            {
                x: 3,
                y: 2,
                beforeX: 4,
                beforeY: 1,
                reverse: false,
                piece: "KI"
            },
            {
                x: 7,
                y: 7,
                beforeX: 8,
                beforeY: 8,
                reverse: false,
                piece: "KA"
            },
            {
                x: 3,
                y: 4,
                beforeX: 3,
                beforeY: 3,
                reverse: false,
                piece: "FU"
            },
            {
                x: 6,
                y: 8,
                beforeX: 7,
                beforeY: 9,
                reverse: false,
                piece: "GI"
            },
            {
                x: 7,
                y: 7,
                beforeX: 2,
                beforeY: 2,
                reverse: true,
                piece: "UM"
            },
            {
                x: 7,
                y: 7,
                beforeX: 6,
                beforeY: 8,
                reverse: false,
                piece: "GI"
            },
            {
                x: 2,
                y: 2,
                beforeX: 3,
                beforeY: 1,
                reverse: false,
                piece: "GI"
            },
            {
                x: 4,
                y: 8,
                beforeX: 6,
                beforeY: 9,
                reverse: false,
                piece: "GI"
            },
            {
                x: 6,
                y: 2,
                beforeX: 7,
                beforeY: 1,
                reverse: false,
                piece: "GI"
            },
            {
                x: 3,
                y: 6,
                beforeX: 3,
                beforeY: 7,
                reverse: false,
                piece: "FU"
            },
            {
                x: 3,
                y: 3,
                beforeX: 2,
                beforeY: 2,
                reverse: false,
                piece: "GI"
            },
            {
                x: 7,
                y: 8,
                beforeX: 6,
                beforeY: 9,
                reverse: false,
                piece: "KI"
            },
            {
                x: 6,
                y: 4,
                beforeX: 6,
                beforeY: 3,
                reverse: false,
                piece: "FU"
            },
            {
                x: 6,
                y: 8,
                beforeX: 5,
                beforeY: 9,
                reverse: false,
                piece: "OU"
            },
            {
                x: 6,
                y: 3,
                beforeX: 7,
                beforeY: 2,
                reverse: false,
                piece: "GI"
            },
            {
                x: null,
                y: null,
                beforeX: null,
                beforeY: null,
                reverse: null,
                piece: null,
                status: "TORYO"
            }
        ]
    });
});
*/

it("CSA Format Test", () => {
    const withLineBreak = `'----------棋譜ファイルの例"example.csa"-----------------
'バージョン
V2.2
'対局者名
N+NAKAHARA
N-YONENAGA
'棋譜情報
'棋戦名
$EVENT:13th World Computer Shogi Championship
'対局場所
$SITE:KAZUSA ARC
'開始日時
$START_TIME:2003/05/03 10:30:00
'終了日時
$END_TIME:2003/05/03 11:11:05
'持ち時間:25分、切れ負け
$TIME_LIMIT:00:25+00
'戦型:矢倉
$OPENING:YAGURA
'平手の局面
P1-KY-KE-GI-KI-OU-KI-GI-KE-KY
P2 * -HI *  *  *  *  * -KA * 
P3-FU-FU-FU-FU-FU-FU-FU-FU-FU
P4 *  *  *  *  *  *  *  *  * 
P5 *  *  *  *  *  *  *  *  * 
P6 *  *  *  *  *  *  *  *  * 
P7+FU+FU+FU+FU+FU+FU+FU+FU+FU
P8 * +KA *  *  *  *  * +HI * 
P9+KY+KE+GI+KI+OU+KI+GI+KE+KY
'先手番
+
'指し手と消費時間
+2726FU
T12
-3334FU
T6
%CHUDAN
'---------------------------------------------------------`;
    expect(loader.parseEvent(withLineBreak)).toEqual({
        nameSente: "NAKAHARA",
        nameGote: "YONENAGA",
        event: "13th World Computer Shogi Championship",
        site: "KAZUSA ARC",
        startTime: "2003/05/03 10:30:00",
        endTime: "2003/05/03 11:11:05",
        timeLimit: "00:25+00",
        openning: "YAGURA"
    });

    expect(loader.parseMove(withLineBreak)).toEqual({
        history: [
            {
                x: 2,
                y: 6,
                beforeX: 2,
                beforeY: 7,
                reverse: false,
                piece: "FU"
            },
            {
                x: 3,
                y: 4,
                beforeX: 3,
                beforeY: 3,
                reverse: false,
                piece: "FU"
            },
            {
                x: null,
                y: null,
                beforeX: null,
                beforeY: null,
                reverse: null,
                piece: null,
                status: "CHUDAN"
            }
        ]
    });

});
