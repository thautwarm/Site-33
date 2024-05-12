# `target()`

The `target()` function defines a target in the build system.


## Parameters

- `name: string`

    A unique identifier for the target. Responsible for invoking, distinguishing and caching the target. If the target is an artifact, it should be a file path (string).

- `deps?: Dependencies`

    Dependencies of this target.
    If a dependency is an artifact, it should be a file path (string).

- `virtual?: boolean`

    If the target is virtual (i.e. no artifact, analogous to PHONY in Makefile).

- `doc?: string`

    The documentation of the target.

- `rebuild?: 'always' | 'never' | 'onChanged'`

    The rebuild mode of the target.

    - `always`: always rebuild the target.
    - `never`: never rebuild the target.
    - `onChanged`: rebuild the target if any of its dependencies has been changed. When the dependencies are not specified, the target will always be rebuilt. `onChanged` will not track the changes of directory contents.

- `logError?: boolean`

    Whether to log errors when building the target fails (default to true).

- `build: (arg: { deps: InferTargets, target: string }) => void | Promise<void>`

    The build logic of the target.

<details>

<summary> Reference source code. </summary>

```typescript
interface TargetParams
{
    /**
     * A unique identifier for the target.
     *
     * Responsible for invoking, distinguishing and caching the target.
     */
    name: string,
    /**
     * Dependencies of the target.
     *
     * If a dependency is an artifact, it should be a file path (string).
     */
    deps?: Deps,
    /**
     * If the target is virtual (i.e. no artifact, analogous to PHONY in Makefile).
     */
    virtual?: boolean,
    /**
     * The documentation of the target.
     */
    doc?: string,
    /**
     * The build logic of the target.
     */
    build: (arg: { deps: InferencedDeps, target: string }) => void | Promise<void>,
    /**
     *
     * The rebuild mode of the target.
     *
     * - 'always': always rebuild the target.
     *
     * - 'never': never rebuild the target.
     *
     * - 'onChanged': rebuild the target if any of its dependencies has been changed.
     *
     * !!! PS1: when the dependencies are not specified, the target will always be rebuilt.
     *
     * !!! PS2: 'onChanged' will not track the changes of directory contents
     */
    rebuild?: 'always' | 'never' | 'onChanged',

    /**
     *
     * Whether to log errors when building the target fails (default to true).
     */
    logError?: boolean
}
```

</details>

## Retrieving the Computed Target Name

In practice, the `name` parameter of the `build` function may be a computed one. Hence, we might reference the target name in the build logic using the `target` parameter.

```typescript
NM.target(
    {
        name: 'output.txt',
        async build( { target } )
        {
            console.log(target) // 'output.txt'
        }
    })
```

## Type-safe Retrieval of Dependencies

The `deps` parameter of `target()` have multiple forms that ease the retrieval of dependencies in the build logic using a type-safe manner.

A dependency can be the following cases:

1. `string`
2. the return of `target()` (type: `Target`)
3. an array of the above types or an async generator of the above types.
4. a record with the above types as values.

The source code defines the following types including `BuildDependency`:

<a name="dependency-def"> </a>

```typescript
export type BuildDependency =
    | string
    | Target

export type BuildDependencySugar =
    | AsyncGenerator<BuildDependency, any, any>
    | BuildDependency[]
    | BuildDependency

// the type of `deps` in `target()`
export type BuildDependencies =
    | BuildDependencySugar
    | { [key: string]: BuildDependencySugar }
```

When retrieving dependencies in the build logic, the `deps` parameter gives you an "inferenced" result of your dependencies:

```typescript
const list_targets: NM.Target[] = [NM.target({ name: 'b.txt', ... })]
async function* async_targets()
{
    yield 'c.txt'
    for await (...) yield ...
}

NM.target(
    {
        name: 'build',
        virtual: true, // like phony in Makefile
        deps: { a: 'a.txt', b: list_targets, c: async_targets },
        async build({ deps })
        {
            console.log(deps.a)  // 'a.txt'
            console.log(deps.b)  //  [ 'b.txt' ]
            console.log(deps.c)  //  [ 'c.txt', ... ]
        }
    })
```

The mapping of dependencies to the `deps` parameter is as follows:

