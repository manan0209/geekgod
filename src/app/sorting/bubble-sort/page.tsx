"use client";

import { useState, useEffect } from "react";
import { dataset } from "@/utils/dataset";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function BubbleSortPage() {
  const [array, setArray] = useState<number[]>([...dataset]);
  const [isSorting, setIsSorting] = useState(false);
  const [colors, setColors] = useState<string[]>(
    new Array(array.length).fill("default")
  );
  const [speed, setSpeed] = useState<number>(300);
  const [isClient, setIsClient] = useState(false);
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null);
  const [copyStatus, setCopyStatus] = useState<string>("Copy Code");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const bubbleSort = async () => {
    setIsSorting(true);
    const arr = [...array];
    const colorArray = new Array(arr.length).fill("default");
    setHighlightedLine(null);

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        colorArray[j] = "compare";
        colorArray[j + 1] = "compare";
        setColors([...colorArray]);
        setHighlightedLine(1); // Highlight comparison line
        await new Promise((resolve) => setTimeout(resolve, speed));

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          colorArray[j] = "swap";
          colorArray[j + 1] = "swap";
          setColors([...colorArray]);
          setHighlightedLine(3); // Highlight swap line
          await new Promise((resolve) => setTimeout(resolve, speed));
        }

        colorArray[j] = "default";
        colorArray[j + 1] = "default";
      }
      colorArray[arr.length - i - 1] = "sorted";
      setColors([...colorArray]);
      setHighlightedLine(5); // Highlight sorted line
    }
    setIsSorting(false);
  };

  const resetArray = () => {
    const newDataset = dataset;
    setArray([...newDataset]);
    setColors(new Array(newDataset.length).fill("default"));
    setHighlightedLine(null);
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopyStatus("Copied!");
        setTimeout(() => setCopyStatus("Copy Code"), 1500);
      })
      .catch((err) => {
        setCopyStatus("Failed to Copy");
        setTimeout(() => setCopyStatus("Copy Code"), 1500);
      });
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-6">
      <h1 className="text-4xl font-extrabold text-center mb-6">Bubble Sort</h1>

      {/* Main content wrapper */}
      <div className="flex flex-col lg:flex-row justify-center gap-8 mb-6">
        {/* Visualization Card (Left Side) */}
        <div className="w-full lg:w-1/2 bg-gray-800 rounded-lg shadow-lg p-4 overflow-hidden">
          <h2 className="text-xl font-bold text-center mb-4 text-gray-200">
            Array Visualization
          </h2>
          <div className="flex items-end justify-center gap-2">
            {array.map((value, index) => (
              <div
                key={index}
                style={{ height: `${value * 5}px` }}
                className={`w-8 text-center text-sm ${
                  colors[index] === "compare"
                    ? "bg-yellow-400"
                    : colors[index] === "swap"
                    ? "bg-red-500"
                    : colors[index] === "sorted"
                    ? "bg-green-500"
                    : "bg-purple-500"
                }`}
              >
                {value}
              </div>
            ))}
          </div>
        </div>

        {/* Pseudocode Card (Right Side) */}
        <div className="w-full lg:w-1/2 bg-gray-800 rounded-lg shadow-lg p-6 overflow-hidden">
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-200">
            Pseudocode
          </h2>
          <pre className="text-sm text-gray-200">
            <code>
              {`for i = 0 to length(arr) - 1:
    for j = 0 to length(arr) - i - 1:
        if arr[j] > arr[j + 1]:
            swap(arr[j], arr[j + 1])
        mark arr[j] and arr[j + 1] as compared
    mark arr[i] as sorted`}
            </code>
          </pre>

          {/* Highlight pseudocode lines */}
          <p className="mt-2 text-yellow-400 text-md">
            {highlightedLine === 1 && (
              <span className="bg-black">Comparison</span>
            )}
            {highlightedLine === 3 && <span className="bg-black">Swap</span>}
            {highlightedLine === 5 && (
              <span className="bg-black">Mark as Sorted</span>
            )}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={bubbleSort}
          disabled={isSorting}
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        >
          Start Sorting
        </button>
        <button
          onClick={resetArray}
          disabled={isSorting}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
        >
          Reset
        </button>
      </div>

      {/* Speed Control */}
      <div className="flex justify-center gap-4 mb-6">
        <label className="text-lg">Speed:</label>
        <input
          type="range"
          min="50"
          max="1000"
          step="50"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-48"
        />
        <span>{speed} ms</span>
      </div>

      {/* Extra: Interactive Data Set Options */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setArray([10, 15, 20, 5, 30, 25, 50, 45, 35, 40])}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Dataset 1
        </button>
        <button
          onClick={() => setArray([19, 33, 17, 21, 15, 6, 8, 20, 14, 10])}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Dataset 2
        </button>
      </div>

      <div className="flex flex-col lg:flex-row justify-center gap-8 mb-6">
        {/* C++ Code Implementation Section */}
        <div className="w-full lg:w-1/2 bg-gray-800 rounded-lg shadow-lg p-6 relative">
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-200">
            C++ Code
          </h2>

          {/* Syntax Highlighter for C++ Code */}
          <SyntaxHighlighter
            language="cpp"
            style={dracula}
            customStyle={{
              background: "#1e293b",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            {`
// GeekGod by devmnn
// Learn algorithms visually at GeekGod! 🚀

      #include <iostream>
      using namespace std;

// Bubble Sort implementation
void bubbleSort(int arr[], int n) {
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      // Swap if the current element is greater than the next
      if (arr[j] > arr[j + 1]) {
        swap(arr[j], arr[j + 1]);
      }
    }
  }
}

int main() {
  // Input array to be sorted
  int arr[] = {64, 34, 25, 12, 22, 11, 90};
  int n = sizeof(arr) / sizeof(arr[0]);

  // Call the Bubble Sort function
  bubbleSort(arr, n);

  // Display the sorted array
  cout << "Sorted array: ";
  for (int i = 0; i < n; i++) {
    cout << arr[i] << " ";
  }
  
  cout <<  endl << "Code brought to you by GeekGod, crafted by devmnn. Happy Learning! 🌟" << endl;
  
  return 0;
}`}
          </SyntaxHighlighter>

          {/* Copy Button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() =>
                copyToClipboard(
                  `
// GeekGod by devmnn
// Learn algorithms visually at GeekGod! 🚀

      #include <iostream>
      using namespace std;

// Bubble Sort implementation
void bubbleSort(int arr[], int n) {
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      // Swap if the current element is greater than the next
      if (arr[j] > arr[j + 1]) {
        swap(arr[j], arr[j + 1]);
      }
    }
  }
}

int main() {
  // Input array to be sorted
  int arr[] = {64, 34, 25, 12, 22, 11, 90};
  int n = sizeof(arr) / sizeof(arr[0]);

  // Call the Bubble Sort function
  bubbleSort(arr, n);

  // Display the sorted array
  cout << "Sorted array: ";
  for (int i = 0; i < n; i++) {
    cout << arr[i] << " ";
  }
  
  cout <<  endl << "Code brought to you by GeekGod, crafted by devmnn. Happy Learning! 🌟" << endl;
  
  return 0;
}`
                )
              }
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded shadow-md transition-all"
            >
              {copyStatus}
            </button>
          </div>
        </div>

        {/* Explanation Section */}
        <div className="w-full lg:w-1/2 bg-gray-800 rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-semibold text-center mb-6 text-gray-200">
            Bubble Sort - Explained Simply
          </h2>
          <p className="text-lg text-gray-300 mb-6">
            Imagine you have a bunch of marbles lined up in a row, and you want
            to sort them from smallest to biggest. Bubble Sort works like a
            playful game: it compares two marbles next to each other and swaps
            them if the bigger one comes first. This "bubbling up" continues
            until everything is perfectly sorted!
          </p>
          <p className="text-lg text-gray-300 mb-6">
            For developers, Bubble Sort is a simple algorithm to understand but
            not the most efficient for large datasets. It’s great for learning
            how sorting works but is rarely used in real-world applications
            because of its slowness for large inputs.
          </p>
          <div className="text-gray-300">
            <p className="text-xl font-medium mb-4">
              <strong>How it Works:</strong>
            </p>
            <ul className="list-inside list-disc mb-6">
              <li>Start from the first pair of items in the list.</li>
              <li>Compare them: if the first is bigger, swap them.</li>
              <li>Move to the next pair and repeat.</li>
              <li>Keep doing this until no more swaps are needed!</li>
            </ul>
            <p className="text-xl font-medium mb-4">
              <strong>Performance Details:</strong>
            </p>
            <ul className="list-inside list-disc">
              <li>
                <strong>Best Case:</strong>{" "}
                <span className="text-blue-400">O(n)</span> (The list is already
                sorted, so just one pass is enough.)
              </li>
              <li>
                <strong>Average Case:</strong>{" "}
                <span className="text-orange-400">O(n²)</span> (It goes through
                many swaps for partially sorted lists.)
              </li>
              <li>
                <strong>Worst Case:</strong>{" "}
                <span className="text-red-400">O(n²)</span> (The list is
                completely reversed, requiring the maximum swaps.)
              </li>
            </ul>
          </div>
          <p className="text-gray-400 italic mt-6 text-center">
            "Brought to you by <span className="text-blue-500">GeekGod</span> –
            turning algorithms into child's play!"
          </p>
        </div>
      </div>
    </div>
  );
}
