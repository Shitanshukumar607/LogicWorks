import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  type Node,
  OnConnect,
  OnEdgesChange,
  type OnNodesChange,
  ReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useMemo } from "react";
import { useCircuitStore } from "../store/useCircuitStore";
import GateNode from "./nodes/GateNode";
import InputNode from "./nodes/InputNode";
import OutputNode from "./nodes/OutputNode";
import AllPanels from "./Panels";

const nodeTypes = {
  inputNode: InputNode,
  outputNode: OutputNode,
  gateNode: GateNode,
};

export default function FlowEditor() {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    simulateFromInputs,
    signalMap,
    resetSignals,
  } = useCircuitStore();

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((edg) => applyEdgeChanges(changes, edg)),
    [setEdges]
  );

  const onConnect: OnConnect = useCallback(
    (connection) => {
      setEdges((oldEdges) => addEdge(connection, oldEdges));
      setTimeout(() => simulateFromInputs(), 50);
    },
    [setEdges, simulateFromInputs]
  );

  const handleAddGate = (type: string) => {
    const id = `${type}-${Date.now()}`;
    const pos = { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 };
    const newNode: Node = {
      id,
      position: pos,
      data: { label: type, type },
      type:
        type === "INPUT"
          ? "inputNode"
          : type === "OUTPUT"
          ? "outputNode"
          : "gateNode",
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const handleClearAll = () => {
    setNodes([]);
    setEdges([]);
    resetSignals();
  };

  const handleResetSignals = () => {
    resetSignals();
    // Re-run simulation with cleared signals
    setTimeout(() => simulateFromInputs(), 50);
  };

  // Style edges based on signal values - memoized for performance
  const styledEdges = useMemo(() => {
    return edges.map((edge) => {
      const sourceSignal = signalMap[edge.source];
      return {
        ...edge,
        animated: sourceSignal === 1,
        style: {
          stroke: sourceSignal === 1 ? "#10b981" : "#d1d5db",
          strokeWidth: 2,
        },
      };
    });
  }, [edges, signalMap]);

  return (
    <div className="h-full w-full flex">
      <div className="flex-1">
        <div className="p-2 bg-white flex gap-2 items-center border-b">
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => simulateFromInputs()}
          >
            Run Simulation
          </button>
          <button
            className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
            onClick={handleResetSignals}
          >
            🔄 Reset Signals
          </button>
          <button
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
            onClick={handleClearAll}
          >
            Clear All
          </button>
          <div className="ml-auto text-sm text-gray-600">
            Nodes: {nodes.length} | Connections: {edges.length}
          </div>
        </div>

        <div className="h-[calc(100%-48px)]">
          <ReactFlow
            nodes={nodes}
            edges={styledEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <AllPanels />

            <Background />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
