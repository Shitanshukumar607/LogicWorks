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

  return (
    <Panel position="top-center">
      <div className="w-44 p-2 bg-gray-50 border-r">
        <div className="mb-2 font-semibold">Gates</div>
        <div className="flex flex-col gap-2">
          {[
            "INPUT",
            "OUTPUT",
            "AND",
            "OR",
            "NOT",
            "NAND",
            "NOR",
            "XOR",
            "XNOR",
          ].map((g) => (
            <DraggableNode
              key={g}
              className="px-2 py-1 bg-white border rounded cursor-grab text-sm"
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

function DraggableNode({ children, nodeType, onDrop }: DraggableNodeProps) {
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

  return (
    <div className="dndnode" ref={draggableRef}>
      {children}
    </div>
  );
}

export default AllPanels;
