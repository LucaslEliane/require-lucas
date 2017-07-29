require(['a'], function(a) {
  console.log(a);
}, function(error) {
  console.log(error);
});

require(['b'], function(b) {
  console.log(b);
})