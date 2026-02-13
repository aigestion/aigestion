import { useState, useCallback, useEffect, useRef } from 'react';

// State machine types
export interface State {
  readonly name: string;
  readonly onEnter?: () => void;
  readonly onExit?: () => void;
  readonly transitions: ReadonlyMap<string, string>;
}

export interface StateMachineConfig {
  readonly initialState: string;
  readonly states: ReadonlyMap<string, State>;
  readonly onTransition?: (from: string, to: string, event: string) => void;
  readonly onStateChange?: (state: string) => void;
}

export interface TransitionEvent {
  readonly type: string;
  readonly payload?: any;
}

// State machine implementation
export class StateMachine {
  private currentState: string;
  private config: StateMachineConfig;
  private history: string[] = [];

  constructor(config: StateMachineConfig) {
    this.config = config;
    this.currentState = config.initialState;
    this.history.push(this.currentState);

    // Call initial state's onEnter
    const initialState = this.config.states.get(this.currentState);
    initialState?.onEnter?.();
  }

  getCurrentState(): string {
    return this.currentState;
  }

  getHistory(): readonly string[] {
    return this.history;
  }

  canTransition(event: string): boolean {
    const currentState = this.config.states.get(this.currentState);
    if (!currentState) return false;

    return currentState.transitions.has(event);
  }

  getAvailableTransitions(): readonly string[] {
    const currentState = this.config.states.get(this.currentState);
    if (!currentState) return [];

    return Array.from(currentState.transitions.keys());
  }

  transition(event: string, _payload?: any): boolean {
    const currentState = this.config.states.get(this.currentState);
    if (!currentState) return false;

    const nextStateName = currentState.transitions.get(event);
    if (!nextStateName) return false;

    const nextState = this.config.states.get(nextStateName);
    if (!nextState) return false;

    // Call exit handlers
    currentState.onExit?.();

    // Update state
    const previousState = this.currentState;
    this.currentState = nextStateName;
    this.history.push(this.currentState);

    // Call transition callback
    this.config.onTransition?.(previousState, this.currentState, event);

    // Call enter handlers
    nextState.onEnter?.();

    // Call state change callback
    this.config.onStateChange?.(this.currentState);

    return true;
  }

  reset(): void {
    const currentState = this.config.states.get(this.currentState);
    currentState?.onExit?.();

    this.currentState = this.config.initialState;
    this.history = [this.currentState];

    const initialState = this.config.states.get(this.currentState);
    initialState?.onEnter?.();
  }

  getStateInfo(): State | undefined {
    return this.config.states.get(this.currentState);
  }
}

// Hook for using state machine
export function useStateMachine(config: StateMachineConfig) {
  const [stateMachine] = useState(() => new StateMachine(config));
  const [currentState, setCurrentState] = useState(stateMachine.getCurrentState());
  const [, forceUpdate] = useState({});

  // Force update on state change
  const triggerUpdate = useCallback(() => {
    forceUpdate({});
  }, []);

  // Update config to include our update trigger
  const machineConfig = {
    ...config,
    onStateChange: (state: string) => {
      setCurrentState(state);
      config.onStateChange?.(state);
      triggerUpdate();
    },
  };

  // Recreate machine if config changes
  const machine = useRef(new StateMachine(machineConfig));

  useEffect(() => {
    machine.current = new StateMachine(machineConfig);
    setCurrentState(machine.current.getCurrentState());
  }, [machineConfig]);

  const transition = useCallback((event: string, payload?: any) => {
    return machine.current.transition(event, payload);
  }, []);

  const canTransition = useCallback((event: string) => {
    return machine.current.canTransition(event);
  }, []);

  const getAvailableTransitions = useCallback(() => {
    return machine.current.getAvailableTransitions();
  }, []);

  const getHistory = useCallback(() => {
    return machine.current.getHistory();
  }, []);

  const reset = useCallback(() => {
    machine.current.reset();
  }, []);

  const getStateInfo = useCallback(() => {
    return machine.current.getStateInfo();
  }, []);

  return {
    currentState,
    transition,
    canTransition,
    getAvailableTransitions,
    getHistory,
    reset,
    getStateInfo,
  };
}

