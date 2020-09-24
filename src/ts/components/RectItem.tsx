import * as React from "react";

export interface RectItemProps {
    x: number;
    y: number;
    piece: string;
    isGote: boolean;
}

export class RectItem extends React.Component<RectItemProps, {}> {
    render() {
        const baseSize = 60;
         const rotate = this.props.isGote
             ? `matrix(-1, 0, 0, -1, ${(2 * this.props.x + 1) *
                   baseSize + 3}, ${(2 * this.props.y + 1) * baseSize+120})`
             : "";
        return (
            <React.Fragment>
                <rect
                    x={this.props.x * baseSize + 3}
                    y={this.props.y * baseSize + 60}
                    width={baseSize}
                    height={baseSize}
                    stroke="black"
                    fill="transparent"
                    strokeWidth="1"
                />
                <text
                    x={this.props.x * baseSize +18}
                    y={this.props.y * baseSize +100}
                    transform={rotate}
                    className="piece"
                >
                    {this.props.piece}
                </text>
            </React.Fragment>
        );
    }
}
