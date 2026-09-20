declare module 'gulp-nunjucks-render' {
	const nunjucksRender: (options?: Record<string, unknown>) => NodeJS.ReadWriteStream;
	export default nunjucksRender;
}
