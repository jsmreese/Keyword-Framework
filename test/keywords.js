$(document)
	.on("keywordupdate", function(e) {
		var keys = _.keys(e.keywords);
		ok(true, keys.length + " keywords updated: " + keys.join(", "));
			start();
	})
	.ready(function() {
		module('K', {
			setup: function() {
				K.flush();
			}
		});
		
		// basic setter
		asyncTest('basic getter/setter', 2, function() {
			K("k_basic", "basic");
			equal(K("k_basic"), "basic"));
		});
		
		// basic setter with invalid keyword name
		test('basic setter, invalid keyword names', function() {
			// these should not produce errors, but should warn using PS.warn
			K("", "invalid name");
			K(null, "invalid name");
			K(undefined, "invalid name");
			K("!", "invalid name");
			K("'", "invalid name");
		});
		
		// array setter
		K(["k_array1", "k_array2"], ["array1", "array2"]);
		
		// array setter with prefix
		K(["1", "2"], ["array prefix1", "array prefix2"], "k_array_prefix");
		
		// pairs array setter
		K([{ name: "k_pairs1", value: "pairs1" }, { name: "k_pairs2", value: "pairs2" }]);

		// pairs array setter with prefix
		K([{ name: "1", value: "pairs prefix1" }, { name: "2", value: "pairs prefix2" }], "k_pairs_prefix");

		// pairs array setter with empty, null, and undefined values
		K([{ name: "k_pairs_empty1", value: "" }, { name: "k_pairs_empty2", value: null }, { name: "k_pairs_empty3", value: undefined }]);
		
		// pairs array setter with invalid keyword name
		K([{ name: "", value: "invalid name" }]);
		
		// URL setter
		K("k_url1=url1&k_url2=url2");

		// URL setter with prefix
		K("1=url prefix1&2=url prefix2", "k_url_prefix");

		// URL setter with URL-escaped characters
		K("1=url%20escape1&2=url%20escape2", "k_url_escape");

		// URL setter beginning with '?'
		K("?k_url_question1=url question1&k_url_question2=url question2");

		// URL setter beginning with '&'
		K("&k_url_amp1=url amp1&k_url_amp2=url amp2");

		// URL setter with empty variables
		K("?&&&&k_url_empty1=&&&&k_url_empty2=");

		// URL setter with invalid names
		K("=");
		K("&=");
		K("?=");
		K("=&!=invalid%20name&%27=invalid%20name");
		
		// object setter
		K({
			k_object1: "object1",
			k_object2: "object2"
		});

		// object setter with prefix
		K({
			"1": "object prefix1",
			"2": "object prefix2"
		}, "k_object_prefix");
		
		// object setter with empty, null, and undefined values
		K({
			"k_object_empty1": "",
			"k_object_empty2": null,
			"k_object_empty3": undefined,
		});

		// object setter with invalid keyword names
		K({
			"!": "invalid name",
			"'": "invalid name"
		});
		
		// flush
		// K.flush
		
		// setDefault
		// K.setDefault(key, value)

		// K.setDefault(keys, values, prefix)

		// K.setDefault(pairs, prefix)

		// K.setDefault(urlQueryString, prefix)

		// K.setDefault(object, prefix)
		
		
		// events
		
		// PS.warn, logging, etc.


	});