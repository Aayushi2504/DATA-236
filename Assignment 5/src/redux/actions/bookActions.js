import axios from 'axios';
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

// Fetch all books
export const fetchBooks = () => async (dispatch) => {
  dispatch({ type: FETCH_BOOKS_REQUEST });
  try {
    const { data } = await axios.get('http://localhost:5000/api/books');
    dispatch({ type: FETCH_BOOKS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_BOOKS_FAILURE, payload: error.message });
  }
};

// Create a new book
export const createBook = (book) => async (dispatch) => {
  dispatch({ type: CREATE_BOOK_REQUEST });
  try {
    const { data } = await axios.post('http://localhost:5000/api/books', book);
    dispatch({ type: CREATE_BOOK_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: CREATE_BOOK_FAILURE, payload: error.message });
  }
};

// Update a book
export const updateBook = (id, book) => async (dispatch) => {
  dispatch({ type: UPDATE_BOOK_REQUEST });
  try {
    const { data } = await axios.put(`http://localhost:5000/api/books/${id}`, book);
    dispatch({ type: UPDATE_BOOK_SUCCESS, payload: data }); // Ensure `data` contains the updated book
  } catch (error) {
    dispatch({ type: UPDATE_BOOK_FAILURE, payload: error.message });
  }
};

// Delete a book
export const deleteBook = (id) => async (dispatch) => {
  dispatch({ type: DELETE_BOOK_REQUEST });
  try {
    await axios.delete(`http://localhost:5000/api/books/${id}`);
    dispatch({ type: DELETE_BOOK_SUCCESS, payload: id });
  } catch (error) {
    dispatch({ type: DELETE_BOOK_FAILURE, payload: error.message });
  }
};
