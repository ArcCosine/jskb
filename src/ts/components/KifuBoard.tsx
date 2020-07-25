import * as React from "react";
import { BoardView } from "./BoardView";
import { BoardControl } from "./BoardControl";
import { KifuLoader } from "./KifuLoader";

export interface KifuBoardProps {
    width: number;
    height: number;
    loader: KifuLoader;
    basesize: number;
    geta: number;
}

export class KifuBoard extends React.Component<KifuBoardProps, {}> {

    next(){
        console.log(this.props.loader);
        this.props.loader.movePiece(1);
    }

    previouse(){
        this.props.loader.movePiece(-1);
    }

    render() {
        const viewBox = `0 0 ${this.props.width} ${this.props.height}`;
        const controls = ["戻る", "盤面反転", "進む"].map((text, index) => {
            return <BoardControl key={index} text={text} controlIndex={index} onPreviouse={this.previouse}  onNext={this.next} />;
        });

        return (
            <React.Fragment>
                <svg
                    version="1.1"
                    baseProfile="full"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox={viewBox}
                    width={this.props.width}
                    height={this.props.height}
                >
                    <g>
                        <rect
                            x={this.props.geta}
                            y={this.props.geta}
                            width={this.props.basesize * 9}
                            height={this.props.basesize * 9}
                            className="jskb-board"
                        ></rect>
                    </g>
                    <BoardView
                        loader={this.props.loader}
                        geta={this.props.geta}
                        basesize={this.props.basesize}
                    />
                </svg>
                <div className="jskb-control">{controls}</div>
            </React.Fragment>
        );
    }
}
