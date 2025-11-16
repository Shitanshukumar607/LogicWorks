import { create } from "zustand";
import { GateType, evaluateGate } from "../utils/gates";

import { type Node, type Edge } from "@xyflow/react";

export type SignalMap = Record<string, 0 | 1>;

export type CircuitState = {
  nodes: Node[];
  edges: Edge[];
  signalMap: SignalMap;
  // accept either a new array or an updater function like React state setters
  setNodes: (n: Node[] | ((prev: Node[]) => Node[])) => void;
  setEdges: (e: Edge[] | ((prev: Edge[]) => Edge[])) => void;
  updateSignal: (nodeId: string, value: 0 | 1) => void;
  simulateFromInputs: () => void;
  clear: () => void;
  importData: (data: { nodes: Node[]; edges: Edge[] }) => void;
};

export const useCircuitStore = create<CircuitState>((set, get) => ({
  nodes: [
    { id: "1", data: { label: "Node 1" }, position: { x: 5, y: 5 } },
    { id: "2", data: { label: "Node 2" }, position: { x: 5, y: 100 } },
  ],
  edges: [],
  signalMap: {},
  setNodes: (newNodes: Node[] | ((prev: Node[]) => Node[])) =>
    set((state) => ({
      nodes:
        typeof newNodes === "function"
          ? (newNodes as (prev: Node[]) => Node[])(state.nodes)
          : newNodes,
    })),
  setEdges: (newEdges: Edge[] | ((prev: Edge[]) => Edge[])) =>
    set((state) => ({
      edges:
        typeof newEdges === "function"
          ? (newEdges as (prev: Edge[]) => Edge[])(state.edges)
          : newEdges,
    })),
  updateSignal: (nodeId: string, value: 0 | 1) => {
    set((state) => ({ signalMap: { ...state.signalMap, [nodeId]: value } }));
  },
  // simulateFromInputs: () => {
  //   const { nodes, edges } = get();
  //   const signalMap: SignalMap = {};

  //   // Initialize inputs
  //   const inputNodes = nodes.filter((n) => n.data?.type === "INPUT");
  //   inputNodes.forEach((n) => {
  //     const v = n.data?.value ? 1 : 0;
  //     signalMap[n.id] = v;
  //   });

  //   // Build adjacency: from node to outgoing edges
  //   const outAdj: Record<string, string[]> = {};
  //   edges.forEach((e) => {
  //     if (!outAdj[e.source]) outAdj[e.source] = [];
  //     outAdj[e.source].push(e.target);
  //   });

  //   // Simple BFS from inputs
  //   const q: string[] = inputNodes.map((n) => n.id);
  //   const visited = new Set<string>();

  //   while (q.length) {
  //     const curr = q.shift()!;
  //     visited.add(curr);
  //     const currVal = signalMap[curr] ?? 0;

  //     const outs = outAdj[curr] || [];
  //     outs.forEach((targetId) => {
  //       // For target node, gather values from all incoming edges
  //       const incomingEdges = edges.filter((e) => e.target === targetId);
  //       const inputVals = incomingEdges.map((ie) => signalMap[ie.source] ?? 0);
  //       const node = nodes.find((n) => n.id === targetId);
  //       if (!node) return;
  //       const rawType = node.data?.type as string | undefined;
  //       const type: GateType | undefined =
  //         rawType &&
  //         (
  //           [
  //             "INPUT",
  //             "OUTPUT",
  //             "AND",
  //             "OR",
  //             "NAND",
  //             "NOR",
  //             "XOR",
  //             "XNOR",
  //             "NOT",
  //           ] as const
  //         ).includes(rawType as GateType)
  //           ? (rawType as GateType)
  //           : undefined;

  //       if (type === "OUTPUT") {
  //         // OUTPUT just forwards its single input
  //         const val = inputVals[0] ?? 0;
  //         signalMap[targetId] = val;
  //       } else if (type === "INPUT") {
  //         // already set
  //       } else if (type === "NOT") {
  //         signalMap[targetId] = evaluateGate("NOT", [inputVals[0] ?? 0]);
  //       } else {
  //         // If type is undefined or not a gate, default to forwarding first input
  //         if (!type) {
  //           signalMap[targetId] = inputVals[0] ?? 0;
  //         } else {
  //           signalMap[targetId] = evaluateGate(type, inputVals.concat());
  //         }
  //       }
  //       if (!visited.has(targetId)) q.push(targetId);
  //     });
  //   }

  //   set({ signalMap });
  // },
  simulateFromInputs: () => {
    console.log("Simulate function called");
  },
  clear: () => set({ nodes: [], edges: [], signalMap: {} }),
  importData: (data) => set({ nodes: data.nodes, edges: data.edges }),
}));
