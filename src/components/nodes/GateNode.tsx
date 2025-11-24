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
  NAND: iconPath("and"),
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
        { id: "a", top: "32%" },
        { id: "b", top: "68%" },
      ]
    : [{ id: "a", top: "50%" }];

  return (
    <div
      className={`node gate-node ${selected ? "selected" : ""}`}
      style={{
        borderColor: signal ? "#10b981" : "#e5e7eb",
        borderWidth: "2px",
        padding: 0,
        minWidth: 0,
        minHeight: 0,
        background: "transparent",
        boxShadow: "none",
        borderRadius: 0,
        position: "relative",
      }}
    >
      <div className="gate-visual">
        <img src={iconSrc} alt={`${type} gate`} className="gate-icon" />
        {(type === "NAND" || type === "XNOR") && (
          <img
            src={iconPath("gate-dot")}
            alt=""
            className="gate-bubble"
            aria-hidden="true"
          />
        )}
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
