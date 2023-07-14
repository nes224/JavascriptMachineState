function createMachine(stateMachineDefinition) {
    const actions = {};
    const transitions = {};

    // initialize actions and transitions
    for (const [state, definition] of Object.entries(stateMachineDefinition)) {
        actions[state] = definition.actions || {};
        transitions[state] = definition.transitions || {};
    }

    return {
        currentState: stateMachineDefinition.initialState,
        value: stateMachineDefinition.initialState,
        actions,
        transitions,

        transition(action) {
            const current = this.currentState;
            const transitionData = this.transitions[current][action];
            // check if transition is defined
            if (!transitionData) {
                console.error(`Invalid transition from state ${current} with action ${action}`);
                return this.value;
            }

            const { target, action: transitionAction } = transitionData;

            // execute transition action if present
            if (transitionAction) {
                transitionAction();
            }

            // execute state action if present
            if (this.actions[target] && this.actions[target][action]) {
                this.actions[target][action]();
            }

            this.currentState = target;
            this.value = target;
            return this.value;
        },
    };
}

function getCharClass(char) {
    if (char === '[') {
        return '[';
    } else if (char === ']') {
        return ']';
    } else if (char === '\n') {
        return '\n';
    } else {
        return 'words';
    }
}

const message = '[ลดเอกสาร  วิทยฐานะ  ปลดล็อกการย้าย]\n';
const machine = createMachine({
    initialState: 'start',
    start: {
        actions: {
            openBracket() {
                console.log('Start state: open bracket');
            },
        },
        transitions: {
            '[': { target: 'title', action: () => console.log('Transition to title state') },
            '\n': { target: 'end', action: () => console.log('Transition to end state') },
        },
    },
    title: {
        actions: {
            words(char) {
                console.log(`Title state: adding ${char} to title`);
            },
            closeBracket() {
                console.log('Title state: close bracket');
            },
        },
        transitions: {
            ']': { target: 'last', action: () => console.log('Transition to last state') },
        },
    },
    last: {
        actions: {
            words(char) {
                console.log(`Last state: adding ${char} to title`);
            },
            closeBracket() {
                console.log('Last state: close bracket');
            },
        },
        transitions: {
            '\n': { target: 'end', action: () => console.log('Transition to end state') },
        },
    },
    end: {
        actions: {
            words(char) {
                console.log(`End state: ignoring ${char}`);
            },
        },
    },
});

let state = machine.value;
console.log(`Current state: ${state}`);

for (let i = 0; i < message.length; i++) {
    const char = message.charAt(i);
    const charClass = getCharClass(char);
    state = machine.transition(charClass);
}

console.log(`Final state: ${state}`);
