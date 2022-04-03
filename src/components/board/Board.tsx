import React, { ReactNode } from "react";
import { IChessCoordinates } from "../../Game";
import Tile from "../tile/Tile";
import "./Board.scss";

interface IBoardProps {
    coordinates: IChessCoordinates
    onClick: (i: number, j: number) => void;
}


const Board = (props: IBoardProps) => {
    const getRowContent = (rowIndex: number): ReactNode[] =>
        props.coordinates.columns.map(
            (columnName, columnIndex) => (
                <Tile
                    key={`r:${rowIndex};c${columnIndex}`}
                    column={columnIndex}
                    row={rowIndex}
                    reversed={props.coordinates.reversed}
                    onClick={(column, row) => props.onClick(column, row)} 
                />
            )
        )

    const rows: ReactNode[] = props.coordinates.rows.map(
        (rowName, rowIndex) => (
            <div key={`r:${rowIndex}`} className="row">
                { getRowContent(rowIndex) }
            </div>
        )
    )

    return (
        <div className="Board">
            { rows }
        </div>
    )
}

export default Board;
// class Board extends React.Component<IBoardProps> {
//     render() {
//         const rows: ReactNode[] = CHESS_COORDINATES.ROWS.map((rowName, rowIndex) => (
//             <div key={rowIndex} className="row">
//                 { this.buildRow(rowIndex) }
//             </div>
//         ))

//         return (
//             <div className="Board">
//                 { rows }
//             </div>
//         )
//     }

//     buildRow = (rowIndex: number): ReactNode[] =>
//         CHESS_COORDINATES.COLUMNS.map(
//             (columnName, columnIndex) =>
//             (
//                 <Tile key={columnIndex} column={columnIndex} row={rowIndex} onClick={(row, column) => this.props.onClick(row, column)} />
//             )
//         )
// }

// export default Board;