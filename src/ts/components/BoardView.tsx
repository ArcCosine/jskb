import * as React from "react";
import { RectItem } from "./RectItem";
import { NumberItem } from "./NumberItem";
import { Translater } from "./Translater";

export interface BoardViewProps {
    boards: string[][];
    pieceSente: {};
    pieceGote: {};
}

export class BoardView extends React.Component<BoardViewProps, {}> {
    render() {
        const translater = new Translater();
        const rectItems = this.props.boards.map((row: [], y: number) => {
            return row.map((piece: string, x: number) => {
                const uniqueKey = `${x} ${y}`;
                const formattedPiece = translater.pieceAlphabetToCharactor(
                    piece
                );
                return (
                    <RectItem
                        key={uniqueKey}
                        x={x}
                        y={y}
                        piece={formattedPiece}
                        isGote={/-/.test(piece)}
                    />
                );
            });
        });
        const numberItems = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(counter => {
            return <NumberItem key={counter} counter={counter}  />;
        });
        const sentePiece = '先手持ち駒';
        const gotePiece = '後手持ち駒';
        return (
            <React.Fragment>
                <g>{rectItems}</g>
                <g><text x="0" y="630">{sentePiece}</text></g>
                <g><text x="0" y="20">{gotePiece}</text></g>
                <g>{numberItems}</g>
            </React.Fragment>
        );
    }
}
