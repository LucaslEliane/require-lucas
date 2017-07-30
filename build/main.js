// require(['a'], function(a) {
//   console.log(a);
// }, function(error) {
//   console.log(error);
// });

// require(['b'], function(b) {
//   console.log(b);
// })

define('a', [], function() {
  console.log('exec module a');
  return 'this is module a';
})

require(['a'], function(a) {
  console.log(a);
})