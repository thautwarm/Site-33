---
date: 2022-04-13
oldUrl: /Site-33/design/linear-time-lr-in-glr.html
---

# 缓存Scannerless GLR解析

与能高效解析左递归的LR相比，scannerless GLR处理左递归极其缓慢。
一些语言原本在 token stream 下能被 lookahead 消去歧义，但在 scannerless GLR 却很难做到。空白符就是其中最有名的祸害，毕竟在 scannerless GLR 下，有限的 lookahead 甚至不一定能读完 trailing whitespace。

一个具体场景是让 JSON 的 key-value pair 后跟空白符，这将导致 shift-reduce 冲突，进而导致每多解析一对 key-value pair 就有一个多余的 N 次 reduce，其中N是已解析的 key-value pair 个数。

这些额外的 reduce 是不能消除的，但我们可以避免重复的计算：

**在每个state stack element上缓存进行过的reduce**

此缓存是安全的: 在输入的字符串和 parsing table 确定时，GLR 上特定位置的 state stack element 做特定 reduce (可能会有多次 reduce) 的结果也是确定的。**但需要一些假设: semantic action 和 semantic predicate 不引入副作用。**

在 JSON key-value pair 的例子里，虽然每次 shift-reduce 冲突都引起一次暂不需要的 reduce，但这个 reduce 的全过程会在正确的 reduce 时刻复现，缓存它将帮我们避免重复计算。缓存结果为多个 state stack。

```json
{
    "a": 1 // 这里遇到空白符，kv-pair可能已经结束，有一次reduce
    ,
    "b": 2 // 遇到空白符，reduce两次，但前一次被缓存，所以只做一次reduce
    ,
    "c": 3 // 遇到空白符，reduce三次，但前两次被缓存，所以只做一次reduce
}
```

利用这个技巧，我们将上述的左递归情况从 $O(n^2)$ 优化至 $O(n)$。

Reference implementation: [https://github.com/thautwarm/uGLR](https://github.com/thautwarm/uGLR).
