const withTM = require('next-transpile-modules')([
	'@mui/material',
	//'@mui/system',
	//'@mui/icons-material', // If @mui/icons-material is being used
]);

/** @type {import('next').NextConfig} */
module.exports = withTM({
	reactStrictMode: true,
	swcMinify: true,
});
