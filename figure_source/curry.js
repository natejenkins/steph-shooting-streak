/* Math routines.  Nathan Jenkins 2015 */
/* used for generating the keyname when memoizing function values */
var hash = function(){
  var res = _.reduce(arguments, 
    function(res, arg){
      return(res + ":" + arg.toString())
    });
  return res;
}

var factorial = function(n){
  if(n==0 || n==1){
    return 1;
  }
  fn = n*factorial(n-1);
  return( fn );
}

/* memoized version of factorial.  I would have used lodash's memoize function but this is a recursive
   function call which means that all of the recursive calls would not be looking up memoized values */
var mfactorial = (function(){
  var memoized = {};
  memoized[hash(0)] = 1;
  memoized[hash(1)] = 1;
  var mfactorial = function(n){
    var hashKey = hash(n);
    var val;
    if(val = memoized[hashKey]){
      return val;
    }
    fn = n*mfactorial(n-1);
    memoized[hashKey] = fn;
    return( fn );
  }
  return mfactorial;
})();

var binomial = function(n, k){
  if((n-k)<0){
    return 0;
  }
  var b = mfactorial(n)/(mfactorial(k)*mfactorial(n-k))
  return b;
}

var mbinomial = (function(){
  var f = [];
  var mbinomial = function(n, k){
    if(f[n]){
      if(f[n][k]){
        return f[n][k];
      }
      else{
        if((n-k)<0){
          f[n][k]=0;
          return 0;
        }
        else{
          f[n][k] = mfactorial(n)/(mfactorial(k)*mfactorial(n-k));
          return f[n][k];
        }
      }

    }
    else{
      f[n] = [];
      if((n-k)<0){
          f[n][k]=0;
          return 0;
      }
      else{
        f[n][k] = mfactorial(n)/(mfactorial(k)*mfactorial(n-k));
      }
      return f[n][k];
    }
  }
  return mbinomial;
})();


var CNK = function(n, k, x){
  if(k<=x){
    return binomial(n, k)
  }
  else if(k>x && k<n){
    var sum = 0, i=0;
    for(i=0; i<=x; i++){
      sum += CNK(n-i-1, k-i, x);
    }
    return sum;
  }
  else{
    return 0;
  }
}

var mCNK = (function(){
  var memoized = {};
  var val;
  var mCNK = function(n, k, x){
    // window.memoized = memoized;
    var hashKey = hash(n, k, x);
    var val;
    if(val = memoized[hashKey]){
      return val;
    }
    
    if(k<=x){
      memoized[hashKey] = mbinomial(n, k);
    }
    else if(k>x && k<n){
      var sum = 0, i=0;
      for(i=0; i<=x; i++){
        sum += mCNK(n-i-1, k-i, x);
      }
      memoized[hashKey] = sum;
    }
    else{
      memoized[hashKey] = 0;
    }
    return memoized[hashKey];
  }
  return mCNK;
})();

/* probability of having a streak no longer than x given a number of attempts n and probability p */
var Fnx = function(n, x, p){
  var sum = 0, k;
  var q = 1-p;
  for(k=0; k<=n; k++){
    sum += mCNK(n, k, x)*Math.pow(p, k)*Math.pow(q, (n - k));
  }
  return sum;
}

/* calculates the probability of having a streak of length streakLength shooting exactly
** streakLength shots per day for numDays */
var simpleProbability = function(p3, streakLength, numDays){
  var oneDayProb = Math.pow(p3, streakLength);
  var failure = Math.pow((1.0 - oneDayProb), numDays);
  return 1.0 - failure;
}

/* calculates the probability of having a streak at least as long as streakLength given a 3 point
** shooting percentage p3*/
var rightProbability = function(p3, shotsPerDay, streakLength, numDays){
  var oneDayFailure = Fnx(shotsPerDay, streakLength-1, p3);
  var failure = Math.pow(oneDayFailure, numDays);
  return 1.0 - failure;
}