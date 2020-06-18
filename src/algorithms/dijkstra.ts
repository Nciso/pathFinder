import NodeType from "../pathVisualizer/node/NodeType";

export function dijkstra(
  grid: NodeType[][],
  startNode: NodeType,
  finishNode: NodeType
) {
  const visitedNodesInOrder: NodeType[] = [];
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode: NodeType = unvisitedNodes.shift()!;
    
    if (closestNode.isWall) {
      continue;
    }
    if (closestNode.distance === Infinity) {
      return visitedNodesInOrder;
    }
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    updateUnvisitedNeigbors(closestNode, grid);
  }
}

function getAllNodes(grid: NodeType[][]): NodeType[] {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

function getUnivistedNeighbors(node: NodeType, grid: NodeType[][]): NodeType[] {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) {
    neighbors.push(grid[row - 1][col]);
  }
  if (row < grid.length - 1) {
    neighbors.push(grid[row + 1][col]);
  }
  if (col > 0) {
    neighbors.push(grid[row][col - 1]);
  }
  if (col < grid[0].length - 1) {
    neighbors.push(grid[row][col + 1]);
  }
  return neighbors.filter((n) => !n.isVisited);
}

function sortNodesByDistance(nodes: NodeType[]) {
  nodes.sort((a, b) => a.distance - b.distance);
}

function updateUnvisitedNeigbors(node: NodeType, grid: NodeType[][]) {
  const unvisitedNeighbors = getUnivistedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
}

export function getNodesInShortesPath(finishNode: NodeType): NodeType[] {
  const path = [];
  let currentNode = finishNode;
  while (currentNode) {
    path.unshift(currentNode);
    currentNode = currentNode.previousNode!;
  }
  return path;
}
