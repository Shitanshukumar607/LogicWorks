import React from "react";
import { Handle, Position } from "@xyflow/react";
import { useCircuitStore } from "../../store/useCircuitStore";

export default function OutputNode({ id }: any) {
  const signal = useCircuitStore((state) => state.signalMap[id] ?? 0);
  return (
    <div className="node bg-white border">
      <div className="flex items-center gap-2">
        <div className="w-10 text-sm">OUTPUT</div>
        <div
          className="led"
          style={{ background: signal ? "#22c55e" : "#ef4444" }}
        />
      </div>
      <Handle type="target" position={Position.Left} />
    </div>
  );
}
