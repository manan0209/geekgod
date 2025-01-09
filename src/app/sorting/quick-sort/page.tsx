"use client";

import { useState, useEffect } from "react";
import { dataset } from "@/utils/dataset";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function QuickSortPage() {
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

  const quickSort = async (
    arr: number[],
    startIdx: number,
    endIdx: number
  ): Promise<number[]> => {
    if (startIdx >= endIdx) return arr;

    const pivotIdx = await partition(arr, startIdx, endIdx);

    // Highlight partitioning action
    setHighlightedLine(0);
    await delay(speed);

    await quickSort(arr, startIdx, pivotIdx - 1);
    await quickSort(arr, pivotIdx + 1, endIdx);

    return arr;
  };

  const partition = async (
    arr: number[],
    startIdx: number,
    endIdx: number
  ): Promise<number> => {
    const pivot = arr[endIdx];
    let i = startIdx - 1;

    for (let j = startIdx; j < endIdx; j++) {
      setColors((prev) => {
        const newColors = [...prev];
        newColors[j] = "compare";
        return newColors;
      });

      // Highlight comparison action
      setHighlightedLine(1);
      await delay(speed);

      if (arr[j] <= pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);

        setColors((prev) => {
          const newColors = [...prev];
          newColors[i] = "swap";
          newColors[j] = "swap";
          return newColors;
        });
        await delay(speed);
      }
    }

    [arr[i + 1], arr[endIdx]] = [arr[endIdx], arr[i + 1]];
    setArray([...arr]);

    setColors((prev) => {
      const newColors = [...prev];
      newColors[i + 1] = "pivot";
      return newColors;
    });
    await delay(speed);

    return i + 1;
  };

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const startQuickSort = async () => {
    setIsSorting(true);
    const arrCopy = [...array];
    await quickSort(arrCopy, 0, arrCopy.length - 1);
    setIsSorting(false);
  };

  const resetArray = () => {
    setArray([...dataset]);
    setColors(new Array(dataset.length).fill("default"));
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
    navigator.clipboard.writeText(code).then(() => {
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus("Copy Code"), 1500);
    });
  };

  if (!isClient) return null;

  return (
    /* Quick Sort Visualization and Interactive Controls */
    <div className="min-h-screen bg-gray-900 text-white py-10 px-6">
      <h1 className="text-4xl font-extrabold text-center mb-6">Quick Sort</h1>

      {/* Main content wrapper */}
      <div className="flex flex-col lg:flex-row justify-center items-start gap-8 mb-6">
        {/* Visualization Card (Left Side) */}
        <div className="w-full lg:w-1/2 bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col justify-between h-[520px]">
          <h2 className="text-xl font-bold text-center text-gray-200 mb-4">
            Array Visualization
          </h2>
          <div className="flex items-end justify-center gap-2 h-full">
            {array.map((value, index) => (
              <div
                key={index}
                style={{ height: `${value * 5}px` }}
                className={`w-8 text-center text-sm ${
                  colors[index] === "compare"
                    ? "bg-yellow-400"
                    : colors[index] === "pivot"
                    ? "bg-red-500"
                    : colors[index] === "default"
                    ? "bg-purple-500"
                    : "bg-green-500"
                }`}
              >
                {value}
              </div>
            ))}
          </div>
        </div>

        {/* Pseudocode Card (Right Side) */}
        <div className="w-full lg:w-1/2 bg-gray-800 rounded-lg shadow-lg p-6 h-[520px] flex flex-col">
          <h2 className="text-2xl font-bold text-center text-gray-200 mb-4">
            Pseudocode
          </h2>
          <SyntaxHighlighter
            language="javascript"
            style={dracula}
            className="overflow-y-auto flex-grow"
          >
            {`function quickSort(array, startIdx, endIdx):
    if startIdx < endIdx:
        pivotIdx = partition(array, startIdx, endIdx)  // Partition action
        quickSort(array, startIdx, pivotIdx - 1)
        quickSort(array, pivotIdx + 1, endIdx)

function partition(array, startIdx, endIdx):
    pivot = array[endIdx]  // Pivot selection
    i = startIdx - 1

    for j = startIdx to endIdx - 1:
        if array[j] <= pivot:
            i++
            swap array[i] and array[j]  // Swap action

    swap array[i + 1] and array[endIdx]  // Move pivot into place
    return i + 1`}
          </SyntaxHighlighter>

          {/* Highlighting pseudocode based on colors */}
          <div className="mt-2 text-yellow-400 text-md">
            {highlightedLine === 0 && (
              <span className="bg-black text-white p-1">Pivot Selection</span>
            )}
            {highlightedLine === 1 && (
              <span className="bg-black text-white p-1">Partitioning</span>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={startQuickSort}
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

      {/* Wrapper for C++ Code and Explanation Sections */}
      <div className="flex flex-col lg:flex-row gap-6">
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

// Function prototype for partition
int partition(int arr[], int low, int high);

// Quick Sort implementation
void quickSort(int arr[], int low, int high) {
  if (low < high) {
      int pivotIndex = partition(arr, low, high);
      quickSort(arr, low, pivotIndex - 1);  // Left part
      quickSort(arr, pivotIndex + 1, high);  // Right part
  }
}

int partition(int arr[], int low, int high) {
  int pivot = arr[high];
  int i = low - 1;

  for (int j = low; j < high; j++) {
      if (arr[j] <= pivot) {
          i++;
          swap(arr[i], arr[j]);
      }
  }

  swap(arr[i + 1], arr[high]);
  return i + 1;
}

int main() {
  int arr[] = {64, 34, 25, 12, 22, 11, 90};
  int n = sizeof(arr) / sizeof(arr[0]);

  quickSort(arr, 0, n - 1);

  cout << "Sorted array: ";
  for (int i = 0; i < n; i++) {
      cout << arr[i] << " ";
  }
  cout << endl << "Code brought to you by GeekGod, crafted with ❤️ by devmnn. Happy Learning!" << endl;
  return 0;
}
`}
          </SyntaxHighlighter>

          {/* Copy Button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() =>
                copyToClipboard(`
// GeekGod by devmnn
// Learn algorithms visually at GeekGod! 🚀

#include <iostream>
using namespace std;

// Function prototype for partition
int partition(int arr[], int low, int high);

// Quick Sort implementation
void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pivotIndex = partition(arr, low, high);
        quickSort(arr, low, pivotIndex - 1);  // Left part
        quickSort(arr, pivotIndex + 1, high);  // Right part
    }
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;

    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }

    swap(arr[i + 1], arr[high]);
    return i + 1;
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);

    quickSort(arr, 0, n - 1);

    cout << "Sorted array: ";
    for (int i = 0; i < n; i++) {
        cout << arr[i] << " ";
    }
    cout << endl << "Code brought to you by GeekGod, crafted with ❤️ by devmnn. Happy Learning!" << endl;
    return 0;
}
`)
              }
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded shadow-md transition-all"
            >
              {copyStatus}
            </button>
          </div>
        </div>

        {/* Quick Sort Explanation Section */}
        <div className="w-full lg:w-1/2 bg-gray-800 rounded-lg shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-200">
            Quick Sort - Explained Simply
          </h2>
          <p className="text-lg leading-relaxed text-gray-300 mb-6">
            Quick Sort is a highly efficient, divide-and-conquer sorting
            algorithm. It works by selecting a pivot element from the array,
            partitioning the array into two subarrays based on the pivot, and
            recursively sorting the subarrays. On average, it achieves a time
            complexity of O(n log n), making it one of the fastest algorithms
            for large datasets. Its ability to sort in place (without needing
            additional storage) is another key benefit.
          </p>

          <div className="text-gray-300">
            <p className="text-xl font-medium mb-4">
              <strong>How it Works:</strong>
            </p>
            <ul className="list-inside list-disc mb-6">
              <li>
                <strong>1. Choose a Pivot:</strong> The first step is to choose
                a pivot element from the array. Common strategies include
                picking the first element, the last element, or a random
                element.
              </li>
              <li>
                <strong>2. Partition the Array:</strong> Rearrange the array by
                moving elements less than the pivot to the left and elements
                greater than the pivot to the right. This creates two subarrays
                where all elements to the left of the pivot are smaller, and all
                elements to the right are larger.
              </li>
              <li>
                <strong>3. Recursively Sort the Subarrays:</strong> Apply the
                same process to the left and right subarrays, choosing new
                pivots for each one. The process continues until the subarrays
                are small enough to be considered sorted.
              </li>
              <li>
                <strong>4. Repeat Until Sorted:</strong> The algorithm repeats
                these steps for each subarray until no further partitioning is
                needed, resulting in a fully sorted array.
              </li>
            </ul>

            <p className="text-xl font-medium mb-4">
              <strong>Performance Details:</strong>
            </p>
            <ul className="list-inside list-disc mb-6">
              <li>
                <strong>Best Case:</strong>{" "}
                <span className="text-blue-400">O(n log n)</span> — Occurs when
                the pivot divides the array into nearly equal halves each time,
                ensuring optimal sorting performance.
              </li>
              <li>
                <strong>Average Case:</strong>{" "}
                <span className="text-orange-400">O(n log n)</span> — This is
                the typical performance for random data and is highly efficient
                for large datasets.
              </li>
              <li>
                <strong>Worst Case:</strong>{" "}
                <span className="text-red-400">O(n^2)</span> — The worst case
                happens when the pivot choice leads to unbalanced partitions,
                such as when the array is already sorted or nearly sorted. This
                can be avoided by using techniques like randomized pivot
                selection.
              </li>
            </ul>

            <p className="text-xl font-medium mb-4">
              <strong>Key Benefits of Quick Sort:</strong>
            </p>
            <ul className="list-inside list-disc mb-6">
              <li>
                <strong>In-Place Sorting:</strong> Quick Sort does not require
                extra space for another array, unlike Merge Sort, making it more
                space-efficient.
              </li>
              <li>
                <strong>Efficiency for Large Datasets:</strong> Despite its
                worst-case time complexity, Quick Sort is often faster than
                other algorithms like Merge Sort due to its smaller constant
                factors and cache efficiency.
              </li>
              <li>
                <strong>Parallelizable:</strong> Its recursive nature makes it
                well-suited for parallel processing on modern multi-core
                processors.
              </li>
            </ul>
          </div>

          <p className="text-gray-400 italic mt-6 text-center">
          &quot;Brought to you by <span className="text-blue-500">GeekGod</span> –
            turning algorithms into child&apos;s play!&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
