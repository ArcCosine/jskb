import "../scss/style.scss";

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { KifuBoard } from './components/KifuBoard';
import { KifuLoader } from './components/KifuLoader';


const loader = new KifuLoader();
const withLineBreak = `開始日時：2020/07/23 10:00:00
終了日時：2020/07/23 21:56:00
棋戦：竜王戦
場所：関西将棋会館
持ち時間：５時間
消費時間：111▲274△299
手合割：平手
先手：久保利明 九段
後手：佐々木勇気 七段
戦型：四間飛車
手数----指手---------消費時間--
1 ７六歩(77) (00:00/00:00:00)
2 ８四歩(83) (00:00/00:00:00)
3 １六歩(17) (00:00/00:00:00)
4 １四歩(13) (00:00/00:00:00)
5 ７八銀(79) (00:00/00:00:00)
6 ６二銀(71) (00:00/00:00:00)
7 ６六歩(67) (00:00/00:00:00)
8 ３四歩(33) (00:00/00:00:00)
9 ６八飛(28) (00:00/00:00:00)
10 ４二玉(51) (00:00/00:00:00)
11 ３八銀(39) (00:00/00:00:00)
12 ５四歩(53) (00:00/00:00:00)
13 ５八金(69) (00:00/00:00:00)
14 ３二玉(42) (00:00/00:00:00)
15 ４六歩(47) (00:00/00:00:00)
16 ５二金(61) (00:00/00:00:00)
17 ４八玉(59) (00:00/00:00:00)
18 ５三銀(62) (00:00/00:00:00)
19 ３六歩(37) (00:00/00:00:00)
20 ８五歩(84) (00:00/00:00:00)
21 ７七角(88) (00:00/00:00:00)
22 ７四歩(73) (00:00/00:00:00)
23 ３九玉(48) (00:00/00:00:00)
24 ９四歩(93) (00:00/00:00:00)
25 ９六歩(97) (00:00/00:00:00)
26 ５五角(22) (00:00/00:00:00)
27 ４七金(58) (00:00/00:00:00)
28 ４四歩(43) (00:00/00:00:00)
29 ３七桂(29) (00:00/00:00:00)
30 ４三金(52) (00:00/00:00:00)
31 ６七銀(78) (00:00/00:00:00)
32 ３三桂(21) (00:00/00:00:00)
33 ２六歩(27) (00:00/00:00:00)
34 ２一玉(32) (00:00/00:00:00)
35 ２七銀(38) (00:00/00:00:00)
36 ３二金(41) (00:00/00:00:00)
37 ３八金(49) (00:00/00:00:00)
38 ４二銀(53) (00:00/00:00:00)
39 ２八玉(39) (00:00/00:00:00)
40 ６四角(55) (00:00/00:00:00)
41 ８八飛(68) (00:00/00:00:00)
42 ７三桂(81) (00:00/00:00:00)
43 ５六歩(57) (00:00/00:00:00)
44 ２二銀(31) (00:00/00:00:00)
45 ６五歩(66) (00:00/00:00:00)
46 同　桂(73) (00:00/00:00:00)
47 ５九角(77) (00:00/00:00:00)
48 ４五歩(44) (00:00/00:00:00)
49 ６六銀(67) (00:00/00:00:00)
50 ４六歩(45) (00:00/00:00:00)
51 ４八金(47) (00:00/00:00:00)
52 ５七桂成(65) (00:00/00:00:00)
53 同　銀(66) (00:00/00:00:00)
54 ４五桂(33) (00:00/00:00:00)
55 ６八角(59) (00:00/00:00:00)
56 ５七桂成(45) (00:00/00:00:00)
57 同　金(48) (00:00/00:00:00)
58 ７五歩(74) (00:00/00:00:00)
59 ４六金(57) (00:00/00:00:00)
60 ７六歩(75) (00:00/00:00:00)
61 ５五歩(56) (00:00/00:00:00)
62 同　歩(54) (00:00/00:00:00)
63 ３五歩(36) (00:00/00:00:00)
64 ４五歩打 (00:00/00:00:00)
65 同　金(46) (00:00/00:00:00)
66 ４四歩打 (00:00/00:00:00)
67 ４六金(45) (00:00/00:00:00)
68 ８六歩(85) (00:00/00:00:00)
69 同　歩(87) (00:00/00:00:00)
70 ６七銀打 (00:00/00:00:00)
71 ３四歩(35) (00:00/00:00:00)
72 ６八銀(67) (00:00/00:00:00)
73 同　飛(88) (00:00/00:00:00)
74 ３六歩打 (00:00/00:00:00)
75 同　金(46) (00:00/00:00:00)
76 ３五歩打 (00:00/00:00:00)
77 ２五金(36) (00:00/00:00:00)
78 ８六飛(82) (00:00/00:00:00)
79 ３三桂打 (00:00/00:00:00)
80 同　銀(42) (00:00/00:00:00)
81 同　歩成(34) (00:00/00:00:00)
82 同　銀(22) (00:00/00:00:00)
83 ３四歩打 (00:00/00:00:00)
84 ３六桂打 (00:00/00:00:00)
85 同　銀(27) (00:00/00:00:00)
86 同　歩(35) (00:00/00:00:00)
87 ３三歩成(34) (00:00/00:00:00)
88 同　金(43) (00:00/00:00:00)
89 ３四歩打 (00:00/00:00:00)
90 ３七歩成(36) (00:00/00:00:00)
91 同　金(38) (00:00/00:00:00)
92 ４五桂打 (00:00/00:00:00)
93 ３三歩成(34) (00:00/00:00:00)
94 ３七桂成(45) (00:00/00:00:00)
95 同　玉(28) (00:00/00:00:00)
96 ３三金(32) (00:00/00:00:00)
97 ３四歩打 (00:00/00:00:00)
98 ３六銀打 (00:00/00:00:00)
99 同　玉(37) (00:00/00:00:00)
100 ４五角打 (00:00/00:00:00)
101 ４七玉(36) (00:00/00:00:00)
102 ３四金(33) (00:00/00:00:00)
103 ２四桂打 (00:00/00:00:00)
104 ８七飛成(86) (00:00/00:00:00)
105 ７七歩打 (00:00/00:00:00)
106 ５六角(45) (00:00/00:00:00)
107 ３七玉(47) (00:00/00:00:00)
108 ３六歩打 (00:00/00:00:00)
109 ２八玉(37) (00:00/00:00:00)
110 ２二金打 (00:00/00:00:00)
111 １三桂打 (00:00/00:00:00)
112 投了 (00:00/00:00:00)`;
loader.loadKifu(withLineBreak);
ReactDOM.render(
  <KifuBoard loader={loader} />,
  document.getElementById("jskb")
);
