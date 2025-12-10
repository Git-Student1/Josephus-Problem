

export function josProblem(n, stepSize) {
    if (typeof n !== "number") {
        throw new TypeError('n must be Number')
    }
    if (typeof stepSize !== "number") {
        throw new TypeError('stepSize must be Number')
    }


    function createAscendingArray(n, arr) {
        //reminder: only allows less than 96XX (Xe[0,9]) elements/recursions
        //question: how much faster is this?:  Array.from({length: n}, (e, i)=> i)-> uses Array.prototype
        let l = arr.length
        if (l >= n) return arr
        arr[l] = l + 1
        return createAscendingArray(n, arr)
    }

    function createState(allElements, leftOverElements, currentIndex, lastRemoved) {
        return {
            allElements: allElements,
            leftOverElements: leftOverElements,
            currentLeftOverIndex: currentIndex,
            lastRemoved: lastRemoved
        }
    }

    function nextStep(state, stepSize, createStateFn) {
        function removeElement(removalIndex, arr) {
            function remove(removalIndex, oldArr, newArr, i, appendFn) {
                //TODO: optimise this
                if (i === oldArr.length)
                    return newArr
                if (i !== removalIndex)
                    newArr = appendFn(newArr, oldArr[i])
                return remove(removalIndex, oldArr, newArr, i + 1, appendFn)
            }
            return remove(removalIndex, arr, [], 0, append)

            function append(arr, element) {
                let newArr = [...arr]
                newArr[newArr.length] = element
                return newArr
            }
        }
        function nextRemovalIndex(currentIndex, arr, stepSize) {
            return (currentIndex + stepSize) % arr.length
        }
        let removalIndex = nextRemovalIndex(state.currentLeftOverIndex, state.leftOverElements, stepSize)
        let lastRemoved = state.leftOverElements[removalIndex]
        //the state needs to be either saved here or needs to be handled by the calling part. As I wish to have it stored in this object, stored away from external manipulation it is necessary like this
        pState =  createStateFn(state.allElements, removeElement(removalIndex, state.leftOverElements), removalIndex, lastRemoved)
    }

    function tryNextSteps() {
        while (pState.leftOverElements.length > 1) {
            nextStep(pState, stepSize, createState)
        }

        return pState.leftOverElements[0]
    }

    function createInitialState(arr, stateCreationFn) {
        return stateCreationFn(arr, [...arr], 0, undefined)
    }

    function calculateResult(n, stepSize) {
        function calculateRecursively(n, k){
            if (n ===1 )return 1
            //formular taken from wikipedia: https://de.wikipedia.org/wiki/Josephus-Problem
            return (calculateRecursively(n-1, k) + k -1) %  n + 1
        }
        return calculateRecursively(n, stepSize+1)
    }

    const stateManager =
        function() {
        let state
            function createState(allElements, leftOverElements, currentIndex, lastRemoved) {
                return {
                    allElements: allElements,
                    leftOverElements: leftOverElements,
                    currentLeftOverIndex: currentIndex,
                    lastRemoved: lastRemoved
                }
            }
            return {
                updateState: function updateState(allElements, leftOverElements, currentIndex, lastRemoved) {
                    state = createState(allElements, leftOverElements, currentIndex, lastRemoved)
                },
                isFinished: function (state) {
                    return state.leftOverElements.length <= 1
                },
                lastRemoved: function (state) {
                    return state.lastRemoved
                },
                currentElement: function (state) {
                    return state.leftOverElements[state.currentLeftOverIndex % state.leftOverElements.length]
                }
            }
        }

    function isFinished(state){
        return state.leftOverElements.length <= 1
    }
    function lastRemoved(state) {
        return state.lastRemoved
    }
    function currentElement(state){
        return state.leftOverElements[state.currentLeftOverIndex % state.leftOverElements.length]
    }
    let pState = createInitialState(createAscendingArray(n, []), createState)
    return Object.freeze({
        next: function () {
            nextStep(pState, stepSize, createState);
            return {
                removed: lastRemoved(pState),
                done:isFinished(pState)
            }
        },
        nextExecutioner: function(){
            return currentElement(pState) },
        tryNextSteps: tryNextSteps,
        lastRemoved: function () { return lastRemoved(pState) },
        calculateResult: function () { return calculateResult(n, stepSize) },
        hasNext: function (){return !isFinished(pState)}


    })
}

