// グローバル変数
var $;

function kifPlayer(args) {
    if (kifPlayer.checkarguments(args) === false) {
        return;
    }

    // コントローラを表示する
    viewControl();

    $ = kifPlayer.SilverState(kifPlayer, kifPlayer.analyzekif(args.kif));

    if (args.myname && $.backname.indexOf(args.myname) === 0) {
        args.reverse = true;
    }

    $.effort = kifPlayer.normalization(args.start, $.totaleffort);
    $.allaspect = kifPlayer.build($.totalmove, $.initalaspect);
    $.data = { reverse: args.reverse };
    $.args = args;

    render($);

    return $.$kifPlayer;
}

kifPlayer.startup = function(event) {
    var el = document.querySelectorAll("[type='kif']");
    for (var i = 0; i < el.length; i++) {
        kifPlayer({
            el: el[i],
            kif: el[i].textContent,
            start: el[i].getAttribute("start"),
            reverse: el[i].hasAttribute("reverse"),
            comment: el[i].getAttribute("comment"),
            myname: el[i].getAttribute("myname")
        });
    }
};

kifPlayer.checkarguments = function(args) {
    args.kif = args.kif || "";
    args.kif = args.kif.trim();

    if (args.kif.match(/^https?:/) || args.kif.match(/\.kifu?$/i)) {
        kifPlayer.checkarguments.getFile(args);
        return false;
    }

    if (typeof args.el === "string") {
        args.el = document.querySelector(args.el);
    }

    args.start = Number(args.start || 0);
    args.reverse = Boolean(args.reverse);
    args.myname = String(args.myname);
};

kifPlayer.checkarguments.getFile = function(args) {
    var encode = args.kif.match(/\.kifu$/) ? "UTF-8" : "Shift_JIS";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", args.kif);
    xhr.timeout = 60 * 1000;
    xhr.onloadend = loadend;
    xhr.overrideMimeType("text/plain; charset=" + encode);
    xhr.send();

    function loadend(event) {
        args.kif = xhr.responseText;
        kifPlayer(args);
    }
};

kifPlayer.normalization = function(effort, totaleffort) {
    if (!effort || !totaleffort) {
        return 0;
    }
    if (effort < 0) {
        effort = totaleffort + effort + 1;
    }
    if (effort > totaleffort) {
        return totaleffort;
    }
    return effort;
};

kifPlayer.build = function(moves, initalaspect) {
    var allaspect = [];

    for (var i = 0; i < moves.length; i++) {
        allaspect[i] = [initalaspect];
        for (var j = 1; j < moves[i].length; j++) {
            allaspect[i].push(
                kifPlayer.build.aspects(moves[i][j], allaspect[i][j - 1])
            );
        }
    }

    return allaspect;
};

kifPlayer.build.aspects = function(move, previousaspect) {
    // move = {'effort','手番','手','駒','前X','前Y','後X','後Y','成り'};

    var aspect = kifPlayer.objectcopy(previousaspect);
    var turn = move.turn === "▲" ? "先手" : "後手";
    var piece = move.piece;

    var turnpiece = {
        歩: "と",
        香: "杏",
        桂: "圭",
        銀: "全",
        角: "馬",
        飛: "龍"
    };
    var re_reversetranslate = {
        と: "歩",
        杏: "香",
        圭: "桂",
        全: "銀",
        馬: "角",
        龍: "飛"
    };

    if (move.手 === "パス") {
        return aspect;
    }

    if (move.手 === "投了") {
        return aspect;
    }

    if (move.前X !== 0) {
        //駒を移動する場合
        aspect.piece[move.前Y][move.前X] = null;

        //駒が成る場合
        if (move.turnpiece) {
            piece = piece in turnpiece ? turnpiece[piece] : piece;
        }

        //駒を取る場合
        if (aspect.piece[move.後Y][move.後X]) {
            var getpiece = aspect.piece[move.後Y][move.後X].replace("_", "");
            getpiece =
                getpiece in re_reversetranslate
                    ? re_reversetranslate[getpiece]
                    : getpiece;
            aspect[turn + "の持駒"][getpiece]++;
        }
    } else {
        //駒を打つ場合
        aspect[turn + "の持駒"][piece]--;
    }

    if (turn === "後手") {
        piece += "_";
    }

    aspect.piece[move.後Y][move.後X] = piece;

    return aspect;
};

