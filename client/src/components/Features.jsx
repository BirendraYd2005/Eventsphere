import { CalendarDays, Users, Bell } from "react-icons/fa6";

function Features() {
  const features = [
    {
      icon: <CalendarDays size={40} />,
      title: "Manage Events",
      desc: "Create and manage college events easily."
    },
    {
      icon: <Users size={40} />,
      title: "Student Registration",
      desc: "Students can register for events in seconds."
    },
    {
      icon: <Bell size={40} />,
      title: "Instant Notifications",
      desc: "Stay updated with event announcements."
    }
  ];

  return (
    <section className="py-24 px-6">

      <h2 className="text-5xl font-bold text-center mb-16">
        Why Choose
        <span className="text-cyan-400"> EventSphere?</span>
      </h2>

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">

        {features.map((feature, index) => (

          <div
            key={index}
            className="bg-slate-900 rounded-3xl p-8 border border-slate-700 hover:border-cyan-400 transition duration-300"
          >

            <div className="text-cyan-400 mb-6">
              {feature.icon}
            </div>

            <h3 className="text-2xl font-bold mb-4">
              {feature.title}
            </h3>

            <p className="text-gray-300">
              {feature.desc}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Features;