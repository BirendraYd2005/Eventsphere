function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">

        {/* Left Side */}
        <div>
          <p className="text-cyan-400 font-semibold text-lg">
            College Event Management Platform
          </p>

          <h1 className="text-6xl font-bold mt-4 leading-tight">
            Manage Your College
            <br />
            Events with
            <span className="text-cyan-400"> EventSphere</span>
          </h1>

          <p className="mt-6 text-gray-300 text-xl">
            Register for events, manage clubs, track registrations,
            receive notifications, and never miss a college event again.
          </p>

          <div className="mt-10 flex gap-4">
            <button className="bg-cyan-500 hover:bg-cyan-600 px-8 py-3 rounded-xl">
              Explore Events
            </button>

            <button className="border border-cyan-500 px-8 py-3 rounded-xl hover:bg-cyan-500">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex justify-center">
          <div className="flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=900"
              alt="College Event"
              className="w-full max-w-md rounded-3xl shadow-2xl animate-bounce"
            />
          </div>
        </div>

      </div>

    </section>
  );
}

export default Hero;