kifPlayer.analyzekif = function(kif) {
    var result = {};
    var temp = { aspect: [], m: [] };

    kif = kif.split(/\r?\n/);

    for (var i = 0; i < kif.length; i++) {
        kif[i] = kif[i].trim();
        if (kif[i].indexOf("#") === 0) {
            continue;
        } else if (kif[i].indexOf("|") === 0) {
            temp.aspect.push(kif[i]);
        } else if (kif[i].indexOf("：") > -1) {
            var info = kif[i].split("："); //手抜き
            temp[info[0]] = info[1];
        } else if (kif[i].indexOf("**Engines") === 0) {
            temp.parsed = true;
        } else if (kif[i] === "後手番" || kif[i] === "上手番") {
            temp.starturn = "後手";
        } else if (kif[i] === "先手番" || kif[i] === "下手番") {
            temp.starturn = "先手";
        } else if (kif[i].match(/effort＝\d/)) {
            temp.lastturn = kif[i];
        } else if (kif[i].match(/^[1\*]/)) {
            temp.move = kif.slice(i);
            break;
        }
    }

    result.firstname = temp.firstname || temp.下手 || "";
    result.backname = temp.backname || temp.上手 || "";
    result.starturn = kifPlayer.analyzekif.starturn(
        temp.starturn,
        temp.handicap
    );
    result.lastturn = kifPlayer.analyzekif.lastturn(temp.lastturn);
    result.handicap = kifPlayer.analyzekif.handicap(temp.handicap);
    result.evaluation = temp.parsed
        ? kifPlayer.analyzekif.evaluation(temp.move)
        : [];
    result.reader = temp.parsed
        ? kifPlayer.analyzekif.reader(temp.move)
        : ["-"];
    result.initalaspect = {
        駒: kifPlayer.analyzekif.aspect(temp.aspect, result.handicap),
        firstPiece: kifPlayer.analyzekif.持駒(
            temp.firstPiece || temp.下手の持駒
        ),
        backPiece: kifPlayer.analyzekif.持駒(temp.backPiece || temp.上手の持駒)
    };
    result.totalmove = kifPlayer.analyzekif.move(temp.move, result.starturn);
    result.totaleffort = result.totalmove[0].length - 1;
    result.change = 0;

    return result;
};

kifPlayer.analyzekif.starturn = function(kifstartturn, kifhandicap) {
    if (kifstartturn) {
        return kifstartturn;
    }
    if (kifhandicap && kifhandicap !== "平手") {
        return "後手";
    }
    return "先手";
};

kifPlayer.analyzekif.lastturn = function(lastturn) {
    if (!lastturn) {
        return;
    }
    var m = lastturn.match(/([１２３４５６７８９])(.)/);
    var fullwidthnumeric = {
        "１": "1",
        "２": "2",
        "３": "3",
        "４": "4",
        "５": "5",
        "６": "6",
        "７": "7",
        "８": "8",
        "９": "9"
    };
    var chinesnumeric = {
        一: "1",
        二: "2",
        三: "3",
        四: "4",
        五: "5",
        六: "6",
        七: "7",
        八: "8",
        九: "9"
    };

    return fullwidthnumeric[m[1]] + chinesnumeric[m[2]];
};

kifPlayer.analyzekif.handicap = function(kifhandicap) {
    var handicap = [
        "香落ち",
        "右香落ち",
        "角落ち",
        "飛車落ち",
        "飛香落ち",
        "二枚落ち",
        "三枚落ち",
        "四枚落ち",
        "五枚落ち",
        "左五枚落ち",
        "六枚落ち",
        "八枚落ち",
        "十枚落ち",
        "その他"
    ];
    return handicap.indexOf(kifhandicap) >= 0 ? kifhandicap : null; // "平手"はnullになる
};

