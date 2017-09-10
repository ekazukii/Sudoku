// Arrays.js

var p, extension;
extension = {
  'isEmpty': function() {
    return this.length ? false : true;
  },
  'clone': function() {
    var p, res=[];
    for(p in this) {
      res[p] = this[p];
    }
    return res;
  },
  'first': function() {
    if(this && this.length) {
      return this[0];
    }
  },
  'last': function() {
    if(this && this.length) {
      return this[(this.length -1)];
    }
  },
  'forEach': function(callback, context) {
    var k =0, len, args;
    len = this.length;
    if(arguments.length >1) {
      args = context;
    }
    if(typeof callback !== 'function') {
      throw TypeError(callback+' is not a function');
    }
    while(k < len) {
      callback.call(args, this[k], k);
      k++;
    }
  },
  'every': function(callback, context) {
    var k =0, len, args, res =true;
    len = this.length;
    if(arguments.length >1) {
      args = context;
    }
    if(typeof callback !== 'function') {
      throw TypeError(callback+' is not a function');
    }
    while(k < len) {
      res = callback.call(args, this[k], k);
      if(res === false) {
        break;
      }
      k++;
    }
    return res;
  },
  'inArray': function(item) {
    var k =0, len, res =false;
    len = this.length;
    while(k < len) {
      if(this[k] === item) {
        res = true;
      }
      k++;
    }
    return res;
  },
  'merge': function() {
    var res =[], i, args, tmp;
    for(i=0; i<arguments.length; i++) {
      args = arguments[i];
      if(args instanceof Array) {
        res = res.concat(args);
      }
    }
    return res;
  },
  'unique': function() {
    var k =0, len, res =[];
    len = this.length;
    while(k < len) {
      if(res.inArray(this[k]) === false) {
        res.push(this[k]);
      }
      k++;
    }
    return res;
  },
  'diff': function() {
    var res =[], compare =[], all =[], arg, i;
    if(arguments && arguments.length <2) {
      throw TypeError('Array.intersect expect altleast two arguments.');
    }
    // The reference array to compare with.
    if(arguments[0] instanceof Array) {
      compare = arguments[0];
    }
    // Merge other arrays.
    for(i=1; i<arguments.length; i++) {
      if(arguments[i] instanceof Array){
        arg = arguments[i];
        all = [].merge(all, arg);
      }
    }
    all = all.unique();
    /**
     * Loop over the first array elements and find elements that are not present
     *  in other arrays.
     */
    for(i=0; i<compare.length; i++) {
      if(all.inArray(compare[i]) === false){
        res.push(compare[i]);
      }
    }
    return res;
  },
  'intersect': function() {
    var res =[], compare =[], all =[], arg, i;
    if(arguments && arguments.length <2) {
      throw TypeError('Array.intersect expect altleast two arguments.');
    }
    // The reference array to compare with.
    if(arguments[0] instanceof Array) {
      compare = arguments[0];
    }
    // Merge other arrays.
    for(i=1; i<arguments.length; i++) {
      if(arguments[i] instanceof Array){
        arg = arguments[i];
        all = [].merge(all, arg);
      }
    }
    /**
     * Loop over the first array elements and find elements that are present in
     *  other arrays.
     */
    for(i=0; i<compare.length; i++) {
      if(all.inArray(compare[i]) === true){
        res.push(compare[i]);
      }
    }
    return res;
  },
  'except': function(exceptions) {
    var k =0, p, len, search =[], res =[];
    len = this.length;
    if(!exceptions) {
      throw TypeError('array.except: exceptions param is not defined');
    }
    if(typeof exceptions !== 'object') {
      search.push(exceptions);
    } else {
      search = exceptions.clone();
    }
    while(k < len) {
      if(search.inArray(this[k]) === false) {
        res.push(this[k]);
      }
      k++;
    }
    return res;
  },
  'rand': function(num) {
    var res=[], i=0, rand=0, index;
    if(!num) {
      num = 1;
    }
    if(num > this.length) {
      res = null;
      throw TypeError(
        'rand: '+
        'You cannot fetch more keys than array.length.'
      );
    }
    while(res.length < num) {
      rand = 0;
      rand = Math.random() * (this.length);
      index = Math.floor(rand);
      if(typeof res.search(index) !== 'number') {
        res.push(index);
      } else {
        this.rand(1);
      }
    }
    if(res.length && res.length === 1) {
      res = res.first();
    }
    return res;
  },
  'shuffle': function() {
    var p, res =[], remaining =[], index;
    remaining = this.clone();
    while(remaining.length >0) {
      index = remaining.rand(1);
      res.push(remaining[index]);
      remaining.splice(index, 1);
    }
    return res;
  },
  'search': function(searched) {
    var k=0, len, index=false;
    if(searched !== undefined) {
      len = this.length;
      while(k < len) {
        if(this[k] === searched){
          index = k;
          break;
        }
        k++;
      }
    }
    return index;
  },
  'range': function(start, length, step) {
    var i=0, index=0, res =[];
    if(typeof start !== 'number') {
      throw TypeError('array.range: start is undefined.');
    }
    if(typeof length !== 'number') {
      throw TypeError('array.range: length is undefined.');
    }
    if(!step) {
      step = 1;
    }
    while(index <length) {
      res.push((start+i));
      i += step;
      index++;
    }
    return res;
  },
  'sector': function(y, depth, x, length) {
    var res =[], u=0, v=0;
    for(u=y; u<depth; u++) {
      for(v=x; v<length; v++) {
        res.push(this[u][v]);
      }
    }
    return res;
  },
  'column': function(column) {
    var i, res=[];
    if(typeof column !== 'number') {
      throw TypeError('array.column: column is not a number.');
    }
    for(i=0; i< this.length; i++) {
      if(this[i][column]) {
        res.push(this[i][column]);
      }
    }
    return res;
  },
  'fill': function(value) {
    var i, end, start=0, length=1;
    if(arguments[1]) {
      start = arguments[1];
    }
    if(arguments[2]) {
      length = arguments[2];
    }
    i = start;
    end = start + length;
    while(i < end) {
      this[i] = value;
      i++;
    }
  },
  'sortByKey': function(key) {
    return this.sort(function(a, b) {
      var x = a[key];
      var y = b[key];
      if (typeof x == "string") {
        x = x.toLowerCase();
        y = y.toLowerCase();
      }
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }
};

// Extend Array.prototype.
for(p in extension) {
  if(!Array.prototype.hasOwnProperty(p)) {
    Array.prototype[p] = extension[p];
  }
}