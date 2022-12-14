import {
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
} from "../constants/productListConstants";

const productListReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST: {
      return { loading: true, products: [] };
    }
    case PRODUCT_LIST_SUCCESS: {
      return { loading: false, products: action.payload };
    }
    case PRODUCT_LIST_FAIL: {
      return { loading: false, products: [], error: action.payload };
    }
    default: {
      return state;
    }
  }
};

const productDetailsReducer = (state = { product: [] }, action) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return { ...state, loading: true, product: [] };
    case PRODUCT_DETAILS_SUCCESS: {
      return { ...state, loading: false, error: "", product: action.payload };
    }
    case PRODUCT_DETAILS_FAIL: {
      return { ...state, loading: false, error: action.payload };
    }
    default: {
      return state;
    }
  }
};

export { productListReducer, productDetailsReducer };
