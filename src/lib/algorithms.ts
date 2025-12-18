
export type AlgorithmType =
    | 'bubble'
    | 'selection'
    | 'insertion'
    | 'merge'
    | 'quick'
    | 'heap'
    | 'counting'
    | 'radix'
    | 'bucket';

export interface AlgorithmMetadata {
    title: string;
    bestCase: string;
    averageCase: string;
    worstCase: string;
    spaceComplexity: string;
    stable: boolean;
    inPlace: boolean;
    description: string;
    pseudocode: string;
}

export const ALGORITHM_DATA: Record<AlgorithmType, AlgorithmMetadata> = {
    bubble: {
        title: 'Bubble Sort',
        bestCase: 'O(n)',
        averageCase: 'O(n²)',
        worstCase: 'O(n²)',
        spaceComplexity: 'O(1)',
        stable: true,
        inPlace: true,
        description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
        pseudocode: `procedure bubbleSort(A : list of sortable items)
    n := length(A)
    repeat
        swapped := false
        for i := 1 to n-1 inclusive do
            if A[i-1] > A[i] then
                swap(A[i-1], A[i])
                swapped := true
    until not swapped
end procedure`
    },
    selection: {
        title: 'Selection Sort',
        bestCase: 'O(n²)',
        averageCase: 'O(n²)',
        worstCase: 'O(n²)',
        spaceComplexity: 'O(1)',
        stable: false,
        inPlace: true,
        description: 'Divides the input list into two parts: a sorted sublist and an unsorted sublist. It repeatedly picks the smallest element from the unsorted sublist and moves it to the sorted part.',
        pseudocode: `procedure selectionSort(A : list of sortable items)
    n := length(A)
    for i := 0 to n-2 do
        min_idx := i
        for j := i+1 to n-1 do
            if A[j] < A[min_idx] then
                min_idx := j
        swap(A[i], A[min_idx])
end procedure`
    },
    insertion: {
        title: 'Insertion Sort',
        bestCase: 'O(n)',
        averageCase: 'O(n²)',
        worstCase: 'O(n²)',
        spaceComplexity: 'O(1)',
        stable: true,
        inPlace: true,
        description: 'Builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.',
        pseudocode: `procedure insertionSort(A : list of sortable items)
    for i := 1 to length(A)-1 do
        key := A[i]
        j := i - 1
        while j >= 0 and A[j] > key do
            A[j + 1] := A[j]
            j := j - 1
        A[j + 1] := key
end procedure`
    },
    merge: {
        title: 'Merge Sort',
        bestCase: 'O(n log n)',
        averageCase: 'O(n log n)',
        worstCase: 'O(n log n)',
        spaceComplexity: 'O(n)',
        stable: true,
        inPlace: false,
        description: 'A divide and conquer algorithm that was invented by John von Neumann in 1945. It divides the unsorted list into n sublists, each containing one element, and then repeatedly merges sublists to produce new sorted sublists.',
        pseudocode: `procedure mergeSort(A : list of sortable items)
    if length(A) <= 1 return A
    mid := length(A) / 2
    left := mergeSort(A[0...mid])
    right := mergeSort(A[mid...end])
    return merge(left, right)
end procedure`
    },
    quick: {
        title: 'Quick Sort',
        bestCase: 'O(n log n)',
        averageCase: 'O(n log n)',
        worstCase: 'O(n²)',
        spaceComplexity: 'O(log n)',
        stable: false,
        inPlace: true,
        description: 'Uses a partition operation to divide the array into two smaller sub-arrays, then recursively sorts the sub-arrays. It is often faster in practice than other O(n log n) algorithms.',
        pseudocode: `procedure quickSort(A, low, high)
    if low < high then
        p := partition(A, low, high)
        quickSort(A, low, p - 1)
        quickSort(A, p + 1, high)
end procedure`
    },
    heap: {
        title: 'Heap Sort',
        bestCase: 'O(n log n)',
        averageCase: 'O(n log n)',
        worstCase: 'O(n log n)',
        spaceComplexity: 'O(1)',
        stable: false,
        inPlace: true,
        description: 'Uses a binary heap data structure to sort elements. It first builds a max-heap and then repeatedly extracts the maximum element and restores the heap property.',
        pseudocode: `procedure heapSort(A)
    buildMaxHeap(A)
    for i := length(A)-1 down to 1 do
        swap(A[0], A[i])
        heapify(A, 0, i)
end procedure`
    },
    counting: {
        title: 'Counting Sort',
        bestCase: 'O(n + k)',
        averageCase: 'O(n + k)',
        worstCase: 'O(n + k)',
        spaceComplexity: 'O(k)',
        stable: true,
        inPlace: false,
        description: 'An integer sorting algorithm that operates by counting the number of objects that have each distinct key value.',
        pseudocode: `procedure countingSort(A, k)
    count := array of k zeros
    for x in A do count[x] += 1
    for i := 1 to k do count[i] += count[i-1]
    result := array of length(A)
    for i := length(A)-1 down to 0 do
        result[count[A[i]]-1] := A[i]
        count[A[i]] -= 1
    return result`
    },
    radix: {
        title: 'Radix Sort',
        bestCase: 'O(nk)',
        averageCase: 'O(nk)',
        worstCase: 'O(nk)',
        spaceComplexity: 'O(n + k)',
        stable: true,
        inPlace: false,
        description: 'Sorts data with integer keys by grouping keys by the individual digits which share the same significant position and value.',
        pseudocode: `procedure radixSort(A)
    maxVal := getMax(A)
    for exp := 1; maxVal/exp > 0; exp *= 10 do
        countingSort(A, exp)
end procedure`
    },
    bucket: {
        title: 'Bucket Sort',
        bestCase: 'O(n + k)',
        averageCase: 'O(n + k)',
        worstCase: 'O(n²)',
        spaceComplexity: 'O(n)',
        stable: true,
        inPlace: false,
        description: 'Distributes the elements of an array into a number of buckets. Each bucket is then sorted individually.',
        pseudocode: `procedure bucketSort(A, n)
    buckets := array of n empty lists
    for x in A do
        i := floor(n * x)
        add x to buckets[i]
    for b in buckets do sort(b)
    return concatenation of buckets`
    }
};
