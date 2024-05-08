# `target`

The `target()` function defines a target in the build system.

```typescript
import * as NM from 'https://github.com/thautwarm/nomake/raw/v0.1.3/mod.ts'

NM.target(
    {
        name: 'output.txt',
        deps: ['input.txt'],
        async build()
        {
            // build logics
        }
    }
)
```

## Parameters

```typescript
interface TargetParams {
    /**
     * 构建目标的唯一标识符
     *
     * A unique identifier for the target.
     *
     * 用于调用、区分和缓存目标。
     *
     * Responsible for invoking, distinguishing and caching the target.
     */
    name: string,
    /**
     * 构建目标的依赖项。
     *
     * Dependencies of the target.
     *
     * 如果目标是实体文件 (artifacts)，则应该是文件路径 (string)。
     *
     * If the target is an artifact, it should be a file path (string).
     */
    deps?: Dependencies,

    /**
     * 目标是否虚拟的（即没有实体文件，类比 Makefile 中的 PHONY）。
     *
     * If the target is virtual (i.e. no artifact, analogous to PHONY in Makefile).
     */
    virtual?: boolean,

    /**
     * 构建目标的文档。
     *
     * The documentation of the target.
     */
    doc?: string,

    /**
     * 构建目标的逻辑。
     *
     * The build logic of the target.
     */
    build: (arg: { deps: InferTargets<It>, target: string }) => void | Promise<void>,
    /**
     * 构建目标的重构建模式。
     *
     * - 'always': 总是重构建目标。
     *
     * - 'never': 从不重构建目标。
     *
     * - 'onChanged': 如果任何依赖项已更改，则重构建目标。
     *
     * The rebuild mode of the target.
     *
     * - 'always': always rebuild the target.
     *
     * - 'never': never rebuild the target.
     *
     * - 'onChanged': rebuild the target if any of its dependencies has been changed.
     *
     * !!! PS1: 当未指定依赖项时，目标将始终重构建。
     *
     * !!! PS1: when the dependencies are not specified, the target will always be rebuilt.
    *
     * !!! PS2: 'onChanged' 不会跟踪目录内容的更改
     *
     * !!! PS2: 'onChanged' will not track the changes of directory contents
     */
    rebuild?: 'always' | 'never' | 'onChanged',

    /**
     * 当构建目标失败，是否记录错误（默认为 true）。
     *
     * Whether to log errors when building the target fails (default to true).
     */
    logError?: boolean
}
```