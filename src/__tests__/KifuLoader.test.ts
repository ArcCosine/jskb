import { KifuLoader } from "../ts/components/KifuLoader";

const loader = new KifuLoader();

it("Kif File Format Test 1", () => {
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
        start_time: "1999/07/15(木) 19:07:12",
        end_time: "1999/07/15(木) 19:07:17",
        player_info: "平手",
        name_plus: "先手の対局者名",
        name_minus: "後手の対局者名"
    });
});

it("Kif File Format Test 2", () => {
    const withLineBreak = `開始日時：2020/06/22 10:00:00
終了日時：2020/06/22 20:10:00
棋戦：竜王戦
場所：東京・将棋会館
持ち時間：５時間
消費時間：80▲211△277
手合割：平手
先手：居飛車先手
後手：居飛車後手
戦型：角換わりその他

▲２六歩 △８四歩 ▲２五歩 △８五歩 ▲７六歩 △３二金 ▲７七角 △３四歩 ▲６八銀 △７七角成
▲同　銀 △２二銀 ▲４八銀 △６二銀 ▲３六歩 △３三銀 ▲７八金 △６四歩 ▲６八玉 △６三銀
▲投了
まで20手で後手の勝ち`;
    expect(loader.parseEvent(withLineBreak)).toEqual({
        start_time: "2020/06/22 10:00:00",
        end_time: "2020/06/22 20:10:00",
        event: "竜王戦",
        site: "東京・将棋会館",
        time_limit: "５時間",
        time_spend: "20▲211△277",
        player_info: "平手",
        name_plus: "居飛車先手",
        name_minus: "居飛車後手",
        openning: "角換わりその他"
    });
});

it("CSA File Format Test 1", () => {
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
        name_plus: "NAKAHARA",
        name_minus: "YONENAG",
        event: "13th World Computer Shogi Championship",
        state: "KAZUSA ARC",
        start_time: "2003/05/03 10:30:00",
        end_time: "2003/05/03 11:11:05",
        time_limit: "00:25+00",
        openning: "YAGURA"
    });
});
