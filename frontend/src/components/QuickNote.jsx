import { useState, useRef, useEffect } from 'react';
import { useAddNoteMutation, useAddTagToNoteMutation } from '../features/notes/notesApiSlice';
import { Palette, Loader2, Tag as TagIcon, Plus, X } from 'lucide-react';

const QuickNote = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bg, setBg] = useState('#1a1a1a');
  const [tagName, setTagName] = useState('');
  const [tags, setTags] = useState([]);

  const [addNote, { isLoading: isAddingNote }] = useAddNoteMutation();
  const [addTagToNote] = useAddTagToNoteMutation();
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        if (!title.trim() && !description.trim() && tags.length === 0) {
          setIsExpanded(false);
          resetForm();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [title, description, tags]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setBg('#1a1a1a');
    setTags([]);
    setTagName('');
  };

  const handleSave = async () => {
    if (!title.trim() && !description.trim()) {
      setIsExpanded(false);
      resetForm();
      return;
    }

    try {
    
      const result = await addNote({ title, description, bg }).unwrap();

      // Add tags if any using the new note's ID
      if (tags.length > 0 && result.note?.id) {
          for (const t of tags) {
              await addTagToNote({ id: result.note.id, tagName: t }).unwrap();
          }
      }

      resetForm();
      setIsExpanded(false);
    } catch (err) {
      console.error('Failed to save note:', err);
    }
  };

  const handleAddTag = (e) => {
      e.preventDefault();
      if (tagName.trim() && !tags.includes(tagName.trim())) {
          setTags([...tags, tagName.trim()]);
          setTagName('');
      }
  };

  const removeTag = (tagToRemove) => {
      setTags(tags.filter(t => t !== tagToRemove));
  };

  const colors = [
    { name: 'default', value: '#1a1a1a' },
    { name: 'ruby', value: '#442222' },
    { name: 'amber', value: '#443311' },
    { name: 'emerald', value: '#113322' },
    { name: 'cyan', value: '#113344' },
    { name: 'indigo', value: '#222244' },
    { name: 'violet', value: '#332244' },
    { name: 'rose', value: '#442233' },
  ];

  return (
    <div className="flex justify-center mb-16">
      <div
        ref={containerRef}
        className={`w-full max-w-2xl bg-bg-surface border border-border-subtle rounded-xl transition-all duration-300 overflow-hidden ${
          isExpanded ? 'shadow-[0_0_30px_rgba(0,0,0,0.6)] border-accent/30' : 'hover:border-white/20'
        }`}
        style={{ backgroundColor: isExpanded ? bg : undefined }}
      >
        {!isExpanded ? (
          <div
            className="flex items-center px-5 py-3.5 cursor-text"
            onClick={() => setIsExpanded(true)}
          >
            <span className="text-text-secondary text-sm font-medium">Take a note...</span>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center px-5 pt-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 bg-transparent text-text-primary text-base font-semibold border-none focus:ring-0 placeholder:text-text-secondary/50 outline-none"
                autoFocus
              />
            </div>
            <textarea
              placeholder="Take a note..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="px-5 py-3 bg-transparent text-text-primary text-sm border-none focus:ring-0 resize-none min-h-[120px] placeholder:text-text-secondary/50 font-medium leading-relaxed outline-none"
            />

            {/* Tags area */}
            <div className="px-5 pb-3 flex flex-wrap gap-2">
                {tags.map(t => (
                    <span key={t} className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                        {t}
                        <button onClick={() => removeTag(t)} className="hover:text-red-400 transition-colors">
                            <X size={10} strokeWidth={3} />
                        </button>
                    </span>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between px-3 py-2 border-t border-white/[0.03] gap-3">
              <div className="flex items-center gap-1 text-text-secondary">
                <div className="relative group/colors">
                    <button className="p-2 hover:bg-white/5 rounded-md transition-colors" title="Background options">
                        <Palette size={16} strokeWidth={1.5} />
                    </button>
                    <div className="absolute bottom-full left-0 mb-3 p-2 bg-bg-surface shadow-2xl border border-border-subtle rounded-xl hidden group-hover/colors:grid grid-cols-4 gap-1.5 z-30">
                        {colors.map(c => (
                            <button
                                key={c.name}
                                onClick={() => setBg(c.value)}
                                className={`w-6 h-6 rounded-md border border-white/5 hover:border-white/40 transition-all ${bg === c.value ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg-surface' : ''}`}
                                style={{ backgroundColor: c.value }}
                                title={c.name}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-2 py-0.5 ml-1">
                    <TagIcon size={12} className="text-text-secondary mr-2" />
                    <input
                        type="text"
                        placeholder="Add tag..."
                        value={tagName}
                        onChange={(e) => setTagName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag(e)}
                        className="bg-transparent border-none focus:ring-0 text-[11px] font-medium w-20 outline-none placeholder:text-text-secondary/40"
                    />
                    <button onClick={handleAddTag} className="p-1 hover:text-accent transition-colors">
                        <Plus size={14} />
                    </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => { setIsExpanded(false); resetForm(); }}
                  className="px-4 py-1.5 text-[12px] font-bold text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-md transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isAddingNote || (!title.trim() && !description.trim())}
                  className="px-6 py-1.5 text-[12px] font-bold bg-accent hover:bg-accent/90 text-white rounded-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/10"
                >
                  {isAddingNote ? <Loader2 size={14} className="animate-spin" /> : <span>Add Note</span>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickNote;
