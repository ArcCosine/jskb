import { Translater } from "../ts/components/Translater";

const translater = new Translater();

it("pieceAlphabetToCharactor test", () => {
    expect(translater.pieceAlphabetToCharactor("FU")).toEqual("歩");
    expect(translater.pieceAlphabetToCharactor("+OU")).toEqual("王");
    expect(translater.pieceAlphabetToCharactor("あああ")).toEqual("あああ");
});

it("counterNumberToCharactor test", () => {
    expect(translater.counterNumberToCharactor(0)).toEqual("〇");
    expect(translater.counterNumberToCharactor(9)).toEqual("九");
    expect(translater.counterNumberToCharactor(-1)).toEqual("");
    expect(translater.counterNumberToCharactor(-11)).toEqual("");
});

it("counterNumberToFullWidth test", () => {
    expect(translater.counterNumberToFullWidth(0)).toEqual("０");
    expect(translater.counterNumberToFullWidth(9)).toEqual("９");
    expect(translater.counterNumberToFullWidth(-1)).toEqual("");
    expect(translater.counterNumberToFullWidth(11)).toEqual("");
});

it("fullWidthToNumber test", () => {
    expect(translater.fullWidthToNumber("０")).toEqual(0);
    expect(translater.fullWidthToNumber("９")).toEqual(9);
    expect(translater.fullWidthToNumber("あああ")).toEqual(-1);
});

it("charactorToNumber test", () => {
    expect(translater.charactorToNumber("〇")).toEqual(0);
    expect(translater.charactorToNumber("九")).toEqual(9);
    expect(translater.charactorToNumber("あああ")).toEqual(-1);
});

it("pieceCharactorToAlphabet test", () => {
    expect(translater.pieceCharactorToAlphabet("歩")).toEqual("FU");
    expect(translater.pieceCharactorToAlphabet("金")).toEqual("KI");
    expect(translater.pieceCharactorToAlphabet("成銀")).toEqual("NG");
    expect(translater.pieceCharactorToAlphabet("あああ")).toEqual("あああ");
});

it("statusCharactorToAlphabet test", () => {
    expect(translater.statusCharactorToAlphabet("投了")).toEqual("TORYO");
    expect(translater.statusCharactorToAlphabet("中断")).toEqual("CHUDAN");
    expect(translater.statusCharactorToAlphabet("持将棋")).toEqual("JISHOGI");
    expect(translater.statusCharactorToAlphabet("あああ")).toEqual("あああ");
});
