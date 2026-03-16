import * as React from "react";
import { Translater } from "./Translater";

export interface NumberItemProps {
    counter: number;
}

export const NumberItem: React.FC<NumberItemProps> = ({ counter }) => {

    const baseSize = 60;
    const translater = new Translater();
    const fullWidthCounter = translater.numberToFullWidth(
        counter
    );

    const characotrCounter = translater.numberToCharactor(
        counter
    );
    const numPos:number = (baseSize * 10) - 40;

    return (
        <React.Fragment>
            <text x={numPos - (counter * baseSize)} y="50" className="piece">
                {fullWidthCounter}
            </text>
            <text x={numPos} y={counter * baseSize + 40 } className="piece">
                {characotrCounter}
            </text>
        </React.Fragment>
    );
}
