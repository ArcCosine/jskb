import * as React from "react";
import { BoardView } from "./BoardView";


export interface KifuBoardProps {
    width: number;
    height: number;
    board: string[][];
    basesize: number;
    geta: number;
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
            
            <g>
                <rect x={this.props.geta} y={this.props.geta} width={this.props.basesize*9} height={this.props.basesize*9} className="boardBase"></rect>
            </g>
                <BoardView boards={this.props.board} geta={this.props.geta} basesize={this.props.basesize} />
            </svg>
        );

    }
}
