import CPT from './index';

let model = new CPT();
let data = [
    ['hello', 'how', 'are', 'you'],
    ['hello', 'how', 'are', 'your', 'studies', 'going', '?'],
    ['This', 'is', 'a', 'test'],
    ['How', 'does', 'this', 'work']
]
model.train(data)
let target = [
    ['how', 'are']
]
let predictions = model.predict(target,2,2);
console.log(predictions);