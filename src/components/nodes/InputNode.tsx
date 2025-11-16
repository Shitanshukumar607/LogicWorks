import React from "react";
import { Handle, Position } from "@xyflow/react";
import { useCircuitStore } from "../../store/useCircuitStore";

export default function InputNode({ id, data }: any) {
  const update = useCircuitStore((state) => state.updateSignal);
  const signal = useCircuitStore(
    (state) => state.signalMap[id] ?? (data?.value ? 1 : 0)
  );

  const toggle = () => {
    const newVal = signal ? 0 : 1;
    update(id, newVal);
    // trigger simulation
    useCircuitStore.getState().simulateFromInputs();
  };

  return (
    <div className="node bg-white border">
      <div className="flex items-center gap-2">
        <div className="w-10 text-sm">INPUT</div>
        <div
          className={`led`}
          style={{ background: signal ? "#22c55e" : "#ef4444" }}
        />
        <button className="ml-2 px-2 py-1 bg-gray-100 rounded" onClick={toggle}>
          {signal ? "1" : "0"}
        </button>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
