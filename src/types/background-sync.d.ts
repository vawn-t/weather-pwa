// Type definitions for Background Sync API
// https://wicg.github.io/background-sync/spec/

interface SyncManager {
  register(tag: string): Promise<void>;
  getTags(): Promise<string[]>;
}

interface ServiceWorkerRegistration {
  sync: SyncManager;
}

interface WindowEventMap {
  sync: SyncEvent;
}

interface SyncEvent extends ExtendableEvent {
  readonly tag: string;
}

interface ServiceWorkerGlobalScopeEventMap {
  sync: SyncEvent;
}
