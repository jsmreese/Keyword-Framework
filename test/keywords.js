$(document).ready(function() {

	module('K');
	
	test('Strings: naturalSort', function() {
		var arr =  ['foo2', 'foo1', 'foo10', 'foo30', 'foo100', 'foo10bar'],
			sorted = ['foo1', 'foo2', 'foo10', 'foo10bar', 'foo30', 'foo100'];
		deepEqual(arr.sort(_.naturalCmp), sorted);
	});
});