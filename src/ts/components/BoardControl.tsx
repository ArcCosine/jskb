import * as React from "react";

export interface BoardControlProps {
    text: string;
    controlIndex: number;
    onPreviouse: ()=> void;
    onNext: ()=> void;
    onRotate: ()=> void;
}

export const BoardControl: React.FC<BoardControlProps> = ({ text, controlIndex, onPreviouse, onNext, onRotate }) => {

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        switch( event.currentTarget.value ){
            case '0':
                onPreviouse();
                break;
            case '1':
                onRotate();
                break;
            case '2':
                onNext();
                break;
            default:
                break;
        }
    };

    return ( 
        <button className="jskb-btn" value={String(controlIndex)} onClick={handleClick}>{text}</button>
    );
}
