import * as React from "react";

export interface RectItemProps {
    x: number;
    y: number;
    piece: string;
    isGote: boolean;
}

export class RectItem extends React.Component<RectItemProps, {}> {
    basesize: number = 60;
    geta: number = 40;
    render() {
         const rotate = this.props.isGote
             ? `matrix(-1, 0, 0, -1, ${(2 * this.props.x + 1) *
                   this.basesize + this.geta*2-2}, ${(2 * this.props.y + 1) * this.basesize + this.geta*2})`
             : "";
        return (
            <React.Fragment>
                <rect
                    x={this.props.x * this.basesize + this.geta}
                    y={this.props.y * this.basesize + this.geta}
                    width={this.basesize}
                    height={this.basesize}
                    stroke="black"
                    fill="transparent"
                    strokeWidth="1"
                />
                <text
                    x={this.props.x * this.basesize+this.geta + 18}
                    y={this.props.y * this.basesize+this.geta + 40}
                    transform={rotate}
                    className="piece"
                >
                    {this.props.piece}
                </text>
            </React.Fragment>
        );
    }
}
