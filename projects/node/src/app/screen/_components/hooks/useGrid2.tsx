'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const getRow = () => 9;
const getColumn = () => 16;

export default function GridSnapContainer() {
  const gridRef = useRef<HTMLDivElement>(null);
  
  const [gridInfo, setGridInfo] = useState<{
    cellWidth: number;
    cellHeight: number;
    borderWidth: number;
    gridLeft: number;
    gridTop: number;
  } | null>(null);

  const updateGridInfo = useCallback(() => {
    if (!gridRef.current) return;

    const el = gridRef.current;
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();

    // 1px borderの正確な幅を取得（zoom対応済み）
    const borderLeft = parseFloat(style.borderLeftWidth);
    const borderTop = parseFloat(style.borderTopWidth);
    const borderRight = parseFloat(style.borderRightWidth);
    const borderBottom = parseFloat(style.borderBottomWidth);

    // 内部の総コンテンツ領域（borderを除く）
    const contentWidth = el.clientWidth - borderLeft - borderRight;
    const contentHeight = el.clientHeight - borderTop - borderBottom;

    // セルの正確なサイズ（border-boxではなく、content領域を均等分割）
    const cellWidth = contentWidth / getColumn();
    const cellHeight = contentHeight / getRow();

    // グリッドの表示座標（ビューポート基準）
    const gridLeft = rect.left + borderLeft;
    const gridTop = rect.top + borderTop;

    setGridInfo({
      cellWidth: Number(cellWidth.toFixed(4)),   // 実用上十分な精度
      cellHeight: Number(cellHeight.toFixed(4)),
      borderWidth: borderLeft, // 左右上下同じ前提だが、個別に取れる
      gridLeft,
      gridTop,
    });
  }, []);

  // ResizeObserver + requestAnimationFrame で最高の安定性とパフォーマンス
  useEffect(() => {
    if (!gridRef.current) return;

    updateGridInfo(); // 初回

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(updateGridInfo);
    });

    ro.observe(gridRef.current);

    // ウィンドウリサイズも確実に拾う（親がflexでも安全）
    window.addEventListener('resize', updateGridInfo);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateGridInfo);
    };
  }, [updateGridInfo]);

  return (
    <>
      {/* グリッド本体 */}
      <div
        ref={gridRef}
        className="flex flex-col aspect-16/9 border-t border-l bg-slate-100 border-gray-400"
      >
        {Array.from({ length: getRow() }, (_, i) => (
          <div key={i} className="flex flex-1">
            {Array.from({ length: getColumn() }, (_, j) => (
              <div
                key={j}
                className="flex-1 border-r border-b border-gray-400"
              />
            ))}
          </div>
        ))}
      </div>

      {/* デバッグ用：グリッド情報表示 */}
      {gridInfo && (
        <div className="fixed top-4 left-4 bg-black/80 text-white p-3 rounded-md text-xs font-mono z-50">
          Cell: {gridInfo.cellWidth.toFixed(3)} × {gridInfo.cellHeight.toFixed(3)} px<br />
          Border: {gridInfo.borderWidth}px<br />
          Grid Pos: ({gridInfo.gridLeft.toFixed(1)}, {gridInfo.gridTop.toFixed(1)})
        </div>
      )}

      {/* ここからが本命：グリッドスナップ用fixed要素の例 */}
      <SnappableItem gridInfo={gridInfo} />
    </>
  );
}

// 完璧なグリッドスナップコンポーネント
function SnappableItem({ gridInfo }: { gridInfo: any }) {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridInfo || !itemRef.current) return;

    const { cellWidth, cellHeight, gridLeft, gridTop } = gridInfo;

    const handleMouseMove = (e: MouseEvent) => {
      if (!itemRef.current) return;

      const x = e.clientX - gridLeft;
      const y = e.clientY - gridTop;

      // 最も近いグリッド線にスナップ
      const snapCol = Math.round(x / cellWidth);
      const snapRow = Math.round(y / cellHeight);

      const snappedX = snapCol * cellWidth + gridLeft;
      const snappedY = snapRow * cellHeight + gridTop;

      itemRef.current.style.transform = `translate(${snappedX}px, ${snappedY}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [gridInfo]);

  if (!gridInfo) return null;

  return (
    <div
      ref={itemRef}
      className="fixed top-0 left-0 w-32 h-32 bg-red-500/60 border-4 border-red-700 pointer-events-none rounded-lg -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 z-40"
      style={{ transform: 'translate(0px, 0px)' }}
    >
      <div className="text-white text-center pt-10 font-bold">SNAP ME</div>
    </div>
  );
}