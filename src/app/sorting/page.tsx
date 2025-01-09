'use client';

import { dataset } from '@/utils/dataset'; // Ensure this function is defined to generate your dataset
import Link from 'next/link';
import { useState } from 'react';

const SortingPage = () => {
  const [originalArray, setOriginalArray] = useState<number[]>(dataset);
  const [bubbleArray, setBubbleArray] = useState<number[]>([...originalArray]);
  const [insertionArray, setInsertionArray] = useState<number[]>([...originalArray]);
  const [mergeArray, setMergeArray] = useState<number[]>([...originalArray]);
  const [quickArray, setQuickArray] = useState<number[]>([...originalArray]);

  const [currentBubbleIndex, setCurrentBubbleIndex] = useState<number | null>(null);
  const [currentInsertionIndex, setCurrentInsertionIndex] = useState<number | null>(null);
  const setCurrentMergeIndices = useState<number[]>([])[1];
  const setCurrentQuickIndices = useState<number[]>([])[1];
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]); // This will store indices to highlight

  const resetArrays = () => {
    const newArray = dataset;
    setOriginalArray(newArray);
    setBubbleArray([...newArray]);
    setInsertionArray([...newArray]);
    setMergeArray([...newArray]);
    setQuickArray([...newArray]);
    setCurrentBubbleIndex(null);
    setCurrentInsertionIndex(null);
    setCurrentMergeIndices([]);
    setCurrentQuickIndices([]);
  };

  const startSorting = () => {
    // Start sorting all algorithms simultaneously
    bubbleSortStep();
    insertionSortStep();
    mergeSortStep();
    quickSortStep();
  };

  // Bubble Sort Logic with animation
  const bubbleSortStep = () => {
    const array = [...bubbleArray];
    let i = 0;
    let j = 0;

    const animate = () => {
      if (i < array.length) {
        if (j < array.length - 1 - i) {
          if (array[j] > array[j + 1]) {
            // Swap
            [array[j], array[j + 1]] = [array[j + 1], array[j]];
          }
          setBubbleArray([...array]);
          setCurrentBubbleIndex(j);
          j++;
        } else {
          i++;
          j = 0;
        }
      } else {
        // Sorting is complete
        setCurrentBubbleIndex(null);
      }
    };

    // Run the animation with a timeout
    const interval = setInterval(animate, 500);
    return interval;
  };

  // Insertion Sort Logic with animation
  const insertionSortStep = () => {
    const array = [...insertionArray];
    let i = 1;
    let j = i;

    const animate = () => {
      if (i < array.length) {
        if (j > 0 && array[j] < array[j - 1]) {
          [array[j], array[j - 1]] = [array[j - 1], array[j]];
          setInsertionArray([...array]);
          setCurrentInsertionIndex(j);
          j--;
        } else {
          i++;
          j = i;
        }
      } else {
        // Sorting is complete
        setCurrentInsertionIndex(null);
      }
    };

    const interval = setInterval(animate, 450);
    return interval;
  };

  // Merge Sort Logic with animation
