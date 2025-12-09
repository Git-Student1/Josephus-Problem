

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
        return createStateFn(state.allElements, removeElement(removalIndex, state.leftOverElements), removalIndex, lastRemoved)
    }

    function tryNextSteps() {
        while (pState.leftOverElements.length > 1) {
            pState = nextStep(pState, stepSize, createState)
            console.log(pState.lastRemoved, pState.currentLeftOverIndex)
        }

        return pState.leftOverElements[0]
    }

    function createInitialState(arr, stateCreationFn) {
        return stateCreationFn(arr, [...arr], 0, undefined)
    }

    function lastRemoved(state) {
        return state.lastRemoved
    }

    function calculateResult(n, stepSize) {
        function calculateRecursively(n, k){
            if (n ===1 )return 1
            return (calculateRecursively(n-1, k) + k -1) %  n + 1
        }
        return calculateRecursively(n, stepSize+1)
    }
    function isFinished(state){
        return state.leftOverElements.length <= 1

    }

    let pState = createInitialState(createAscendingArray(n, []), createState)

    return {
        next: function () {
            pState = nextStep(pState, stepSize, createState);
            return {removed: lastRemoved(pState), currentElement: pState.leftOverElements[pState.currentLeftOverIndex], done:isFinished(pState)}
        },
        tryNextSteps: tryNextSteps,
        lastRemoved: function () { return lastRemoved(pState) },
        calculateResult: function () { return calculateResult(n, stepSize) },
        hasNext: function (){return !isFinished(pState)}
    }.freeze()
}

