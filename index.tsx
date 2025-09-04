import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./src/App";

const container = document.getElementById('root');
const root = createRoot(container!); // container!는 null이 아님을 단언
root.render(<App />);
