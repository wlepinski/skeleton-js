define ->
	StringExt =
		camelize: do ->
			regexp = /[-_]([a-z])/g
			camelizer = (match, c) ->
				c.toUpperCase()
			(string) ->
				string.replace regexp, camelizer

		upcase: (str) ->
			str.charAt(0).toUpperCase() + str.substring(1)

		underscorize: do ->
			regexp = /[A-Z]/g
			underscorizer = (c) ->
				'_' + c.toLowerCase()
			(string) ->
				string.replace regexp, underscorizer

	StringExt