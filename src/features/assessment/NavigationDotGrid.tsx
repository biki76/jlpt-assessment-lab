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
  return (
    <div className="flex gap-2 overflow-x-auto py-2 px-1 scrollbar-hide">
      {Array.from({ length: total }, (_, i) => {
        const isAnswered = answeredIndices.includes(i);
        const isCurrent = i === currentIndex;

        return (
          <button
            key={i}
            onClick={() => onNavigate(i)}
            className={`flex-shrink-0 w-8 h-8 rounded-full text-xs font-bold tap-min transition-all ${
              isCurrent
                ? 'bg-primary-600 text-white ring-2 ring-primary-400 ring-offset-2 ring-offset-dark-900'
                : isAnswered
                ? 'bg-success text-white'
                : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
            }`}
          >
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}
