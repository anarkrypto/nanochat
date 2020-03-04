// Change this file as you need it

const config = {
	port: 7076,
}

const node = {
	// default remote Node
	default: 'remote',
	remote: {
		address: '157.245.80.20',
		...config,
		protocol: 'http'
	},

	// default local node
	local: {
		address: '127.0.0.1',
		...config,
		protocol: 'http'
	}
}
