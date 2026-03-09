import { useState } from "react";

export default function CounterApp() {
  const [count, setCount] = useState<number>(0);

  const increment = () => setCount((counter) => counter + 1);
  const decrement = () => setCount((counter) => counter - 1);
  const reset = () => setCount(0);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-80">
        <h1 className="text-2xl font-bold mb-4">React Counter</h1>
        <p className="text-4xl font-semibold mb-6">{count}</p>

        <div className="flex justify-center gap-3">
          <button
            onClick={decrement}
            className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
          >
            -
          </button>

          <button
            onClick={reset}
            className="px-4 py-2 rounded-xl bg-gray-500 text-white hover:bg-gray-600"
          >
            Reset
          </button>

          <button
            onClick={increment}
            className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
