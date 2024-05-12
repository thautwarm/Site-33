# Path

`NM.Path` is a class that represents a file path. It provides a set of methods for working with files and directories. It is similar to the `pathlib.Path` class from Python's standard library.

The `Path` object may handle discrepancies between different operating systems.

You might also import `ParsedPath` from the Deno std library: [https://deno.land/std@0.224.0/path/mod.ts](https://deno.land/std@0.224.0/path/mod.ts).

## Creating Path Objects

```typescript
import * as NM from 'https://github.com/thautwarm/nomake/raw/v0.1.5/mod.ts'

// create a Path object
const p1 = new NM.Path("path/to/file.txt")

// get the current working directory
const cwd = NM.Path.cwd()

// get the home directory
const home = NM.Path.home()

// get the parent directory
const parent = p1.parent()

// join one or more other paths
const joined = p1.join("another", "path")

// get the absolute path
const absPath = p1.abs()

// change the extension of the file
const newExt = p1.withExt(".md")
```

## Retriving Strings

```typescript
/* const p1: NM.Path */

// get the file name
const fileName = p1.name

// get the file extension
const ext = p1.ext

// get the file name without the extension
const stem = p1.stem

// get a string that represents the posix path
const posixPath = p1.asPosix()

// get a string that represents the native path
// for the current platform
const nativePath = p1.asOsPath()
```

## Non-IO Predicates

```typescript
// check if the path is absolute
p1.isAbs()

// check if the path is relative
p1.isRelative()
```

## IO

### Copy, Remove and Makedirs
```typescript
// read the file or directory
await p1.rm({
    // onError: 'ignore' | ((error: Error) => void)
    onError: 'ignore',
    // maxRetries?: number, default to 0
    // retryDelay?: number, default to 100
    // recursive?: boolean, default to false
})

// create the directory
await p1.mkdir({
    // parents?: boolean, default to false
    parents: true,
    // onError: 'ignore' | 'existOk' | ((error: Error) => void)
    onError: 'ignore',
    // mode?: number,
    mode: 0o755
})

// copy the file or directory to the destination
const dest: string | Path = 'path/to/destination'
await p1.copyTo(dest)
// you copy only the contents to the destination,
// instead of the directory itself
await p1.copyTo(dest, { contentsOnly: true })
```

### Read and Write

```typescript
// readText with the specified encoding
const text: string = await p1.readText('utf-8')

// read the file as an array of bytes
const bytes: Uint8Array = await p1.readBytes()

// write text to the file with the specified encoding
await p1.writeText('Hello, World!', 'utf-8')

// write an array of bytes to the file
const bytesToWrite = new TextEncoder().encode('Hello, World!')
await p1.writeBytes(bytesToWrite)
```


### Predicates

```typescript
// check if the path exists
await p1.exists()

// check if the path is a file
await p1.isFile()

// check if the path is a directory
await p1.isDirectory()
```

### Stats

```typescript
// get the file stats
const stats: fs.promises.Stats  = await p1.stat()
```