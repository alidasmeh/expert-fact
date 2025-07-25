export function TopBar() {
  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-neutral-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <i className="fas fa-brain text-white text-sm"></i>
          </div>
          <h1 className="text-lg font-semibold text-neutral-900">ExpertVoice</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center touch-manipulation">
            <i className="fas fa-search text-neutral-600 text-sm"></i>
          </button>
          <button className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center touch-manipulation">
            <i className="fas fa-bell text-neutral-600 text-sm"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
