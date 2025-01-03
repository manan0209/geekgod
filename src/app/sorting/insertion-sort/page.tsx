// src/app/sorting/insertion-sort/page.tsx
"use client";

import { useState, useEffect } from "react";
import { dataset } from "@/utils/dataset";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function InsertionSortPage() {
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

  const insertionSort = async () => {
    setIsSorting(true);
    const arr = [...array];
    let colorArray = new Array(arr.length).fill("default");
    setColors([...colorArray]);

    for (let i = 1; i < arr.length; i++) {
      let j = i;
      colorArray[j] = "compare";
      setColors([...colorArray]);
      setHighlightedLine(0); // Highlighting comparison line
      await delay(speed);

      while (j > 0 && arr[j] < arr[j - 1]) {
        [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
        setArray([...arr]);
        colorArray[j] = "swap";
        colorArray[j - 1] = "swap";
        setColors([...colorArray]);
        setHighlightedLine(1); // Highlighting swap line
        await delay(speed);
        colorArray[j] = "default";
        colorArray[j - 1] = "default";
        j--;
      }
      colorArray[j] = "sorted";
      setColors([...colorArray]);
      setHighlightedLine(2); // Highlighting mark sorted line
    }
    setIsSorting(false);
  };

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const resetArray = () => {
    const newDataset = dataset;
    setArray([...newDataset]);
    setColors(new Array(newDataset.length).fill("default"));
    setHighlightedLine(null); // Reset highlighted line
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(Number(e.target.value));
  };

  const updateDataset = (newDataset: number[]) => {
    setArray(newDataset);
    setColors(new Array(newDataset.length).fill("default"));
    setHighlightedLine(null); // Reset highlighted line
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

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-6">
      <h1 className="text-4xl font-extrabold text-center mb-6">
        Insertion Sort
      </h1>

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
          <SyntaxHighlighter language="javascript" style={dracula}>
            {`for i = 1 to length(arr) - 1:  // Start from the second element
  key = arr[i]  // Set the current element as the key
  j = i - 1  // Set j to the previous index

  // Move elements of arr[0..i-1] that are > key to one position ahead
  while j >= 0 and arr[j] > key:
    arr[j + 1] = arr[j]  // Move element one position to the right
    j = j - 1  // Check the next previous element

  arr[j + 1] = key  // Insert the key in the correct position`}
          </SyntaxHighlighter>

          {/* Highlighting pseudocode based on colors */}
          <div className="mt-2 text-yellow-400 text-md">
            {highlightedLine === 0 && (
              <span className="bg-black text-white p-1">Comparison Line</span>
            )}
            {highlightedLine === 1 && (
              <span className="bg-black text-white p-1">Swap Line</span>
            )}
            {highlightedLine === 2 && (
              <span className="bg-black text-white p-1">Sorted Line</span>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={insertionSort}
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
          onChange={handleSpeedChange}
          className="w-48"
        />
        <span>{speed} ms</span>
      </div>

      {/* Extra: Interactive Data Set Options */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => updateDataset([10, 15, 20, 5, 30, 25, 50, 45, 35, 40])}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Dataset 1
        </button>
        <button
          onClick={() => updateDataset([19, 33, 17, 21, 15, 6, 8, 20, 14, 10])}
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

// Insertion Sort implementation
void insertionSort(int arr[], int n) {
  for (int i = 1; i < n; i++) {
    int key = arr[i];  // The current element (key)
    int j = i - 1;     // Start comparing with the element before the key

    // Shift elements of arr[0..i-1] that are greater than the key to one position ahead
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];  // Move the element one position to the right
      j = j - 1;  // Check the next previous element
    }

    arr[j + 1] = key;  // Insert the key at its correct position
  }
}

int main() {
  // Input array to be sorted
  int arr[] = {64, 34, 25, 12, 22, 11, 90};
  int n = sizeof(arr) / sizeof(arr[0]);

  // Call the Insertion Sort function
  insertionSort(arr, n);

  // Display the sorted array
  cout << "Sorted array: ";
  for (int i = 0; i < n; i++) {
    cout << arr[i] << " ";
  }

  cout << endl << "Code brought to you by GeekGod, crafted with ❤️ by devmnn. Happy Learning! 🌟" << endl;

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

// Insertion Sort implementation
void insertionSort(int arr[], int n) {
  for (int i = 1; i < n; i++) {
    int key = arr[i];  // The current element (key)
    int j = i - 1;     // Start comparing with the element before the key

    // Shift elements of arr[0..i-1] that are greater than the key to one position ahead
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];  // Move the element one position to the right
      j = j - 1;  // Check the next previous element
    }

    arr[j + 1] = key;  // Insert the key at its correct position
  }
}

int main() {
  // Input array to be sorted
  int arr[] = {64, 34, 25, 12, 22, 11, 90};
  int n = sizeof(arr) / sizeof(arr[0]);

  // Call the Insertion Sort function
  insertionSort(arr, n);

  // Display the sorted array
  cout << "Sorted array: ";
  for (int i = 0; i < n; i++) {
    cout << arr[i] << " ";
  }

  cout << endl << "Code brought to you by GeekGod, crafted with ❤️ by devmnn. Happy Learning! 🌟" << endl;

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

        {/* Insertion Sort Explanation Section */}
        <div className="w-full lg:w-1/2 bg-gray-800 rounded-lg shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-200">
            Insertion Sort - Explained Simply
          </h2>
          <p className="text-lg leading-relaxed text-gray-300 mb-6">
            Imagine you are sorting a deck of cards in your hands, and you pick
            one card at a time, placing it in the correct position among the
            cards you have already sorted. This is how Insertion Sort works: it
            picks an element, compares it to the ones before it, and "inserts"
            it in the right place.
          </p>
          <p className="text-lg leading-relaxed text-gray-300 mb-6">
            Insertion Sort is a straightforward algorithm but can be inefficient
            for large datasets due to its time complexity. However, it’s
            efficient for small or nearly sorted datasets, making it useful in
            practice for specific cases.
          </p>
          <div className="text-gray-300">
            <p className="text-xl font-medium mb-4">
              <strong>How it Works:</strong>
            </p>
            <ul className="list-inside list-disc mb-6">
              <li>
                Start with the second element in the list (since the first
                element is already considered sorted).
              </li>
              <li>
                Compare it to the elements before it, shifting them to the right
                if they are greater than the current element.
              </li>
              <li>Insert the current element in its correct position.</li>
              <li>
                Repeat until all elements are inserted in the correct order!
              </li>
            </ul>
            <p className="text-xl font-medium mb-4">
              <strong>Performance Details:</strong>
            </p>
            <ul className="list-inside list-disc">
              <li>
                <strong>Best Case:</strong>{" "}
                <span className="text-blue-400">O(n)</span> (The list is already
                sorted, so no swaps are needed.)
              </li>
              <li>
                <strong>Average Case:</strong>{" "}
                <span className="text-orange-400">O(n²)</span> (It will perform
                several comparisons and shifts.)
              </li>
              <li>
                <strong>Worst Case:</strong>{" "}
                <span className="text-red-400">O(n²)</span> (The list is sorted
                in reverse order, requiring the maximum number of shifts.)
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
