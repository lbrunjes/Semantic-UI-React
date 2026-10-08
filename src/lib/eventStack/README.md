# Event Stack

Originally https://github.com/layershifter/event-stack, now maintained in this folder.

Handlers are subscribed to DOM events in pools. The `default` pool dispatches an event to all its
handlers, any other pool dispatches it only to the most recently subscribed handler. This allows
nested components (i.e. Modals) to handle events like `Escape` only on the top-most instance.

- `eventStack.sub(eventName, handlers, { pool, target })` / `eventStack.unsub(...)` – imperative API
- `<EventStack name on pool target />` – declarative API, subscribes while mounted
