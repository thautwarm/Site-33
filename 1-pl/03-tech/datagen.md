---
oldUrl: /pl/datagen.html
date: 2022-12-16
---

# Random Test Data Generation for Arbitrary Types

## Introduction

In this article, we'd talk about a technique that provides random data generation for arbitrary data types. Whether you're working on testing code, creating mock data for demos or prototypes, or just want to quickly generate some sample data for whatever reason, this technique can come in handy.

Such a technique does not have a special name, and we'll call it "datagen combinators" or "datagenc" in this article.

The idea of "datagenc" is simple and well-known to functional programming guys. By observing and abstracting approaches of data generation and representing the generation process via generalised algebraic data types, we succeed in creating random data that conforms to the structure and constraints specified. Such a process is also type-safe, which means certain bugs are got rid of at compile time.

The special part of this article is that we also discuss the further improvement to the application of "datagenc" for dynamic programming languages such as Julia and Python.

## Mechanism

Suppose we want to generate runtime data for purposes such as testing, we'll need a "generator":

Using OCaml, what we want can be given as follows:

```ocaml
type 'a generator = unit -> 'a
let gen (g: 'a generator) = g ()
```

We can contrive a simple generator of integers`:
```ocaml
let int_g = fun () -> Random.int 16
let _ = gen int_g;;
- : int = 3
```

Such simple generators can be also made for other non-composite types, such as `string`, `float`, `bool`, etc.

The first interesting part comes when we consider the composite types. Giving a composite type as below:

```ocaml
type ('a, 'b) either = Left of 'a | Right of 'b
let either_g = ?
```

If we want to generate an `either` datum, we should provide information about its type arguments (`'a, 'b`). If you are familiar with solving problems with recursions, you may have immediately noticed that the generation of `either_g` can be also constructed by composting two generators, one for each type argument. In other words, we can generate an `either` datum by generating a datum of type `'a` and a datum of type `'b`, and then combine them into an `either` datum.

```ocaml
let either_g = fun (g1: 'a generator) (g2: 'b generator) ->
    match Random.int 2 with
    | 0 -> Left (gen g1)
    | 1 -> Right (gen g2)
    | _ -> failwith "impossible"
