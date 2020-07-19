import * as React from "react";
import { RectItem } from "./RectItem";
import { NumberItem } from "./NumberItem";

export interface BoardViewProps {
    boards: string[][];
}

export class BoardView extends React.Component<BoardViewProps, {}> {
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

    render() {
        const rectItems = this.props.boards.map((row: [], y: number) => {
            return row.map((piece: string, x: number) => {
                const formattedPiece = this.pieceAlphabetToCharactor(piece);
                const isGote = /-/.test(piece); 
                return <RectItem x={x} y={y} piece={formattedPiece} isGote={isGote} />;
            });
        });
        const numberItems = [1,2,3,4,5,6,7,8,9].map((counter)=>{
            return <NumberItem counter={counter} />
        })
        return (
            <React.Fragment>
                {rectItems}
                {numberItems}
            </React.Fragment>
        );
    }
}
