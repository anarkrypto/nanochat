// Change this file as you need it

const config = {
	port: 7076,
}

const node = {
	// default remote Node
	default: 'remote',
	remote: {
		address: '139.59.202.16',
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
