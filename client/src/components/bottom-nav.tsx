interface BottomNavProps {
  activeTab: 'home' | 'explore' | 'experts' | 'profile';
}

export function BottomNav({ activeTab }: BottomNavProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: 'fas fa-home', path: '/' },
    { id: 'explore', label: 'Explore', icon: 'fas fa-compass', path: '/explore' },
    { id: 'experts', label: 'Experts', icon: 'fas fa-users', path: '/experts' },
    { id: 'profile', label: 'Profile', icon: 'fas fa-user', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-neutral-200 safe-area-bottom z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <button 
            key={item.id}
            className={`flex flex-col items-center space-y-1 py-2 px-3 touch-manipulation ${
              activeTab === item.id ? 'text-primary' : 'text-neutral-400'
            }`}
            onClick={() => window.location.href = item.path}
          >
            <i className={`${item.icon} text-lg`}></i>
            <span className={`text-xs ${activeTab === item.id ? 'font-medium' : ''}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
