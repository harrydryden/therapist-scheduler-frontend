interface FilterBarProps {
  categories: string[];
  selectedCategory: string | null;
  onFilterChange: (category: string | null) => void;
}

export default function FilterBar({ categories, selectedCategory, onFilterChange }: FilterBarProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onFilterChange(null)}
          className={`px-5 py-2 text-sm font-semibold rounded-full transition-all ${
            selectedCategory === null
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onFilterChange(category)}
            className={`px-5 py-2 text-sm font-semibold rounded-full transition-all ${
              selectedCategory === category
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
