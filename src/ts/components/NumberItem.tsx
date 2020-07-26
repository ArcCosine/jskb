import * as React from "react";
import { Translater } from "./Translater";

export interface NumberItemProps {
    counter: number;
    basesize: number;
    geta: number;
}

export class NumberItem extends React.Component<NumberItemProps, {}> {

    render() {
        const translater = new Translater();
        const fullWidthCounter = translater.numberToFullWidth(
            this.props.counter
        );

        const characotrCounter = translater.numberToCharactor(
            this.props.counter
        );
        const numPos:number = (this.props.basesize * 10);

        return (
            <React.Fragment>
                <text x={numPos- (this.props.counter * this.props.basesize)} y={(this.props.geta/2)} className="piece">
                    {fullWidthCounter}
                </text>
                <text x={numPos} y={this.props.counter * this.props.basesize+(this.props.geta/2)} className="piece">
                    {characotrCounter}
                </text>
            </React.Fragment>
        );
    }
}
