import * as React from 'react';
import { createContext, useContext, useEffect, useReducer } from 'react';
import type {
  accountSchema,
  addressSchema,
  legalSchema,
  paymentSchema,
  personalSchema,
} from '@/schemas/registration.ts';
import type { Tier } from '@/schemas/membership-tier.ts';
import type { ReactNode } from 'react';
import type { z } from 'zod';

// ——— State & Actions ———
type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface State {
  step: Step;
  selectedTier: Tier | null;
  account: z.infer<typeof accountSchema>;
  personal: z.infer<typeof personalSchema>;
  address: z.infer<typeof addressSchema>;
  healthConditions: Array<string>;
  requiresMedicalClearance: boolean;
  payment: z.infer<typeof paymentSchema>;
  legal: z.infer<typeof legalSchema>;
}

const initialState: State = {
  step: 1,
  selectedTier: null,
  account: { email: '', password: '', confirmPassword: '' },
  personal: { firstName: '', lastName: '', phone: '', dob: '' },
  address: { street: '', apt: '', city: '', state: '', zip: '' },
  healthConditions: [],
  requiresMedicalClearance: false,
  payment: {
    cardNumber: '',
    expiry: '',
    cvv: '',
    billingZip: '',
  },
  legal: { agreeTerms: false, agreeWaiver: false, marketingOptIn: false },
};

type Action =
  | { type: 'SET_STEP'; payload: Step }
  | { type: 'SET_TIER'; payload: Tier }
  | { type: 'UPDATE_ACCOUNT'; payload: Partial<State['account']> }
  | { type: 'UPDATE_PERSONAL'; payload: Partial<State['personal']> }
  | { type: 'UPDATE_ADDRESS'; payload: Partial<State['address']> }
  | { type: 'SET_HEALTH_CONDITIONS'; payload: Array<string> }
  | { type: 'UPDATE_PAYMENT'; payload: Partial<State['payment']> }
  | { type: 'UPDATE_LEGAL'; payload: Partial<State['legal']> }
  | { type: 'RESET' }
  | { type: 'LOAD_FROM_STORAGE'; payload: State };

// ——— Reducer ———
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_TIER':
      return { ...state, selectedTier: action.payload, step: 2 };
    case 'UPDATE_ACCOUNT':
      return { ...state, account: { ...state.account, ...action.payload } };
    case 'UPDATE_PERSONAL':
      return { ...state, personal: { ...state.personal, ...action.payload } };
    case 'UPDATE_ADDRESS':
      return { ...state, address: { ...state.address, ...action.payload } };
    case 'SET_HEALTH_CONDITIONS': {
      const requires = action.payload.some((id) =>
        // Mock data
        [
          'heart-disease',
          'high-blood-pressure',
          'diabetes-type1',
          'diabetes-type2',
          'pregnancy',
          'epilepsy',
          'osteoporosis',
          'recent-surgery',
        ].includes(id),
      );
      return {
        ...state,
        healthConditions: action.payload,
        requiresMedicalClearance: requires,
      };
    }
    case 'UPDATE_PAYMENT':
      return { ...state, payment: { ...state.payment, ...action.payload } };
    case 'UPDATE_LEGAL':
      return { ...state, legal: { ...state.legal, ...action.payload } };
    case 'RESET':
      return initialState;
    case 'LOAD_FROM_STORAGE':
      return { ...action.payload, step: state.step }; // keep current step
    default:
      return state;
  }
}

// ——— Context ———
interface RegistrationContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
  nextStep: () => void;
  prevStep: () => void;
  isLastStep: boolean;
  progress: number;
}

const RegistrationContext = createContext<RegistrationContextValue | undefined>(
  undefined,
);

export const RegistrationProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ——— Persist to localStorage ———
  useEffect(() => {
    const saved = localStorage.getItem('registrationData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsed });
      } catch (e) {
        console.warn('Failed to load registration data');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('registrationData', JSON.stringify(state));
  }, [state]);

  const nextStep = () =>
    dispatch({ type: 'SET_STEP', payload: (state.step + 1) as Step });
  const prevStep = () =>
    dispatch({ type: 'SET_STEP', payload: (state.step - 1) as Step });
  const isLastStep = state.step === 7;
  const progress = ((state.step - 1) / 6) * 100;

  return (
    <RegistrationContext.Provider
      value={{ state, dispatch, nextStep, prevStep, isLastStep, progress }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

// ——— Hook ———
export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context)
    throw new Error('useRegistration must be used within RegistrationProvider');
  return context;
};
