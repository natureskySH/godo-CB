export type State = 'S0' | 'S1' | 'S4';

export type Event =
  | { type: 'CLICK_CHATBOT_COMPONENT' }
  | { type: 'CLICK_CONSULT_COMPONENT' }
  | { type: 'CLICK_CALL_COMPONENT' }
  | { type: 'CLICK_CHIP'; chipId: string }
  | { type: 'CLICK_RETURN' }
  | { type: 'CLOSE_PANEL' };

export class StateMachine {
  private current: State = 'S0';

  get state() {
    return this.current;
  }

  transition(event: Event): State | 'EXIT' {
    const next =
      this.current === 'S0'
        ? this.transitionFromS0(event)
        : this.current === 'S1'
          ? this.transitionFromS1(event)
          : this.transitionFromS4(event);

    return next;
  }

  private setState(state: State) {
    this.current = state;
    return state;
  }

  private transitionFromS0(event: Event): State | 'EXIT' {
    if (event.type === 'CLICK_CHATBOT_COMPONENT') return this.setState('S1');
    if (event.type === 'CLICK_CONSULT_COMPONENT' || event.type === 'CLICK_CALL_COMPONENT')
      return 'EXIT';
    return this.current;
  }

  private transitionFromS1(event: Event): State | 'EXIT' {
    if (event.type === 'CLICK_CHIP') return this.setState('S4');
    if (event.type === 'CLOSE_PANEL') return this.setState('S0');
    return this.current;
  }

  private transitionFromS4(event: Event): State | 'EXIT' {
    if (event.type === 'CLICK_RETURN') return this.setState('S1');
    if (event.type === 'CLICK_CHIP') return 'EXIT';
    if (event.type === 'CLOSE_PANEL') return this.setState('S0');
    return this.current;
  }
}
