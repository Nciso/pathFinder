import React, { useState, useEffect } from "react";
import Node from "./node/Node";
import NodeType from "./node/NodeType";
import shortId from "shortid";
import { dijkstra, getNodesInShortesPath } from "../algorithms/dijkstra";

const PathVisualizer = () => {
  // css for grid

  const [grid, setGrid]: [NodeType[][], any] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [tmpWalls, setTmpWalls]: [
    { col: number; row: number }[],
    any
  ] = useState([]);
  const [startNode, setStartNode]: [NodeType | null, any] = useState(null);
  const [endNode, setEndNode]: [NodeType | null, any] = useState(null);
  const [gridSize, setGridSize]: [
    { columns: number; rows: number },
    any
  ] = useState({ columns: 30, rows: 20 });

  const [painting, setPainting] = useState(false);

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${gridSize.columns},30px)`,
    gridTemplateRows: `repeat(${gridSize.rows},30px)`,
  };

  useEffect(function paintingWalls() {
    const localGrid = grid.map(function (arr) {
      return arr.slice();
    });
    tmpWalls.forEach((w) => {
      localGrid[w.row][w.col].isWall = true;
    });
    setGrid(localGrid);
    setTmpWalls([])
  }, [editMode]);

  useEffect(
    function setInitialGrid() {
      const startPoint = { row: 10, col: 3 };
      const endPoint = { row: 18, col: 29 };
      const nodes: NodeType[][] = new Array(gridSize.rows)
        .fill(null)
        .map((_) => new Array(gridSize.columns).fill(null));

      for (let col = 0; col < gridSize.columns; col++) {
        for (let row = 0; row < gridSize.rows; row++) {
          const gridElement: NodeType = {
            id: shortId.generate(),
            isStart: false,
            isFinish: false,
            isVisited: false,
            isWall: false,
            distance: Infinity,
            col,
            row,
            previousNode: null,
            isPath: false,
            pathOrder: NaN,
          };
          if (row === startPoint.row && col === startPoint.col) {
            gridElement.isStart = true;
            setStartNode(gridElement);
          }

          if (row === endPoint.row && col === endPoint.col) {
            gridElement.isFinish = true;
            setEndNode(gridElement);
          }
          nodes[row][col] = gridElement;
        }
      }
      setGrid(nodes);
    },
    [gridSize]
  );

 
  const callDijkstra = () => {
    const localGrid = grid.map(function (arr) {
      return arr.slice();
    });
    dijkstra(localGrid, startNode!, endNode!);

    const localNodes = getNodesInShortesPath(endNode!);
    console.log(localNodes);
    localNodes.forEach((n, i) => {
      localGrid[n.row][n.col].isPath = true;
      localGrid[n.row][n.col].pathOrder = i;
    });
    setGrid(localGrid);
  };

  const changeEditMode = () => {
    setEditMode(!editMode);
  };

  const endOfEditMode = () => {
    const localGrid = grid.map(function (arr) {
      return arr.slice();
    });
    tmpWalls.forEach((wall) => {
      localGrid[wall.row][wall.col].isWall = !localGrid[wall.row][wall.col]
        .isWall;
    });
    setGrid(localGrid);
    setTmpWalls([]);
  };

  const onClickTile = (row: number, col: number) => {
    if (editMode) {
      let localWalls = [{ row, col }];
      if(!tmpWalls.includes(localWalls[0])){
        setTmpWalls([...tmpWalls, ...localWalls]);
      }
      // const localGrid = grid.map(function (arr) {
      //   return arr.slice();
      // });
      //localGrid[row][col].isWall = !localGrid[row][col].isWall;
      //setGrid(localGrid);
    }
  };

  const restartGrid = () => {
    const localGrid = {...gridSize}
    setGridSize(localGrid)
  }

  const updatePaintingMode =(update: boolean) =>{
    setPainting(update);
  }

  return (
    <div>
      <button disabled={editMode} onClick={callDijkstra}>find path</button>
      <button onClick={() => setEditMode(!editMode)}>
        {!editMode ? "Edit map" : "done Editing"}
      </button>
      <button onClick={() => restartGrid()}>Restart</button>
      <div style={gridStyle}>
        {grid
          .reduce((acc, rows) => acc.concat(rows), [])
          .map((gridElement, i) => {
            return (
              <Node
                {...gridElement}
                clickOnTile={onClickTile}
                editMode={editMode}
                key={gridElement.id}
                updatePaintingMode={updatePaintingMode}
                painting={painting}
                //onEndEditMode={endOfEditMode}
              />
            );
          })}
      </div>
    </div>
  );
};

export default PathVisualizer;
