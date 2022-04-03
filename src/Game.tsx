import { useEffect, useReducer, useRef } from 'react';
import './Game.scss';
import Board from './components/board/Board';
import Timer from './components/timer/Timer';

export interface IChessCoordinates {
    columns: string[],
    rows: number[],
	reversed: boolean
}
interface IHistoryItem {
	tile: string,
	success: boolean
}
interface IGameProps {};
interface IGameState {
	current: string | null,
	score: number,
	history: IHistoryItem[],
	coordinates: IChessCoordinates,
	duration: number,
	startTime: number | null,
	timeLeft: number | null
}

const initialState: IGameState = {
	current: null,
	score: 0,
	history: [],
	coordinates: {
		columns: [ "a", "b", "c", "d", "e", "f", "g", "h" ],
		rows: [ 8, 7, 6, 5, 4, 3, 2, 1 ],
		reversed: false
	},
	duration: 90,
	startTime: null,
	timeLeft: null,
}

const reducer = (state: IGameState, action: { type: string, payload?: any }): IGameState  => {
	switch(action.type) {
		case "SET_CURRENT":
			return { ...state, current: action.payload };
		case "INCREMENT_SCORE":
			return { ...state, score: state.score + 1 };
		case "RESET_SCORE":
			return { ...state, score: 0 };
		case "SAVE_HISTORY":
			return { ...state, history: [ ...state.history, action.payload ] };
		case "CLEAR_HISTORY":
			return { ...state, history: [] };
		case "REVERSE_COORDINATES":
			return { ...state, coordinates:
				{
					...state.coordinates, 
					rows: [ ...state.coordinates.rows.reverse() ]
				} 
			};
		case "START_TIMER":
			return { ...state, startTime: Date.now(), timeLeft: state.duration };
		case "STOP_TIMER":
			return { ...state, startTime: null, timeLeft: null };
		case "SET_TIME_LEFT":
			return { ...state, timeLeft: action.payload };
	}

	return state;
}

const Game = (props: IGameProps) => {
	const [ state, dispatch ] = useReducer(reducer, initialState);
	let interval = useRef<number | null>(null);

	useEffect(() => {
		if(state.coordinates.reversed) // reverse board if needed (playing as white/black)
			dispatch({ type: "REVERSE_COORDINATES" })

		if(state.startTime && interval.current === null) { // start interval when game started
			console.log("setting interval", interval)
			interval.current = window.setInterval(() => manageTime(), 1000)
		}
	})

	const randomBetween = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min);
	const getTileNameByIndexes = (column: number, row: number): string => `${state.coordinates.columns[column]}${state.coordinates.rows[row]}`;
	const generateRandomTile = (): string => {
		const randomColumn = randomBetween(0, 7);
		const randomRow = randomBetween(0, 7);
		return getTileNameByIndexes(randomColumn, randomRow);
	}

	const nextTile = (): void => {
		const randomTile = generateRandomTile();
		dispatch({ type: "SET_CURRENT", payload: randomTile });
	}

	const saveToHistory = (tileName: string, success: boolean): void => {
		dispatch({ type: "SAVE_HISTORY", payload: { tile: tileName, success } });
	}

	const start = (): void => {
		dispatch({ type: "CLEAR_HISTORY" });
		dispatch({ type: "START_TIMER" });
		dispatch({ type: "RESET_SCORE" });
		nextTile();
	}

	const stop = (): void => {
		if(!interval.current) return;

		dispatch({ type: "SET_CURRENT", payload: null });
		dispatch({ type: "STOP_TIMER" });
		clearInterval(interval.current);
		interval.current = null;
	}

	const manageTime = (): void => {
		if(!state.startTime) return;

		const secondsPassed = Math.floor((Date.now() - state.startTime!!) / 1000);
		const secondsLeft = state.duration - secondsPassed;
		if(secondsLeft === 0) {
			stop();
		} else {
			dispatch({ type: "SET_TIME_LEFT", payload: secondsLeft });
		}
	}

	const handleTileClick = (column: number, row: number): void => {
		if(!state.current) return;

		const clickedTileName = getTileNameByIndexes(column, row);
		if(state.current === clickedTileName)
			dispatch({ type: "INCREMENT_SCORE" })

		saveToHistory(state.current, state.current === clickedTileName);
		nextTile();
	}

	const historyList = state.history.map((historyItem: IHistoryItem, historyItemIndex: number) => (
		<li className={`history__item history__item--${historyItem.success ? "good" : "bad"}`} key={`h:${historyItemIndex}`}>{historyItem.tile}</li>
	))

	return (
		<div className="Game">
			<Board 
				coordinates={ state.coordinates }
				onClick={ (column, row) => handleTileClick(column, row) }
			/>
			<div className="sidebar">
				<div className="score">
					<div className="score__title">Score</div>
					<div className="score__value">{ state.score }</div>
				</div>
				{ state.current && 
					<div className="action">
						<div className="action__timer"><Timer seconds={ state.timeLeft } /></div>
						
						<div className="action__current">{ state.current }</div>
					</div>				
				}
				{ !state.current && <button type="button" className="sidebar__button" onClick={ start }>Start</button> }
				<ul className="history">
					<h2 className="history__title">History</h2>
					{ historyList }
				</ul>
			</div>
		</div>
	);
}

export default Game;
