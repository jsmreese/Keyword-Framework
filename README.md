# PureShare JavaScript API
Functions for manipulating widgets, keywords, and data in server and client JavaScript using PureShare ActiveMetrics.


## K
K facilitates working with ActiveMetrics Keywords in both client and server JavaScript.

On the client, K completely replaces the client keyword hash (daaHash) and all related functions (daaURLUpdate, etc.)

On the server, K wraps the native AMEngine keyword functions (keywordUpdate, keywordOrDefault, keywordsToURL, containsKeyword, etc.)

K behavior is harmonized between client and server JavaScript.

* Internally, keyword values input into K are always stored as strings.
Native number and boolean values are coerced to strings.
Native objects and arrays are coerced to strings using JSON.stringify.
Native null and undefined are coerced to empty strings.

* Externally, keyword values retrieved from K are always coerced to native JavaScript types.
String values of 'true' and 'false' are coereced to the native JavaScript booleans `true` and `false`.
String values that appear numeric are coerced to native JavaScript numbers.
Values that appear to be JSON representations of arrays and objects can be parsed using JSON.parse, they are returned as native arrays and objects.

* Keyword values are stored with square brackets escaped by back slashes.
Keyword values are retrieved with unescaped square brackets.

* If keyword values appear to contain other keywords, those nested keywords will be evaluated if possible.

* Keyword names should always be lowercase.
Keyword names will automatically be converted to underscored representation (my_keyword_name).
A provided camelcased key of myKeywordName will be stored as my_keyword_name.
Keywords are returned in underscored format by default. Optionally retrieve keywords in camelCased format by setting the `shouldCamelCaseKeys` boolean flag on any getter method that returns key names (any of the K.toX methods).


### Basic getter/setter

`K(key)`

Gets the value associated with a keyword.
Returns `undefined` if the keyword is not found.

`K(key, value)`

Sets the value associated with a keyword.


### Array getter/setter

`K(keys)`

Gets an array of values associated with the provided array of keys.

`K(keys, prefix)`

Gets an array of values associated with the provided array of keys, prefixing each key with the provided prefix.

`K(keys, values)`

Sets values for all keys.
If keys array is longer than values array, remaining keys will be set as if values are undefined (values are coerced to empty string).

`K(keys, values, prefix)`

Sets values for all keys, prefixing each key with the provided prefix.


### Pairs Array setter
For the pairs array getter, use K.toPairs

`K(pairs)`

Sets values for all name/value pair objects, where pair objects use the format { name: keywordName, value: keywordValue }.

`K(pairs, prefix)`

Sets values for all name/value pair objects, where pair objects use the above format.
Prefixes each key with the provided prefix.


### URL setter
For the URL getter, use K.toURL

`K(urlQueryString)`

Sets values for each query string variable and value.
urlQueryString may begin with `?`, `&`, or immediately with the first variable name.

`K(urlQueryString, prefix)`

Sets values for each query string variable and value, prefixing each key with the provided prefix.


### Object setter
For the object getter, use K.toObject

`K(object)`

Sets values for each property/value pair in the object.

`K(object, prefix)`

Sets values for each property/value pair in the object, prefixing each key with the provided prefix.


### Getter methods
For all of the getter methods, setting the Boolean shouldCamelCaseKeys flag to `true` will convert all underscored_keys into camelCasedKeys in the return value.

`K.toPairs([shouldCamelCaseKeys,] prefix)`

Gets the name and value of all matching keywords and returns an array of name/value pair objects.
`prefix` may be a string or an array of prefix values.
Returns an empty array if no matches are found.
Matchs ALL keywords if prefix is not supplied or is falsey.

`K.toURL([shouldCamelCaseKeys,] prefix)`

Gets the name and value of all matching keywords and returns a URL query string.
`prefix` may be a string or an array of prefix values.
Returns an empty string if no matches are found.
Matchs ALL keywords if prefix is not supplied or is falsey.
All values in the returned URL query string will be URL-encoded.

`K.toObject([shouldCamelCaseKeys,] prefix)`

Gets the name and value of all matching keywords and returns an object of property/value pairs.
`prefix` may be a string or an array of prefix values.
Returns an empty object if no matches are found.
Matchs ALL keywords if prefix is not supplied or is falsey.

### Utility methods

`K.flush(prefix)`

Deletes all keywords matching the supplied prefix.
`prefix` may be a string or an array of prefix values.
If `prefix` is not supplied or is falsey, ALL keywords will be deleted. This is usually a bad thing, so in client JavaScript a warning will be logged using DDK.warn.
Returns `undefined`.

`K.setDefault(key, value)`

`K.setDefault(keys, values, prefix)`

`K.setDefault(pairs, prefix)`

`K.setDefault(urlQueryString, prefix)`

`K.setDefault(object, prefix)`

Sets the value associated with a keyword only if that keyword is not yet defined.
Accepts all of the standard setter options (strings, arrays, pairs array, URL query string, and object.
Also accepts a prefix argument when using a signature that allows setting multiple keywords in a single action.


### Events
In client JavaScript, a `keywordupdate` event will be triggered each time any keyword values are set using K.
The specific keywords and values that were updated are accessible on the event object using the `event.keywords` property.