// Predefined state machines
export const createStateMachines = {
  // Authentication state machine
  auth: (): StateMachineConfig => ({
    initialState: 'idle',
    states: new Map([
      [
        'idle',
        {
          name: 'idle',
          transitions: new Map([
            ['login', 'loading'],
            ['register', 'loading'],
          ]),
        },
      ],
      [
        'loading',
        {
          name: 'loading',
          onEnter: () => console.log('Auth loading...'),
          transitions: new Map([
            ['success', 'authenticated'],
            ['error', 'error'],
          ]),
        },
      ],
      [
        'authenticated',
        {
          name: 'authenticated',
          onEnter: () => console.log('User authenticated'),
          transitions: new Map([
            ['logout', 'idle'],
            ['tokenExpired', 'idle'],
          ]),
        },
      ],
      [
        'error',
        {
          name: 'error',
          onEnter: () => console.log('Auth error'),
          transitions: new Map([
            ['retry', 'loading'],
            ['logout', 'idle'],
          ]),
        },
      ],
    ]),
    onTransition: (from, to, event) => {
      console.log(`Auth transition: ${from} -> ${to} (${event})`);
    },
  }),

  // Form state machine
  form: (): StateMachineConfig => ({
    initialState: 'pristine',
    states: new Map([
      [
        'pristine',
        {
          name: 'pristine',
          transitions: new Map([
            ['change', 'dirty'],
            ['submit', 'validating'],
          ]),
        },
      ],
      [
        'dirty',
        {
          name: 'dirty',
          transitions: new Map([
            ['submit', 'validating'],
            ['reset', 'pristine'],
          ]),
        },
      ],
      [
        'validating',
        {
          name: 'validating',
          onEnter: () => console.log('Validating form...'),
          transitions: new Map([
            ['valid', 'submitting'],
            ['invalid', 'dirty'],
          ]),
        },
      ],
      [
        'submitting',
        {
          name: 'submitting',
          onEnter: () => console.log('Submitting form...'),
          transitions: new Map([
            ['success', 'submitted'],
            ['error', 'dirty'],
          ]),
        },
      ],
      [
        'submitted',
        {
          name: 'submitted',
          onEnter: () => console.log('Form submitted successfully'),
          transitions: new Map([['reset', 'pristine']]),
        },
      ],
    ]),
  }),

  // API request state machine
  api: (): StateMachineConfig => ({
    initialState: 'idle',
    states: new Map([
      [
        'idle',
        {
          name: 'idle',
          transitions: new Map([['request', 'loading']]),
        },
      ],
      [
        'loading',
        {
          name: 'loading',
          onEnter: () => console.log('Loading...'),
          transitions: new Map([
            ['success', 'success'],
            ['error', 'error'],
            ['cancel', 'idle'],
          ]),
        },
      ],
      [
        'success',
        {
          name: 'success',
          transitions: new Map([
            ['request', 'loading'],
            ['reset', 'idle'],
          ]),
        },
      ],
      [
        'error',
        {
          name: 'error',
          transitions: new Map([
            ['retry', 'loading'],
            ['reset', 'idle'],
          ]),
        },
      ],
    ]),
  }),

  // Modal state machine
  modal: (): StateMachineConfig => ({
    initialState: 'closed',
    states: new Map([
      [
        'closed',
        {
          name: 'closed',
          transitions: new Map([['open', 'opening']]),
        },
      ],
      [
        'opening',
        {
          name: 'opening',
          onEnter: () => console.log('Opening modal...'),
          transitions: new Map([['opened', 'open']]),
        },
      ],
      [
        'open',
        {
          name: 'open',
          transitions: new Map([['close', 'closing']]),
        },
      ],
      [
        'closing',
        {
          name: 'closing',
          onEnter: () => console.log('Closing modal...'),
          transitions: new Map([['closed', 'closed']]),
        },
      ],
    ]),
  }),
};

// Hook for authentication state machine
export function useAuthStateMachine() {
  return useStateMachine(createStateMachines.auth());
}

// Hook for form state machine
export function useFormStateMachine() {
  return useStateMachine(createStateMachines.form());
}

// Hook for API state machine
export function useApiStateMachine() {
  return useStateMachine(createStateMachines.api());
}

// Hook for modal state machine
export function useModalStateMachine() {
  return useStateMachine(createStateMachines.modal());
}

// State machine visualizer component
export function StateMachineVisualizer({
  machine,
  width = 400,
  height = 300,
}: {
  readonly machine: StateMachine;
  readonly width?: number;
  readonly height?: number;
}) {
  const currentState = machine.getCurrentState();
  const availableTransitions = machine.getAvailableTransitions();

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white" style={{ width, height }}>
      <h3 className="font-bold mb-2">State Machine</h3>
      <div className="mb-2">
        <span className="font-semibold">Current State: </span>
        <span className="text-blue-600">{currentState}</span>
      </div>
      <div className="mb-2">
        <span className="font-semibold">Available Transitions: </span>
        <div className="flex flex-wrap gap-1 mt-1">
          {availableTransitions.map(transition => (
            <span
              key={transition}
              className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs"
            >
              {transition}
            </span>
          ))}
        </div>
      </div>
      <div>
        <span className="font-semibold">History: </span>
        <div className="text-xs text-gray-600 mt-1">{machine.getHistory().join(' → ')}</div>
      </div>
    </div>
  );
}

// State machine debugger component
export function StateMachineDebugger({ machine }: { readonly machine: StateMachine }) {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const originalTransition = machine.transition.bind(machine);

    machine.transition = (event: string, payload?: any) => {
      const result = originalTransition(event, payload);
      const log = `Transition: ${machine.getCurrentState()} (${event})`;
      setLogs(prev => [...prev.slice(-9), log]);
      return result;
    };

    return () => {
      machine.transition = originalTransition;
    };
  }, [machine]);

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
      <h3 className="font-bold mb-2">State Machine Debugger</h3>
      <div className="text-xs font-mono space-y-1">
        {logs.map((log, index) => (
          <div key={index} className="text-gray-700">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
