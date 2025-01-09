"use client";

import { useState, useEffect } from "react";
import { dataset } from "@/utils/dataset";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function MergeSortPage() {
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

  const mergeSort = async (
    arr: number[],
    startIdx: number,
    endIdx: number
  ): Promise<number[]> => {
    if (startIdx >= endIdx) {
      return [arr[startIdx]];
    }

    const mid = Math.floor((startIdx + endIdx) / 2);

    // Highlight splitting action
    setHighlightedLine(0);
    await delay(speed);

    const left = await mergeSort(arr, startIdx, mid);
    const right = await mergeSort(arr, mid + 1, endIdx);

    return await merge(arr, left, right, startIdx);
  };

  const merge = async (
    arr: number[],
    left: number[],
    right: number[],
    startIdx: number
  ): Promise<number[]> => {
    const merged = [];
    let i = 0,
      j = 0;

    while (i < left.length && j < right.length) {
      const leftIdx = startIdx + i;
      const rightIdx = startIdx + left.length + j;

      setColors((prev) => {
        const newColors = [...prev];
        newColors[leftIdx] = "compare";
        newColors[rightIdx] = "compare";
        return newColors;
      });

      // Highlight merge comparison
      setHighlightedLine(1);
      await delay(speed);

      if (left[i] <= right[j]) {
        merged.push(left[i]);
        i++;
      } else {
        merged.push(right[j]);
        j++;
      }

      setColors((prev) => {
        const newColors = [...prev];
        newColors[leftIdx] = "merge";
        newColors[rightIdx] = "merge";
        return newColors;
      });

      await delay(speed);
    }

    while (i < left.length) {
      merged.push(left[i++]);
    }

    while (j < right.length) {
      merged.push(right[j++]);
    }

    merged.forEach((value, idx) => {
      arr[startIdx + idx] = value;
    });

    setArray([...arr]);
    return merged;
  };

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const startMergeSort = async () => {
    setIsSorting(true);
    const arrCopy = [...array];
    await mergeSort(arrCopy, 0, arrCopy.length - 1);
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
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopyStatus("Copied!");
        setTimeout(() => setCopyStatus("Copy Code"), 1500);
      })
      ;
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-6">
      <h1 className="text-4xl font-extrabold text-center mb-6">Merge Sort</h1>

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
                    : colors[index] === "merge"
                    ? "bg-blue-500"
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
            {`function mergeSort(array):
    if size of array <= 1:
        return array  // Base case

    split array into two halves: left and right  // Split action
    sortedLeft = mergeSort(left)
    sortedRight = mergeSort(right)

    return merge(sortedLeft, sortedRight)

function merge(left, right):
    create an empty result array
    while both left and right are not empty:
        if left[0] <= right[0]:
            move left[0] to result  // Merge comparison
        else:
            move right[0] to result

    append any remaining elements from left to result
    append any remaining elements from right to result

    return result`}
          </SyntaxHighlighter>

          {/* Highlighting pseudocode based on colors */}
          <div className="mt-2 text-yellow-400 text-md">
            {highlightedLine === 0 && (
              <span className="bg-black text-white p-1">Split Action</span>
            )}
            {highlightedLine === 1 && (
              <span className="bg-black text-white p-1">Merge Comparison</span>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={startMergeSort}
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

// Function prototype for merge
void merge(int arr[], int l, int m, int r);

// Merge Sort implementation
void mergeSort(int arr[], int l, int r) {
    if (l >= r)
        return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);  // Left part
    mergeSort(arr, m + 1, r);  // Right part
    merge(arr, l, m, r);  // Merge the sorted halves
}

void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    
    int L[n1], R[n2];
    
    for (int i = 0; i < n1; i++)
        L[i] = arr[l + i];
    for (int i = 0; i < n2; i++)
        R[i] = arr[m + 1 + i];

    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }

    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }

    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);

    mergeSort(arr, 0, n - 1);

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

// Function prototype for merge
void merge(int arr[], int l, int m, int r);

// Merge Sort implementation
void mergeSort(int arr[], int l, int r) {
    if (l >= r)
        return;
    int m = l + (r - l) / 2;
    mergeSort(arr, l, m);  // Left part
    mergeSort(arr, m + 1, r);  // Right part
    merge(arr, l, m, r);  // Merge the sorted halves
}

void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    
    int L[n1], R[n2];
    
    for (int i = 0; i < n1; i++)
        L[i] = arr[l + i];
    for (int i = 0; i < n2; i++)
        R[i] = arr[m + 1 + i];

    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }

    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }

    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);

    mergeSort(arr, 0, n - 1);

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

        {/* Merge Sort Explanation Section */}
        <div className="w-full lg:w-1/2 bg-gray-800 rounded-lg shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-200">
            Merge Sort - Explained Simply
          </h2>
          <p className="text-lg leading-relaxed text-gray-300 mb-6">
            Merge Sort is a classic divide-and-conquer algorithm. It recursively
            divides the array into two halves, sorts each half independently,
            and then merges the two sorted halves back together. This method
            ensures that the array is sorted in an orderly and efficient manner.
          </p>
          <p className="text-lg leading-relaxed text-gray-300 mb-6">
            While Merge Sort operates with a time complexity of{" "}
            <span className="text-blue-400">O(n log n)</span>, it does have a
            space complexity of <span className="text-red-400">O(n)</span>, as
            additional space is required to merge the sorted subarrays. This can
            be a limitation when working with very large datasets.
          </p>
          <div className="text-gray-300">
            <p className="text-xl font-medium mb-4">
              <strong>How it Works:</strong>
            </p>
            <ul className="list-inside list-disc mb-6">
              <li>Split the array into two halves.</li>
              <li>Recursively sort both halves.</li>
              <li>Merge the two sorted halves back together.</li>
              <li>Repeat the process until the entire array is sorted.</li>
            </ul>
            <p className="text-xl font-medium mb-4">
              <strong>Performance Details:</strong>
            </p>
            <ul className="list-inside list-disc">
              <li>
                <strong>Best Case:</strong>{" "}
                <span className="text-blue-400">O(n log n)</span> — Occurs when
                the array is already well-sorted.
              </li>
              <li>
                <strong>Average Case:</strong>{" "}
                <span className="text-orange-400">O(n log n)</span> — Typically
                the case for random arrays.
              </li>
              <li>
                <strong>Worst Case:</strong>{" "}
                <span className="text-red-400">O(n log n)</span> — The
                performance remains optimal even with unsorted or partially
                sorted data.
              </li>
            </ul>
          </div>
          <p className="text-gray-400 italic mt-6 text-center">
          &quot;Brought to you by <span className="text-blue-500">GeekGod</span> —
            simplifying algorithms, one step at a time!&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
