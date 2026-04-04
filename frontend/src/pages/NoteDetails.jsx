import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetNoteByIdQuery, useAddTagToNoteMutation, useRemoveTagFromNoteMutation } from '../features/notes/notesApiSlice';
import { 
  useGetTasksByNoteQuery, 
  useCreateTaskMutation, 
  useUpdateTaskStatusMutation, 
  useDeleteTaskMutation 
} from '../features/tasks/tasksApiSlice';
import { ArrowLeft, CheckCircle2, Circle, Clock, Loader2, Plus, Trash2, AlertCircle, Tag as TagIcon, X } from 'lucide-react';

const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: note, isLoading: isLoadingNote, isError: isNoteError } = useGetNoteByIdQuery(id);
  const { data: tasks = [], isLoading: isLoadingTasks } = useGetTasksByNoteQuery(id);
  
  const [createTask, { isLoading: isCreatingTask }] = useCreateTaskMutation();
  const [updateTaskStatus] = useUpdateTaskStatusMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [addTagToNote] = useAddTagToNoteMutation();
  const [removeTagFromNote] = useRemoveTagFromNoteMutation();
  
  const [taskDesc, setTaskDesc] = useState('');
  const [priority, setPriority] = useState('medium');
  const [newTagName, setNewTagName] = useState('');

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskDesc.trim()) return;
    try {
      await createTask({ noteId: id, taskDesc, priority }).unwrap();
      setTaskDesc('');
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleToggleStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      await updateTaskStatus({ id: taskId, status: newStatus, noteId: id }).unwrap();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
      try {
          await deleteTask({ id: taskId, noteId: id }).unwrap();
      } catch (err) {
          console.error('Failed to delete task:', err);
      }
  };

  const handleAddTag = async (e) => {
      e.preventDefault();
      if (newTagName.trim()) {
          try {
              await addTagToNote({ id, tagName: newTagName.trim() }).unwrap();
              setNewTagName('');
          } catch (err) {
              console.error('Failed to add tag:', err);
          }
      }
  };

  const handleRemoveTag = async (tagId) => {
      try {
          await removeTagFromNote({ id, tagId }).unwrap();
      } catch (err) {
          console.error('Failed to remove tag:', err);
      }
  };

  if (isLoadingNote || isLoadingTasks) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-bg-main gap-4">
        <Loader2 className="animate-spin text-accent" size={48} strokeWidth={1.5} />
        <p className="text-sm font-medium text-text-secondary animate-pulse uppercase tracking-[0.2em]">Loading Note</p>
      </div>
    );
  }

  if (isNoteError || !note) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg-main text-center p-6">
        <div className="w-16 h-16 bg-white/[0.02] border border-border-subtle rounded-2xl flex items-center justify-center mb-6">
            <AlertCircle size={28} strokeWidth={1} className="text-red-400 opacity-50" />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">Note not found</h2>
        <p className="text-text-secondary mb-8 max-w-xs">The note you're looking for might have been deleted or moved.</p>
        <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-border-subtle rounded-lg text-sm font-semibold text-text-primary transition-all"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main text-text-primary pb-24">
        <div className="max-w-4xl mx-auto px-6 pt-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm font-bold uppercase tracking-widest"
            >
                <ArrowLeft size={16} strokeWidth={2} />
                Back
            </button>

            {/* Note Header */}
            <div 
                className="bg-bg-surface p-8 rounded-2xl border border-border-subtle shadow-2xl relative overflow-hidden"
            >
                <div 
                    className="absolute top-0 left-0 w-full h-1.5 opacity-80" 
                    style={{ backgroundColor: note.bg || 'var(--color-accent)' }}
                ></div>
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-3xl font-bold tracking-tight text-text-primary">{note.title || "Untitled Note"}</h1>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-white/5 text-text-secondary border border-white/[0.03] uppercase tracking-widest">
                        {new Date(note.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
                <p className="text-text-secondary text-base whitespace-pre-wrap leading-relaxed font-medium mb-8">
                    {note.desc || note.description || 'No description available.'}
                </p>

                {/* Tags Section In Header */}
                <div className="flex flex-wrap items-center gap-3 border-t border-white/[0.03] pt-6">
                    <div className="flex items-center gap-2 mr-2">
                        <TagIcon size={14} className="text-text-secondary opacity-40" />
                        <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] opacity-40">Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {note.tags?.map(tagWrapper => {
                            const tag = tagWrapper.tag || tagWrapper;
                            return (
                                <span key={tag.id} className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                                    {tag.name}
                                    <button onClick={() => handleRemoveTag(tag.id)} className="hover:text-red-400 transition-colors">
                                        <X size={10} strokeWidth={3} />
                                    </button>
                                </span>
                            );
                        })}
                        <form onSubmit={handleAddTag} className="flex items-center bg-white/5 border border-white/10 rounded-md px-2 py-1 ml-1 group focus-within:border-accent/30 transition-all">
                            <input 
                                type="text" 
                                placeholder="Add Tag..." 
                                value={newTagName}
                                onChange={(e) => setNewTagName(e.target.value)}
                                className="bg-transparent border-none focus:ring-0 text-[10px] font-bold w-16 outline-none placeholder:text-text-secondary/30 uppercase tracking-widest"
                            />
                            <button type="submit" className="p-0.5 hover:text-accent transition-colors">
                                <Plus size={12} strokeWidth={3} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Tasks Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-4 ml-1">
                    <h2 className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.3em] opacity-40 flex items-center gap-2">
                        Tasks
                        <span className="w-5 h-5 flex items-center justify-center bg-white/5 rounded-full text-[9px]">
                            {tasks?.length || 0}
                        </span>
                    </h2>
                    <div className="h-px flex-1 bg-border-subtle opacity-50" />
                </div>

                {/* Create Task Form */}
                <form onSubmit={handleCreateTask} className="flex flex-col sm:flex-row gap-3 bg-white/[0.02] p-5 rounded-xl border border-border-subtle">
                    <input
                        type="text"
                        value={taskDesc}
                        onChange={(e) => setTaskDesc(e.target.value)}
                        className="flex-1 bg-white/5 border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all font-medium"
                        placeholder="What needs to be done?"
                        required
                    />
                    <div className="flex gap-2">
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="bg-white/5 border border-border-subtle rounded-lg px-3 py-2.5 text-xs font-bold text-text-secondary uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-accent/50"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <button
                            type="submit"
                            disabled={isCreatingTask}
                            className="flex-1 sm:flex-none bg-accent hover:bg-accent/90 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-accent/10"
                        >
                            {isCreatingTask ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} strokeWidth={2.5} />}
                            <span>Add Task</span>
                        </button>
                    </div>
                </form>

                {/* Tasks List */}
                <div className="space-y-3">
                    {tasks?.length === 0 ? (
                        <div className="text-center py-16 bg-white/[0.01] rounded-2xl border border-dashed border-border-subtle/50 text-text-secondary">
                            <p className="text-sm font-medium opacity-50 italic">No tasks for this note yet.</p>
                        </div>
                    ) : (
                        tasks?.map((task) => (
                            <div
                                key={task.id}
                                className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 group ${
                                    task.status === 'completed' 
                                        ? 'bg-white/[0.01] border-transparent opacity-60' 
                                        : 'bg-bg-surface border-border-subtle hover:border-white/10 shadow-sm'
                                }`}
                            >
                                <button
                                    onClick={() => handleToggleStatus(task.id, task.status)}
                                    className={`transition-all duration-300 ${
                                        task.status === 'completed' ? 'text-accent' : 'text-text-secondary/30 hover:text-text-secondary'
                                    }`}
                                >
                                    {task.status === 'completed' ? <CheckCircle2 size={22} strokeWidth={2.5} /> : <Circle size={22} strokeWidth={1.5} />}
                                </button>
                                
                                <div className="flex-1">
                                    <p className={`text-sm font-semibold transition-all duration-300 ${task.status === 'completed' ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
                                        {task.taskDesc}
                                    </p>
                                    <div className="flex items-center gap-4 mt-1.5 text-[10px] font-bold uppercase tracking-widest">
                                        <span className={`flex items-center gap-1.5 ${
                                            task.priority === 'high' ? 'text-red-400' : 
                                            task.priority === 'medium' ? 'text-amber-400' : 'text-blue-400'
                                        }`}>
                                            <div className={`w-1 h-1 rounded-full ${
                                                task.priority === 'high' ? 'bg-red-400' : 
                                                task.priority === 'medium' ? 'bg-amber-400' : 'bg-blue-400'
                                            }`} />
                                            {task.priority}
                                        </span>
                                        {task.deadline && (
                                            <span className="text-text-secondary/50 flex items-center gap-1.5">
                                                <Clock size={12} strokeWidth={2} />
                                                {new Date(task.deadline).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="text-text-secondary/20 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100 p-2 hover:bg-red-400/5 rounded-md"
                                >
                                    <Trash2 size={16} strokeWidth={1.5} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default NoteDetails;
