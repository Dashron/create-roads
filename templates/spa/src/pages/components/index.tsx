import * as React from 'react';

export const title = 'Home';

export function Index(props: {}) {
	return (
		<div className="flex flex-col items-center">
			<div className="mt-12 text-2xl">
				Hi!
			</div>
			<div className="mt-8 text-lg">
				<div>
					This is the homepage
				</div>
				<div>
					<a href="https://github.com/Dashron/roads-spa">Check out the the roads-spa github</a>
				</div>
			</div>
		</div>

	);
}