| Dependencies | Inferenced Dependencies |
|:--------------:|:-------------------------:|
| `BuildDependency`     | `string`                |
| `BuildDependency[]`   | `string[]`              |
| `AsyncGenerator<BuildDependency>` | `string[]` |
| `{ a: BuildDependency }` | `{ a: string }` |
| `{ a: BuildDependency[] }` | `{ a: string[] }` |
| `{ a: AsyncGenerator<BuildDependency> }` | `{ a: string[] }` |

You might be refer to the [Dependency](#dependency-def) definition.


## Grouping Dependencies

You can group dependencies using `Record`-style composition, which helps your organize your dependencies.

```typescript
import * as NM from 'https://github.com/thautwarm/nomake/raw/v0.1.5/mod.ts'

function glob(options: { root: string, suffix: string, excludeParts?: string[] })
{
    const { root, suffix, excludeParts } = options
    return new NM.Path(root).fwalk(
        (p) => p.endsWith(suffix) && !excludeParts?.some(part => p.parts.includes(part)),
        { includeDir: false, recursive: true }
    )
}

NM.target(
    name: './linux-x64/app',
    deps:
    {
        cppSources: glob({ root: 'src', suffix: '.cpp', excludeParts: ['generated'] }),
        libraries: ['lib1.so', 'lib2.so'],
        async build( { target, deps: { cppSources,  libraries }  } )
        {
            // you might do something like:
            // gcc $cppSources -l:$libraries -o $target
        }
    })
```

## Virtual Targets

A virtual target is a target that does not produce an artifact. It is analogous to the `PHONY` target in Makefile.

```typescript
import * as NM from 'https://github.com/thautwarm/nomake/raw/v0.1.5/mod.ts'

NM.target(
    {
        name: 'clean',
        virtual: true,
        async build()
        {
            await new NM.Path('build').rm(
                {
                    // no worries as all the parameters have
                    // 1. **intellisense support**
                    // 2. **exhaustive type checking**
                    // 3. **documentations**
                    onError: 'ignore',
                    recursive: true
                }
            )
        }
    })
```

## Caching & Rebuilding

Similar to Makefile, NoMake provides a mechanism to automatically rebuild targets based on the changes in their dependencies.

However, flexibility are left to the user to specify the rebuild mode of the target.

The `rebuild` parameter of `target()` specifies the rebuild mode of the target. It can be one of the following:

- `always`: always rebuild the target.
- `never`: never rebuild the target.
- `onChanged`: rebuild the target if any of its dependencies has been changed.

> [!NOTE]
> The default behavior when `rebuild` is not specified:
> 1. When no `deps` are specified, `rebuild` is set to `always`
> 2. When any `deps` are specified, `rebuild` is set to `onChanged`

The following code demonstrates the default behavior of the `rebuild` parameter:

```typescript
import * as NM from 'https://github.com/thautwarm/nomake/raw/v0.1.5/mod.ts'

NM.target(
    {
        name: 'clean',
        virtual: true,
        async build()
        {
            // this build logic will be always executed
        }
    })

NM.target(
    {
        name: 'output.txt',
        deps: ['input.txt'],
        async build({ deps, target })
        {
            // this build logic will be executed only when 'input.txt' is changed
        }
    })
```

## Adding Documentations

The `doc` parameter of `target()` specifies the documentation of the target.

So far, only virtual targets have been documented. The documentation of the target can be accessed via the `help` option.

```typescript
import * as NM from 'https://github.com/thautwarm/nomake/raw/v0.1.5/mod.ts'

NM.option(
    'legacy',
    {
        callback: ({ value }) => { /* do stuff with value */ },
        doc: 'Enable legacy mode.'
    })

// see parseOptions() for more details
NM.parseOptions()

NM.target(
    {
        name: 'build',
        virtual: true,
        doc: 'This target generates the output file.',
        async build()
        {
            // build logic
        }
    })

// trigger the build process
await NM.makefile()
```

You can trigger the documentations by running the following command:

```bash
sh> deno run -A build.ts help

Targets:
    [build] This target generates the output file.
Options:
    [-Dlegacy=value] Enable legacy mode.
```