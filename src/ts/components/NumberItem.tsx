import * as React from "react";

export interface NumberItemProps {
    counter: number;
}

export class NumberItem extends React.Component<NumberItemProps, {}> {
    counterNumberToCharactor(num: number | null): string {
        const numberCharactor = [
            "〇",
            "一",
            "二",
            "三",
            "四",
            "五",
            "六",
            "七",
            "八",
            "九"
        ];
        return typeof numberCharactor[num] !== "undefined"
            ? numberCharactor[num]
            : "";
    }

    counterNumberToFullWidth(num: number | null): string {
        const numberCharactor = [
            "０",
            "１",
            "２",
            "３",
            "４",
            "５",
            "６",
            "７",
            "８",
            "９"
        ];

        return typeof numberCharactor[num] !== "undefined"
            ? numberCharactor[num]
            : "";
    }

    basesize: number = 60;

    render() {
        const fullWidthCounter = this.counterNumberToFullWidth(
            this.props.counter
        );

        const characotrCounter = this.counterNumberToCharactor(
            this.props.counter
        );
        return (
            <React.Fragment>
                <text x={595 - (this.props.counter * this.basesize)} y="24" className="piece">
                    {fullWidthCounter}
                </text>
                <text x="595" y={this.props.counter * this.basesize + 18} className="piece">
                    {characotrCounter}
                </text>
            </React.Fragment>
        );
    }
}
