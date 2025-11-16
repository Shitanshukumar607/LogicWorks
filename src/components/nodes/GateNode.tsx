import React from "react";
import { Handle, Position } from "@xyflow/react";
import { useCircuitStore } from "../../store/useCircuitStore";

export default function GateNode({ id, data, selected }: any) {
  const type = data?.type || "AND";
  const signal = useCircuitStore((state) => state.signalMap[id] ?? 0);

  return (
    <div
      className={`node bg-white ${selected ? "selected" : ""}`}
      style={{
        borderColor: signal ? "#10b981" : "#e5e7eb",
        borderWidth: "2px",
        background: signal ? "#10b981" : "#ffffff",
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="font-medium text-sm"
          style={{ color: signal ? "#ffffff" : "#1f2937" }}
        >
          {type}
        </div>
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
        style={{ top: 30 }}
      />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
