import * as React from 'react'

import instance from './instance'

/**
 * Subscribes `on` handler(s) to a DOM event via the event stack while mounted.
 * A drop-in replacement for the component from "@semantic-ui-react/event-stack".
 */
export default class EventStack extends React.PureComponent<any> {
  componentDidMount() {
    this.subscribe(this.props)
  }

  componentDidUpdate(prevProps) {
    this.unsubscribe(prevProps)
    this.subscribe(this.props)
  }

  componentWillUnmount() {
    this.unsubscribe(this.props)
  }

  subscribe({ name, on, pool, target }: any) {
    instance.sub(name, on, { pool, target })
  }

  unsubscribe({ name, on, pool, target }: any) {
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
