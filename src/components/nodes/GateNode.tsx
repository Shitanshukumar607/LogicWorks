import React from "react";
import { Handle, Position } from "@xyflow/react";
import { useCircuitStore } from "../../store/useCircuitStore";
import type { GateType } from "../../utils/gates";

import AndGate from "../../assets/and.tsx";
import OrGate from "../../assets/or.tsx";
import NandGate from "../../assets/nand.tsx";
import NorGate from "../../assets/nor.tsx";
import XorGate from "../../assets/xor.tsx";
import XnorGate from "../../assets/xnor.tsx";
import NotGate from "../../assets/not.tsx";

type GateShape = Exclude<GateType, "INPUT" | "OUTPUT">;

interface GateProps {
  fill?: string;
  className?: string;
}

const gateIcons: Record<GateShape, React.FC<GateProps>> = {
  AND: AndGate,
  OR: OrGate,
  NAND: NandGate,
  NOR: NorGate,
  XOR: XorGate,
  XNOR: XnorGate,
  NOT: NotGate,
};

const dualInputGates: GateShape[] = ["AND", "OR", "NAND", "NOR", "XOR", "XNOR"];

export default function GateNode({ id, data, selected }: any) {
  const rawType = (data?.type as GateType) ?? "AND";
  const type =
    rawType === "INPUT" || rawType === "OUTPUT"
      ? "AND"
      : (rawType as GateShape);
  const signal = useCircuitStore((state) => state.signalMap[id] ?? 0);
  const GateComponent = gateIcons[type];

  const targetHandles = dualInputGates.includes(type)
    ? [
        { id: "a", top: "25%" },
        { id: "b", top: "75%" },
      ]
    : [{ id: "a", top: "50%" }];

  return (
    <div
      className={`relative flex items-center justify-center p-0 min-w-0 min-h-0 bg-transparent shadow-none rounded-none transition-all duration-200 ${
        selected ? "ring-black" : ""
      }`}
    >
      <div className="flex items-center justify-center relative ">
        <GateComponent
          fill={signal ? "#10b981" : "#ffffff"}
          className="pointer-events-none h-[50px] w-full"
        />
      </div>
      {targetHandles.map((handle) => (
        <Handle
          key={handle.id}
          type="target"
          id={handle.id}
          position={Position.Left}
          style={{ top: handle.top }}
        />
      ))}
      <Handle
        id="source"
        type="source"
        position={Position.Right}
        style={{ top: "50%" }}
      />
    </div>
  );
}
