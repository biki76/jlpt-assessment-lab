import { useRef, useEffect } from 'react';

interface NavigationDotGridProps {
  total: number;
  currentIndex: number;
  answeredIndices: number[];
  onNavigate: (index: number) => void;
}

export function NavigationDotGrid({
  total,
  currentIndex,
  answeredIndices,
  onNavigate,
}: NavigationDotGridProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to keep active button centered
  useEffect(() => {
    if (activeButtonRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeBtn = activeButtonRef.current;
      
      const containerRect = container.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      
      // Calculate scroll position to center the active button
      const scrollLeft = container.scrollLeft + btnRect.left - containerRect.left - (containerRect.width / 2) + (btnRect.width / 2);
      
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [currentIndex]);

  return (
    <div 
      ref={scrollContainerRef}
      className="flex gap-2.5 overflow-x-auto py-3 px-1 scrollbar-hide scroll-smooth"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {Array.from({ length: total }, (_, i) => {
        const isAnswered = answeredIndices.includes(i);
        const isCurrent = i === currentIndex;

        return (
          <button
            key={i}
            ref={isCurrent ? activeButtonRef : null}
            onClick={() => onNavigate(i)}
            className={`flex-shrink-0 w-10 h-10 rounded-full text-sm font-bold tap-min transition-all duration-200 ${
              isCurrent
                ? 'bg-primary-600 text-white scale-110 shadow-lg shadow-primary-600/30 ring-2 ring-primary-400 ring-offset-2 ring-offset-dark-900'
                : isAnswered
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                : 'bg-dark-800 text-gray-500 border border-dark-700 hover:bg-dark-700 hover:text-gray-400'
            }`}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
