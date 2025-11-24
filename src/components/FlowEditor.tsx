import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  type Edge,
  type IsValidConnection,
  MarkerType,
  MiniMap,
  type Node,
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

type HandleLimit = {
  target?: Record<string, number>;
};

const handleLimitConfig: Record<string, HandleLimit> = {
  gateNode: { target: { a: 1, b: 1 } },
  outputNode: { target: { target: 1 } },
};

const handleKey = (nodeId: string, handleId: string) => `${nodeId}|${handleId}`;

export default function FlowEditor() {
  const { nodes, edges, setNodes, setEdges, simulateFromInputs, signalMap } =
    useCircuitStore();

  const nodesById = useMemo(() => {
    const map = new Map<string, Node>();
    nodes.forEach((node) => map.set(node.id, node));
    return map;
  }, [nodes]);
  const handleCounts = useMemo(() => {
    const counts = new Map<string, number>();
    const bump = (key: string) => counts.set(key, (counts.get(key) ?? 0) + 1);
    edges.forEach((edge) => {
      if (edge.targetHandle) bump(handleKey(edge.target, edge.targetHandle));
    });
    return counts;
  }, [edges]);

  const hasReachedLimit = useCallback(
    (nodeId: string, handleId: string) => {
      const limit =
        handleLimitConfig[nodesById.get(nodeId)?.type ?? ""]?.target?.[
          handleId
        ];
      if (!limit) {
        return false;
      }
      return (handleCounts.get(handleKey(nodeId, handleId)) ?? 0) >= limit;
    },
    [handleCounts, nodesById],
  );

  const isValidConnection: IsValidConnection = useCallback(
    (connection) => {
      if (
        !connection.source ||
        !connection.target ||
        !connection.targetHandle
      ) {
        return false;
      }
      return !hasReachedLimit(connection.target, connection.targetHandle);
    },
    [hasReachedLimit],
  );

  const edgeReconnectSuccessful = useRef(true);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((edg) => applyEdgeChanges(changes, edg)),
    [setEdges],
  );

  const onConnect: OnConnect = useCallback(
    (connection) => {
      if (
        connection.source === connection.target ||
        !isValidConnection(connection)
      ) {
        return;
      }

      setEdges((oldEdges) => addEdge(connection, oldEdges));
      setTimeout(() => simulateFromInputs(), 50);
    },
    [setEdges, simulateFromInputs, isValidConnection],
  );

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect: OnReconnect = useCallback(
    (oldEdge, newConnection) => {
      if (!isValidConnection(newConnection)) {
        edgeReconnectSuccessful.current = false;
        return;
      }

      edgeReconnectSuccessful.current = true;
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    },
    [isValidConnection, setEdges],
  );

  const onReconnectEnd = useCallback(
    (_: MouseEvent | TouchEvent, edge: Edge) => {
      if (!edgeReconnectSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
      edgeReconnectSuccessful.current = true;
    },
    [],
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
          isValidConnection={isValidConnection}
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
