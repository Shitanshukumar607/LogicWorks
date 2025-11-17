import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  type Edge,
  MarkerType,
  MiniMap,
  OnConnect,
  OnEdgesChange,
  type OnNodesChange,
  OnReconnect,
  ReactFlow,
  reconnectEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useMemo, useRef } from "react";
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
  const { nodes, edges, setNodes, setEdges, simulateFromInputs, signalMap } =
    useCircuitStore();

  const edgeReconnectSuccessful = useRef(true);

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

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect: OnReconnect = useCallback((oldEdge, newConnection) => {
    edgeReconnectSuccessful.current = true;
    setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
  }, []);

  const onReconnectEnd = useCallback(
    (_: MouseEvent | TouchEvent, edge: Edge) => {
      if (!edgeReconnectSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
      edgeReconnectSuccessful.current = true;
    },
    []
  );

  const styledEdges = useMemo(() => {
    return edges.map((edge) => {
      const sourceSignal = signalMap[edge.source];
      return {
        ...edge,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
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
      <div className="h-full w-full">
        <ReactFlow
          nodes={nodes}
          edges={styledEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onReconnect={onReconnect}
          onReconnectStart={onReconnectStart}
          onReconnectEnd={onReconnectEnd}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <AllPanels />
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}
