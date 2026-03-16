import * as React from "react";
import { BoardView } from "./BoardView";
import { BoardControl } from "./BoardControl";
import { KifuLoader } from "./KifuLoader";

export interface KifuBoardProps {
    loader: KifuLoader;
}

export const KifuBoard: React.FC<KifuBoardProps> = ({ loader }) => {
    const [boards, setBoards] = React.useState<string[][]>(loader.getBoard());
    const [pieceSente, setPieceSente] = React.useState<{}>(loader.getPieceSente());
    const [pieceGote, setPieceGote] = React.useState<{}>(loader.getPieceGote());
    const [status, setStatus] = React.useState<string>(loader.getStatus());

    const updateBoardState = React.useCallback(() => {
        setBoards(loader.getBoard());
        setPieceSente(loader.getPieceSente());
        setPieceGote(loader.getPieceGote());
        setStatus(loader.getStatus());
    }, [loader]);

    const next = React.useCallback(() => {
        loader.movePiece(1);
        updateBoardState();
    }, [loader, updateBoardState]);

    const previouse = React.useCallback(() => {
        loader.movePiece(-1);
        updateBoardState();
    }, [loader, updateBoardState]);

    const rotate = React.useCallback(() => {
        console.log("rotate");
    }, []);

    const controls = ["戻る", "盤面反転", "進む"].map((text, index) => {
        return (
            <BoardControl
                key={index}
                text={text}
                controlIndex={index}
                onPreviouse={previouse}
                onNext={next}
                onRotate={rotate}
            />
        );
    });

    return (
        <React.Fragment>
            <svg
                version="1.1"
                baseProfile="full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 650 670"
                width="650"
                height="670"
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
                    boards={boards}
                    pieceSente={pieceSente}
                    pieceGote={pieceGote}
                    status={status}
                />
            </svg>
            <div className="jskb-control">{controls}</div>
        </React.Fragment>
    );
}
