'use client';

import { useState, useEffect } from 'react';
import { dataset } from '@/utils/dataset';

export default function BubbleSortPage() {
  const [array, setArray] = useState<number[]>([...dataset]);
  const [isSorting, setIsSorting] = useState(false);
  const [colors, setColors] = useState<string[]>(new Array(array.length).fill('default'));
  const [speed, setSpeed] = useState<number>(300);
  const [isClient, setIsClient] = useState(false); // Track if it's client-side render

  // Ensure component is only rendered on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const bubbleSort = async () => {
    setIsSorting(true);
    const arr = [...array];
    const colorArray = new Array(arr.length).fill('default');
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        colorArray[j] = 'compare';
        colorArray[j + 1] = 'compare';
        setColors([...colorArray]);
        await new Promise((resolve) => setTimeout(resolve, speed));

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          colorArray[j] = 'swap';
          colorArray[j + 1] = 'swap';
          setColors([...colorArray]);
          await new Promise((resolve) => setTimeout(resolve, speed));
        }

        colorArray[j] = 'default';
        colorArray[j + 1] = 'default';
      }
      colorArray[arr.length - i - 1] = 'sorted';
      setColors([...colorArray]);
    }
    setIsSorting(false);
  };

  const resetArray = () => {
    const newDataset = dataset;
    setArray([...newDataset]);
    setColors(new Array(newDataset.length).fill('default'));
  };

  if (!isClient) {
    // Render nothing or a placeholder while waiting for client-side render
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10">
      <h1 className="text-4xl font-extrabold text-center mb-6">Bubble Sort</h1>
      <div className="flex justify-center items-end gap-2 mb-6">
        {array.map((value, index) => (
          <div
            key={index}
            style={{ height: `${value * 5}px` }}
            className={`w-8 text-center text-sm ${
              colors[index] === 'compare'
                ? 'bg-yellow-400'
                : colors[index] === 'swap'
                ? 'bg-red-500'
                : colors[index] === 'sorted'
                ? 'bg-green-500'
                : 'bg-purple-500'
            }`}
          >
            {value}
          </div>
        ))}
      </div>
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
