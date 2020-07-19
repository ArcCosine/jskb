import * as React from "react";
import { BoardView } from "./BoardView";


export interface KifuBoardProps {
    width: number;
    height: number;
    board: string[][];
}

export class KifuBoard extends React.Component<KifuBoardProps, {}> {
    render() {
        const viewBox = `0 0 ${this.props.width} ${this.props.height}`
        return (
            <svg
                version="1.1"
                baseProfile="full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox={viewBox}
                width={this.props.width}
                height={this.props.height}
            >
                <rect x="40" y="40" width="540" height="540" className="boardBase"></rect>
                <BoardView boards={this.props.board} />
            </svg>
        );

    }
}
