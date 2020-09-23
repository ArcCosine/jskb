import * as React from "react";
import { Translater } from "./Translater";

export interface PieceItemProps {
}

export class PieceItem extends React.Component<PieceItemProps, {}> {

    render() {
        return (
            <React.Fragment>
                <text x={} y={} className="pieceBoard"></text>
            </React.Fragment>
        );
    }
}
