import './index.css';
import Game from './Game';
import reportWebVitals from './reportWebVitals';
import * as ReactDOMClient from 'react-dom/client';

const rootElement = document.getElementById('root');
if (rootElement) {
	const root = ReactDOMClient.createRoot(rootElement);
	root.render(
		<Game />
	);
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
