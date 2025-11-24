import { type Node, type Edge } from "@xyflow/react";
import { GateType, evaluateGate } from "./gates";
import { SignalMap } from "../store/useCircuitStore";

/**
 * Efficient circuit simulation using topological sort
 * Handles cycles by detecting them early and processing with fixed iterations
 */
export function simulateCircuit(
  nodes: Node[],
  edges: Edge[],
  currentSignalMap: SignalMap,
): SignalMap {
  // Build adjacency list and edge mapping
  const adjacencyList = new Map<string, string[]>();
  const inDegree = new Map<string, number>();
  const edgeMap = new Map<
    string,
    Array<{ source: string; sourceHandle?: string }>
  >();

  // Initialize all nodes
  nodes.forEach((node) => {
    adjacencyList.set(node.id, []);
    inDegree.set(node.id, 0);
    edgeMap.set(node.id, []);
  });

  // Build the graph
  edges.forEach((edge) => {
    const sourceList = adjacencyList.get(edge.source);
    if (sourceList) {
      sourceList.push(edge.target);
    }

    const degree = inDegree.get(edge.target) || 0;
    inDegree.set(edge.target, degree + 1);

    const inputs = edgeMap.get(edge.target) || [];
    inputs.push({
      source: edge.source,
      sourceHandle: edge.sourceHandle || undefined,
    });
    edgeMap.set(edge.target, inputs);
  });

  // Check for cycles using topological sort
  const tempInDegree = new Map(inDegree);
  const tempQueue: string[] = [];

  nodes.forEach((node) => {
    if (tempInDegree.get(node.id) === 0) {
      tempQueue.push(node.id);
    }
  });

  let processedCount = 0;
  while (tempQueue.length > 0) {
    const nodeId = tempQueue.shift()!;
    processedCount++;

    const neighbors = adjacencyList.get(nodeId) || [];
    neighbors.forEach((neighborId) => {
      const degree = tempInDegree.get(neighborId)! - 1;
      tempInDegree.set(neighborId, degree);
      if (degree === 0) {
        tempQueue.push(neighborId);
      }
    });
  }

  const hasCycle = processedCount !== nodes.length;

  // Initialize signal map
  const newSignalMap: SignalMap = { ...currentSignalMap };

  // Ensure INPUT nodes have values
  nodes.forEach((node) => {
    if (node.data?.type === "INPUT" && !(node.id in newSignalMap)) {
      newSignalMap[node.id] = 0;
    }
  });

  if (hasCycle) {
    // If there's a cycle, use iterative stabilization (max 10 iterations)
    return simulateWithCycles(nodes, edgeMap, newSignalMap);
  }

  // Topological sort for acyclic graph (most efficient)
  const queue: string[] = [];
  const processed = new Set<string>();

  // Start with nodes that have no dependencies
  nodes.forEach((node) => {
    if (inDegree.get(node.id) === 0) {
      queue.push(node.id);
    }
  });

  while (queue.length > 0) {
    const nodeId = queue.shift()!;

    if (processed.has(nodeId)) continue;
    processed.add(nodeId);

    const node = nodes.find((n) => n.id === nodeId);
    if (!node) continue;

    const gateType = node.data?.type as GateType;

    // Evaluate gate nodes
    if (gateType && gateType !== "INPUT" && gateType !== "OUTPUT") {
      const inputConnections = edgeMap.get(nodeId) || [];
      const inputValues = inputConnections.map(
        (conn) => newSignalMap[conn.source] ?? 0,
      );

      if (inputValues.length > 0) {
        newSignalMap[nodeId] = evaluateGate(gateType, inputValues);
      } else {
        newSignalMap[nodeId] = 0;
      }
    }

    // For OUTPUT nodes, propagate input
    if (gateType === "OUTPUT") {
      const inputConnections = edgeMap.get(nodeId) || [];
      if (inputConnections.length > 0) {
        newSignalMap[nodeId] = newSignalMap[inputConnections[0].source] ?? 0;
      } else {
        newSignalMap[nodeId] = 0;
      }
    }

    // Add downstream nodes to queue when all their inputs are ready
    const neighbors = adjacencyList.get(nodeId) || [];
    neighbors.forEach((neighborId) => {
      const neighborInputs = edgeMap.get(neighborId) || [];
      const allInputsReady = neighborInputs.every((inp) =>
        processed.has(inp.source),
      );

      if (allInputsReady && !processed.has(neighborId)) {
        queue.push(neighborId);
      }
    });
  }

  return newSignalMap;
}

/**
 * Simulate circuits with feedback loops/cycles
 * Uses iterative stabilization
 */
function simulateWithCycles(
  nodes: Node[],
  edgeMap: Map<string, Array<{ source: string; sourceHandle?: string }>>,
  initialSignalMap: SignalMap,
): SignalMap {
  let signalMap = { ...initialSignalMap };
  const maxIterations = 10;

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const newSignalMap: SignalMap = { ...signalMap };
    let changed = false;

    // Process all non-INPUT nodes
    nodes.forEach((node) => {
      const gateType = node.data?.type as GateType;

      if (gateType && gateType !== "INPUT") {
        const inputConnections = edgeMap.get(node.id) || [];

        if (gateType === "OUTPUT") {
          if (inputConnections.length > 0) {
            const newValue = signalMap[inputConnections[0].source] ?? 0;
            if (newSignalMap[node.id] !== newValue) {
              newSignalMap[node.id] = newValue;
              changed = true;
            }
          }
        } else {
          const inputValues = inputConnections.map(
            (conn) => signalMap[conn.source] ?? 0,
          );

          if (inputValues.length > 0) {
            const newValue = evaluateGate(gateType, inputValues);
            if (newSignalMap[node.id] !== newValue) {
              newSignalMap[node.id] = newValue;
              changed = true;
            }
          }
        }
      }
    });

    signalMap = newSignalMap;

    // If no changes, we've stabilized
    if (!changed) break;
  }

  return signalMap;
}
