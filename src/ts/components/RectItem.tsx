import * as React from "react";

export interface RectItemProps {
    x: number;
    y: number;
    piece: string;
    isGote: boolean;
    geta: number;
    basesize: number;
}

export class RectItem extends React.Component<RectItemProps, {}> {
    render() {
         const rotate = this.props.isGote
             ? `matrix(-1, 0, 0, -1, ${(2 * this.props.x + 1) *
                   this.props.basesize + this.props.geta*2-2}, ${(2 * this.props.y + 1) * this.props.basesize + this.props.geta*2})`
             : "";
        return (
            <React.Fragment>
                <rect
                    x={this.props.x * this.props.basesize + this.props.geta}
                    y={this.props.y * this.props.basesize + this.props.geta}
                    width={this.props.basesize}
                    height={this.props.basesize}
                    stroke="black"
                    fill="transparent"
                    strokeWidth="1"
                />
                <text
                    x={this.props.x * this.props.basesize+this.props.geta + 18}
                    y={this.props.y * this.props.basesize+this.props.geta + 40}
                    transform={rotate}
                    className="piece"
                >
                    {this.props.piece}
                </text>
            </React.Fragment>
        );
    }
}
