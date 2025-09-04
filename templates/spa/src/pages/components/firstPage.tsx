import * as React from 'react';

export const title = 'First Page';

export function FirstPage(props: {}) {
	return (
		<div className="flex flex-col items-center">
			<div className="mt-12 text-2xl">
				Hi!
			</div>
			<div className="mt-8 text-lg">
				This is the first page
			</div>
		</div>
	);
}