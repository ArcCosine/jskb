import * as React from "react";
import { RectItem } from "./RectItem";
import { NumberItem } from "./NumberItem";
import { Translater } from "./Translater";
import { KifuLoader } from "./KifuLoader";

export interface BoardViewProps {
    loader: KifuLoader;
    geta: number;
    basesize: number;
}

export class BoardView extends React.Component<BoardViewProps, { boards: string[][] }> {
    constructor(props:any) {
        super(props);
        this.state = {
            boards : this.props.loader.getBoard()
        }
    }
    render() {
        const translater = new Translater();
        const rectItems = this.state.boards.map((row: [], y: number) => {
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
                        basesize={this.props.basesize}
                        geta={this.props.geta}
                    />
                );
            });
        });
        const numberItems = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(counter => {
            return <NumberItem key={counter} counter={counter} basesize={this.props.basesize} geta={this.props.geta} />;
        });
        return (
            <React.Fragment>
                <g>{rectItems}</g>
                <g>{numberItems}</g>
            </React.Fragment>
        );
    }
}