// Merge Sort Logic with animation and colors
const mergeSortStep = () => {
    const array = [...mergeArray];
    const animations: number[][] = [];
    let currentMergeIndices: number[] = [];
  
    const merge = (arr: number[], start: number, mid: number, end: number) => {
      const left = arr.slice(start, mid + 1);
      const right = arr.slice(mid + 1, end + 1);
      let i = 0, j = 0, k = start;
  
      while (i < left.length && j < right.length) {
        currentMergeIndices = [start + i, mid + 1 + j];  // Highlight both elements being compared
        setHighlightedIndices(currentMergeIndices);  // Update the highlighted indices
  
        if (left[i] <= right[j]) {
          arr[k] = left[i];
          animations.push([...arr]);
          i++;
        } else {
          arr[k] = right[j];
          animations.push([...arr]);
          j++;
        }
        k++;
      }
  
      while (i < left.length) {
        currentMergeIndices = [start + i];  // Only highlight one element
        setHighlightedIndices(currentMergeIndices);
        arr[k] = left[i];
        animations.push([...arr]);
        i++;
        k++;
      }
  
      while (j < right.length) {
        currentMergeIndices = [mid + 1 + j];  // Only highlight one element
        setHighlightedIndices(currentMergeIndices);
        arr[k] = right[j];
        animations.push([...arr]);
        j++;
        k++;
      }
    };
  
    const mergeSortRecursive = (arr: number[], start: number, end: number) => {
      if (start >= end) return;
      const mid = Math.floor((start + end) / 2);
      mergeSortRecursive(arr, start, mid);
      mergeSortRecursive(arr, mid + 1, end);
      merge(arr, start, mid, end);
    };
  
    mergeSortRecursive(array, 0, array.length - 1);
  
    let i = 0;
    const interval = setInterval(() => {
      if (i < animations.length) {
        setMergeArray(animations[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 300); // Adjust animation speed
  };
  


  // Quick Sort Logic with animation
 // Quick Sort Logic with animation
const quickSortStep = () => {
    const array = [...quickArray];
    const animations: number[][] = [];
    
    const partition = (arr: number[], low: number, high: number): number => {
      const pivot = arr[high];
      let i = low - 1;
  
      for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          animations.push([...arr]);
        }
      }
  
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      animations.push([...arr]);
      return i + 1;
    };
  
    const quickSortRecursive = (arr: number[], low: number, high: number) => {
      if (low < high) {
        const pi = partition(arr, low, high);
        quickSortRecursive(arr, low, pi - 1);
        quickSortRecursive(arr, pi + 1, high);
      }
    };
  
    quickSortRecursive(array, 0, array.length - 1);
  
    let i = 0;
    const interval = setInterval(() => {
      if (i < animations.length) {
        setQuickArray(animations[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 200); // Adjust animation speed
  };
  


  return (
    <div className="min-h-screen bg-gray-900 text-white py-10">
      <h1 className="text-4xl font-extrabold text-center mb-12">Sorting Algorithms</h1>
      <div className="flex justify-center mb-6 gap-4">
        <button
          onClick={startSorting}
          className="bg-purple-500 text-white font-medium py-2 px-4 rounded hover:bg-purple-600 transition"
        >
          Start Sorting
        </button>
        <button
          onClick={resetArrays}
          className="bg-gray-500 text-white font-medium py-2 px-4 rounded hover:bg-gray-600 transition"
        >
          Reset
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 container mx-auto px-4">
        <SortingCard
          title="Bubble Sort"
          array={bubbleArray}
          currentIndex={currentBubbleIndex}
          link="/sorting/bubble-sort"
          bgColor="bg-gradient-to-r from-purple-500 to-indigo-500"
          timeComplexity="O(n^2)"
        />
        <SortingCard
          title="Insertion Sort"
          array={insertionArray}
          currentIndex={currentInsertionIndex}
          link="/sorting/insertion-sort"
          bgColor="bg-gradient-to-r from-green-400 to-teal-500"
          timeComplexity="O(n^2)"
        />
        <SortingCard
          title="Merge Sort"
          array={mergeArray}
          currentIndex={highlightedIndices}// indices will be handled inside the page
          link="/sorting/merge-sort"
          bgColor="bg-gradient-to-r from-blue-400 to-cyan-500"
          timeComplexity="O(n log n)"
        />
        <SortingCard
          title="Quick Sort"
          array={quickArray}
          currentIndex={null} // Quick-specific indices will be handled inside the page
          link="/sorting/quick-sort"
          bgColor="bg-gradient-to-r from-red-400 to-pink-500"
          timeComplexity="O(n log n)"
        />
      </div>
    </div>
  );
};

function SortingCard({
  title,
  array,
  currentIndex,
  link,
  bgColor,
  timeComplexity,
}: {
  title: string;
  array: number[];
  currentIndex: number | number[] | null;
  link: string;
  bgColor: string;
  timeComplexity: string;
}) {
  return (
    <div className={`${bgColor} rounded-lg shadow-lg p-6`}>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="flex items-end gap-2 justify-center">
        {array.map((value, idx) => (
          <div
            key={idx}
            style={{ height: `${value * 3}px` }}
            className={`w-6 transition-all duration-300 ${
              currentIndex === idx ? 'bg-yellow-300' : 'bg-white'
            } text-center`}
          ></div>
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-300">Time Complexity: {timeComplexity}</p>
      <Link
        href={link}
        className="inline-block mt-4 bg-white text-gray-900 font-medium py-2 px-4 rounded hover:bg-gray-200"
      >
        Learn More →
      </Link>
    </div>
  );
}

export default SortingPage;
