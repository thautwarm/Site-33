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

1. Install [Deno](https://deno.com/)

    <div class="site33-tabs">
        <input type="radio" name="site33-tabs" id="site33-tab1" checked>
        <label for="site33-tab1">Windows</label>
        <input type="radio" name="site33-tabs" id="site33-tab2">
        <label for="site33-tab2">Linux/macOS</label>
        <input type="radio" name="site33-tabs" id="site33-tab3">
        <label for="site33-tab3">GitHub Releases</label>
        <input type="radio" name="site33-tabs" id="site33-tab3">
        <div class="site33-tab-content" id="site33-content1" style="height: 6em">

            ```bash
            irm https://deno.land/install.ps1 | iex
            ```
        </div>
        <div class="site33-tab-content" id="site33-content2" style="height: 6em">

            ```bash
            curl -fsSL https://deno.land/install.sh | sh
            ```
        </div>
        <div class="site33-tab-content" id="site33-content3" style="height: 6em">
            The Deno releases can be found at [https://github.com/denoland/deno/releases](https://github.com/denoland/deno/releases).

        </div>
    </div>

2. Run your build script:

    ```bash
    deno run -A build.ts
    ```

See examples at [NoMake Examples](https://github.com/thautwarm/nomake/tree/main/example).

## Preview

```typescript
// build.ts
import * as NM from 'https://github.com/thautwarm/nomake/raw/v0.1.3/mod.ts'

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
```

## Namespaces

Functionality in NoMake is organized into namespaces. Here are some of the most important ones:

- `NM.Platform`: Platform detection and manipulation
- `NM.Env`: Type-safe environment variable access
- `NM.Path`: Filesystem operations (similar to Python `pathlib`)
- `NM.Repo`: Git repository operations
- `NM.Log`: Logging utilities
- `NM.CC`: C/C++ compilation toolchain
- `NM.Bflat`: C# native compilation toolchain without .NET SDKs & Visual Studio ([Linux/Windows only](https://github.com/bflattened/bflat/issues/110); for macOS support, use [.NET SDKs](https://learn.microsoft.com/en-us/dotnet/core/install/macos) by Microsoft)

The core operations are directly defined in the `NM` namespace, including:
- `NM.target()`: Define a build target
- `NM.option()`: Define a build option
- `NM.parseOptions()`: Parse the build options
- `NM.makefile()`: Invoke the build process
