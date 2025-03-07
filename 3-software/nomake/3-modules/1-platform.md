# Platform

Platform-related utilities are provided in the `NM.Platform` namespace. The following types are used when working with platforms:

```typescript
import * as NM from 'https://github.com/thautwarm/nomake/raw/v0.1.12/mod.ts'

NM.Platform.current // e.g., { os: "linux", arch: "x64" }
NM.Platform.currentOS // e.g., "linux"
NM.Platform.currentArch // e.g., "x64"
NM.linesep() // e.g., "\n" or "\r\n", depending on the platform
NM.pathsep() // e.g., ":" or ";", depending on the platform
NM.linesep('linux') // "\n"
NM.pathsep('windows') // ";"
```

The following types are used when working with platforms:

```typescript
export type OS =
  | "linux"
  | "windows"
  | "macos"
  | { unknownStr: string };

export type Arch =
  | "x86"
  | "x64"
  | "arm"
  | "arm64"
  | { unknownStr: string };

export class Platform
{
  os: OS;
  arch: Arch;
  // methods are omitted
}

