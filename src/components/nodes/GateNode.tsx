import React from "react";
import { Handle, Position } from "@xyflow/react";
import { useCircuitStore } from "../../store/useCircuitStore";

export default function GateNode({ id, data }: any) {
  const type = data?.type || "AND";
  const signal = useCircuitStore((state) => state.signalMap[id] ?? 0);

  return (
    <div className="node bg-white border">
      <div className="flex items-center gap-2">
        <div className="w-12 font-medium">{type}</div>
        <div
          className="led"
          style={{ background: signal ? "#22c55e" : "#ef4444" }}
        />
      </div>
      <Handle
        type="target"
        id="a"
        position={Position.Left}
        style={{ top: 10 }}
      />
      <Handle
        type="target"
        id="b"
        position={Position.Left}
        style={{ top: 34 }}
      />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
