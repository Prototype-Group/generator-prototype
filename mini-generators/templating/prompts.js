module.exports = function prompts() {
	return [
		{
			type: 'list',
			name: 'templateEngine',
			message: 'Which Template Engine do you want to use?',
			choices: [
				{
					name: 'Server-Side Rendering with Mangony (Handlebars)',
					value: 'ssr-mangony-hbs'
				},
				// {
				// 	name: 'Server-Side-Rendering with React',
				// 	value: 'ssr-react'
				// }
			],
			default: 'ssr-mangony-hbs'
		}
	];
};