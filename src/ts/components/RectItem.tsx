import * as React from "react";

export interface RectItemProps {
    x: number;
    y: number;
    piece: string;
    isGote: boolean;
}

export const RectItem: React.FC<RectItemProps> = ({ x, y, piece, isGote }) => {
    const baseSize = 60;
    const rotate = isGote
        ? `matrix(-1, 0, 0, -1, ${(2 * x + 1) * baseSize + 9}, ${(2 * y + 1) * baseSize + 124})`
        : "";
    return (
        <React.Fragment>
            <rect
                x={x * baseSize + 6}
                y={y * baseSize + 60}
                width={baseSize}
                height={baseSize}
                stroke="black"
                fill="transparent"
                strokeWidth="1"
            />
            <text
                x={x * baseSize + 22}
                y={y * baseSize + 102}
                transform={rotate}
                className="piece"
            >
                {piece}
            </text>
        </React.Fragment>
    );
}
