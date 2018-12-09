import { PredictionTree } from './prediction-tree';

export default class CPT {
    private alphabet = new Set();
    private root: PredictionTree = new PredictionTree();
    private II: {[key: string]: Set<number>} = {};
    private LT: {[key: number]: PredictionTree} = {};
    private data: any[][] = [];

    constructor() {
        //
    }

    /** 
        This functions populates the Prediction Tree,
        Inverted Index and LookUp Table for the algorithm.

        Input: The list of list training data
        Output : Boolean True
    */
    train(data) {
        let existingDataLength = this.data.length;
        this.data = this.data.concat(data);
        let cursornode = this.root;
        data.forEach((row, idx) => {
            idx = idx + existingDataLength;
            row.forEach(element => {
                if(!cursornode.hasChild(element)) {
                    cursornode.addChild(element);
                }
                cursornode = cursornode.getChild(element);

                this.II[element] = this.II[element] || new Set();
                this.II[element].add(idx);
                this.alphabet.add(element);
            })

            this.LT[idx] = cursornode;
            cursornode = this.root;
        });

        return true;
    }

    /**
     * 
     * This function is the main workhorse and calculates the score to be populated against an item. Items are predicted
        using this score.

        Output: Returns a counttable dictionary which stores the score against items. This counttable is specific for a 
        particular row or a sequence and therefore re-calculated at each prediction.
     * 
     * @param counttable 
     * @param key
     * @param numberOfSimilarSequences 
     * @param numberItemsCounttable 
     */
    score(
            counttable: Map<string, number>, 
            key,
            numberOfSimilarSequences, 
            numberItemsCounttable) {
        let weightLevel = 1/numberOfSimilarSequences;
        let weightDistance = 1/numberItemsCounttable;
        let score = 1 + weightLevel + weightDistance * 0.001;

        let entry = (isNaN(counttable.get(key)))
                ? score
                : score * counttable.get(key);
        counttable.set(key, entry);
        return counttable;
    }

    /**
     * 
     * @param target Test dataset in the form of list of list
     * @param k The number of last elements that will be used to find similar sequences
     * @param n The number of predictions required
     * 
     * @returns max n predictions for each sequence
     */
    predict(target: any[], 
         k: number = target.length,
         n: number = 1): any[][] {
        
        let predictions = [];

        for(let eachTarget of target) {
            eachTarget = eachTarget.slice(-k);
            let eachTargetSet = new Set(eachTarget);
            let intersection = new Set([...Array(this.data.length).keys()])

            for(let element of eachTarget) {
                if(!this.II[element]) continue;
                intersection = intersect(intersection, this.II[element]);
            }

            let similarSequences = [];

            for(let element of intersection) {
                let currNode = this.LT[element];
                let tmp = [];
                while (currNode.item !== null) {
                    tmp.push(currNode.item);
                    currNode = currNode.parent;
                }
                similarSequences.push(tmp);
            }

            similarSequences = similarSequences.map(s => s.reverse());
            let countTable = new Map();

            for(let sequence of similarSequences) {
                let index;
                try {
                    index = sequence.length - 1 - sequence.slice(0)
                        .reverse()
                        .findIndex(v => v === eachTarget[eachTarget.length - 1]);
                } catch(e) {
                    index = null;
                }
                if(index >= 0) {
                    let count = 1;
                    for(let element of sequence.slice(index + 1)) {
                        if(eachTargetSet.has(element)) continue;
                        countTable = this.score(countTable, element, similarSequences.length, count);
                        count++;
                    }
                }
            }

            let pred = getNLargest(countTable, n);
            predictions.push(pred);
        }

        return predictions;
    }
}

/**
 * A small utility to obtain top n keys of a Dictionary based on their values.
 * 
 * @param dict 
 * @param n 
 */
function getNLargest(dict: Map<string, number>, n: number) {
    return [...dict.entries()]
        .sort(([key1, val1], [key2, val2]) => (val2 > val1) ? 1 : -1)
        .slice(0, n)
        .map(entry => entry[0])
}

function intersect(a: Set<any>, b: Set<any>) {
    return new Set(
        [...a].filter(x => b.has(x)));
}