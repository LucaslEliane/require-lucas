define('a', ['b'], function(b) {
  console.log(b);
  return 'this is module a';
}, function(error) {
  console.log('module a has some error');
})