onmessage = (event) => {
	const timeMs = event.data ?? 1000;

	setInterval(() => {
		postMessage(1);
	}, timeMs);
};
