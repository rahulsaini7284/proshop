import {
  CART_ADD_PRODUCT,
  CART_REMOVE_PRODUCT,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
} from "../constants/cartConstants";

export const cartReducer = (
  state = { cartItems: [], shippingAddress: {}, paymentMethod: "" },
  action
) => {
  switch (action.type) {
    case CART_SAVE_SHIPPING_ADDRESS: {
      return { ...state, shippingAddress: action.payload };
    }
    case CART_ADD_PRODUCT:
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.product === existItem.product ? item : x
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }
    case CART_SAVE_PAYMENT_METHOD: {
      return { ...state, paymentMethod: action.payload };
    }
    case CART_REMOVE_PRODUCT:
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x.product !== action.payload),
      };
    default:
      return state;
  }
};
