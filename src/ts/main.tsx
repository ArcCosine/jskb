import "../scss/style.scss";

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { KifuBoard } from './components/KifuBoard';
import { KifuLoader } from './components/KifuLoader';

const loader = new KifuLoader();
const boardData = loader.getBoard();

ReactDOM.render(
  <KifuBoard width={650} height={650} board={boardData} />,
  document.getElementById("jskb")
);
