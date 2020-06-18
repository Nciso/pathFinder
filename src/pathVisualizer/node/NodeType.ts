type Node = {
  id: string,
  isStart: boolean;
  isFinish: boolean;
  isVisited: boolean;
  isWall: boolean;
  distance: number;
  col: number;
  row: number;
  previousNode: Node | null;
  isPath: boolean;
  pathOrder: number
};

export default Node;
