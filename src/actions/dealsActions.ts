import { GET_DEALS, GET_ROUTE, RESET_PATH } from "./types";
import { IFormValues } from "../models/interfaces";
 
export const getDeals = () => async (dispatch: any) => {
  const serverUrl: any = process.env.REACT_APP_GET_DEALS_PATH;

  await fetch(serverUrl)
    .then(res => res.json())
    .then(data =>
      dispatch({
        payload: data,
        type: GET_DEALS
      })
    )
    .catch((err: any) => err);
};

export const getRoute = (data: IFormValues) => (dispatch: any) => dispatch({payload: data, type: GET_ROUTE});
export const resetPath = () => (dispatch: any) => dispatch({type: RESET_PATH});