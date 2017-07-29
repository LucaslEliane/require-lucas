define('b', [], function() {
  console.log('b has been exec');
  return 'this is module b';
}, function(error) {
  console.log('module b error');
});