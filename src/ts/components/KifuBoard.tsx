import * as React from "react";
import { BoardView } from "./BoardView";


export interface KifuBoardProps {
    width: number;
    height: number;
    board: string[][];
}

export class KifuBoard extends React.Component<KifuBoardProps, {}> {
    render() {
        return (
            <svg
                version="1.1"
                baseProfile="full"
                xmlns="http://www.w3.org/2000/svg"
                width={this.props.width}
                height={this.props.height}
            >
                <BoardView boards={this.props.board} />
            </svg>
        );
    }
}