kifPlayer.analyzekif.aspect = function(kifaspect, handicap) {
    if (kifaspect.length !== 9) {
        return handicap
            ? kifPlayer.analyzekif.aspect.handicap(handicap)
            : kifPlayer.analyzekif.aspect.normal();
    }

    var aspect = kifPlayer.analyzekif.aspect.no_piece();
    var isFirst = true;
    var x = 10;
    var translate = { 王: "玉", 竜: "龍" };

    for (var y = 0; y < 9; y++) {
        x = 10;
        var str = kifaspect[y];
        for (var i = 1; i < str.length; i++) {
            if (str[i] === " ") {
                isFirst = true;
                x -= 1;
                continue;
            } else if (str[i] === "v") {
                isFirst = false;
                x -= 1;
                continue;
            } else if (str[i] === "|") {
                break;
            } else if (str[i] === "・") {
                continue;
            }

            var piece = str[i];
            piece = piece in translate ? translate[piece] : piece;

            aspect[y + 1][x] = isFirst ? piece : piece + "_";
        }
    }

    return aspect;
};

kifPlayer.analyzekif.aspect.normal = function() {
    return {
        "1": {
            "9": "香_",
            "8": "桂_",
            "7": "銀_",
            "6": "金_",
            "5": "玉_",
            "4": "金_",
            "3": "銀_",
            "2": "桂_",
            "1": "香_"
        },
        "2": {
            "9": null,
            "8": "飛_",
            "7": null,
            "6": null,
            "5": null,
            "4": null,
            "3": null,
            "2": "角_",
            "1": null
        },
        "3": {
            "9": "歩_",
            "8": "歩_",
            "7": "歩_",
            "6": "歩_",
            "5": "歩_",
            "4": "歩_",
            "3": "歩_",
            "2": "歩_",
            "1": "歩_"
        },
        "4": {
            "9": null,
            "8": null,
            "7": null,
            "6": null,
            "5": null,
            "4": null,
            "3": null,
            "2": null,
            "1": null
        },
        "5": {
            "9": null,
            "8": null,
            "7": null,
            "6": null,
            "5": null,
            "4": null,
            "3": null,
            "2": null,
            "1": null
        },
        "6": {
            "9": null,
            "8": null,
            "7": null,
            "6": null,
            "5": null,
            "4": null,
            "3": null,
            "2": null,
            "1": null
        },
        "7": {
            "9": "歩",
            "8": "歩",
            "7": "歩",
            "6": "歩",
            "5": "歩",
            "4": "歩",
            "3": "歩",
            "2": "歩",
            "1": "歩"
        },
        "8": {
            "9": null,
            "8": "角",
            "7": null,
            "6": null,
            "5": null,
            "4": null,
            "3": null,
            "2": "飛",
            "1": null
        },
        "9": {
            "9": "香",
            "8": "桂",
            "7": "銀",
            "6": "金",
            "5": "玉",
            "4": "金",
            "3": "銀",
            "2": "桂",
            "1": "香"
        }
    };
};

kifPlayer.analyzekif.aspect.no_piece = function() {
    return {
        "1": {
            "9": null,
            "8": null,
            "7": null,
            "6": null,
            "5": null,
            "4": null,
            "3": null,
            "2": null,
            "1": null
        },
        "2": {
            "9": null,
            "8": null,
            "7": null,
            "6": null,
            "5": null,
            "4": null,
            "3": null,
            "2": null,
            "1": null
        },
        "3": {
            "9": null,
            "8": null,
            "7": null,
            "6": null,
            "5": null,
            "4": null,
            "3": null,
            "2": null,
            "1": null
        },
        "4": {
            "9": null,
            "8": null,
            "7": null,
            "6": null,
            "5": null,
            "4": null,
            "3": null,
            "2": null,
            "1": null
        },
        "5": {
            "9": null,
            "8": null,
            "7": null,
            "6": null,
            "5": null,
            "4": null,
            "3": null,
            "2": null,
            "1": null
        },
        "6": {
            "9": null,
            "8": null,
            "7": null,
            "6": null,
            "5": null,
            "4": null,
            "3": null,
            "2": null,
            "1": null
        },
        "7": {
            "9": null,
            "8": null,
            "7": null,
            "6": null,
            "5": null,
            "4": null,
            "3": null,
            "2": null,
            "1": null
        },
        "8": {
            "9": null,
            "8": null,
            "7": null,
            "6": null,
            "5": null,
            "4": null,
            "3": null,
            "2": null,
            "1": null
        },
        "9": {
            "9": null,
            "8": null,
            "7": null,
            "6": null,
            "5": null,
            "4": null,
            "3": null,
            "2": null,
            "1": null
        }
    };
};

