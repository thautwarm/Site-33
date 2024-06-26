---
title: A Short Introduction to Active Patterns
oldUrl: /design/a-short-intro-to-active-patterns.html
date: 2022-01-26
tags:
    - article
---

# A Short Introduction to Active Patterns

The progress of adopting pattern matching in mainstream industrial programming languages is accelerating. Python and Ruby have already supported such an impressive feature, which leads to quite a different atmosphere in the world of programming languages.

However, their rejection of **active patterns** is disappointing. Active patterns, or view patterns, is a mechanism to pattern match data structure using custom, specific perspectives. For instance, the notation of list deconstruction is so convenient that it becomes a mark of functional programming languages. A list is partitioned into two parts, the first few elements and the tail of the list. The following OCaml/F\# program shows how list deconstruction eases sequence processing.

```fsharp
let rec string_unescape (chars: list<char>) : list<char> =
    match chars with
    | '"'::[] -> []
    | '"'::_ -> (* invalid string literal *)
    | '\\' :: '"' :: tail -> '"' :: string_unescape tail
    | '\\' :: 'n' :: tail -> '\n' :: string_unescape tail
    | ...
```

It is also observed that such convenient notation does not only work for lists. Arrays, which is not a recursive data structure, can also enjoy such convenience. Subarrays, or array views, which is a data structure constructed in $O(1)$ time,  can be leveraged to support list-like array deconstruction, if active patterns are supported. List-like array deconstruction allows us to implement `string_unescape` that accepts an array.

```fsharp
type array_view<'a> = { source: array<'a>; offset: int }

let rec string_unescape (chars: array_view<char>) : list<char> =
    match chars with
    | ArrCons('"', ArrNil) -> []
    | ArrCons('"', _) -> (* invalid string literal *)
    | ArrCons('\\', ArrCons('"', tail)) -> '"' :: string_unescape tail
    | ArrCons('\\', ArrCons('n', tail)) -> '\n' :: string_unescape tail
    | ...
```

As can be seen from the above code, we use 2 patterns `ArrCons` and `ArrNil`. These patterns are very similar to that in the list deconstruction. However, they do not indicate the shape of an `array_view<'a>`, instead, they deconstruct an `array_view<'a>` using a custom, specific perspective; they are active patterns.

Active patterns are supported in Haskell and F\#. We can define patterns for an existing data type to fit our task-specific use. There is a valid F\# implementation for the aforementioned `ArrCons` and `ArrNil`.

```fsharp
let (|ArrCons|ArrNil|) ({source = source; offset=offset}: array_view<'a>) =
    if offset >= Array.length source
    then ArrNil
    else ArrCons(source.[offset], {source=source; offset=offset + 1})
```

Active patterns allow customizable pattern matching, considerably improving the readability. However, this might not be the truth for people who see it the first time. To make it easier for newcomers to read, we give a program equivalent to the above, to clarify the behaviour of active patterns.

```fsharp
type array_decons =
    | ArrCons of 'a * array_view<'a>
    | ArrNil

let array_decons: array_view<'a> -> array_decons = fun ->
    if offset >= Array.length source
    then ArrNil
    else ArrCons(source.[offset], {source=source; offset=offset + 1})


let rec string_unescape (chars: array_view<char>) : list<char> =
    match array_decons chars with
    | ArrCons('"', ArrNil) -> []
    | ...
```

Such code unveils that using active patterns is no more than applying a transformation to match targets. A naive implementation of active patterns is suggested as well.

```fsharp
let (|Positive|NotPositive|) x = if x >  0 then Positive else NotPositive
let (|Zero|NotZero|) x = if x = 0 then Zero else NotZero

match 0 with
| 10 -> 0       (* natural pattern of int *)
| Positive -> 1 (* patterns: Positive/NotPositive *)
| NotZero -> 2  (* patterns: Zero/NotZero *)
| _ -> 3
// => 3
```

However, in practice, the implementation of active patterns can avoid redundant allocations (by laziness or analysis). Different active patterns defined for the same data type can be used simultaneously, which makes active patterns a good approach to non-invasive extensions to pattern matching.
