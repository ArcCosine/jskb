import * as React from "react";

export interface BoardControlProps {
    text: string;
    controlIndex: number;
    onPreviouse: ()=> void;
    onNext: ()=> void;
    onRotate: ()=> void;
}

export class BoardControl extends React.Component<BoardControlProps, {}> {

    handleClick(event: any){
        event.preventDefault();
        switch( event.target.value ){
            case '0':
                this.props.onPreviouse();
                break;
            case '1':
                this.props.onRotate();
                break;
            case '2':
                this.props.onNext();
                break;
            default:
                break;
        }
        return false;
    }

    render() {
        return( 
            <button className="jskb-btn" value={this.props.controlIndex} onClick={this.handleClick.bind(this)}>{this.props.text}</button>
        );
    }
}
