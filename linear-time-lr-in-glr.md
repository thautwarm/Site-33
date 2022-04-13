与能高效解析左递归的LR相比，scannerless GLR处理左递归极其缓慢。
一些语言原本在token stream下能被lookahead消去歧义，但在scannerless GLR下却很难做到。空白符就是其中最有名的祸害，毕竟在scannerless GLR下，有限的lookahead甚至不一定能读完trailing的空白符。

一个具体场景是让JSON的key-value pair后跟空白符，这将导致shift-reduce冲突，进而导致每多解析一对key-value pair就有一个多余的N次reduce，其中N是已解析的key-value pair个数。

这些额外的reduce不能消除，但我们可以避免重复的计算：
**在每个state stack element上缓存进行过的reduce**

这个缓存是安全的。在输入的字符串和parsing table确定时，GLR上特定位置的state stack element做特定reduce(可能会有多次reduce)的结果也是确定的。这里需要假设semantic action和semantic predicate不引入副作用。

在JSON key-value pair的例子里，虽然每次shift-reduce冲突都引起一次暂不需要的reduce，但这个reduce的全过程会在正确的reduce时刻复现，缓存它将帮我们避免重复计算。缓存结果为多个state stack。

```json
{
    "a": 1 // 这里遇到空白符，kv-pair可能已经结束，有一次reduce
    ,
    "b": 2 // 遇到空白符，reduce两次，但前一次被缓存，所以只做一次reduce
    ,
    "c": 3 // 遇到空白符，reduce三次，但前两次被缓存，所以只做一次reduce
}
```

利用这个技巧，我们将上述的左递归情况从O(n^2)优化至O(n)。

reference implementation: https://github.com/thautwarm/uGLR
