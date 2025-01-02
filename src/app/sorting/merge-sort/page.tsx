'use client';

import { useState, useEffect } from 'react';
import { dataset } from '@/utils/dataset';

export default function MergeSortPage() {
  const [array, setArray] = useState<number[]>([...dataset]);
  const [isSorting, setIsSorting] = useState(false);
  const [colors, setColors] = useState<string[]>(new Array(dataset.length).fill('default'));
  const [speed, setSpeed] = useState<number>(300);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const mergeSort = async (arr: number[], startIdx: number, endIdx: number): Promise<number[]> => {
    if (startIdx >= endIdx) {
      return [arr[startIdx]];
    }

    const mid = Math.floor((startIdx + endIdx) / 2);
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
        newColors[leftIdx] = 'compare';
        newColors[rightIdx] = 'compare';
        return newColors;
      });

      await new Promise((resolve) => setTimeout(resolve, speed));

      if (left[i] <= right[j]) {
        merged.push(left[i]);
        i++;
      } else {
        merged.push(right[j]);
        j++;
      }

      setColors((prev) => {
        const newColors = [...prev];
        newColors[leftIdx] = 'merge';
        newColors[rightIdx] = 'merge';
        return newColors;
      });

      await new Promise((resolve) => setTimeout(resolve, speed));
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

  const startMergeSort = async () => {
    setIsSorting(true);
    const arrCopy = [...array]; // Ensure arr is passed down
    await mergeSort(arrCopy, 0, arrCopy.length - 1);
    setIsSorting(false);
  };

  const resetArray = () => {
    setArray([...dataset]);
    setColors(new Array(dataset.length).fill('default'));
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10">
      <h1 className="text-4xl font-extrabold text-center mb-6">Merge Sort</h1>
      <div className="flex flex-row justify-center items-end gap-2 mb-6">
        {array.map((value, index) => (
          <div
            key={index}
            style={{ height: `${value * 5}px`, width: '20px' }}
            className={`text-center text-sm ${
              colors[index] === 'compare'
                ? 'bg-yellow-400'
                : colors[index] === 'merge'
                ? 'bg-blue-500'
                : colors[index] === 'default'
                ? 'bg-purple-500'
                : 'bg-green-500'
            }`}
          ></div>
        ))}
      </div>
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
      <div className="flex justify-center gap-4">
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
    </div>
  );
}
