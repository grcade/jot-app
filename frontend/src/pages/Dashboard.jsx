import { useState } from 'react';
import { useGetNotesQuery } from '../features/notes/notesApiSlice';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import QuickNote from '../components/QuickNote';
import NoteCard from '../components/NoteCard';
import { Loader2, Search } from 'lucide-react';

const Dashboard = () => {
  const { data: notes = [], isLoading, isError } = useGetNotesQuery();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = 
      note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.desc?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter.startsWith('tag:')) {
      const tagId = activeFilter.split(':')[1];
      // Note: Backend returns tags as an array of NoteTag objects with an included tag
      return note.tags?.some(tagWrapper => (tagWrapper.tag?.id || tagWrapper.tagId) === tagId);
    }
    return true;
  });

  return (
    <div className="flex flex-col h-screen bg-bg-main overflow-hidden text-text-primary">
      <TopBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      
      <div className="flex flex-1 overflow-hidden">
        {isSidebarOpen && (
          <Sidebar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        )}
        
        <main className="flex-1 overflow-y-auto bg-bg-main px-8 pb-24 scrollbar-hide">
          <div className="max-w-[1400px] mx-auto pt-10">
            <QuickNote />

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="animate-spin text-accent" size={32} strokeWidth={1.5} />
                <p className="text-sm font-medium text-text-secondary animate-pulse uppercase tracking-[0.2em]">Loading Workspace</p>
              </div>
            ) : isError ? (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                    <p className="text-red-400">Error loading notes. Please try again later.</p>
                </div>
            ) : (
              <div className="space-y-16">
                <section>
                  {filteredNotes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-16 h-16 bg-white/[0.02] border border-border-subtle rounded-2xl flex items-center justify-center mb-6">
                            <Search size={28} strokeWidth={1} className="text-text-secondary opacity-30" />
                        </div>
                        <h3 className="text-lg font-semibold text-text-primary mb-1">No notes found</h3>
                        <p className="text-sm text-text-secondary max-w-xs">Start creating some ideas or try a different search term.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                      {filteredNotes.map(note => (
                        <NoteCard key={note.id} note={note} />
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
