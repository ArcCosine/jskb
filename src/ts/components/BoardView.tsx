import * as React from "react";
import { RectItem } from "./RectItem";
import { NumberItem } from "./NumberItem";
import { Translater } from "./Translater";

interface pieceStatus {
    [key: string]: number;
}

export interface BoardViewProps {
    boards: string[][];
    pieceSente: pieceStatus;
    pieceGote: pieceStatus;
    status: string;
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
        let sentePieceTotal = '';
        for( let key in this.props.pieceSente ){
            if( this.props.pieceSente[key] > 0 ){
                sentePieceTotal += translater.pieceAlphabetToCharactor(key) + this.props.pieceSente[key] + ' ';
            }
        }
        let gotePieceTotal = '';
        for( let key in this.props.pieceGote ){
            if( this.props.pieceGote[key] > 0 ){
                gotePieceTotal += translater.pieceAlphabetToCharactor(key) + this.props.pieceGote[key] + ' ';
            }
        }
        const sentePiece = `先手持ち駒 ${sentePieceTotal}`;
        const gotePiece = `後手持ち駒 ${gotePieceTotal}`;

        const statusItem = `${translater.statusAlphabetToCharactor(this.props.status)}`;
        return (
            <React.Fragment>
                <g>{rectItems}</g>
                <g><text x="6" y="630">{sentePiece}</text></g>
                <g><text x="6" y="20">{gotePiece}</text></g>
                <g>{numberItems}</g>
                <g><text x="6" y="650">{statusItem}</text></g>
            </React.Fragment>
        );
    }
}
