import {
  MY_ORDER_DETAILS_FAIL,
  MY_ORDER_DETAILS_REQUEST,
  MY_ORDER_DETAILS_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_RESET,
  ORDER_PAY_SUCCESS,
} from "../constants/orderConstants";

export const orderCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_CREATE_REQUEST:
      return { loading: true };
    case ORDER_CREATE_SUCCESS:
      return { loading: false, status: true, order: action.payload };
    case ORDER_CREATE_FAIL:
      return { error: action.payload };
    default:
      return state;
  }
};

export const orderDetailsReducer = (
  state = {
    loading: true,
    order: [],
  },
  action
) => {
  switch (action.type) {
    case ORDER_DETAILS_REQUEST:
      return { ...state, loading: true };
    case ORDER_DETAILS_SUCCESS:
      return { loading: false, order: action.payload };

    case ORDER_DETAILS_FAIL:
      return { error: action.payload };
    default:
      return state;
  }
};

export const orderPayReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_PAY_REQUEST:
      return { loading: true };
    case ORDER_PAY_SUCCESS:
      return { status: true };
    case ORDER_PAY_FAIL:
      return { error: action.payload };
    case ORDER_PAY_RESET:
      return {};
    default:
      return state;
  }
};

export const myOrdersReducer = (state = { myOrders: [] }, action) => {
  switch (action.type) {
    case MY_ORDER_DETAILS_REQUEST:
      return { ...state, loading: true };
    case MY_ORDER_DETAILS_SUCCESS:
      return { myOrders: action.payload };
    case MY_ORDER_DETAILS_FAIL:
      return { error: action.payload };
    default:
      return state;
  }
};
