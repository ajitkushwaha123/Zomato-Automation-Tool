import { useRef, useState, useCallback } from "react";

export const useResizableColumns = (initialWidths) => {
  const resizingRef = useRef(null);
  const [columnWidths, setColumnWidths] = useState(() => {
    return Object.keys(initialWidths).reduce((acc, colId) => {
      acc[colId] = initialWidths[colId] || 150;
      return acc;
    }, {});
  });

  const handleResize = useCallback(
    (e, colId) => {
      resizingRef.current = {
        startX: e.clientX,
        colId,
        startWidth: columnWidths[colId] || 150,
      };

      const onMouseMove = (moveEvent) => {
        if (!resizingRef.current) return;

        const { startX, colId, startWidth } = resizingRef.current;
        const newWidth = Math.max(
          50,
          startWidth + (moveEvent.clientX - startX)
        ); 

        requestAnimationFrame(() => {
          setColumnWidths((prev) => {
            if (prev[colId] === newWidth) return prev; 
            return { ...prev, [colId]: newWidth };
          });
        });
      };

      const onMouseUp = () => {
        resizingRef.current = null;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.body.style.cursor = "default"; 
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "col-resize";
    },
    [columnWidths]
  );

  return { columnWidths, handleResize };
};
