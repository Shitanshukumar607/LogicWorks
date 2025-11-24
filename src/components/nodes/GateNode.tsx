import React from "react";
import { Handle, Position } from "@xyflow/react";
import { useCircuitStore } from "../../store/useCircuitStore";
import type { GateType } from "../../utils/gates";

type GateShape = Exclude<GateType, "INPUT" | "OUTPUT">;

const iconPath = (fileName: string) =>
  new URL(`../..\/assets/${fileName}.svg`, import.meta.url).href;

const gateIcons: Record<GateShape, string> = {
  AND: iconPath("and"),
  OR: iconPath("or"),
  NAND: iconPath("nand"),
  NOR: iconPath("nor"),
  XOR: iconPath("xor"),
  XNOR: iconPath("xnor"),
  NOT: iconPath("not"),
};

const dualInputGates: GateShape[] = ["AND", "OR", "NAND", "NOR", "XOR", "XNOR"];

export default function GateNode({ id, data, selected }: any) {
  const rawType = (data?.type as GateType) ?? "AND";
  const type =
    rawType === "INPUT" || rawType === "OUTPUT"
      ? "AND"
      : (rawType as GateShape);
  const signal = useCircuitStore((state) => state.signalMap[id] ?? 0);
  const iconSrc = gateIcons[type];

  const targetHandles = dualInputGates.includes(type)
    ? [
        { id: "a", top: "25%" },
        { id: "b", top: "75%" },
      ]
    : [{ id: "a", top: "50%" }];

  return (
    <div
      className={`relative flex items-center justify-center p-0 min-w-0 min-h-0 bg-transparent shadow-none rounded-none transition-all duration-200 ${
        selected ? "ring-2 ring-black" : ""
      }`}
    >
      <div className="flex items-center justify-center relative">
        <img
          src={iconSrc}
          alt={`${type} gate`}
          className="h-[75px] object-contain pointer-events-none"
          style={{ fill: signal ? "#10b981" : "#e5e7eb" }}
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
      <Handle type="source" position={Position.Right} style={{ top: "50%" }} />
    </div>
  );
}
