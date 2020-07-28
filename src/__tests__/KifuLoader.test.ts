import { KifuLoader } from "../ts/components/KifuLoader";

const loader = new KifuLoader();

it("Kif Format Test", () => {
    const withLineBreak = `# ---- Kifu for Windows95 V3.53 棋譜ファイル ----
開始日時：1999/07/15(木) 19:07:12
終了日時：1999/07/15(木) 19:07:17
手合割：平手
先手：先手の対局者名
後手：後手の対局者名
手数----指手---------消費時間-- # この行は、なくてもいい
   1 ７六歩(77)   ( 0:01/00:00:01)
   2 ３四歩(33)   ( 0:01/00:00:01)
   3 ２二角成(88) ( 0:13/00:00:14)
   4 同　銀(31)   ( 0:03/00:00:04)
   5 中断         ( 0:02/00:00:16)
まで4手で中断`;
    expect(loader.parseEvent(withLineBreak)).toEqual({
        startTime: "1999/07/15(木) 19:07:12",
        endTime: "1999/07/15(木) 19:07:17",
        handicap: "平手",
        nameSente: "先手の対局者名",
        nameGote: "後手の対局者名"
    });

    loader.loadKifu(withLineBreak);
    expect(loader.getMoves()).toEqual({
        history: [
            {
                x: 7,
                y: 6,
                beforeX: 7,
                beforeY: 7,
                piece: "FU",
                status: null
            },
            {
                x: 3,
                y: 4,
                beforeX: 3,
                beforeY: 3,
                piece: "FU",
                status: null
            },
            {
                x: 2,
                y: 2,
                beforeX: 8,
                beforeY: 8,
                piece: "UM",
                status: null
            },
            {
                x: 2,
                y: 2,
                beforeX: 3,
                beforeY: 1,
                piece: "GI",
                status: null
            },
            {
                x: null,
                y: null,
                beforeX: null,
                beforeY: null,
                piece: null,
                status: "CHUDAN"
            }
        ]
    });

    // next one
    loader.loadKifu(withLineBreak);
    loader.movePiece(1);
    expect(loader.getBoard()).toEqual([
        ["-KY", "-KE", "-GI", "-KI", "-OU", "-KI", "-GI", "-KE", "-KY"],
        ["*", "-HI", "*", "*", "*", "*", "*", "-KA", "*"],
        ["-FU", "-FU", "-FU", "-FU", "-FU", "-FU", "-FU", "-FU", "-FU"],
        ["*", "*", "*", "*", "*", "*", "*", "*", "*"],
        ["*", "*", "*", "*", "*", "*", "*", "*", "*"],
        ["*", "*", "+FU", "*", "*", "*", "*", "*", "*"],
        ["+FU", "+FU", "*", "+FU", "+FU", "+FU", "+FU", "+FU", "+FU"],
        ["*", "+KA", "*", "*", "*", "*", "*", "+HI", "*"],
        ["+KY", "+KE", "+GI", "+KI", "+OU", "+KI", "+GI", "+KE", "+KY"]
    ]);

    // next one
    loader.movePiece(1);
    expect(loader.getBoard()).toEqual([
        ["-KY", "-KE", "-GI", "-KI", "-OU", "-KI", "-GI", "-KE", "-KY"],
        ["*", "-HI", "*", "*", "*", "*", "*", "-KA", "*"],
        ["-FU", "-FU", "-FU", "-FU", "-FU", "-FU", "*", "-FU", "-FU"],
        ["*", "*", "*", "*", "*", "*", "-FU", "*", "*"],
        ["*", "*", "*", "*", "*", "*", "*", "*", "*"],
        ["*", "*", "+FU", "*", "*", "*", "*", "*", "*"],
        ["+FU", "+FU", "*", "+FU", "+FU", "+FU", "+FU", "+FU", "+FU"],
        ["*", "+KA", "*", "*", "*", "*", "*", "+HI", "*"],
        ["+KY", "+KE", "+GI", "+KI", "+OU", "+KI", "+GI", "+KE", "+KY"]
    ]);

    // next one
    loader.movePiece(1);
    expect(loader.getBoard()).toEqual([
        ["-KY", "-KE", "-GI", "-KI", "-OU", "-KI", "-GI", "-KE", "-KY"],
        ["*", "-HI", "*", "*", "*", "*", "*", "+UM", "*"],
        ["-FU", "-FU", "-FU", "-FU", "-FU", "-FU", "*", "-FU", "-FU"],
        ["*", "*", "*", "*", "*", "*", "-FU", "*", "*"],
        ["*", "*", "*", "*", "*", "*", "*", "*", "*"],
        ["*", "*", "+FU", "*", "*", "*", "*", "*", "*"],
        ["+FU", "+FU", "*", "+FU", "+FU", "+FU", "+FU", "+FU", "+FU"],
        ["*", "*", "*", "*", "*", "*", "*", "+HI", "*"],
        ["+KY", "+KE", "+GI", "+KI", "+OU", "+KI", "+GI", "+KE", "+KY"]
    ]);
    expect(loader.getPieceSente()).toEqual({
        KA: 1
    });

    // next one
    loader.movePiece(1);
    expect(loader.getBoard()).toEqual([
        ["-KY", "-KE", "-GI", "-KI", "-OU", "-KI", "*", "-KE", "-KY"],
        ["*", "-HI", "*", "*", "*", "*", "*", "-GI", "*"],
        ["-FU", "-FU", "-FU", "-FU", "-FU", "-FU", "*", "-FU", "-FU"],
        ["*", "*", "*", "*", "*", "*", "-FU", "*", "*"],
        ["*", "*", "*", "*", "*", "*", "*", "*", "*"],
        ["*", "*", "+FU", "*", "*", "*", "*", "*", "*"],
        ["+FU", "+FU", "*", "+FU", "+FU", "+FU", "+FU", "+FU", "+FU"],
        ["*", "*", "*", "*", "*", "*", "*", "+HI", "*"],
        ["+KY", "+KE", "+GI", "+KI", "+OU", "+KI", "+GI", "+KE", "+KY"]
    ]);
    expect(loader.getPieceGote()).toEqual({
        KA: 1
    });

    // previouse one
    loader.movePiece(-1);
    expect(loader.getBoard()).toEqual([
        ["-KY", "-KE", "-GI", "-KI", "-OU", "-KI", "-GI", "-KE", "-KY"],
        ["*", "-HI", "*", "*", "*", "*", "*", "+UM", "*"],
        ["-FU", "-FU", "-FU", "-FU", "-FU", "-FU", "*", "-FU", "-FU"],
        ["*", "*", "*", "*", "*", "*", "-FU", "*", "*"],
        ["*", "*", "*", "*", "*", "*", "*", "*", "*"],
        ["*", "*", "+FU", "*", "*", "*", "*", "*", "*"],
        ["+FU", "+FU", "*", "+FU", "+FU", "+FU", "+FU", "+FU", "+FU"],
        ["*", "*", "*", "*", "*", "*", "*", "+HI", "*"],
        ["+KY", "+KE", "+GI", "+KI", "+OU", "+KI", "+GI", "+KE", "+KY"]
    ]);
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
                piece: "FU"
            },
            {
                x: 8,
                y: 4,
                beforeX: 8,
                beforeY: 3,
                piece: "FU"
            },
            {
                x: 2,
                y: 5,
                beforeX: 2,
                beforeY: 6,
                piece: "FU"
            },
            {
                x: 8,
                y: 5,
                beforeX: 8,
                beforeY: 4,
                piece: "FU"
            },
            {
                x: 7,
                y: 6,
                beforeX: 7,
                beforeY: 7,
                piece: "FU"
            },
            {
                x: 3,
                y: 2,
                beforeX: 4,
                beforeY: 1,
                piece: "KI"
            },
            {
                x: 7,
                y: 7,
                beforeX: 8,
                beforeY: 8,
                piece: "KA"
            },
            {
                x: 3,
                y: 4,
                beforeX: 3,
                beforeY: 3,
                piece: "FU"
            },
            {
                x: 6,
                y: 8,
                beforeX: 7,
                beforeY: 9,
                piece: "GI"
            },
            {
                x: 7,
                y: 7,
                beforeX: 2,
                beforeY: 2,
                piece: "UM"
            },
            {
                x: 7,
                y: 7,
                beforeX: 6,
                beforeY: 8,
                piece: "GI"
            },
            {
                x: 2,
                y: 2,
                beforeX: 3,
                beforeY: 1,
                piece: "GI"
            },
            {
                x: 4,
                y: 8,
                beforeX: 6,
                beforeY: 9,
                piece: "GI"
            },
            {
                x: 6,
                y: 2,
                beforeX: 7,
                beforeY: 1,
                piece: "GI"
            },
            {
                x: 3,
                y: 6,
                beforeX: 3,
                beforeY: 7,
                piece: "FU"
            },
            {
                x: 3,
                y: 3,
                beforeX: 2,
                beforeY: 2,
                piece: "GI"
            },
            {
                x: 7,
                y: 8,
                beforeX: 6,
                beforeY: 9,
                piece: "KI"
            },
            {
                x: 6,
                y: 4,
                beforeX: 6,
                beforeY: 3,
                piece: "FU"
            },
            {
                x: 6,
                y: 8,
                beforeX: 5,
                beforeY: 9,
                piece: "OU"
            },
            {
                x: 6,
                y: 3,
                beforeX: 7,
                beforeY: 2,
                piece: "GI"
            },
            {
                x: null,
                y: null,
                beforeX: null,
                beforeY: null,
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

    loader.loadKifu(withLineBreak);
    expect(loader.getMoves()).toEqual({
        history: [
            {
                x: 2,
                y: 6,
                beforeX: 2,
                beforeY: 7,
                piece: "FU",
                status: null
            },
            {
                x: 3,
                y: 4,
                beforeX: 3,
                beforeY: 3,
                piece: "FU",
                status: null
            },
            {
                x: null,
                y: null,
                beforeX: null,
                beforeY: null,
                piece: null,
                status: "CHUDAN"
            }
        ]
    });
});
