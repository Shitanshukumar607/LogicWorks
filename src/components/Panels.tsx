import { useDraggable } from "@neodrag/react";
import { Panel, useReactFlow, XYPosition } from "@xyflow/react";
import { useCallback, useRef, useState } from "react";
import { useCircuitStore } from "../store/useCircuitStore";

interface DraggableNodeProps {
  className?: string;
  children: React.ReactNode;
  nodeType: string;
  onDrop: (nodeType: string, position: XYPosition) => void;
}

const AllPanels = () => {
  const { setNodes } = useCircuitStore();
  const { screenToFlowPosition } = useReactFlow();

  const handleNodeDrop = useCallback(
    (nodeType: string, screenPosition: XYPosition) => {
      const flow = document.querySelector(".react-flow");
      const flowRect = flow?.getBoundingClientRect();
      const isInFlow =
        flowRect &&
        screenPosition.x >= flowRect.left &&
        screenPosition.x <= flowRect.right &&
        screenPosition.y >= flowRect.top &&
        screenPosition.y <= flowRect.bottom;

      if (isInFlow) {
        const position = screenToFlowPosition(screenPosition);
        const id = `${nodeType}-${Date.now()}`;

        const newNode = {
          id,
          position,
          data: { label: nodeType, type: nodeType },
          type:
            nodeType === "INPUT"
              ? "inputNode"
              : nodeType === "OUTPUT"
              ? "outputNode"
              : "gateNode",
        };

        setNodes((prev) => [...prev, newNode]);
      }
    },
    [setNodes, screenToFlowPosition]
  );

  const gates = [
    "INPUT",
    "OUTPUT",
    "AND",
    "OR",
    "NOT",
    "NAND",
    "NOR",
    "XOR",
    "XNOR",
  ];

  return (
    <Panel position="top-center" className="px-4 pointer-events-none">
      <div
        className="
        pointer-events-auto
        flex w-full max-w-4xl items-center justify-between
        rounded-xl border border-neutral-300/60 bg-white/70
        px-4 py-2 shadow-sm backdrop-blur-md
      "
      >
        <div className="mx-auto flex flex-1 flex-wrap items-center justify-center gap-2 sm:mx-0">
          {gates.map((g) => (
            <DraggableNode
              key={g}
              className="
              rounded-md border border-neutral-300/70 bg-white/60
              px-3 py-1.5 text-[0.75rem] font-medium text-neutral-800
              shadow-sm backdrop-blur-sm cursor-grab
              transition-all duration-150 ease-out
              hover:bg-neutral-100 hover:border-neutral-400 hover:-translate-y-0.5
              active:scale-95 select-none
            "
              nodeType={
                g === "INPUT"
                  ? "inputNode"
                  : g === "OUTPUT"
                  ? "outputNode"
                  : "gateNode"
              }
              onDrop={(_, pos) => handleNodeDrop(g, pos)}
            >
              {g}
            </DraggableNode>
          ))}
        </div>
      </div>
    </Panel>
  );
};

function DraggableNode({
  children,
  className,
  nodeType,
  onDrop,
}: DraggableNodeProps) {
  const draggableRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<XYPosition>({ x: 0, y: 0 });

  useDraggable(draggableRef, {
    position: position,
    onDrag: ({ offsetX, offsetY }) => {
      setPosition({
        x: offsetX,
        y: offsetY,
      });
    },
    onDragEnd: ({ event }) => {
      setPosition({ x: 0, y: 0 });
      onDrop(nodeType, {
        x: event.clientX,
        y: event.clientY,
      });
    },
  });

  const combinedClassName = ["dndnode", className].filter(Boolean).join(" ");

  return (
    <div className={combinedClassName} ref={draggableRef}>
      {children}
    </div>
  );
}

export default AllPanels;
