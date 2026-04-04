import { Search, Menu, UserCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectCurrentUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../features/auth/authApiSlice';

const TopBar = ({ searchTerm, setSearchTerm, toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      // Even if API fails, clear local state
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <header className="h-14 flex items-center px-6 bg-bg-main border-b border-border-subtle sticky top-0 z-20">
      <div className="flex items-center gap-6 w-64">
        <button 
          onClick={toggleSidebar}
          className="p-1 hover:bg-white/5 rounded-md text-text-secondary transition-colors"
        >
          <Menu size={20} strokeWidth={1.5} />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-accent rounded-md flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-text-primary tracking-tight">JotApp</span>
        </div>
      </div>

      <div className="flex-1 max-w-xl ml-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-secondary">
            <Search size={16} strokeWidth={1.5} />
          </div>
          <input
            type="text"
            placeholder="Search notes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-1.5 bg-white/5 border border-border-subtle rounded-md focus:ring-1 focus:ring-accent/50 focus:border-accent/50 focus:bg-white/[0.07] transition-all text-sm text-text-primary placeholder:text-text-secondary shadow-sm outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        <div className="flex items-center gap-2.5">
            <span className="text-xs font-medium text-text-secondary hidden sm:inline uppercase tracking-widest">
                {user?.email?.split('@')[0] || 'User'}
            </span>
            <button 
                onClick={handleLogout}
                className="p-1 hover:bg-white/5 rounded-md transition-colors"
                title="Logout"
            >
                <UserCircle size={24} strokeWidth={1.25} className="text-text-secondary" />
            </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
