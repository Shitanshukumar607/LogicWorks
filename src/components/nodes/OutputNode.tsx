import React from "react";
import { Handle, Position } from "@xyflow/react";
import { useCircuitStore } from "../../store/useCircuitStore";

export default function OutputNode({
  id,
  selected,
}: {
  id: string;
  selected?: boolean;
}) {
  const signal = useCircuitStore((state) => state.signalMap[id] ?? 0);
  return (
    <div
      className={`node bg-white ${selected ? "selected" : ""}`}
      style={{
        borderColor: signal ? "#10b981" : "#e5e7eb",
        borderWidth: "1px",
        background: signal ? "#10b981" : "#ffffff",
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="font-medium text-sm"
          style={{ color: signal ? "#ffffff" : "#1f2937" }}
        >
          OUTPUT
        </div>
      </div>
      <Handle type="target" position={Position.Left} />
    </div>
  );
}
