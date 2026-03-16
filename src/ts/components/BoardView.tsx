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

export const BoardView: React.FC<BoardViewProps> = ({ boards, pieceSente, pieceGote, status }) => {
    const translater = new Translater();
    const rectItems = boards.map((row: [], y: number) => {
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
    for( let key in pieceSente ){
        if( pieceSente[key] > 0 ){
            sentePieceTotal += translater.pieceAlphabetToCharactor(key) + pieceSente[key] + ' ';
        }
    }
    let gotePieceTotal = '';
    for( let key in pieceGote ){
        if( pieceGote[key] > 0 ){
            gotePieceTotal += translater.pieceAlphabetToCharactor(key) + pieceGote[key] + ' ';
        }
    }
    const sentePiece = `先手持ち駒 ${sentePieceTotal}`;
    const gotePiece = `後手持ち駒 ${gotePieceTotal}`;

    const statusItem = `${translater.statusAlphabetToCharactor(status)}`;
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
