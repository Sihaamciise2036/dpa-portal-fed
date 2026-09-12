import { combineReducers } from "redux";
import Auth from "./Auth";
import GeneralSetting from "./GeneralSetting";

const RootReducer = combineReducers({ Auth, GeneralSetting });

export default RootReducer;