```

It shows that constructing a generator for a composite type such as `either` can be represented by compositing the generator of its components.

$$
\textit{Gen}((t_1, \cdots, t_n)) = (\textit{Gen}(t_1), \cdots, \textit{Gen}(t_n))
$$

The above case also shows that if the composite type is a sum type, we can also split the data generation process into the union of its constructors' data generation processes.

```ocaml
let or_g (gs: 'a generator list) =
    let i = Random.int (List.length gs) in List.nth gs i

let map_g (f: 'a -> 'b) (ga: 'a generator) = fun () -> f (gen ga)
let left a = Left a
let right a = Right a

let either_g (ga: 'a generator) (gb: 'b generator) = or_g [map_g left ga; map_g left gb]
```

The above analysis, i.e., deconstructing the generation process of `either` into "primitive" generation processes, unveils more common patterns in data generation such as `map` and `or`.

Another pattern is repeatedly generating a datum of a certain type. For example, if we want to generate a list of integers, we can repeatedly generate integers and then combine them into a list. This pattern is also common in data generation, and can be represented by the following function:

```ocaml
let rec repeat_g (n: int) (g: 'a generator) : 'a list generator =
    if n = 0 then fun () -> []
    else fun () -> (gen g) :: (gen (repeat_g (n - 1) g))

let _ = gen (repeat_g 3 int_g);;
- : int list = [8; 9; 4]
```

Besides, you might also want to use predicate functions to assure the generation conforms to some requirements. For example, if we want to generate a list of integers, we may want to make sure that the list is not empty, or the integer elements are not prim numbers. We can use the following function to achieve this:

```ocaml
let guard_g (predicate: 'a -> bool) (g: 'a generator) : 'a generator =
    let rec aux () =
        let x = gen g in
        if predicate x then x else aux ()
    in aux

let iseven x = (x mod 2 = 0)
let _ = guard_g iseven int_g
- : int = 4
```

Using `map`, `or`, `repeat`, `guard` and existing "primitive" generators, we can automatically construct a generator for most composite types via code generation with respect to the type definition.

By generalising the above patterns, we present the following code, which is adequate for generating data for arbitrary types:

```ocaml
type _ spec =
    | Gen    : 't generator -> 't spec
    | Rep    : int * 't spec -> 't list spec
    | Map    : ('a -> 'b) * 'a spec -> 'b spec
    | App    : ('a -> 't) spec * 'a spec -> 't spec
    | Guard  : ('a -> bool) * 'a spec -> 'a spec
    | Or     : 'a spec list -> 'a spec
(* `create_generator` creates `'a generator` from `'a spec` *)
let create_generator =
    let rec (!) : type a. a spec -> a generator =
        function
        | Gen g          -> g
        | Rep (n, spec)  -> repeat_g n !spec
        | Map(f, m)      -> map_g f !m
        | App(s1, s2)    -> let a1 = !s1 in let a2 = !s2 in fun () -> (gen a1) (gen a2)
        | Guard (p, s)   -> guard_g p !s
        | Or ts          -> or_g (List.map (!) ts)
    in (!)
```



## Pattern-based Data Generation

The basics of "datagenc" described above have been well integrated into famous frameworks such as QuickCheck in Haskell or Hypothesis in Python.

In Haskell, things are automatic as static typing is used to reason about the required generator.

```haskell
import Test.QuickCheck
-- suppose we already have
split :: Char -> String -> [String]
unsplit :: Char -> [String] -> String

-- we don't need manually specify what data generators are needed.
invariant c cs = unsplit c (split c xs) == xs

-- check!
main = quickCheck invariant
```

In Python, generators are manually specified, which is a little bit verbose.

```python
from hypothesis import given, strategies as st

@given(st.lists(st.integers()))
def test_reversing_twice_gives_same_list(xs):
    # This will generate lists of arbitrary length (usually between 0 and
    # 100 elements) whose elements are integers.
    ys = list(xs)
    ys.reverse()
    ys.reverse()
    assert xs == ys
```

Even if the framework is mature from an industrial perspective, the generation process can be still improved by introducing pattern-based data generation.

Pattern-based generation uses the same mechanism as that in "datagenc", but performs a translation from pattern matching like syntax to data generator specifications (like `spec` defined in the above OCaml prototyping code).

This was initially [implemented](https://github.com/thautwarm/MLStyle.jl/blob/main/matrix-benchmark/sampler.jl) in MLStyle.jl (a pattern matching library for Julia by me) for generating random data using pattern matching syntax.

```julia-repl
# generating primitives
julia> t = @spec (::Int)
julia> generate(t)
10

# generating tuples
julia> t = @spec (::Int, ::String)
julia> generate(t)
(10, "2as9p2")

# generating like constructing
julia> struct Data1
          f::Int
       end
julia> struct Data2{T}
          f1::String
          f2::T
          f3::Data1
       end
julia> t = @spec Data2(::String, ::Int, Data1(::Int))
julia> generate(t)

Data2{Int64}(
    "Vnsz625lAvOo:hrB?utg]Zz72Q\\L\\f=_1ko5XXWws[g@", 6597270699655146706,
    Data1(-7688086717226739915)
)
```

The possibility of implementing pattern-based data generation comes from the observation of the similar structures between syntax trees and data generation specifications:

```julia

@data Spec{T} begin
    S_or{A, B}  :: (Spec{A}, Spec{B}) => Spec{Union{A, B}}
    # ...
end

function ast2spec(ast)::Spec
    @switch ast begin
        # Julia can pattern match its ASTs in a homoiconic approach
        @case :($a || $b)
            return OrSpec(ast2spec(a), ast2spec(b))
        # ...
    end
end
```

## Miscellaneous

The "datagenc" technique described in this article can save you a lot of time and effort by getting rid of manually creating data yourself and, ensuring that your data is representative and accurate.

An interesting open problem is how to generate data for dynamic programming languages in a "visual" approach. Pattern-based data generation is a good start (see some uses at [bench-datagen.jl](https://github.com/thautwarm/MLStyle.jl/blob/4773f8900bd534924d27d0082685ad79478c4301/matrix-benchmark/bench-datatype.jl#L25)), and may deserve better engineering for implementations in Python, Julia and other dynamic programming languages.
