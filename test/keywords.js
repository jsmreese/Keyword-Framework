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
		asyncTest('basic getter/setter', function() {
			K("k_basic", "basic");
			equal(K("k_basic"), "basic", "validate basic setter/getter");
			
			K("k_basic", "basic setter");
			equal(K("k_basic"), "basic", "modify basic setter/getter value");

			K("k.basic", "basic2");
			equal(K("k.basic"), "basic2", "validate basic setter/getter with period");

			//non existing keyword
			equal(K("k_basic2"), undefined, "validate non existing variable");

			K("k_basic", true);
			equal(K("k_basic"), true, "validate basic setter/getter boolean true");
			K("k_basic", "false");
			equal(K("k_basic"), false, "validate basic setter/getter boolean false");
			K("k_basic", 321);
			equal(K("k_basic"), 321, "validate basic setter/getter number");
			K("k_basic", "654");
			equal(K("k_basic"), 654, "validate basic setter/getter number");
			
			//camel case
			K("kBasic2", "basic");
			equal(K("k_basic2"), "basic", "validate basic camel case setter");
			equal(K("kBasic2"), "basic", "validate basic camel case getter");

			K("k_basic3", "");
			equal(K("k_basic3"), "", "validate empty value string");
			K("k_basic3", null);
			equal(K("k_basic3"), null, "validate null value string");
			K("k_basic3", undefined);
			equal(K("k_basic3"), undefined, "validate undefined value string");
			
			start();
			//other valid . and _
		});
		
		// basic setter with invalid keyword name
		asyncTest('basic setter, invalid keyword names', function() {
			// these should not produce errors, but should warn using PS.warn
			K("", "invalid name");
			K(null, "invalid name");
			K(undefined, "invalid name");
			K("!", "invalid name");
			K("'", "invalid name");
			K(123, "invalid name");
			K(true, "invalid name");
			
			//throw an exception, what will the exception message look like?
			start();
		});
		
		asyncTest('array setter/getter', function(){
			var k_arr = ["k_array1", "k_array2", "k_array3"];
			var k_arr2 = ["1", "2", "3"];
			// array setter
			K(["k_array1", "k_array2"], ["array1", "array2"]);
			equal(K("k_array1"), "array1", "k_array1 = array1");
			equal(K("k_array2"), "array2", "k_array2 = array2");
			deepEqual(K(["k_array1", "k_array2"]), ["array1", "array2"], "validate array setter/getter");
			deepEqual(K(k_arr), ["array1", "array2", undefined], "validate array getter with undefined");
		
			// array setter with prefix
			K(["1", "2"], ["array prefix1", "array prefix2"], "k_array_prefix");
			equal(K("k_array_prefix1"), "array prefix1", "k_array_prefix1 = array prefix1");
			equal(K("k_array_prefix2"), "array prefix2", "k_array_prefix2 = array prefix2");
			deepEqual(K(["1", "2"], "k_array_prefix"), ["array prefix1", "array prefix2"], "validate array prefix setter/getter");
			deepEqual(K(k_arr2, "k_array_prefix"), ["array prefix1", "array prefix2", undefined], "validate array prefix setter/getter with undefined");

			//key array longer than value array
			K(["k_array1", "k_tc_array2", "k_tc_array3"], [true, "false"]);
			deepEqual(K(k_arr), [true, false, ""], "validate key array longer than value array, also boolean");
			K(["1", "2", "3"], [true, "false"], "k_array_prefix");
			deepEqual(K(k_arr2, "k_array_prefix"), [true, false, ""], "validate key prefix array longer than value array, also boolean");
			
			//key array shorter than value array
			K(["k_tc_array1", "k_tc_array3"], [123, "789", "modify array extra"]);
			deepEqual(K(k_arr), [123, false, 789], "validate key array shorter than value array, also number");
			K(["1", "3"], [456, "789", "modify prefix array extra"], "k_array_prefix");
			deepEqual(K(k_arr2, "k_array_prefix"), [456, false, 789], "validate key prefix array shorter than value array, also number");
			
			//repeat array
			K(["k_array1", "k_array1", "k_array2"], ["array1", "repeated array1", "array2"]);
			deepEqual(K(["k_array1", "k_array1", "k_array2"]), ["repeated array1", "repeated array1", "array2"], "validate array with repeated keyword");
			K(["1", "1", "2"], ["array prefix1", "repeated array prefix1", "array prefix2"], "k_array_prefix")
			deepEqual(K(["1", "1", "2"], "k_array_prefix"), ["repeated array prefix1", "repeated array prefix1", "array prefix2"], "validate key prefix array with repeated keyword");
			
			//Camel case
			K(["kArray1", "KArray2", "KARRAY_3", "k.Array.4"], ["array1", "array2", "array3", "ArrayValue4"]);
			deepEqual(K(["k_array1", "k_array2", "k_a_r_r_a_y_3", "k._array.4"]), ["array1", "array2", "array3", "ArrayValue4"], "validate array with camel case");
			K(["One", "Two", "Three", ".Four"], ["array prefix1", "array prefix2", "array prefix3", "Array Prefix4"], "kArrayPrefix")
			deepEqual(K(["_one", "_two", "_three", "._four"], "kArray_prefix"), ["array prefix1", "array prefix2", "array prefix3", "Array Prefix4"], "validate key prefix array with camel case");

			//empty array
			var k_arr0;
			K(k_arr1, ["", null, k_arr0]);
			deepEqual(K(k_arr1), ["", null, undefined], "validate array with empty values");
			K(k_arr2, ["", null, k_arr0], "k_array_prefix");
			deepEqual(K(k_arr2,"k_array_prefix"), ["", null, undefined], "validate array prefix with empty values");
			
			//throws an exception?
			K(["k_array1", "k_array2", ""], ["array1", "array2", "invalid name"]);
			//deepEqual(K(k_arr1), ["array1", "array2", undefined], "validate array with empty string value");
			K(["k_array1", "k_array2", null], ["array1", "array2", "null name"]);
			//deepEqual(K(k_arr1), ["array1", "array2", undefined], "validate array with null string value");
			K(["k_array1", "k_array2", k_arr0], ["array1", "array2", "undefined name"]);
			//deepEqual(K(k_arr1), ["array1", "array2", undefined], "validate array with undefined string value");
			//???
			start();
			
		});
			
		asyncTest('pair array setter/getter', function(){
			// pairs array setter
			K([{ name: "k_pairs1", value: "pairs1" }, { name: "k_pairs2", value: "pairs2" }]);
			equal(K("k_pairs1"), "pairs1", "k_pairs1 = pairs1");
			equal(K("k_pairs2"), "pairs2", "k_pairs2 = pairs2");
			equal(K(["k_pairs1", "k_pairs2"]), ["pairs1", "pairs2"], "validate pair array setter via array getter");
			deepEqual(K.toPairs(["k_pairs1", "k_pairs2"]), '{name: "k_pairs1", value: "pairs1"}, {name: "k_pairs2", value: "pairs2"}', "validate pair array setter");
			deepEqual(K.toPairs("k_pairs"), '{name: "k_pairs1", value: "pairs1"}, {name: "k_pairs2", value: "pairs2"}', "validate pair array setter toPairs prefix");

			// pairs array setter with prefix
			K([{ name: "1", value: "pairs prefix1" }, { name: "2", value: "pairs prefix2" }], "k_pairs_prefix");
			equal(K("k_pairs_prefix1"), "pairs prefix1", "k_pairs_prefix1 = pairs prefix1");
			equal(K("k_pairs_prefix2"), "pairs prefix2", "k_pairs_prefix2 = pairs prefix2");
			deepEqual(K.toPairs("k_pairs_prefix"), '{name: "k_pairs_prefix1", value: "pairs prefix1"}, {name: "k_pairs_prefix2", value: "pairs prefix2"}', "validate pair array setter with prefix");

			//getting undefined pair
			deepEqual(K.toPairs(["k_pairs1,k_pairs2,k_pairs3"]), '{name: "k_pairs1", value: "modify pairs1"}, {name: "k_pairs2", value: "modify pairs2"}, {name: "k_pairs3", value: undefined}', "pair array getter - undefined");
			
			//passing from variable
			var pair1 = [{ name: "k_pairs1", value: true }, { name: "k_pairs2", value: 123 }];
			var pair2 = [{ name: "1", value: true }, { name: "2", value: 789 }];
			K(pair1);
			deepEqual(K.toPairs("k_pairs"), '{name: "k_pairs1", value: true}, {name: "k_pairs2", value: 123}, {name: "k_pairs_prefix1", value: "pairs prefix1"}, {name: "k_pairs_prefix2", value: "pairs prefix2"}', "validate pair array setter using variable, boolean/number values");
			K(pair2, "k_pairs_prefix");
			deepEqual(K.toPairs("k_pairs_prefix"), '{name: "1", value: true}, {name: "2", value: 789}', "validate pair array setter with prefix using variable, boolean/number values");
			
			// pairs array setter with empty, null, and undefined values
			K([{ name: "k_pairs_empty1", value: "" }, { name: "k_pairs_empty2", value: null }, { name: "k_pairs_empty3", value: undefined }]);
			//equal(K("k_pairs_empty1"), "", 'k_pairs_empty1 = ""');
			//equal(K("k_pairs_empty2"), null, "k_pairs_empty2 = null");
			//equal(K("k_pairs_empty3"), undefined, "k_pairs_empty3 = undefined");
			deepEqual(K.toPairs("k_pairs_empty"), '{name: "k_pairs_empty1", value: ""}, {name: "k_pairs_empty2", value: null}, {name: "k_pairs_empty3", value: undefined}', "validate pair array setter with empty, null, undefined");
			
			K([{ name: "Empty1", value: undefined }, {name: "Empty2", value: ""}, { name: "Empty3", value: null }], "k_pairs");
			deepEqual(K.toPairs("k_pairs_empty"), '{name: "k_pairs_empty1", value: undefined}, {name: "k_pairs_empty2", value: ""}, {name: "k_pairs_empty3", value: null}', "validate pair array setter with empty, null, undefined");

			// pairs array camel case
			K([{ name: "kPairs1", value: "pairs1" }, { name: "KPairs2", value: "pairs2" }, { name: "K.Pairs3", value: "pairs3" }]);
			deepEqual(K.toPairs("k_pairs"), '{name: "k_pairs1", value: "pairs1"}, {name: "k_pairs2", value: "pairs2"}, {name: "k._pairs3", value: "pairs3"}, {name: "k_pairs_prefix1", value: true}, {name: "k_pairs_prefix2", value: 789}, {name: "k_pairs_empty1", value: undefined}, {name: "k_pairs_empty2", value: ""}, {name: "k_pairs_empty3", value: null}', "validate pair array setter camel case");
			K([{ name: "1", value: "prefix1" }, { name: "2", value: "Prefix2" }, { name: ".3.A1", value: "prefix3" }], "kPairsPrefix");
			deepEqual(K.toPairs("kPairsPrefix,k.Pairs"), '{name: "k_pairs_prefix1", value: "prefix1"}, {name: "k_pairs_prefix2", value: "Prefix2"}, {name: "k_pairs_prefix.3._a1", value: "prefix3"}, {name: "k._pairs3", value: "pairs3"}', "validate pair prefix array setter camel case");

			deepEqual(K.toPairs(true, "kPairs"), '{name: "kPairs1", value: "pairs1"}, {name: "kPairs2", value: "pairs2"}, {name: "kPairsPrefix1", value: "prefix1"}, {name: "kPairsPrefix2", value: "Prefix2"}, {name: "kPairsPrefix.3.A1", value: "prefix3"}, {name: "kPairsEmpty1", value: undefined}, {name: "kPairsEmpty2", value: ""}, {name: "kPairsEmpty3", value: null}', "validate pair array setter camel case shouldCamelCaseKeys =true");

			deepEqual(K.toPairs(true, "kPairsEmpty,kPairsPrefix,k.Pairs"), '{name: "kPairsEmpty1", value: undefined}, {name: "kPairsEmpty2", value: ""}, {name: "kPairsEmpty3", value: null}, {name: "kPairsPrefix1", value: "prefix1"}, {name: "kPairsPrefix2", value: "Prefix2"}, {name: "kPairsPrefix.3.A1", value: "prefix3"}, {name: "k.Pairs3", value: "pairs3"}', "validate pair array camel case and prefixes");

			// pairs array setter with invalid keyword name
			var pair0;
			K([{ name: "", value: "invalid name" }]);
			K([{ name: pair0, value: "undefined name" }]);
			pair0=null;
			K([{ name: pair0, value: "null name" }]);
			K([{ name: "=", value: "invalid name" }]);
			//???
			start();
		});

		asyncTest('URL setter/getter', function(){
			// URL setter
			K("k_url1=url1&k_url2=url2");
			equal(K("k_url1"), "url1", "k_url1=url1");
			equal(K("k_url2"), "url2", "k_url2=url2");
			equal(K(["k_url1", "k_url2"]), ["url1", "url2"], "validate url setters via array getter");
			deepEqual(K.toPairs("k_url"), '{name: "k_url1", value: "url1" }, {name: "k_url2", value: "url2" }', "validate url setter via toPairs");
			deepEqual(K.toURL("k_url"), "k_url1=url1&k_url2=url2", "validate URL using toURL");

			// URL setter with prefix
			K("1=url prefix1&2=url prefix2", "k_url_prefix");
			equal(K("k_url_prefix1"), "url prefix1", "k_url_prefix1=url prefix1");
			equal(K(["1", "2"], "k_url_prefix"), ["url prefix1", "url prefix2"], "validate url setters via array prefix getter");
			deepEqual(K.toURL("k_url_prefix"), "k_url_prefix1=url prefix1&k_url_prefix2=url prefix2", "validate URL with prefix");

			K("k.url1=url1&k.url2=url2");
			deepEqual(K.toURL("k.Array.4,k.url"), "k._array.4=ArrayValue4&k.url1=url1&k.url2=url2", "validate URL with period character");
			
			// URL setter with URL-escaped characters
			K("1=url%20escape1&2=url%20escape2", "k_url_escape");
			deepEqual(K.toURL("k_url_escape"), "k_url_escape1=url escape1&k_url_escape2=url escape2", "validate URL with escape chars");

			// URL setter beginning with '?'
			K("?k_url_question1=url question1&k_url_question2=url question2");
			deepEqual(K.toURL("k_url_question"), "k_url_question1=url question1&k_url_question2=url question2", "validate URL beginning with beginning ?");

			// URL setter beginning with '&'
			K("&k_url_amp1=url amp1&k_url_amp2=url amp2");
			deepEqual(K.toURL("k_url_amp"), "k_url_amp1=url amp1&k_url_amp2=url amp2", "validate URL beginning with beginning &");

			// URL setter with empty variables
			K("?&&&&k_url_empty1=&&&&k_url_empty2=");
			deepEqual(K.toURL("k_url_empty"), "k_url_empty1=&k_url_empty2=", "validate URL with empty value");

			var u="k_url_var1=true&k_url_var2=123";
			K(u);
			deepEqual(K.toURL("k_url_var"), u, "validate URL from variable, including boolean and number");
			
			deepEqual(K.toURL("k_url_prefix,k_url_escape"), "k_url_prefix1=url prefix1&k_url_prefix2=url prefix2&k_url_escape1=url escape1&k_url_escape2=url escape2", "validate URL with multiple prefix");
			
			deepEqual(K.toURL(true, "k_url_amp"), "kUrlAmp1=url amp1&kUrlAmp2=url amp2", "validate URL with camel case");
			deepEqual(K.toURL(true, "k_url_amp,kUrlQuestion"), "kUrlAmp1=url amp1&kUrlAmp2=url amp2&kUrlQuestion1=url question1&kUrlQuestion2=url question2", "validate URL with camel case and prefixes");
			
			// URL setter with invalid names
			K("=value");
			K("&=");
			K("?=");
			K("=&!=invalid%20name&%27=invalid%20name");
			start();
		});
			
		asyncTest('Object setter/getter', function(){
			// object setter
			K({
				k_object1: "object1",
				k_object2: "object2"
			});
			equal(K("k_object1"), "object1", "k_object1=object1");
			equal(K("k_object2"), "object2", "k_object2=object2");
			equal(K(["k_object1", "k_object2"]), ["object1", "object2"], "validate object setters via array getter");
			deepEqual(K.toPairs("k_object"), '{ name: "k_object1", value: "object1" }, { name: "k_object2", value: "object2" }', "validate object setter via toPairs");
			deepEqual(K.toURL("k_object"), "k_object1=object1&k_object2=object2", "validate object setter via toURL");
			deepEqual(K.toObject("k_object"), '{k_object1: "object1", k_object2: "object2"}', "validate object setter via toObject");

			// object setter with prefix
			K({
				"1": "object prefix1", 
				"2": "object prefix2"
			}, "k_object_prefix");
			equal(K("k_object_prefix1"), "object prefix1", "k_object_prefix1=object prefix1");
			equal(K(["1", "2"], "k_object_prefix"), ["object prefix1", "object prefix2"], "validate object setters prefix via array getter prefix");
			deepEqual(K.toObject("k_object_prefix"), '{k_object_prefix1: "object prefix1", k_object_prefix2: "object prefix2"}', "validate object prefix setter via toObject");
			
			K({
				k_object1: "false",
				k_object2: "456",
				k_object3: true,
				k_object4: 789
			});
			deepEqual(K.toObject("k_object"), '{k_object1: false, k_object2: 456, k_object3: true, k_object4: 789, k_object_prefix1: "object prefix1", k_object_prefix2: "object prefix2"}', "validate object setter with boolean and numbers");

			K({
				kObject1: "Object1",
				kObject2: "Object2"
			});
			deepEqual(K.toObject("k_object"), '{k_object1: "Object1", k_object2: "Object2", k_object3: true, k_object4: 789, k_object_prefix1: "object prefix1", k_object_prefix2: "object prefix2"}', "validate object setter with camel case");

			K({
				"1": "camel case1",
				"2": "Camel Case2"
			}, "kObjectPrefix");
			deepEqual(K.toObject(true, "kObjectPrefix"), '{kObjectPrefix1: "camel case1", kObjectPrefix2: "Camel Case2"}', "validate object prefix getter with camel case");

			//nested objects
			K({
				"1": {obj1: "name", obj2: "address", obj3: "age"},
				"2": ["arr1", "arr2", "arr3"],
				"3": function(v) { return v; }
			}, "kObjectNested");
			deepEqual(K.toObject("k_objectNested"), '{k_object_nested1: {obj1: "name", obj2: "address", obj3: "age"}, k_object_nested2: ["arr1", "arr2", "arr3"], k_object_nested3: function(v) { return v; }}', "validate object: jason, array and function");
			
			var myObj = ["arr1", "arr2", "arr3"];
			var num1 = 123, num2=2;
			var str1 = "object string";
			var 
			K({
				k_object_var1: myObj,
				k_object_var2: num1*num2,
				k_object_var3: str1
			});
			deepEqual(K.toObject(true, "k_object_var"), '{kObjectVar1: ["arr1", "arr2", "arr3"], kObjectVar2: 246, kObjectVar3: "object string"}', "validate object from actual variable");
			
			// object setter with empty, null, and undefined values
			K({
				"k_object_empty1": "",
				"k_object_empty2": null,
				"k_object_empty3": undefined,
			});
			deepEqual(K.toObject("k_object_empty"), '{k_object_empty1: "", k_object_empty2: null, k_object_empty3: undefined}', "validate object with empty values");
			
			var nu=null, un;	//undefined
			// object setter with invalid keyword names
			K({
				"!": "invalid name",
				"'": "invalid name",
				un: "invalid name",
				nu: "invalid name"
			});
			//throw warning??
			start();
		});

		asyncTest('Utility Methods', function(){

			// flush
			K.flush("k_object1");
			equal(K("k_object1"), undefined, "validate flush object");

			K.flush("kObject2");
			equal(K("k_object2"), undefined, "validate flush camel case");
			
			K.flush("k.url");
			equal(K("k.url"), undefined, "validate flush with period");
			
			K.flush("");	//based from document, this will flush all?
			equal(K("k_object3"), undefined, "validate flush all");
			K.flush();	//makes sure we flush everything
			
			// setDefault
			K.setDefault("k_def_var1", "default value");
			equal(K("k_def_var1"), "default value", "validate default value");
			K("k_def_var1", "new value");
			equal(K("k_def_var1"), "new value", "validate modified value");

			K.setDefault(["k_def_var1", "k_def_var2", "k_def_var3"], ["default1", "default2", "default3"])
			equal(K(["k_def_var1", "k_def_var2", "k_def_var3"]), ["default1", "default2", "default3"], "validate array default value");
			K("k_def_var1", "new value");
			equal(K(["k_def_var1", "k_def_var2", "k_def_var3"]), ["new value", "default2", "default3"], "validate array updated value");
			
			K.setDefault(["k_def_var1", "k_def_var2", "k_def_var3"], ["default1", "default2", "default3"], "k_prefix")
			equal(K(["k_def_var1", "k_def_var2", "k_def_var3"], "k_prefix"), ["default1", "default2", "default3"], "validate array with prefix default value");
			K(["k_def_var1", "k_def_var2"], ["new value1", "new value2"], "k_prefix");
			equal(K(["k_def_var1", "k_def_var2", "k_def_var3"], "k_prefix"), ["new value1", "new value2", "default3"], "validate array with prefix updated value");
			
			K.setDefault('{name: "k_def_pair1", value: "default1"},{name: "k_def_pair2", value: "default2"},{name: "k_def_pair3", value: "default3"}');
			deepEqual(K.toPairs("k_def_pair"), '{name: "k_def_pair1", value: "default1"},{name: "k_def_pair2", value: "default2"},{name: "k_def_pair3", value: "default3"}', "validate pairs default value");
			K('{name: "k_def_pair1", value: "new value1"},{name: "k_def_pair2", value: "new value2"}');
			deepEqual(K.toPairs("k_def_pair"), '{name: "k_def_pair1", value: "new value1"},{name: "k_def_pair2", value: "new value2"},{name: "k_def_pair3", value: "default3"}', "validate pairs updated value");

			K.setDefault('{name: "k_def_pair1", value: "default1"},{name: "k_def_pair2", value: "default2"},{name: "k_def_pair3", value: "default3"}', "k_prepair");
			deepEqual(K.toPairs("k_prepair"), '{name: "k_prepairk_def_pair1", value: "default1"},{name: "k_prepairk_def_pair2", value: "default2"},{name: "k_prepairk_def_pair3", value: "default3"}', "validate pairs with prefix default value");
			K('{name: "k_def_pair1", value: "new val1"},{name: "k_def_pair2", value: "new val2"}', "k_prepair");
			deepEqual(K.toPairs("k_prepair"), '{name: "k_prepairk_def_pair1", value: "new val1"},{name: "k_prepairk_def_pair2", value: "new val2"},{name: "k_prepairk_def_pair3", value: "default3"}', "validate pairs with prefix updated value");

			// K.setDefault(urlQueryString, prefix)
			K.setDefault("k_def_url1=default1&k_def_url2=default2&k_def_url3=default3");
			deepEqual(K.toURL("k_def_url"), "k_def_url1=default1&k_def_url2=default2&k_def_url3=default3", "validate url default value");
			K("k_def_url1=url1");
			deepEqual(K.toURL("k_def_url"), "k_def_url1=url1&k_def_url2=default2&k_def_url3=default3", "validate url updated value");
			
			K.setDefault("k_def_url1=default1&k_def_url2=default2&k_def_url3=default3", "k_url_");
			deepEqual(K.toURL("k_url"), "k_url_k_def_url1=default1&k_url_k_def_url2=default2&k_url_k_def_url3=default3", "validate url prefix default value");
			K("k_def_url1=new1&k_def_url2=new2", "k_url_");
			deepEqual(K.toURL("k_url"), "k_url_k_def_url1=new1&k_url_k_def_url2=new2&k_url_k_def_url3=default3", "validate url prefix updated value");

			// K.setDefault(object, prefix)
			K.setDefault({k_object1: [1,2], k_object2: "object2"});
			deepEqual(K.toObject("k_object"), '{k_object1: [1,2], k_object2: "object2"}', "validate object default value");
			K({k_object1: [1,2,3,4], k_object3: "object3"});
			deepEqual(K.toObject("k_object"), '{k_object1: [1,2,3,4], k_object2: "object2", k_object3: "object3"}', "validate object updated value");
			
			K.setDefault({k_object1: [1,2], k_object2: "default2", k_object3: "default3"}, "k_prefix_");
			deepEqual(K.toObject("k_prefix"), '{k_prefix_k_object1: [1,2], k_prefix_k_object2: "object2"}', "validate object prefix default value");
			K({k_object1: [1,2,3,4], k_object3: "object3"});
			deepEqual(K.toObject("k_prefix"), '{k_prefix_k_object1: [1,2,3,4], k_prefix_k_object2: "default2", k_prefix_k_object3: "object3"}', "validate object prefix updated value");
			//2013/06/05 ray siy
			// K.isKeyword("string")
			
			start();
		});
			
			// events
			
			// PS.warn, logging, etc.


	});