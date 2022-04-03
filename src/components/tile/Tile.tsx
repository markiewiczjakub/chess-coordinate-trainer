import "./Tile.scss";

interface ITileProps {
    row: number;
    column: number;
    reversed: boolean;
    onClick: (i: number, j: number) => void;
}

const Tile = (props: ITileProps) => {
    const { row, column, reversed } = props;

    const getColor = (): "light" | "dark" => {
        if(
            (column % 2 === 0 && row % 2 === 0) ||
            (column % 2 === 1 && row % 2 === 1)
        )
            return reversed ? "dark": "light";
        else
            return reversed ? "light": "dark";
    }

    return (
        <div className={`Tile Tile--${ getColor() }`} onClick={() => props.onClick(column, row)}></div>
    )
}

export default Tile;