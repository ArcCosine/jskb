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
