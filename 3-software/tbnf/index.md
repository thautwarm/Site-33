---
tags:
    - software
---

# Typed BNF

[Typed BNF](https://github.com/thautwarm/Typed-BNF) enables you to write **backend-agnostic** BNF grammar with **type inference** and **semantic actions**.

## Tutorials

- [JSON Parser Tutorials](./json-tutorials.md)

## Overview

Typed BNF (TBNF) is a powerful grammar specification language that combines the simplicity of BNF notation with the expressiveness of type systems. It allows you to define parsers with semantic actions that can be generated for multiple target languages from a single grammar specification.

### Key Features

- **Type Inference**: type-safe semantic actions with automatic type checking
- **Backend Agnostic**: parsers for multiple programming languages from the same grammar
- **Semantic Actions**: embed code (a minimal ML-like language; [ast](https://github.com/thautwarm/Typed-BNF/blob/ee0831eb3cbe7fc286bd4b20ee39eba99032d26d/core/Grammar.fs#L21);[syntax](https://github.com/thautwarm/Typed-BNF/blob/ee0831eb3cbe7fc286bd4b20ee39eba99032d26d/TypedBNF.tbnf#L147)) directly in your grammar to build ASTs or perform other operations
- **Parametric Rules**: parametric polymorphism in grammar rules
- **IDE Support**: decent IDE support with syntax highlighting and navigation features

## Supported Architectures

| Architecture | Backend (PGEN + PL) | Lexer Impl | Parser Capability | ADT Encoding |
|--------------|---------------------|------------|-------------------|--------------|
| antlr | antlr4+csharp | antlr | ALL(*) | case classes |
| antlr | antlr4+typescript (default) | antlr | ALL(*) | tagged unions |
| antlr | antlr4+typescript (`-be case-class`) | antlr | ALL(*) | case classes |
| *pure bnf | pure bnf | antlr notation | CFG | |

(**PL** = programming language; **PGEN** = parser generator; **pure bnf** means it is the pure BNF for readable syntax specification)

## Quick Start

Download the single executable file from [the release page](https://github.com/thautwarm/Typed-BNF/releases) and run:

```bash
tbnf -lang MyLanguage mygrammar.tbnf -be typescript-antlr -ae tagged-union
```

For C\#/TypeScript backends, you will get a `.g4` file and some supporting `.cs`/`.ts` files for the lexer and parser.

To actually get the parser, you need to compile the `.g4` file with ANTLR (for C\#)/ANTLR NG(for TypeScript).


```bash
> cat ./hello_world/MyLang.tbnf
start: 'hello' 'world' { $1 }

# create the directory for the generated files
> mkdir -p ./hello_world/src/grammar

# compile, type inference, and finally produce .g4 grammar and supporting files
> tbnf -lang MyLang ./hello_world/MyLang.tbnf -o ./hello_world/src/grammar -be typescript-antlr

# compile the g4 file with ANTLR NG
# use `antlr4` for non-TypeScript targets
>  antlr-ng -Dlanguage=TypeScript ./hello_world/src/grammar/MyLang.g4 -o ./hello_world/src/grammar/
```



