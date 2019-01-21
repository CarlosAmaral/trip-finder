import {
  CONTINUE_FORM_STEP,
  BACK_FORM_STEP,
  UPDATE_FORM_VALUES,
  RESET_FORM
} from "../actions/types";

const initialState = {
  formStep: 0,
  formValues: {
    arrival: undefined,
    departure: undefined,
    weight: undefined
  },
  valid: false
};

export default function formSteps(state = initialState, action: any) {
  switch (action.type) {
    case CONTINUE_FORM_STEP:
      return {
        ...state,
        formStep: state.formStep + 1
      };
    case BACK_FORM_STEP:
      return {
        ...state,
        formStep: state.formStep - 1
      };
    case UPDATE_FORM_VALUES:
      return {
        ...state,
        formValues: action.payload
      };
    case RESET_FORM:
      return {
        ...state,
        formStep: initialState.formStep,
        formValues: initialState.formValues
      };
    default:
      return state;
  }
}
