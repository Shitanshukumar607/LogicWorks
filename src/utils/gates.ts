export type GateType =
  | "INPUT"
  | "OUTPUT"
  | "AND"
  | "OR"
  | "NAND"
  | "NOR"
  | "XOR"
  | "XNOR"
  | "NOT";

export function evaluateGate(type: GateType, inputs: number[]): 0 | 1 {
  switch (type) {
    case "AND":
      return inputs.every(Boolean) ? 1 : 0;
    case "OR":
      return inputs.some(Boolean) ? 1 : 0;
    case "NAND":
      return inputs.every(Boolean) ? 0 : 1;
    case "NOR":
      return inputs.some(Boolean) ? 0 : 1;
    case "XOR":
      return inputs.filter(Boolean).length === 1 ? 1 : 0;
    case "XNOR":
      return inputs.filter(Boolean).length !== 1 ? 1 : 0;
    case "NOT":
      return inputs[0] ? 0 : 1;
    default:
      return 0;
  }
}
