import { useState, useEffect, useMemo } from 'react';
import { useGetNotesQuery } from '../features/notes/notesApiSlice';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import QuickNote from '../components/QuickNote';
import NoteCard from '../components/NoteCard';
import { Loader2, Search } from 'lucide-react';


const Dashboard = () => {




    const [cursor, setCursor] = useState(null);
    // const [hasMore, setHasMore] = useState(true);


    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [allNotes, setAllNotes] = useState([]);

    const { data, isLoading, isError } = useGetNotesQuery(cursor);


    const notes = data?.notes || [];
    const totalNotesCount = data?.totalNotesCount || 0;


    useEffect(() => {
  if (!data?.notes) return;

  // eslint-disable-next-line react-hooks/set-state-in-effect
   setAllNotes(prev => {
    const existingIds = new Set(prev.map(n => n.id));
    const newNotes = data.notes.filter(n => !existingIds.has(n.id));

    if (newNotes.length === 0) return prev;

    return [...prev, ...newNotes];
  });
}, [data?.notes]);



    const filteredNotes = useMemo(() => {
        return allNotes.filter(note => {
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
}) }, [allNotes, searchTerm, activeFilter]);

const hasMore = useMemo(() => {
  if (allNotes.length === 0) return false;

  if (filteredNotes.length === 0) return false;

  if (totalNotesCount === allNotes.length) return false;

  return true;
}, [allNotes.length, filteredNotes.length, totalNotesCount]);




  const handleLoadMore = () => {
      if (hasMore && !isLoading && notes.length > 0) {
            const enCursor = btoa(allNotes.at(-1)?.id);

          setCursor(enCursor);
        }


  }
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

                    {hasMore && (
                        <div className="col-span-full flex justify-center">
                      <button onClick={handleLoadMore} className=' text-center hover:text-amber-50 hover:cursor-pointer py-2 text-sm text-text-secondary'>
                        load more...
                      </button>
                      </div>
                    )}
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