kifPlayer.analyzekif.aspect.handicap = function(handicap) {
    var aspect = kifPlayer.analyzekif.aspect.normal();

    if (handicap === "香落ち") {
        aspect[1][1] = null;
    } else if (handicap === "右香落ち") {
        aspect[1][9] = null;
    } else if (handicap === "角落ち") {
        aspect[2][2] = null;
    } else if (handicap === "飛車落ち") {
        aspect[2][8] = null;
    } else if (handicap === "飛香落ち") {
        aspect[1][1] = null;
        aspect[2][8] = null;
    } else if (handicap === "二枚落ち") {
        aspect[2][2] = null;
        aspect[2][8] = null;
    } else if (handicap === "三枚落ち") {
        aspect[1][1] = null;
        aspect[2][2] = null;
        aspect[2][8] = null;
    } else if (handicap === "四枚落ち") {
        aspect[1][1] = null;
        aspect[1][9] = null;
        aspect[2][2] = null;
        aspect[2][8] = null;
    } else if (handicap === "五枚落ち") {
        aspect[1][1] = null;
        aspect[1][2] = null;
        aspect[1][9] = null;
        aspect[2][2] = null;
        aspect[2][8] = null;
    } else if (handicap === "左五枚落ち") {
        aspect[1][1] = null;
        aspect[1][8] = null;
        aspect[1][9] = null;
        aspect[2][2] = null;
        aspect[2][8] = null;
    } else if (handicap === "六枚落ち") {
        aspect[1][1] = null;
        aspect[1][2] = null;
        aspect[1][8] = null;
        aspect[1][9] = null;
        aspect[2][2] = null;
        aspect[2][8] = null;
    } else if (handicap === "八枚落ち") {
        aspect[1][1] = null;
        aspect[1][2] = null;
        aspect[1][3] = null;
        aspect[1][7] = null;
        aspect[1][8] = null;
        aspect[1][9] = null;
        aspect[2][2] = null;
        aspect[2][8] = null;
    } else if (handicap === "十枚落ち") {
        aspect[1][1] = null;
        aspect[1][2] = null;
        aspect[1][3] = null;
        aspect[1][4] = null;
        aspect[1][6] = null;
        aspect[1][7] = null;
        aspect[1][8] = null;
        aspect[1][9] = null;
        aspect[2][2] = null;
        aspect[2][8] = null;
    }

    return aspect;
};

kifPlayer.analyzekif.holding = function(kifholding) {
    var holding = { 歩: 0, 香: 0, 桂: 0, 銀: 0, 金: 0, 飛: 0, 角: 0 };

    if (kifholding === undefined || kifholding.match("なし")) {
        return holding;
    }

    var numeral = {
        一: 1,
        二: 2,
        三: 3,
        四: 4,
        五: 5,
        六: 6,
        七: 7,
        八: 8,
        九: 9,
        十: 10,
        十一: 11,
        十二: 12,
        十三: 13,
        十四: 14,
        十五: 15,
        十六: 16,
        十七: 17,
        十八: 18
    };
    var str = kifholding.split(/\s/);

    for (var i = 0; i < str.length; i++) {
        var piece = str[i][0];
        var num = str[i][1];

        if (piece in holding) {
            holding[piece] = num ? numeral[num] : 1;
        }
    }

    return holding;
};

kifPlayer.analyzekif.move = function(kif, starturn) {
    var totalmove = [[{ effort: 0, コメント: "" }]];
    var effort = 0;
    var change = 0;

    totalmove.changeeffort = [];
    if (!kif) {
        return totalmove;
    }

    for (var i = 0; i < kif.length; i++) {
        kif[i] = kif[i].trim();

        if (kif[i].indexOf("*") === 0 && totalmove[change][effort]) {
            //指し手コメント
            totalmove[change][effort].コメント +=
                kif[i].replace(/^\*/, "") + "\n";
        } else if (kif[i].match(/^\d/)) {
            effort++;
            kifPlayer.analyzekif.move.now(
                totalmove[change],
                kif[i],
                effort,
                starturn
            );
        } else if (kif[i].indexOf("変化：") === 0) {
            effort = Number(kif[i].match(/変化：(\d+)/)[1]);
            totalmove.push(totalmove[0].slice(0, effort));
            totalmove.changeeffort.push(effort);
            effort--;
            change++;
        }
    }

    return totalmove;
};

