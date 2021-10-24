export function slide(
	node,
	{ delay = 0, duration = 300,}
) {
	const style = getComputedStyle(node);
	const opacity = +style.opacity;
	const height = parseFloat(style.height);
	const width = parseFloat(style.width);
	const paddingTop = parseFloat(style.paddingTop);
	const paddingBottom = parseFloat(style.paddingBottom);
	const marginTop = parseFloat(style.marginTop);
	const marginBottom = parseFloat(style.marginBottom);
	const borderTopWidth = parseFloat(style.borderTopWidth);
	const borderRadius = parseFloat(style.borderRadius);
	const borderBottomWidth = parseFloat(style.borderBottomWidth);

	return {
		delay,
		duration,
		// easing,
		css: t =>
			`overflow: hidden;` +
			`opacity: ${Math.min(t * 20, 1) * opacity};` +
			`height: ${t * height}px;` +
			`width: ${t * width}px;` +
			`borderRadius: ${t * borderRadius}px;` +
			`padding-top: ${t * paddingTop}px;` +
			`padding-bottom: ${t * paddingBottom}px;` +
			`margin-top: ${t * marginTop}px;` +
			`margin-bottom: ${t * marginBottom}px;` +
			`border-top-width: ${t * borderTopWidth}px;` +
			`border-bottom-width: ${t * borderBottomWidth}px;`
	};
}
