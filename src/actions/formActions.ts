import { BACK_FORM_STEP, CONTINUE_FORM_STEP, UPDATE_FORM_VALUES, RESET_FORM } from "./types";
import { IFormValues} from "../models/interfaces";

export const continueFormStep = () => (dispatch: any) => dispatch({type: CONTINUE_FORM_STEP});
export const backFormStep = () => (dispatch: any) => dispatch({type: BACK_FORM_STEP});
export const updateForm = (data: IFormValues) => (dispatch: any) => dispatch({payload: data, type: UPDATE_FORM_VALUES});
export const resetForm = () => (dispatch: any) => dispatch({type: RESET_FORM});