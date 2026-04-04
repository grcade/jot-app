import { useState } from 'react';
import { useUpdateNoteMutation, useDeleteNoteMutation, useAddTagToNoteMutation, useRemoveTagFromNoteMutation } from '../features/notes/notesApiSlice';
import { useGetTasksByNoteQuery, useUpdateTaskStatusMutation } from '../features/tasks/tasksApiSlice';
import { Palette, Tag as TagIcon, Trash2, CheckCircle2, Circle, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const NoteCard = ({ note }) => {
  const { data: tasks = [] } = useGetTasksByNoteQuery(note.id);
  const [updateNote] = useUpdateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [addTagToNote] = useAddTagToNoteMutation();
  const [removeTagFromNote] = useRemoveTagFromNoteMutation();
  
  const [showActions, setShowActions] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  const handleToggleTask = async (e, taskId, currentStatus) => {
    e.preventDefault();
    e.stopPropagation();
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
        await updateTaskStatus({ id: taskId, status: newStatus, noteId: note.id }).unwrap();
    } catch (err) {
        console.error('Failed to update task status:', err);
    }
  };

  const handleDelete = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.confirm('Are you sure you want to delete this note?')) {
          try {
              await deleteNote(note.id).unwrap();
          } catch (err) {
              console.error('Failed to delete note:', err);
          }
      }
  };

  const handleColorChange = async (e, colorValue) => {
      e.preventDefault();
      e.stopPropagation();
      try {
          // Backend expects 'bg' for update
          await updateNote({ id: note.id, bg: colorValue }).unwrap();
      } catch (err) {
          console.error('Failed to change color:', err);
      }
  };

  const handleAddTag = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (newTagName.trim()) {
          try {
              await addTagToNote({ id: note.id, tagName: newTagName.trim() }).unwrap();
              setNewTagName('');
              setShowTagInput(false);
          } catch (err) {
              console.error('Failed to add tag:', err);
          }
      }
  };

  const handleRemoveTag = async (e, tagId) => {
      e.preventDefault();
      e.stopPropagation();
      try {
          await removeTagFromNote({ id: note.id, tagId }).unwrap();
      } catch (err) {
          console.error('Failed to remove tag:', err);
      }
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

  const cardBgColor = note.bg || '#1a1a1a';

  return (
    <div 
      className="group relative rounded-xl border border-border-subtle transition-all duration-300 flex flex-col h-fit hover:shadow-xl hover:border-white/10"
      style={{ backgroundColor: cardBgColor }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => { setShowActions(false); setShowTagInput(false); }}
    >
      <Link to={`/notes/${note.id}`} className="p-5 flex-1">
        <div className="flex justify-between items-start mb-3">
          {note.title && <h3 className="font-bold text-text-primary text-[15px] leading-snug pr-6 tracking-tight">{note.title}</h3>}
        </div>

        {note.description || note.desc ? (
          <p className="text-text-secondary text-sm mb-5 line-clamp-8 whitespace-pre-wrap leading-relaxed font-medium">
            {note.description || note.desc}
          </p>
        ) : null}

        {tasks.length > 0 && (
          <div className="space-y-2 mt-2">
            {tasks.slice(0, 4).map(task => (
              <div 
                key={task.id} 
                className="flex items-start gap-3 group/task cursor-pointer"
                onClick={(e) => handleToggleTask(e, task.id, task.status)}
              >
                <div className={`mt-0.5 transition-colors ${task.status === 'completed' ? 'text-accent' : 'text-text-secondary/50 group-hover/task:text-text-secondary'}`}>
                  {task.status === 'completed' ? <CheckCircle2 size={16} strokeWidth={2} /> : <Circle size={16} strokeWidth={1.5} />}
                </div>
                <span className={`text-[13px] leading-5 transition-all ${task.status === 'completed' ? 'line-through text-text-secondary/40' : 'text-text-secondary group-hover/task:text-text-primary'}`}>
                  {task.taskDesc}
                </span>
              </div>
            ))}
            {tasks.length > 4 && (
              <p className="text-[11px] font-bold text-text-secondary/50 pl-7 mt-2 uppercase tracking-wider">
                + {tasks.length - 4} more items
              </p>
            )}
          </div>
        )}

        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-6">
              {note.tags?.map(tagWrapper => {
                  const tag = tagWrapper.tag || tagWrapper;
                  return (
                    <span key={tag.id} className="flex items-center gap-1 px-2 py-0.5 bg-white/5 text-[9px] font-bold text-text-secondary rounded-md uppercase tracking-widest border border-white/5">
                        {tag.name}
                        <button 
                            onClick={(e) => handleRemoveTag(e, tag.id)}
                            className="hover:text-red-400 ml-0.5 opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <X size={8} strokeWidth={3} />
                        </button>
                    </span>
                  );
              })}
          </div>
        )}
      </Link>

      <div className={`flex items-center justify-between px-3 py-1.5 border-t border-white/[0.03] transition-all duration-300 ${showActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
        <div className="flex items-center gap-0.5 text-text-secondary">
          <div className="relative group/colors">
            <button className="p-2 hover:bg-white/5 hover:text-text-primary rounded-md transition-all" title="Background options">
              <Palette size={15} strokeWidth={1.5} />
            </button>
            <div className="absolute bottom-full left-0 mb-3 p-2 bg-bg-surface shadow-2xl border border-border-subtle rounded-xl hidden group-hover/colors:grid grid-cols-4 gap-1.5 z-30">
                {colors.map(c => (
                    <button 
                        key={c.name}
                        onClick={(e) => handleColorChange(e, c.value)}
                        className={`w-6 h-6 rounded-md border border-white/5 hover:border-white/40 transition-all ${note.bg === c.value ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg-surface' : ''}`}
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                    />
                ))}
            </div>
          </div>
          
          <div className="relative">
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowTagInput(!showTagInput); }}
                className={`p-2 hover:bg-white/5 hover:text-text-primary rounded-md transition-all ${showTagInput ? 'text-accent bg-white/5' : ''}`} 
                title="Add tag"
              >
                <TagIcon size={15} strokeWidth={1.5} />
              </button>
              {showTagInput && (
                  <div className="absolute bottom-full left-0 mb-3 p-2 bg-bg-surface border border-border-subtle rounded-xl shadow-2xl z-30 flex items-center gap-1">
                      <input 
                        type="text" 
                        placeholder="Tag name..."
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag(e)}
                        className="bg-white/5 border border-border-subtle rounded-md px-2 py-1 text-[11px] outline-none focus:ring-1 focus:ring-accent/50 w-24"
                      />
                      <button onClick={handleAddTag} className="p-1 hover:text-accent transition-colors">
                          <Plus size={14} />
                      </button>
                  </div>
              )}
          </div>

          <button 
            onClick={handleDelete}
            className="p-2 hover:bg-white/5 hover:text-red-400 rounded-md transition-all" 
            title="Delete note"
          >
            <Trash2 size={15} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
