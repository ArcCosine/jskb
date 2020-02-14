import * as React from "react";
import * as ReactDOM from "react-dom";

import { Hello } from "./components/Hello";

const rootEl = document.getElementById('dark-kifu')
rootEl ? ReactDOM.render(<Hello compiler="TypeScript" framework="React" />, rootEl) : false;
