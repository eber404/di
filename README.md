# TinyDI Container 🚀

This library provides a simple implementation of dependency injection in TypeScript.

## Installation 📦

To install the library:

```sh
npm i @codespeaks/tinydi
```

## Usage 🛠️

### Import

First, import the `TinyDI` class:

```typescript
import { TinyDI } from '@codespeaks/tinydi'
```

### Adding Classes to the Container

You can add classes to the container using the `add` method. If the class has dependencies, you can use the `inject` method to specify them in the same order as you defined in the target class constructor.

```typescript
class ProfileService {
  // ...
}

class RoleService {
  // ...
}

class User {
  constructor(
    private readonly profileService: ProfileService,
    private readonly roleService: RoleService
  ) {
    // ...
  }
}

const container = new TinyDI()

container.add(ProfileService)
container.add(RoleService)

const user = container.add(User).inject(ProfileService, RoleService).getSelf()
```

### Lifecycle

You can specify the lifecycle of instances when registering them. By default, instances are singletons. To create transient instances, provide a factory as the second parameter of the `.add` method.

```typescript
class MyService {
  // ...
}

container.add(MyService, () => new MyService())
```

### Retrieving Instances

To retrieve an instance of a registered class, use the `get` method:

```typescript
const serviceA = container.get(ServiceA)
const serviceB = container.get(ServiceB)
```

## API 📚

### `add<T>(classRef: ClassRef<T>, factory?: () => T)`

Adds a class to the container.

- `classRef`: The reference of the class to be added.
- `factory`: (Optional) A factory function to create transient instances.

### `inject<T>(...depRefs: ClassRef[])`

Injects dependencies into a registered class.

- `depRefs`: The references to the dependency classes in the same order as defined in the target class constructor.

### `get<T>(classRef: ClassRef<T>): T`

Retrieves an instance of the registered class.

- `classRef`: The reference of the class to be retrieved.

### `getSelf(): T`

Retrieves an instance of the added class.

## License 📄

This project is licensed under the MIT License.
