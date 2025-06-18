# GeekGod - Algorithm Visualization Tool

GeekGod is an interactive web application designed to help users visualize and understand various computer science algorithms through animations and step-by-step execution. The project is built with Next.js and features a modern, responsive UI.

## 🚀 Features

- **Sorting Algorithms**
  - Bubble Sort
  - Insertion Sort
  - Merge Sort
  - Quick Sort
  
- **Pathfinding Algorithms** (Coming Soon!)
  - Dijkstra's Algorithm
  - A* Search
  - BFS
  - DFS

- **Greedy Algorithms** (Coming Soon!)

- **Interactive Visualizations**
  - Step-by-step execution
  - Speed control
  - Color-coded elements for better understanding
  - Pseudocode highlighting

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 13+ (App Router)
- **Styling**: Tailwind CSS
- **Visualization**: Custom-built with React
- **Type Safety**: TypeScript
- **Icons**: React Icons
- **Code Highlighting**: react-syntax-highlighter

## 🚀 Getting Started

### Prerequisites

- Node.js 16.8 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/manan0209/geekgod.git
   cd geekgod
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🎯 Usage

1. Navigate to the algorithm you want to visualize from the home page
2. Click "Start Sorting" to begin the visualization
3. Use the speed control to adjust the animation speed
4. Click "Reset" to start over with a new random dataset
5. Follow along with the highlighted pseudocode to understand the algorithm's steps

## 🛠 Project Structure

```
src/
├── app/                    # App router pages
│   ├── sorting/            # Sorting algorithms
│   ├── pathfinding/        # Pathfinding algorithms (coming soon)
│   ├── greedy/             # Greedy algorithms (coming soon)
│   ├── about/              # About page
│   └── layout.tsx          # Root layout
├── components/             # Reusable components
└── utils/                  # Utility functions and data
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by various algorithm visualization tools
- Built with ❤️ using Next.js and Tailwind CSS
