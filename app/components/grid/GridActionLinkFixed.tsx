import Link from "next/link";
import { memo, useCallback, useState } from "react";

interface GridLinkProps {
  hoveredRowHeight: number | null;
  items: { actionId: string; link: string; icon: React.ReactNode; title: string; onClick?: () => void }[];
}

const GridActionLinkFixed = memo(({ hoveredRowHeight, items }: GridLinkProps) => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const setHoverId = useCallback((actionId: string) => {
    setHoveredButton(actionId);
  }, []);

  const removeHoverId = useCallback(() => {
    setHoveredButton(null);
  }, []);

  return (
    <div className="md:px-2 flex flex-row bg-white gap-4 md:gap-3 justify-center items-center">
      {items.map((v, i) => (
        <div key={i} className="flex flex-col items-center justify-center relative">
          <div className="h-auto">
            {v.actionId === 'delete' || v.actionId === 'internal' ? (
              <button
                onClick={v.onClick}
                onMouseOver={() => setHoverId(v.actionId)}
                onMouseOut={removeHoverId}
                className="cursor-pointer hover:text-[#43ACD6]"
              >
                {v.icon}
              </button>
            ) : (
              <Link
                onMouseOver={() => setHoverId(v.actionId)}
                onMouseOut={removeHoverId}
                className="cursor-pointer hover:text-[#43ACD6]"
                href={v.link}
              >
                {v.icon}
              </Link>
            )}
          </div>

          {hoveredButton === v.actionId && (
            <div className="absolute top-9 h-10" style={{ pointerEvents: 'none' }}>
              <p className="bg-[#000000] py-1 px-2 rounded text-[13px] text-white font-medium capitalize">
                {v.title}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

GridActionLinkFixed.displayName = 'GridActionLinkFixed';
export default GridActionLinkFixed;
