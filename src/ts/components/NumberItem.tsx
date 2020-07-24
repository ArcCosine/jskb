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
        const fullWidthCounter = translater.counterNumberToFullWidth(
            this.props.counter
        );

        const characotrCounter = translater.counterNumberToCharactor(
            this.props.counter
        );
        return (
            <React.Fragment>
                <text x={595 - (this.props.counter * this.props.basesize)} y="24" className="piece">
                    {fullWidthCounter}
                </text>
                <text x="595" y={this.props.counter * this.props.basesize + 18} className="piece">
                    {characotrCounter}
                </text>
            </React.Fragment>
        );
    }
}
