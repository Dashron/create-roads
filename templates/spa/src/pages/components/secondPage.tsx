import * as React from 'react';

export const title = 'Second Page';

// eslint-disable-next-line no-empty-pattern
export function SecondPage({}: {}) {
	return (
		<div className="flex flex-col items-center">
			<div className="mt-12 text-2xl">
				Hi!
			</div>
			<div className="mt-8 text-lg">
				This is the second page
			</div>
		</div>
	);
}