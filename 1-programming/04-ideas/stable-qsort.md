# Stable Argsort

This is a note on how to implement a stable `argsort` function based on an existing sort function, in a simple and pragmatic way.

## Argsort & Stability

Argsort is a function that returns the indices that would sort an array.

```math
\textrm{arg} \text{sort}([a_1, \cdots, a_n]) = [i_1, \cdots, i_n] \, \text{where} \, [a_{i_1}, \cdots, a_{i_n}] \text{ is sorted. }
```

Such a function is useful especially in the context of scientific computing where you also want to keep track of the original indices. For instance, NumPy has a function called `argsort` that does this.

```python
from numpy import argsort

argsort([3, 1, 2])
# => [1, 2, 0]
[[3, 1, 2][i] for i in argsort([3, 1, 2])]
# => [1, 2, 3]

argsort([100, -100, 20])
# => [1, 2, 0]
[[100, -100, 20][i] for i in argsort([100, -100, 20])]
# => [-100, 20, 100]
```

However, `argsort` does not mean to be stable. That is, if two elements are equal, the order of their indices in the output may not be guaranteed. For instance, in the following example, the order of `N` and `N+1` in `R` is not guaranteed.

```python
import numpy as np

N = np.random.randint(30, 70)
seq1 = [np.random.randint(2, 10) for i in range(N)]
seq2 = [np.random.randint(2, 10) for i in range(98-N)]
R = argsort([*seq1, 0, 0, *seq2])
```

Since NumPy 1.15, `argsort` can be made stable by using the `kind='stable'` parameter.

```python
import numpy as np

N = np.random.randint(30, 70)
seq1 = [np.random.randint(2, 10) for i in range(N)]
seq2 = [np.random.randint(2, 10) for i in range(98-N)]
R = argsort([*seq1, 0, 0, *seq2], kind='stable')
# 'R' always contains a subsequence '[N, N+1]'.
```

However, investigating a general approach to implement a stable `argsort` function based on an existing de-facto sort function is still pragmatic.

## Why is it Pragmatic?

Creating stable `argsort` from an existing de-facto sort function still pragmatic, due the following reasons:

1. `argsort` functionality may be missing from the standard library of a programming language.
2. Even if `argsort` is available, it may not be stable.
3. Even if `argsort` is available and stable, using custom sort configurations may cause sorting unstable.

The reason why we didn't implement our own sorting algorithm is, that in most cases, a sorting function from stdlib is well-optimized and well-tested. Many years ago, a friend of mine (let's call hime "doctor" and he is now indeed a Ph.D. student of medicine XD) implemented his own TimSort in Python because he thought "the built-in sorting algorithm is too slow". "Doctor" is of course humerous, and we already know that in Python, we could never beat the performance of the built-in `sorted` function by implementing our own sorting algorithm in pure Python.

Anyway, a real-world need to achieve a stable `argsort` function based on an existing sort function, did happen to me. We performed code generation from Julia (`@code_typed` IR) to some C-family language to utilize the well-designed sorting algorithms from Julia stdlib. To ease the downstream use cases, we used `lt` paramter (which is a custom "less than" function) to perform the sorting. Although the default sorting algorithm in Julia is stable, the custom `lt` function causes the sorting to be unstable.

Finally, implementing a stable `argsort` function based on an existing sort function does not cost much. It is simple, and again pragmatic.

## How to Implement?

The idea is simple for any one who know dictionary sorting. We can sort the indices based on the values, and then sort the indices based on their original order. The following Python code demonstrates this idea.

```python
def stable_argsort(arr):
    return sorted(range(len(arr)), key=lambda i: (arr[i], i))

import numpy as np

N = np.random.randint(30, 70)
seq1 = [np.random.randint(2, 10) for i in range(N)]
seq2 = [np.random.randint(2, 10) for i in range(98-N)]
stable_argsort([*seq1, 0, 0, *seq2])
```

However, `key` parameter in Python is not flexible enough as the elements to be sorted may not be mapped to a sortable value without expensive computations.

As the original case happens in Julia, we can also use the `lt` parameter to perform the sorting. In the downstream use cases, we use the `lt` parameter to perform the sorting demonstrated in the following Julia code.

```julia
function flexible_argsort(arr)
    function custom_lt(i, j)
        r = @inbounds cmp(arr[i], arr[j])
        if r < 0
            return true
        elseif iszero(r)
            # the key to make the sorting stable
            return i < j
        else
            return false
        end
    end

    return sort(1:length(arr), lt=custom_lt)
end

function normal_argsort(arr)
    return sort(1:length(arr), by = i -> @inbounds arr[i])
end
```

## Performance

We test the methods over 1000 double numbers. Benchmark tools: IPython `%timeit` for Python; `@btime` for Julia.

<style>
table {
    width: 80%;                /* Set the width of the table */
    margin: 20px auto;         /* Center the table on the page */
    border-collapse: collapse; /* Collapse borders between cells */
}

th, td {
    border: 1px solid #ddd;    /* Add a border to each cell */
    padding: 8px;              /* Padding inside each cell */
    text-align: left;          /* Align text to the left */
}

th {
    background-color: #f2f2f2; /* Background color for headers */
    color: #333;               /* Text color for headers */
}

tr:nth-child(even) {
    background-color: #f9f9f9; /* Zebra striping for rows */
}

td:hover {
    background-color: #f1f1f1; /* Highlight row on hover */
}
</style>
| Method | Performance |
|:---:|:----:|
| NumPy argsort (unstable) | 12.4 us |
| NumPy argsort (stable) | 23.6 us |
| Julia normal_argsort (stable) | 16.5 us |
| Julia flexible_argsort (stable) | 18.7 us |

As can be seen from the benchmark results, our method (i.e., `sort` from Julia stdlib with `lt` parameter but `lt` get passed at the downstream code) keeps performant without lossing it flexibility.

## Conclusion

We discussed the importance of stable `argsort` function and why it is pragmatic to implement the function based on an existing/mature sort function. We also demonstrated how to implement a stable `argsort` function in Python and Julia, and benchmarked the performance of the methods. The results show that our method is performant and flexible.
