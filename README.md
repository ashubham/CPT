# Compact Prediction Tree
[![npm version](https://badge.fury.io/js/compact-prediction-tree.svg)](https://badge.fury.io/js/compact-prediction-tree)

<img src="https://github.com/ashubham/CPT/raw/master/assets/prediction.jpg" align="right" width="300" style="width:300px;margin-left:20px" alt="Sequence Prediction" />

This is an implementation of CPT algorithm for Fast Sequence Prediction. Its written in Pure Javascript
and can be run both in NodeJS and the browser.

The library is based on these research papers:

1. [Compact Prediction Tree: A Losless Model for Accurate Sequence Prediction](http://www.philippe-fournier-viger.com/spmf/ADMA2013_Compact_Prediction_tree) 

2. [CPT+: Decreasing the time/space complexity of the Compact Prediction Tree](https://pdfs.semanticscholar.org/bd00/0fe7e222b8095c6591291cd7bef18f970ab7.pdf)

## Install

```bash
$ npm i compact-prediciton-tree
```

## Usage

```javascript
import CPT from 'compact-prediction-tree';

let model = new CPT();
let data = [
    ['hello', 'how', 'are', 'you'],
    ['hello', 'how', 'are', 'your', 'studies', 'going', '?'],
    ['This', 'is', 'a', 'test'],
    ['How', 'does', 'this', 'work']
]
model.train(
    data // Training Data
);

let target = [
    ['how', 'are']
];
let predictions = model.predict(
    target, // Test input
    2, // The number of last elements that will be used
       // to find similar sequences, (default: target.length)
    2  // The number of predictions required.
);

console.log(predictions) // [['you'], ['your']]
```

It works on Strings/Number sequences. Perf optimizations are pending such as compression of frequent sequences.
Pull requests are welcome!
