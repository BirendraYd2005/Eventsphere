function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-slate-900/70 backdrop-blur-md border-b border-slate-700 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">
        <h1 className="text-3xl font-bold text-cyan-400">
          EventSphere
        </h1>

        <ul className="flex gap-8 text-lg">
          <li><a href="#" className="hover:text-cyan-400">Home</a></li>
          <li><a href="#" className="hover:text-cyan-400">Events</a></li>
          <li><a href="#" className="hover:text-cyan-400">About</a></li>
          <li><a href="#" className="hover:text-cyan-400">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;