import Image from "next/image";

// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12 px-6">
      <div className="container mx-auto max-w-3xl">
        <div className="flex flex-col items-center mb-10">
          <Image
            src="/geekgodlogo.jpg"
            alt="GeekGod Logo"
            width={112}
            height={112}
            className="w-28 h-28 rounded-full shadow-lg mb-4 border-4 border-purple-500"
            priority
          />
          <h1 className="text-4xl font-extrabold text-center mb-2 bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text">
            About the Creator
          </h1>
        </div>
        <div className="bg-gray-800/80 rounded-xl shadow-lg p-8 mb-8">
          <p className="text-xl text-gray-100 mb-6 text-center">
            Hi, I’m{" "}
            <span className="text-purple-300 font-bold">Manan Goel</span> — a
            developer and lifelong learner.
          </p>
          <p className="text-lg text-gray-300 mb-6">
            I created{" "}
            <span className="text-purple-400 font-semibold">GeekGod</span> to help
            my fellow peers and the wider community truly{" "}
            <span className="text-yellow-300 font-bold">understand</span> the
            core ideas behind algorithms — not just memorize them.
          </p>
          <p className="text-lg text-gray-300 mb-6">
            As a student, I saw how confusing and intimidating algorithms could
            be. My goal was to make these concepts{" "}
            <span className="text-green-300 font-bold">crystal clear</span> and{" "}
            <span className="text-blue-300 font-bold">as easy as possible</span>{" "}
            for everyone, through interactive, visual, and hands-on learning.
          </p>
          <p className="text-lg text-gray-300 mb-6">
            GeekGod is my way of giving back: a free, modern, and beautiful
            resource for students, educators, and the curious. Every visualization
            is designed to make learning{" "}
            <span className="text-yellow-400 font-bold">fun</span>,{" "}
            <span className="text-green-400 font-bold">intuitive</span>, and{" "}
            <span className="text-blue-400 font-bold">accessible</span>.
          </p>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center mt-8">
            <a
              href="https://github.com/manan0209"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:scale-105 transition-transform"
              target="_blank"
              rel="noopener noreferrer"
            >
              My GitHub
            </a>
            <a
              href="mailto:manangoel0209@gmail.com"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-400 to-blue-400 text-white font-semibold shadow hover:scale-105 transition-transform"
            >
              Contact Me
            </a>
          </div>
        </div>
        <div className="text-center text-gray-400 text-sm mt-8">
          Built with{" "}
          <span className="text-teal-400">Next.js</span>,{" "}
          <span className="text-purple-400">Tailwind CSS</span>,{" "}
          <span className="text-blue-400">React</span>
          <br />
          Hosted on{" "}
          <span className="text-pink-400">Vercel</span>.
          <br />
          © {new Date().getFullYear()} Manan Goel. All rights reserved.
        </div>
      </div>
    </div>
  );
}
