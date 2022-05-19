function findMaxRecursive(arr, n) {
    if(n == 0) {
        return arr[0]
    }
    let max1 = findMaxRecursive(arr, n-1)
    if(max1 > arr[n-1]) {
        return max1
    } else {
        return arr[n-1]
    }
}
const arr = [2,4,0,2,1,89,33,55]
console.log(findMaxRecursive(arr, arr.length))