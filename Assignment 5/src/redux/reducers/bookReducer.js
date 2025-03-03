import {
    FETCH_BOOKS_REQUEST,
    FETCH_BOOKS_SUCCESS,
    FETCH_BOOKS_FAILURE,
    CREATE_BOOK_REQUEST,
    CREATE_BOOK_SUCCESS,
    CREATE_BOOK_FAILURE,
    UPDATE_BOOK_REQUEST,
    UPDATE_BOOK_SUCCESS,
    UPDATE_BOOK_FAILURE,
    DELETE_BOOK_REQUEST,
    DELETE_BOOK_SUCCESS,
    DELETE_BOOK_FAILURE,
  } from '../constants/bookConstants';
  
  // Reducer for fetching books
  const bookListReducer = (state = { books: [], loading: false, error: null }, action) => {
    switch (action.type) {
      case FETCH_BOOKS_REQUEST:
        return { ...state, loading: true };
      case FETCH_BOOKS_SUCCESS:
        return { ...state, loading: false, books: action.payload };
      case FETCH_BOOKS_FAILURE:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  // Reducer for creating a book
  const bookCreateReducer = (state = { book: null, loading: false, error: null }, action) => {
    switch (action.type) {
      case CREATE_BOOK_REQUEST:
        return { ...state, loading: true };
      case CREATE_BOOK_SUCCESS:
        return { ...state, loading: false, book: action.payload };
      case CREATE_BOOK_FAILURE:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
// Reducer for updating a book
const bookUpdateReducer = (state = { book: null, loading: false, error: null }, action) => {
  switch (action.type) {
    case UPDATE_BOOK_REQUEST:
      return { ...state, loading: true };
    case UPDATE_BOOK_SUCCESS:
      return { ...state, loading: false, book: action.payload, error: null }; // Ensure `action.payload` is used
    case UPDATE_BOOK_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
  
  // Reducer for deleting a book
  const bookDeleteReducer = (state = { loading: false, error: null }, action) => {
    switch (action.type) {
      case DELETE_BOOK_REQUEST:
        return { ...state, loading: true };
      case DELETE_BOOK_SUCCESS:
        return { ...state, loading: false };
      case DELETE_BOOK_FAILURE:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export { bookListReducer, bookCreateReducer, bookUpdateReducer, bookDeleteReducer };
