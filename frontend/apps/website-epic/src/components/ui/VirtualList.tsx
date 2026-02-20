import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

interface VirtualListProps<T> {
  readonly items: T[];
  readonly renderItem: (item: T, index: number) => React.ReactNode;
  readonly itemHeight: number;
  readonly containerHeight: number;
  readonly overscan?: number;
  readonly className?: string;
  readonly onScroll?: (scrollTop: number) => void;
  readonly estimatedItemHeight?: number;
  readonly getItemKey?: (item: T, index: number) => string | number;
}

interface VirtualItem {
  readonly index: number;
  readonly offset: number;
  readonly size: number;
}

export function VirtualList<T>({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  overscan = 5,
  className,
  onScroll,
  estimatedItemHeight,
  getItemKey = (_, index) => index,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerSize, setContainerSize] = useState({ width: 0, height: containerHeight });
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerSize.height / itemHeight);
    const end = start + visibleCount;

    return {
      start: Math.max(0, start - overscan),
      end: Math.min(items.length, end + overscan),
    };
  }, [scrollTop, itemHeight, containerSize.height, overscan, items.length]);

  // Generate virtual items
  const virtualItems = useMemo(() => {
    const items: VirtualItem[] = [];
    for (let i = visibleRange.start; i < visibleRange.end; i++) {
      items.push({
        index: i,
        offset: i * itemHeight,
        size: itemHeight,
      });
    }
    return items;
  }, [visibleRange, itemHeight]);

  // Handle scroll
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const newScrollTop = e.currentTarget.scrollTop;
      setScrollTop(newScrollTop);
      onScroll?.(newScrollTop);
    },
    [onScroll]
  );

  // Resize observer for container
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Scroll to item functionality
  const scrollToItem = useCallback(
    (index: number, alignment: 'start' | 'center' | 'end' = 'start') => {
      if (!scrollElementRef.current) return;

      const itemOffset = index * itemHeight;
      let scrollTop: number;

      switch (alignment) {
        case 'center':
          scrollTop = itemOffset - containerSize.height / 2 + itemHeight / 2;
          break;
        case 'end':
          scrollTop = itemOffset - containerSize.height + itemHeight;
          break;
        default:
          scrollTop = itemOffset;
      }

      scrollElementRef.current.scrollTo({
        top: Math.max(0, scrollTop),
        behavior: 'smooth',
      });
    },
    [itemHeight, containerSize.height]
  );

  // Expose scroll methods via ref
  useEffect(() => {
    if (containerRef.current) {
      (containerRef.current as any).scrollToItem = scrollToItem;
    }
  }, [scrollToItem]);

  const totalHeight = items.length * itemHeight;

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      style={{ height: containerHeight }}
    >
      <div
        ref={scrollElementRef}
        className="h-full overflow-y-auto overflow-x-hidden"
        onScroll={handleScroll}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgb(156 163 175) rgb(17 24 39)',
        }}
      >
        {/* Spacer for total height */}
        <div style={{ height: totalHeight, position: 'relative' }}>
          {/* Virtual items */}
          <AnimatePresence>
            {virtualItems.map(virtualItem => {
              const item = items[virtualItem.index];
              const key = getItemKey(item, virtualItem.index);

              return (
                <motion.div
                  key={key}
                  className="absolute w-full"
                  style={{
                    transform: `translateY(${virtualItem.offset}px)`,
                    height: virtualItem.size,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.2,
                    ease: 'easeOut',
                  }}
                >
                  {renderItem(item, virtualItem.index)}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute right-2 top-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
        {Math.round(scrollTop)}px
      </div>
    </div>
  );
}

// Hook for dynamic item heights
export function useDynamicVirtualList<T>({
  items,
  renderItem,
  estimatedItemHeight,
  containerHeight,
  overscan = 5,
}: {
  readonly items: T[];
  readonly renderItem: (item: T, index: number) => React.ReactNode;
  readonly estimatedItemHeight: number;
  readonly containerHeight: number;
  readonly overscan?: number;
}) {
  const [itemSizes, setItemSizes] = useState<Map<number, number>>(new Map());
  const [scrollTop, setScrollTop] = useState(0);

  const getItemOffset = useCallback(
    (index: number): number => {
      let offset = 0;
      for (let i = 0; i < index; i++) {
        offset += itemSizes.get(i) || estimatedItemHeight;
      }
      return offset;
    },
    [itemSizes, estimatedItemHeight]
  );

  const findItemIndex = useCallback(
    (scrollTop: number): number => {
      let offset = 0;
      for (let i = 0; i < items.length; i++) {
        const itemSize = itemSizes.get(i) || estimatedItemHeight;
        if (offset + itemSize > scrollTop) {
          return i;
        }
        offset += itemSize;
      }
      return items.length - 1;
    },
    [itemSizes, estimatedItemHeight, items.length]
  );

  const visibleRange = useMemo(() => {
    const startIndex = findItemIndex(scrollTop);
    let endIndex = startIndex;
    let currentOffset = getItemOffset(startIndex);

    while (currentOffset < scrollTop + containerHeight && endIndex < items.length) {
      endIndex++;
      currentOffset += itemSizes.get(endIndex) || estimatedItemHeight;
    }

    return {
      start: Math.max(0, startIndex - overscan),
      end: Math.min(items.length, endIndex + overscan),
    };
  }, [
    scrollTop,
    containerHeight,
    findItemIndex,
    getItemOffset,
    itemSizes,
    estimatedItemHeight,
    items.length,
    overscan,
  ]);

  const totalHeight = useMemo(() => {
    let height = 0;
    for (let i = 0; i < items.length; i++) {
      height += itemSizes.get(i) || estimatedItemHeight;
    }
    return height;
  }, [itemSizes, estimatedItemHeight, items.length]);

  const updateItemSize = useCallback((index: number, size: number) => {
    setItemSizes(prev => new Map(prev).set(index, size));
  }, []);

  return {
    visibleRange,
    totalHeight,
    scrollTop,
    setScrollTop,
    updateItemSize,
    getItemOffset,
  };
}
