import * as React from "react";
import { Translater } from "./Translater";

export interface NumberItemProps {
    counter: number;
}

export class NumberItem extends React.Component<NumberItemProps, {}> {

    render() {
        const baseSize = 60;
        const translater = new Translater();
        const fullWidthCounter = translater.numberToFullWidth(
            this.props.counter
        );

        const characotrCounter = translater.numberToCharactor(
            this.props.counter
        );
        const numPos:number = (baseSize * 10) - 40;

        return (
            <React.Fragment>
                <text x={numPos- (this.props.counter * baseSize)} y={50} className="piece">
                    {fullWidthCounter}
                </text>
                <text x={numPos} y={this.props.counter * baseSize + 40 } className="piece">
                    {characotrCounter}
                </text>
            </React.Fragment>
        );
    }
}
