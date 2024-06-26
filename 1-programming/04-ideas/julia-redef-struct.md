---
oldUrl: /design/julia-redef-struct.html
date: 2022-08-01
tags:
    - article
---

# Julia交互会话中的重定义问题

## 背景问题

使用Python比较多的用户如果接触Julia，除开启动延迟问题，一些重定义的操作也可能让人烦恼。

```julia
struct S
    int_field::Int32
end
```

以上语法定义一个结构体，这很酷：它的内存布局和在C里写一个结构体是一样的，内存开销不到一个Python整数的 $\dfrac{1}{4}$ .

但是用户不关心，用户关心这个：

```julia-repl
julia> struct S
           int_field::Int32
       end
# 定义一个结构体

julia> struct S
           int_field::Int32
       end
# 定义相同，正常工作

julia> struct S
           int_field::Int64
       end
ERROR: invalid redefinition of type S
```

之所以发生这个情况，是因为Julia没办法“卸载”一个结构体。

这有两方面原因：

1. 与Python相比，Julia中的变量名、尤其是定义类型时自动绑定的const变量名是不能重定义的。

   其之所以不能重定义的底层原因是，const变量名并非像Python那样只是字符串到堆对象的绑定，而是到LLVM编译结果中某个稳定位置的符号链接。虽然存在重定向的机会，但Julia没做。

2. Julia之所以不愿意花精力支持重绑定const变量名，是因为他们认为这会对用户造成误导。

   他们担心的情况确实可能出现，因为和Python不同的是，Julia中的类型大规模地用于“重载”（多重派发），重名类型相比Python会产生更多误导。

考虑下面的情况：

```julia-repl
julia> struct S
        v1 :: Int
        end

julia> x = S(1)

julia> f(s::S) = 1

julia> struct S
        v2 :: Float64
        end

julia> f(s::S, ::Int) = 2

julia> y = S(1.0)
julia> f(y)
ERROR: MethodError: no method matching f(::S)
Closest candidates are:
f(::S, ::Int64) at ...
f(::S,) at ...
```

可以看到，如果允许重定义，将会发生 `f(::S)` 缺失重载，却又提示 `f(::S)` 存在。

在使用交互环境时，用户的需求是进行实验迭代。在这个过程中设计快速变动，结构体形状也不例外。

实际上不止是结构体的重定义，真正的问题是，Julia中const变量的绑定基本都不能改变 (例外是存在的，例如模块名是 const 绑定，但修改只出现warning)。

```julia-repl
julia> f(x) = 2x + 3
f (generic function with 2 methods)

julia> f = 1
ERROR: invalid redefinition of constant f
```

在这里，我们不得不做一个取舍，即舍弃更好的报错，转而支持灵活的重定义。这个决定是否正确要看场景，在我所关心的场景中，要求上层用户向无法满足需求的语言进行妥协——这是毫无道理的。

## 解决方案

处于可维护性的考虑，在库代码层面进行类型、常量的重定义是错误的。

但在我所关心的场景中，交互会话应该支持重定义——以方便用户进行实验。

目前，结构体乃至通用的 const 绑定的重定义，并没有很好的实现：

要么使用了非 const 绑定对类型进行别名绑定，这将导致函数中的 `isa` 检查退化为动态派发，性能下降数百倍；

要么是利用了泛型参数，将字段变成泛型参量，这将隐式地导致一些类型转换问题，并且不支持用户定义泛型；

再要么就是利用 type alias，用 `Tuple{Tag, ...}` 或者 `Ref{Tuple{Tag, ...}}` 伪装结构体，这几乎是完全工作的，但 Julia 的 Tuple 自动协变:

```julia
Tuple{Union{Int, String}, Int} == Union{Tuple{Int, Int}, Tuple{String, Int}}
```

这可能导致结构体的字段出现意想不到的协变性质，因此无法确认此种方式是否可靠。

一个比较好的方式可能是下面这样，重点是对有限的情况做保证，而其他情况保持与原生Julia行为一致：

1. 将 Main 模块设置为动态变化的，而 REPL 始终使用最新的 Main 模块。

2. 捕获有限情况的重定义错误。一旦捕获到可以处理的重定义错误，闯进一个新的 Main 模块，将旧的Main模块中所有变量转移到新的Main模块，除开发生冲突的 const 绑定。

这种方法乍一看很危险，因为一些宏展开可能会使用访问当前模块，并一直持有旧的 Main。

但其实，这并不会出现问题：即使这些宏可能期待 `Main` 中新定义的方法会扩展他们的行为，但由于将变量从旧模块迁移到新模块可以使用 `import` 语义，因此方法的扩展是正常工作的。

当然，不可避免的，和原生 Julia 不兼容的情况是存在的。有一些宏变换可能会基于模块的引用相等性进行工作。例如 PyCall 的 `@py_str` 会使用当前模块，唯一决定一个执行 Python 代码的命名空间。

但这种情况相对比较少，使用模块的引用相等性本身也是不推荐的，遇到这种情况更好的做法是先偷着乐一乐，然后写 PR 改进上游的实现，例如将 PyCall 的 `@py_str` 修改，通过访问模块中一个固定的变量获取 Python 作用域，若不存在则定义——这种方式就与前述的重定义方案兼容了。

~~明天给代码实现，35行以内。~~

## 实现

效果如下:

```julia
redef> struct S end

redef> f(::S) = 1
f (generic function with 1 method)

redef> s1 = S()
S()

redef> f(s1)
1

redef> struct S
         a :: Int
       end

redef> s2 = S(2)
Main.__Main_0.S(2)

redef> f(::S) = 2
f (generic function with 2 methods)

redef> f(s1)
1

redef> f(s2)
2
```

实现如下。

1. 首先，在`~/.julia/config/startup.jl`中增加下列行：

    ```julia
    include("redef.jl")
    atreplinit() do repl
    try
        @async begin
            Redef.start()
        end
    catch e
        throw(e)
    end
    end
    ```

2. 然后创建`~/.julia/config/redef.jl`，填入以下内容：

    ```julia
    module Redef
    using ReplMaker
    const pat = r"invalid redefinition of constant ([\w|\W]+)"
    const cntRef = Ref(0)
    const curMod = Ref{Module}()

    function __init__()
        cntRef[] = 0
        curMod[] = Main
    end

    function run(ex)
        m = curMod[]
        try
            Base.eval(m, ex)
        catch e
            if e isa ErrorException && (rm = match(pat, e.msg)) !== nothing
                new_mod = Module(Symbol("__Main_", cntRef[]), true)
                cntRef[] += 1
                curMod[] = new_mod
                interested_name = Symbol(rm.captures[1])
                for each in names(m; all=true, imported=true)
                    if each == :eval || interested_name === each
                        continue
                    end
                    full_module_name = Symbol(join(string.(fullname(m)), "."))
                    if isconst(m, each)
                        Base.eval(new_mod, :(import $full_module_name: $each))
                    else
                        Base.eval(new_mod, :($each = $m.$each))
                    end
                end
                Base.eval(new_mod, ex)
            else
                rethrow(e)
            end
        end
    end

    function redirect_parse(s::AbstractString)
        ex = Meta.parse(s)
        :($run($(QuoteNode(ex))))
    end

    @inline start() = initrepl(
        redirect_parse;
        prompt_text = "redef> ",
        prompt_color = :magenta,
        mode_name = :redef_julia,
        valid_input_checker=ReplMaker.complete_julia
    )
    end # end module
    ```