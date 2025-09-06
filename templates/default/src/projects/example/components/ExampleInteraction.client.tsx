import * as React from 'react';
import { hydrate } from '../../core/components/hydrate.js';


// eslint-disable-next-line no-empty-pattern
export function ExampleInteraction({  }: {}) {
	const [count, setCount] = React.useState(0);
	return (
		<div className="flex flex-col items-center justify-center p-4 border-2 border-gray-300 rounded-lg">
			<span>
				Everything in this box was initially rendered on the server,<br />
				and then turned into an interactive component in the browser.
			</span>
			<div>{`Count: ${count}`}</div>
			<button
				onClick={() => {
					setCount(count + 1);
				}}
				className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
			>
				Increment
			</button>
			<button
				onClick={() => {
					setCount(count - 1);
				}}
				className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
			>
				Decrement
			</button>
			<button
				onClick={() => {
					setCount(0);
				}}
				className="px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-700"
			>
				Reset
			</button>
			<button
				onClick={() => {
					alert(`Count is ${count}`);
				}}
				className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700"
			>
				Alert Count
			</button>
		</div>
	);
}

ExampleInteraction.ScriptName = 'ExampleInteraction';
ExampleInteraction.URLPath = 'example/components/ExampleInteraction';

hydrate(ExampleInteraction);
