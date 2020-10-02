import * as React from "react";
import { BoardView } from "./BoardView";
import { BoardControl } from "./BoardControl";
import { KifuLoader } from "./KifuLoader";

export interface KifuBoardProps {
    loader: KifuLoader;
}

export class KifuBoard extends React.Component<KifuBoardProps, { boards: string[][], pieceSente: {}, pieceGote: {} }> {
    constructor(props: any) {
        super(props);
        this.next = this.next.bind(this);
        this.previouse = this.previouse.bind(this);
        this.rotate = this.rotate.bind(this);
        this.state = {
            boards: this.props.loader.getBoard(),
            pieceSente: this.props.loader.getPieceSente(),
            pieceGote: this.props.loader.getPieceGote()
        };
    }

    next() {
        this.props.loader.movePiece(1);
        // console.warn('先手:=', this.props.loader.getPieceSente());
        // console.warn('後手:=', this.props.loader.getPieceGote());
        this.setState({ 
            boards: this.props.loader.getBoard(),
            pieceSente: this.props.loader.getPieceSente(),
            pieceGote: this.props.loader.getPieceGote()
        });
    }

    previouse() {
        this.props.loader.movePiece(-1);
        // console.error('先手:=', this.props.loader.getPieceSente());
        // console.error('後手:=', this.props.loader.getPieceGote());
        this.setState({ 
            boards: this.props.loader.getBoard(),
            pieceSente: this.props.loader.getPieceSente(),
            pieceGote: this.props.loader.getPieceGote()
        });
    }

    rotate() {
        console.log("rotate");
    }

    render() {
        const controls = ["戻る", "盤面反転", "進む"].map((text, index) => {
            return (
                <BoardControl
                    key={index}
                    text={text}
                    controlIndex={index}
                    onPreviouse={this.previouse}
                    onNext={this.next}
                    onRotate={this.rotate}
                />
            );
        });

        return (
            <React.Fragment>
                <svg
                    version="1.1"
                    baseProfile="full"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 650 650"
                    width="650"
                    height="650"
                >
                    <g>
                        <rect
                            x="6"
                            y="60"
                            width="540"
                            height="540"
                            className="jskb-board"
                        ></rect>
                    </g>
                    <BoardView
                        boards={this.state.boards}
                        pieceSente={this.state.pieceSente}
                        pieceGote={this.state.pieceGote}
                    />
                </svg>
                <div className="jskb-control">{controls}</div>
            </React.Fragment>
        );
    }
}
