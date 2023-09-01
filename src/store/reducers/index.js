import { combineReducers } from 'redux';
import quizReducer from './quiz'; 

const rootReducer = combineReducers({
  quiz: quizReducer,
});

export default rootReducer;
