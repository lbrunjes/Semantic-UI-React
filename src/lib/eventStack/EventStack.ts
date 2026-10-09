import * as React from 'react'

import type { EventHandler, EventStackTarget } from './EventStackManager'
import instance from './instance'

export interface EventStackProps {
  /** A DOM event name, i.e. "keydown". */
  name: string

  /** Handler(s) of the event. */
  on: EventHandler | EventHandler[]

  /** A pool name, see `EventPool` for the dispatching rules. */
  pool?: string

  /** A target to subscribe to. */
  target?: EventStackTarget
}

/**
 * Subscribes `on` handler(s) to a DOM event via the event stack while mounted.
 * A drop-in replacement for the component from "@semantic-ui-react/event-stack".
 */
export default class EventStack extends React.PureComponent<EventStackProps> {
  componentDidMount() {
    this.subscribe(this.props)
  }

  componentDidUpdate(prevProps: EventStackProps) {
    this.unsubscribe(prevProps)
    this.subscribe(this.props)
  }

  componentWillUnmount() {
    this.unsubscribe(this.props)
  }

  subscribe({ name, on, pool, target }: EventStackProps) {
    instance.sub(name, on, { pool, target })
  }

  unsubscribe({ name, on, pool, target }: EventStackProps) {
    instance.unsub(name, on, { pool, target })
  }

  render() {
    return null
  }
}

EventStack.defaultProps = {
  pool: 'default',
  target: 'document',
}
