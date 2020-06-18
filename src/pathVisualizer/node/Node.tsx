import React, { useEffect, useState, useRef } from "react";
import classNames from "classnames";
import NodeType from "./NodeType";
import "./node.css";

type NodeProps = NodeType & {
  clickOnTile: (row: number, col: number) => void;
  //onEndEditMode: () => void;
  editMode: boolean;
  painting: boolean;
  updatePaintingMode: (update:boolean) => void;
};

const Node = ({
  isStart,
  isFinish,
  isPath,
  row,
  col,
  distance,
  pathOrder,
  isVisited,
  isWall,
  clickOnTile,
  editMode,
  painting,
  updatePaintingMode
}: //editMode,
//clickOnTile,
//onEndEditMode,
NodeProps) => {
  const [paintPath, setPaintPath] = useState(false);
  const [paintVisited, setPaintVisited] = useState(false);
  const [isWallView, setIsWall] = useState(false);
  const firstUpdate = useRef(true);
 
  useEffect(
    function animatePath() {
      if (isPath) {
        setTimeout(() => {
          setPaintPath(true);
        }, pathOrder * 100);
      }
    },
    [isPath, pathOrder]
  );

  useEffect(
    function animateVisited() {
      if (isVisited) {
        setTimeout(() => {
          setPaintVisited(true);
        }, 50 * distance);
      }
    },
    [isVisited, distance]
  );

  // useEffect(() => {
  //   //onEndEditMode();
  // }, [editMode]);

  const createWall = (firstPaint: boolean = false) => {
    if (editMode && (painting||firstPaint)) {
      console.log('creating a wall')
      clickOnTile(row, col);
      console.log(!isWallView)
      setIsWall(!isWallView);
    }
  };

  const initLocalEdit =() => {
    console.log('on mouse down');
    updatePaintingMode(true);
    //setLocalEditing(true);
    createWall(true);
    
  }

  const endLocalEdit =() => {
    console.log('on mouse up')
    
    updatePaintingMode(false);
    //setLocalEditing(false)
  }

  const paint =() => {
    if(editMode){
      console.log('painting')
    }
    createWall();
  }

  

  return (
    <div
      //onClick={(e: any) => createWall()}
      onMouseDown={initLocalEdit}
      onMouseUp={endLocalEdit}
      onMouseEnter={paint}
      className={classNames("node", {
        is_path: paintPath && !isStart && !isFinish,
        is_start: isStart,
        is_finish: isFinish,
        is_visited: paintVisited && !isStart && !isFinish && !isPath,
        is_wall: isWallView && !isStart && !isFinish,
      })}
      //style={{backgroundColor: `rgba(0,0,0,${distance/100})`}}
    ></div>
  );
};

export default Node;
