import { GENERAL_SETTING, DEVICE_TOKEN } from "@/store/action-types";
import Moment from "moment";

const initialState = {
    generalSetting: {},
    todayDateUpdate: "",
    deviceToken: "",
};

const GeneralSetting = (state = initialState, { type, payload = null }) => {
    switch (type) {
        case GENERAL_SETTING:
            return generalSetting(state, payload);
        case DEVICE_TOKEN:
            return setDeviceToken(state, payload);
        default:
            return state;
    }
};

const generalSetting = (state, payload) => {
    state = Object.assign({}, state, {
        cartItems: [],
        generalSetting: payload?.data,
        todayDateUpdate: Moment.utc().format("DD/MM/YYYY"),
    });
    return state;
};

const setDeviceToken = (state, payload) => {
    state = Object.assign({}, state, {
        deviceToken: payload,
    });
    return state;
};

export default GeneralSetting;
