---
tags:
    - software
---
# NoMake

[NoMake](https://github.com/thautwarm/nomake) is a build system for multi-language and multi-platform projects with the following highlighted practical features:

1. Type-safe build scripts
2. Intellisense support
3. Minimal learning curve
4. Url-based ruleset sharing
5. Incremental, asynchronous, and distributed building

<details>

<summary>

Why is NoMake created with TypeScript & Deno?

</summary>

NoMake achieves most of these features by using TypeScript, a statically typed language that is widely adopted in the industry and has been proven to have a good trade-off between static typing and real-world usability.

Deno fundamentally eases the sharing and reusing of build scripts and ruleset libraries. It also allows distributing the build process across multiple machines by cross-compiling and single-file bundling.

</details>

## Installation

<script type="text/javascript">
    function copyToClipboard(id) {
        var copyText = document.getElementById(id);
        // Copy the text inside the text field
        navigator.clipboard.writeText(copyText.innerText);
    }
</script>

1. Install NoMake for your platform.

    Supported platforms: `win-x64`, `linux-x64`, `macos-x64`, `linux-arm64`, `macos-arm64`.


    ::: tabs#download

    @tab GitHub Releases
        
    Download the binaries and add them to your PATH: [https://github.com/thautwarm/nomake/releases](https://github.com/thautwarm/nomake/releases)

    @tab Deno Library

    ```typescript
    import * as NM from 'https://github.com/thautwarm/nomake/raw/v0.1.5/mod.ts'
    ```

    :::

2. Run your build script (requires a `build.ts` file as an entry point).

    ```bash
    nomake help
    nomake <build target>

    ## or if you're using nomake as a Deno library:
    # deno run -A build.ts help
    # deno run -A build.ts <build target>
    ```

See examples at [NoMake Examples](https://github.com/thautwarm/nomake/tree/main/example).

## Preview

```typescript
// build.ts
import * as NM from 'https://github.com/thautwarm/nomake/raw/v0.1.5/mod.ts'

// define options
NM.option('legacy', ({ value }) => { /* do stuff with value */ })

// parse options
NM.parseOptions()

// define one or more targets
NM.target(
    {
        name: 'output.txt',
        deps: { file: 'input.txt' },
        async build({ deps, target })
        {
            const input = await new NM.Path(deps.file).readText();
            await new NM.Path(target).writeText(
                'Hello, ' + input
            )
        }
    })

// trigger the build process
await NM.makefile()
```

## Namespaces

Functionality in NoMake is organized into namespaces. Here are some of the most important ones:

- [`NM.Platform`](./3-modules/1-platform.md): Platform detection and manipulation
- [`NM.Env`](./3-modules/2-env.md): Type-safe environment variable access
- [`NM.Path`](./3-modules/3-path.md): Filesystem operations (similar to Python `pathlib`)
- [`NM.Log`](./3-modules/4-log.md): Logging utilities
- `NM.Repo`: Git repository operations
- `NM.CC`: C/C++ compilation toolchain
- `NM.Bflat`: C# native compilation toolchain without .NET SDKs & Visual Studio ([Linux/Windows only](https://github.com/bflattened/bflat/issues/110); for macOS support, use [.NET SDKs](https://learn.microsoft.com/en-us/dotnet/core/install/macos) by Microsoft)

The core operations are directly defined in the `NM` namespace, including:
- [`NM.target()`](./2-core/target.md): Define a build target
- [`NM.option()`](./2-core/option.md): Define a build option
- [`NM.parseOptions()`](./2-core/parseOptions.md): Parse the build options
- [`NM.makefile()`](./2-core/makefile.md): Invoke the build process

## Patterns

NoMake provides a set of patterns assign type safety for many common jobs in build systems, such as:

1. Defining and organizing artifacts
2. Platform-specific build rules
3. Environment variables of interest
4. Grouping and retrieving target dependencies
