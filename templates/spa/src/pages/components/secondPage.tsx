import * as React from 'react';

export const title = 'Second Page';

export function SecondPage(props: {}) {
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