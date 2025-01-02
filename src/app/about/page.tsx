// src/app/about/page.tsx
export default function AboutPage() {
    return (
      <div className="min-h-screen bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-extrabold text-center mb-8">
            About the Creator
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            Hi, I’m a passionate developer who loves building interactive tools to help others learn.
          </p>
          <p className="text-lg text-gray-300 mb-6">
            I created <span className="text-purple-400">GeekGod</span> to simplify the process of learning complex algorithms. 
            With its visual approach, students can understand and master sorting, greedy, and pathfinding algorithms in an engaging way.
          </p>
          <p className="text-lg text-gray-300 mb-6">
            GeekGod is built using modern technologies like <span className="text-teal-400">Next.js</span>, 
            <span className="text-purple-400">Tailwind CSS</span>, and <span className="text-blue-400">D3.js</span>. 
            The platform is hosted on <span className="text-pink-400">Vercel</span>.
          </p>
          <p className="text-lg text-gray-300 mb-6">
            Feel free to reach out or explore my other projects:
            <a
              href="https://github.com/your-github"
              className="text-blue-400 hover:underline ml-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Profile
            </a>
          </p>
        </div>
      </div>
    );
  }
  