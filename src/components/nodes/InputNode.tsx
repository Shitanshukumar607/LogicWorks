import { Handle, Position } from "@xyflow/react";
import { useCircuitStore } from "../../store/useCircuitStore";

export default function InputNode({ id, data, selected }: any) {
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
    <div
      className={`node bg-white ${selected ? "selected" : ""}`}
      onClick={toggle}
      style={{
        borderColor: signal ? "#10b981" : "#e5e7eb",
        borderWidth: "1px",
        background: signal ? "#10b981" : "#f3f4f6",
        cursor: "pointer",
      }}
    >
      <div className="flex items-center gap-2">
        <div
          className="font-medium text-sm"
          style={{ color: signal ? "#ffffff" : "#6b7280" }}
        >
          INPUT
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
