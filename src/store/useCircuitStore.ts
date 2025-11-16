import { create } from "zustand";
import { GateType, evaluateGate } from "../utils/gates";
import { simulateCircuit } from "../utils/simulation";

import { type Node, type Edge } from "@xyflow/react";

export type SignalMap = Record<string, 0 | 1>;

export type CircuitState = {
  nodes: Node[];
  edges: Edge[];
  signalMap: SignalMap;
  setNodes: (n: Node[] | ((prev: Node[]) => Node[])) => void;
  setEdges: (e: Edge[] | ((prev: Edge[]) => Edge[])) => void;
  updateSignal: (nodeId: string, value: 0 | 1) => void;
  simulateFromInputs: () => void;
  resetSignals: () => void;
};

export const useCircuitStore = create<CircuitState>((set, get) => ({
  nodes: [],
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

  simulateFromInputs: () => {
    const { nodes, edges, signalMap } = get();
    const newSignalMap = simulateCircuit(nodes, edges, signalMap);
    set({ signalMap: newSignalMap });
  },

  resetSignals: () => {
    set({ signalMap: {} });
  },
}));
