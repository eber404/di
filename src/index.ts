type ClassRef<T = unknown> = new (...args: any[]) => T

type Lifecycle = 'singleton' | 'transient'

interface Registration<T> {
  classRef: ClassRef<T>
  lifecycle: Lifecycle
  instance?: T
  factory?: () => T
}

export class DI {
  private container: Map<ClassRef, Registration<unknown>> = new Map()

  public add<T>(classRef: ClassRef<T>, factory?: () => T) {
    const registration: Registration<T> = {
      lifecycle: factory ? 'transient' : 'singleton',
      classRef,
      ...(factory ? { factory } : {}) 
    }

    this.container.set(classRef, registration)

    return this.injectWrapper(registration)
  }

  public get<T>(classRef: ClassRef<T>): T {
    const registration = this.container.get(classRef)

    if (!registration) {
      throw new Error(`You should first add the class before retrieving it`)
    }

    if (registration?.lifecycle === 'singleton' && registration.instance) {
      return registration.instance as T
    }

    if (registration?.lifecycle === 'singleton' && !registration.instance) {
      const instance = new registration.classRef()
      registration.instance = instance
      this.container.set(classRef, registration)
      return instance as T
    }

    return this.container.get(classRef)?.factory?.() as T
  }

  public inject<T>(registration: Registration<T>, ...depRefs: ClassRef[]) {
    if (!registration) {
      throw new Error(`You should first add the class before injecting it`)
    }

    const depInstances = depRefs.map((depRef) => this.get(depRef))

    registration.instance = new registration.classRef(...depInstances)

    this.container.set(registration.classRef, registration)

    return {
      get: () => this.get(registration.classRef),
    }
  }

  private injectWrapper = <T>(registration: Registration<T>) => ({
    inject: (...depRefs: ClassRef[]) => this.inject(registration, ...depRefs),
  })
}
