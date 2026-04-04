import { useGetAllTagsQuery } from '../features/notes/notesApiSlice';
import { Lightbulb, Tag, Loader2 } from 'lucide-react';

const Sidebar = ({ activeFilter, setActiveFilter }) => {
  const { data: tags = [], isLoading } = useGetAllTagsQuery();

  const menuItems = [
    { id: 'all', label: 'Notes', icon: Lightbulb },
  ];

  return (
    <aside className="w-64 h-full bg-bg-main flex flex-col pt-6 pr-4 pl-2 overflow-y-auto">
      <div className="space-y-0.5">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveFilter(item.id)}
            className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
              activeFilter === item.id 
                ? 'bg-accent/10 text-accent' 
                : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
            }`}
          >
            <item.icon size={16} strokeWidth={activeFilter === item.id ? 2 : 1.5} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 border-t border-border-subtle pt-6">
        <h3 className="px-3.5 text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-3 opacity-50">Tags</h3>
        <div className="space-y-0.5">
          {isLoading ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 text-text-secondary opacity-50">
                <Loader2 size={12} className="animate-spin" />
                <span className="text-xs">Loading...</span>
            </div>
          ) : tags.length > 0 ? (
            tags.map((tag) => (
                <button
                key={tag.id}
                onClick={() => setActiveFilter(`tag:${tag.id}`)}
                className={`w-full flex items-center gap-3 px-3.5 py-1.5 rounded-md transition-all duration-200 text-sm font-medium ${
                    activeFilter === `tag:${tag.id}`
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                }`}
                >
                <Tag size={16} strokeWidth={1.5} />
                <span className="truncate">{tag.name}</span>
                </button>
            ))
          ) : (
            <p className="px-3.5 py-2 text-[11px] text-text-secondary opacity-40 italic">No tags yet</p>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
