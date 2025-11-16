# Logic Circuit Simulator

A small React + Vite app to visually design and simulate digital logic circuits using a node-based editor (React Flow / XYFlow).

## Features

- Drag & drop logic gates (INPUT, OUTPUT, AND, OR, NOT, NAND, NOR, XOR, XNOR)
- Connect gates with edges (wires)
- Toggle INPUT nodes to propagate signals
- Run simulation and see outputs (LEDs) update
- Save and load circuit JSON

## Setup (Windows PowerShell)

1. Install dependencies

```powershell
cd "c:\Users\SHITANSHU KUMAR\OneDrive\Desktop\logic-circuit"
npm install
```

2. Run dev server

```powershell
npm run dev
```

3. Open the dev URL shown by Vite in your browser.

## Notes & Next Steps

- This repo uses Zustand for global state and a simple BFS propagation algorithm.
- Improve: edge coloring, cycle detection, better topological evaluation, UI polish with shadcn components.