kifPlayer.analyzekif.move.now = function(totalmove, kif, effort, starturn) {
    var fullwidthnumeric = {
        "１": 1,
        "２": 2,
        "３": 3,
        "４": 4,
        "５": 5,
        "６": 6,
        "７": 7,
        "８": 8,
        "９": 9
    };
    var chinesnumeric = {
        一: 1,
        二: 2,
        三: 3,
        四: 4,
        五: 5,
        六: 6,
        七: 7,
        八: 8,
        九: 9
    };
    var lastview = [
        "中断",
        "投了",
        "持将棋",
        "千日手",
        "詰み",
        "切れ負け",
        "反則勝ち",
        "反則負け",
        "入玉勝ち"
    ];

    var turn = starturn === "先手" && effort % 2 === 1 ? "▲" : "△";
    var now = kif.split(/ +/)[1] || "";
    var m = now.match(
        /([１-９同])([一二三四五六七八九　])([^\(]+)(\((\d)(\d)\))?/
    );

    if (m) {
        //TODO
        totalmove.push({
            effort: effort,
            turn: turn,
            手: m[0],
            駒: m[3]
                .replace(/[打成]$/, "")
                .replace("成銀", "全")
                .replace("成桂", "圭")
                .replace("成香", "杏")
                .replace("王", "玉")
                .replace("竜", "龍"),
            前X: Number(m[5] || 0),
            前Y: Number(m[6] || 0),
            後X:
                m[1] === "同"
                    ? totalmove[effort - 1].後X
                    : fullwidthnumeric[m[1]],
            後Y:
                m[1] === "同" ? totalmove[effort - 1].後Y : chinesnumeric[m[2]],
            turnpiece: /成$/.test(m[3]),
            comment: ""
        });
    } else if (now === "パス") {
        totalmove.push({
            effort: effort,
            turn: turn,
            手: "パス",
            駒: "",
            前X: 0,
            前Y: 0,
            後X: 0,
            後Y: 0,
            turnpiece: false,
            comment: ""
        });
    } else if (now === "投了") {
        totalmove.push({
            effort: effort,
            turn: turn,
            手: "投了",
            駒: "",
            前X: 0,
            前Y: 0,
            後X: 0,
            後Y: 0,
            turnpiece: false,
            comment: ""
        });
    } else if (lastview.indexOf(now) >= 0) {
        totalmove.victory = kifPlayer.analyzekif.move.victory(now, turn);
    }
};

kifPlayer.analyzekif.move.victory = function(reason, turn) {
    var result = { winner: "", looser: "", reason: reason, view: "" };

    if (
        reason === "投了" ||
        reason === "詰み" ||
        reason === "切れ負け" ||
        reason === "反則負け"
    ) {
        result.winner = turn === "▲" ? "△" : "▲";
        result.looser = turn === "▲" ? "▲" : "△";
        result.view = result.looser + reason + "で" + result.winner + "の勝ち";
    } else if (reason === "反則勝ち" || reason === "入玉勝ち") {
        result.winner = turn === "▲" ? "▲" : "△";
        result.looser = turn === "▲" ? "△" : "▲";
        result.view = result.winner + reason;
    } else if (reason === "持将棋" || reason === "千日手") {
        result.winner = result.looser = "引き分け";
        result.view = reason + "で引き分け";
    } else if (reason === "中断") {
        result.view = reason;
    }

    return result;
};

kifPlayer.analyzekif.evaluation = function(kifmove) {
    var evaluation = [];

    for (var i = 0; i < kifmove.length; i++) {
        if (kifmove[i].indexOf("**解析 0 ") !== 0) {
            continue;
        }
        evaluation.push(kifmove[i].match(/評価値 (\S+)/)[1].replace(/↓|↑/, ""));
    }

    return evaluation;
};

kifPlayer.analyzekif.reader = function(kifmove) {
    var all_reader = ["-"];

    for (var i = 0; i < kifmove.length; i++) {
        if (kifmove[i].indexOf("**解析 0 ") !== 0) {
            continue;
        }
    }

    return all_reader;
};

kifPlayer.SilverState = function(app, $) {
    $ = $ || {};

    //プロパティ登録
    for (var name in app) {
        if (name.indexOf("$") !== 0) {
            continue;
        }

        var pos = name.lastIndexOf("_");
        if (pos === -1) {
            $[name] =
                typeof app[name] === "function" ? app[name].bind($) : app[name];
        } else {
            var $id = name.substring(0, pos);
            var prop = name.substring(pos + 1);

            if (!($id in $)) {
                $[$id] = {};
            }
            $[$id][prop] =
                typeof app[name] === "function" ? app[name].bind($) : app[name];
        }
    }

    return $;
};

kifPlayer.objectcopy = function(data) {
    var to = Array.isArray(data) ? [] : {};
    for (var key in data) {
        to[key] =
            data[key] instanceof Object
                ? kifPlayer.objectcopy(data[key])
                : data[key];
    }
    return to;
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", kifPlayer.startup);
} else {
    kifPlayer.startup();
}

function render($) {
    var effort = $.effort;
    var aspect = $.allaspect[$.change][effort];
    var move = $.totalmove[$.change][effort];
    var reverse = $.data.reverse;
    var firstname = reverse ? "後手" : "先手";
    var backname = reverse ? "先手" : "後手";

    var text;
    if (move.effort == 0) {
        text = "開始局面";
    } else {
        text = move.effort + "手目  " + move.turn + move.手;
    }

    //将棋盤クリア
    var piece = Snap("#board");
    piece.clear();

    //将棋盤描画
    renderBoard(
        $.firstname,
        $.backname,
        $.evaluation[effort],
        reverse,
        move.手
    );

    piece
        .g()
        .text(25, 550, text)
        .attr({
            fontSize: 17,
            fontFamily:
                "游明朝, YuMincho, ヒラギノ明朝 ProN W3, Hiragino Mincho ProN, ＭＳ Ｐ明朝, MS Mincho, serif",
            textAnchor: "centsr"
        });

    player = {
        black: {
            koma: piece.g().transform("translate(25, 520)"),
            capture: new Array()
        },
        white: {
            koma: piece.g().transform("translate(25, 73)"),
            capture: new Array()
        }
    };

    //先手持駒配置
    var firstPiece = "";
    for (var piece in aspect.firstPiece) {
        if (aspect.firstPiece[piece] != 0) {
            if (firstPiece != "") {
                firstPiece += " ";
            }
            firstPiece += piece + aspect.firstPiece[piece];
        }
    }
    if (firstPiece == "") {
        firstPiece = "なし";
    }

    //後手持駒配置
    var backPiece = "";
    for (var piece in aspect.backPiece) {
        if (aspect.backPiece[piece] != 0) {
            if (backPiece != "") {
                backPiece += " ";
            }
            backPiece += piece + aspect.backPiece[piece];
        }
    }
    if (backPiece == "") {
        backPiece = "なし";
    }

    var 上持駒 = backPiece;
    var 下持駒 = firstPiece;
    if (reverse) {
        上持駒 = firstPiece;
        下持駒 = backPiece;
    }

    // 持ち駒情報表示
    var pieceStyle = {
        fontSize: 21,
        fontFamily:
            "游明朝, YuMincho, ヒラギノ明朝 ProN W3, Hiragino Mincho ProN, ＭＳ Ｐ明朝, MS Mincho, serif",
        textAnchor: "left"
    };

    player.black.koma.text(0, 0, 下持駒).attr(pieceStyle);
    player.white.koma.text(0, 0, 上持駒).attr(pieceStyle);

    //駒配置 -start-
    for (var y in aspect.piece) {
        for (var x in aspect.piece[y]) {
            if (aspect.piece[y][x]) {
                var move_blackview = false;
                if (x == move.後X && y == move.後Y) {
                    move_blackview = true;
                }
                pieceDraw(aspect.piece[y][x], x, y, move_blackview, reverse);
            }
        }
    }
    //駒配置 -end-
}

function pieceDraw(piece, x, y, moveblack, reverse) {
    //筋を反転
    x = 10 - x;

    if (reverse) {
        x = 10 - x;
        y = 10 - y;
        piece = piece.match("_") ? piece.replace("_", "") : piece + "_";
    }

    var piece = Snap("#board").g();
    var 文字 = piece;
    if (piece.match("_")) {
        文字 = piece.replace("_", "");
    }

    var 筋 = 40 * x - 40 + 42;
    var 段 = 40 * y - 40 + 114;

    if (moveblack) {
        piece
            .g()
            .rect(筋 - 20, 段 - 16, 40, 40)
            .attr({
                fill: "#111111"
            });
    }

    var masu;
    if (piece.match("_")) {
        //後手
        masu = piece.g().transform(`translate(${筋}, ${段 + 8}) scale(-1, -1)`);
    } else {
        //先手
        masu = piece.g().transform(`translate(${筋}, ${段})`);
    }

    if (moveblack) {
        //差し手
        masu.text(0, 0, 文字).attr({
            textAnchor: "middle",
            fill: "#FFFFFF",
            dy: 16,
            fontSize: 31,
            fontFamily:
                "游明朝, YuMincho, ヒラギノ明朝 ProN W3, Hiragino Mincho ProN, ＭＳ Ｐ明朝, MS Mincho, serif"
        });
    } else {
        //差し手以外
        masu.text(0, 0, 文字).attr({
            textAnchor: "middle",
            fill: "#000000",
            dy: 16,
            fontSize: 31,
            fontFamily:
                "游明朝, YuMincho, ヒラギノ明朝 ProN W3, Hiragino Mincho ProN, ＭＳ Ｐ明朝, MS Mincho, serif"
        });
    }
}

// 以下、出力されたJSONを読み込むところ
function renderBoard(firstname, backname, evaluation, reverse, move) {
    var board = Snap("#board").g();
    //外枠色のみ
    board.rect(10, 78, 395, 390).attr({
        "touch-action": "manipulation",
        fill: "#FFE084"
    });
    //外枠色のみ
    board.rect(22, 37 + 60, 360, 360).attr({
        id: "ban",
        fill: "#FFE084",
        stroke: "#000000",
        strokeWidth: 3
    });

    if (firstname == "") {
        firstname = "先手";
    }
    if (backname == "") {
        backname = "後手";
    }

    var 上名称 = "△" + backname;
    var 下名称 = "▲" + firstname;
    if (reverse) {
        上名称 = "▲" + firstname;
        下名称 = "△" + backname;
    }

    var size = 22;
    board.text(20, 43, 上名称).attr({
        fontSize: size,
        fontFamily:
            "游明朝, YuMincho, ヒラギノ明朝 ProN W3, Hiragino Mincho ProN, ＭＳ Ｐ明朝, MS Mincho, serif",
        textAnchor: "left"
    });
    board.text(20, 490, 下名称).attr({
        fontSize: size,
        fontFamily:
            "游明朝, YuMincho, ヒラギノ明朝 ProN W3, Hiragino Mincho ProN, ＭＳ Ｐ明朝, MS Mincho, serif",
        textAnchor: "left"
    });

    //評価値を表示
    var evaluate_text = "評価値  -";
    if (move !== undefined && move !== "投了" && evaluation !== undefined) {
        var 情勢 = "";
        if (evaluation.match("詰")) {
            情勢 = "勝勢";
        } else {
            var 評価値数値;
            評価値数値 = evaluation.replace("-", "");
            if (0 <= 評価値数値 && 評価値数値 <= 300) {
                情勢 = "互角";
            } else if (301 <= 評価値数値 && 評価値数値 <= 800) {
                情勢 = "有利";
            } else if (801 <= 評価値数値 && 評価値数値 <= 1500) {
                情勢 = "優勢";
            } else if (1501 <= 評価値数値) {
                情勢 = "勝勢";
            } else {
                情勢 = "";
            }
        }

        var 先手後手;
        if (evaluation.match("-")) {
            先手後手 = "△後手";
        } else {
            先手後手 = "▲先手";
        }
        if (情勢 == "互角") {
            先手後手 = "";
        }
        evaluate_text = "評価値  " + 先手後手 + 情勢 + "(" + evaluation + ")";
    }

    var fontSize = 17;

    board.text(225, 550, evaluate_text).attr({
        fontSize: fontSize,
        fontFamily:
            "游明朝, YuMincho, ヒラギノ明朝 ProN W3, Hiragino Mincho ProN, ＭＳ Ｐ明朝, MS Mincho, serif",
        textAnchor: "left"
    });

    // 将棋盤を表示
    var text_n = new Array(
        "１",
        "２",
        "３",
        "４",
        "５",
        "６",
        "７",
        "８",
        "９"
    );
    var text_k = new Array(
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九"
    );
    if (reverse) {
        text_n = new Array(
            "９",
            "８",
            "７",
            "６",
            "５",
            "４",
            "３",
            "２",
            "１"
        );
        text_k = new Array(
            "九",
            "八",
            "七",
            "六",
            "五",
            "四",
            "三",
            "二",
            "一"
        );
    }
    for (var i = 0; i <= 8; i++) {
        //筋
        board.text(362 - 40 * i, 93, text_n[i]).attr({
            fontSize: 14,
            fontFamily:
                "游明朝, YuMincho, ヒラギノ明朝 ProN W3, Hiragino Mincho ProN, ＭＳ Ｐ明朝, MS Mincho, serif",
            "font-weight": "bold",
            textAnchor: "middle"
        });
        //段
        board.text(393, 120 + 40 * i, text_k[i]).attr({
            fontSize: 14,
            fontFamily:
                "游明朝, YuMincho, ヒラギノ明朝 ProN W3, Hiragino Mincho ProN, ＭＳ Ｐ明朝, MS Mincho, serif",
            "font-weight": "bold",
            textAnchor: "middle"
        });
    }
    for (var i = 1; i <= 8; i++) {
        //縦線
        board.line(22 + 40 * i, 97.5, 22 + 40 * i, 360 + 97.5).attr({
            strokeWidth: 1,
            stroke: "#000000"
        });
        //横線
        board.line(22, 97.5 + 40 * i, 380, 97.5 + 40 * i).attr({
            strokeWidth: 1,
            stroke: "#000000"
        });
    }
}

// コントロールボタン作成
function viewControl() {
    $(".shogiboard").append('<ul class="center-block">');
    $("ul").append(
        '<li class="material-icons ctlbtn" onclick="first()">first_page</li>'
    );
    $("ul").append(
        '<li class="material-icons ctlbtn" onclick="prev()">chevron_left</li>'
    );
    $("ul").append(
        '<li class="material-icons ctlbtn" onclick="next()">chevron_right</li>'
    );
    $("ul").append(
        '<li class="material-icons ctlbtn" onclick="last()">last_page</li>'
    );
    $("ul").append(
        '<li class="material-icons ctlbtn " onclick="reverse()">autorenew</li>'
    );
    $("ul").wrap('<div class="control" />');
}

var isDo = false;
$(document).on("touchend", "#board", function(event) {
    if (isDo) {
        event.preventDefault();
    } else {
        isDo = true;

        //var ele = document.querySelector('#board');
        var eleBan = document.querySelector("#ban");
        //var rect = ele.getBoundingClientRect();
        var rectBan = eleBan.getBoundingClientRect();

        if (
            rectBan.y <= event.clientY &&
            event.clientY <= rectBan.y + rectBan.height
        ) {
            if (
                rectBan.x <= event.clientY &&
                event.clientX <= rectBan.x + rectBan.width
            ) {
                if (event.clientX - rectBan.left < rectBan.width / 2) {
                    //1手戻るアイコンクリック関数
                    prev();
                } else {
                    //1手進むアイコンクリック関数
                    next();
                }
            }
        }

        isDo = false;
    }
});

//盤クリック関数
$(document).on("click", "#board", function(event) {
    // var ele = document.querySelector('#board');
    var eleBan = document.querySelector("#ban");
    // var rect = ele.getBoundingClientRect();
    var rectBan = eleBan.getBoundingClientRect();

    if (
        rectBan.y <= event.clientY &&
        event.clientY <= rectBan.y + rectBan.height
    ) {
        if (
            rectBan.x <= event.clientY &&
            event.clientX <= rectBan.x + rectBan.width
        ) {
            if (event.clientX - rectBan.left < rectBan.width / 2) {
                //1手戻るアイコンクリック関数
                prev();
            } else {
                //1手進むアイコンクリック関数
                next();
            }
        }
    }
});

//開始局面アイコンクリック関数
function first() {
    $.effort = 0;
    render($);
}

//1手戻るアイコンクリック関数
function prev() {
    if ($.effort > 0) {
        $.effort--;
        render($);
    }
}

//1手進むアイコンクリック関数
function next() {
    if ($.effort < $.totaleffort) {
        $.effort++;
        render($);
    }
}

//最終局面アイコンクリック関数
function last() {
    $.effort = $.totaleffort;
    render($);
}

//反転アイコンクリック関数
function reverse() {
    $.data.reverse = !$.data.reverse;
    render($);
}
