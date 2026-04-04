import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col w-full">
      <main className="flex-1 w-full overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
