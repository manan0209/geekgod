'use client';

import { useState, useEffect } from 'react';
import { dataset } from '@/utils/dataset';

export default function QuickSortPage() {
  const [array, setArray] = useState<number[]>([...dataset]);
  const [isSorting, setIsSorting] = useState(false);
  const [colors, setColors] = useState<string[]>(new Array(dataset.length).fill('default'));
  const [speed, setSpeed] = useState<number>(300);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const quickSort = async (arr: number[], start: number, end: number): Promise<void> => {
    if (start >= end) return;

    const pivotIdx = await partition(arr, start, end);
    await quickSort(arr, start, pivotIdx - 1);
    await quickSort(arr, pivotIdx + 1, end);
  };

  const partition = async (arr: number[], start: number, end: number): Promise<number> => {
    const pivot = arr[end];
    let i = start;

    for (let j = start; j < end; j++) {
      setColors((prev) => {
        const newColors = [...prev];
        newColors[j] = 'compare';
        newColors[end] = 'pivot';
        return newColors;
      });

      await new Promise((resolve) => setTimeout(resolve, speed));

      if (arr[j] < pivot) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        i++;

        setColors((prev) => {
          const newColors = [...prev];
          newColors[j] = 'swap';
          newColors[i - 1] = 'swap';
          return newColors;
        });

        await new Promise((resolve) => setTimeout(resolve, speed));
      }

      setColors((prev) => {
        const newColors = [...prev];
        newColors[j] = 'default';
        return newColors;
      });
    }

    [arr[i], arr[end]] = [arr[end], arr[i]];
    setArray([...arr]);

    setColors((prev) => {
      const newColors = [...prev];
      newColors[i] = 'sorted';
      return newColors;
    });

    await new Promise((resolve) => setTimeout(resolve, speed));

    return i;
  };

  const startQuickSort = async () => {
    setIsSorting(true);
    const arrCopy = [...array];
    await quickSort(arrCopy, 0, arrCopy.length - 1);
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
      <h1 className="text-4xl font-extrabold text-center mb-6">Quick Sort</h1>
      <div className="flex flex-row justify-center items-end gap-2 mb-6">
        {array.map((value, index) => (
          <div
            key={index}
            style={{ height: `${value * 5}px`, width: '20px' }}
            className={`text-center text-sm ${
              colors[index] === 'compare'
                ? 'bg-yellow-400'
                : colors[index] === 'pivot'
                ? 'bg-red-500'
                : colors[index] === 'swap'
                ? 'bg-blue-500'
                : colors[index] === 'sorted'
                ? 'bg-green-500'
                : 'bg-purple-500'
            }`}
          ></div>
        ))}
      </div>
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
