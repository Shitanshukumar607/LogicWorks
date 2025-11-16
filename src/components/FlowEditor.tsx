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
import { useCallback } from "react";
import { useCircuitStore } from "../store/useCircuitStore";
import GateNode from "./nodes/GateNode";
import InputNode from "./nodes/InputNode";
import OutputNode from "./nodes/OutputNode";

const nodeTypes = {
  inputNode: InputNode,
  outputNode: OutputNode,
  gateNode: GateNode,
};

export default function FlowEditor() {
  const { nodes, edges, setNodes, setEdges, simulateFromInputs, signalMap } =
    useCircuitStore();

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((edg) => applyEdgeChanges(changes, edg)),
    [setEdges]
  );

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((oldEdges) => addEdge(connection, oldEdges)),
    [setEdges]
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

  // const handleSave = () => {
  //   const data = { nodes, edges };
  //   const json = JSON.stringify(data, null, 2);
  //   const blob = new Blob([json], { type: "application/json" });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "circuit.json";
  //   a.click();
  //   URL.revokeObjectURL(url);
  // };

  // const handleLoad = (ev: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = ev.target.files?.[0];
  //   if (!file) return;
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     try {
  //       const data = JSON.parse(String(reader.result));
  //       importData(data);
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   };
  //   reader.readAsText(file);
  // };

  return (
    <div className="h-full w-full">
      <div className="p-2 bg-white flex gap-2 items-center">
        <select
          onChange={(e) => handleAddGate(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="">Add Gate...</option>
          <option value="INPUT">INPUT</option>
          <option value="OUTPUT">OUTPUT</option>
          <option value="AND">AND</option>
          <option value="OR">OR</option>
          <option value="NOT">NOT</option>
          <option value="NAND">NAND</option>
          <option value="NOR">NOR</option>
          <option value="XOR">XOR</option>
          <option value="XNOR">XNOR</option>
        </select>
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded"
          onClick={() => simulateFromInputs()}
        >
          Run Simulation
        </button>
      </div>
      <div className="h-[calc(100%-48px)]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          {/* <MiniMap /> */}
        </ReactFlow>
      </div>
    </div>
  );
}
