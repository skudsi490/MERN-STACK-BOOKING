import { createContext, useReducer, useEffect } from "react";

// Initial state with default options set
const INITIAL_STATE = {
  city: undefined,
  dates: [],
  options: {
    adult: 2,
    children: 0,
    room: 1,
  },
};

// Creating context
export const SearchContext = createContext(INITIAL_STATE);

// Reducer to handle actions
const SearchReducer = (state, action) => {
  switch (action.type) {
    case "NEW_SEARCH":
      return action.payload;
    case "UPDATE_SEARCH":
      return { ...state, ...action.payload }; // Merge the current state with updated fields
    case "RESET_SEARCH":
      return INITIAL_STATE;
    default:
      return state;
  }
};

// Context provider component
export const SearchContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(SearchReducer, INITIAL_STATE, () => {
    // Try to load saved state from local storage
    const localData = localStorage.getItem("searchState");
    return localData ? JSON.parse(localData) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem("searchState", JSON.stringify(state));
  }, [state]);

  return (
    <SearchContext.Provider
      value={{
        city: state.city,
        dates: state.dates,
        options: state.options,
        dispatch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
