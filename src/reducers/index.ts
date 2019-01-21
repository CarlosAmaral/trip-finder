import {combineReducers} from 'redux';
import dealsReducer from './dealsReducer';
import formReducer from './formReducer';

export default combineReducers({
    deals: dealsReducer,
    form: formReducer
})
