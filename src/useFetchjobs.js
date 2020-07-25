import { useReducer, useEffect } from "react";
import axois from "axios";

const Base_Url =
  "https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json";

const ACTIONS = {
  MAKE_REQUEST: "make-request",
  GET_DATA: "get-data",
  ERROR: "error",
  UPDATE_NEXT_PAGE: "update_next_page"
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.MAKE_REQUEST:
      return {
        loading: true,
        jobs: []
      };
    case ACTIONS.GET_DATA:
      return {
        ...state,
        loading: false,
        jobs: action.payload.jobs
      };
    case ACTIONS.ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        jobs: []
      };
    case ACTIONS.UPDATE_NEXT_PAGE:
      return { ...state, hasNextPage: action.payload.hasNextPage };
    default:
      return state;
  }
}

export default function useFetchjobs(params, page) {
  const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true });

  useEffect(() => {
    const cancelToken = axois.CancelToken.source();
    dispatch({ type: ACTIONS.MAKE_REQUEST });
    axois
      .get(Base_Url, {
        cancelToken: cancelToken.token,
        params: { markdown: true, page: page, ...params }
      })
      .then(res => {
        dispatch({ type: ACTIONS.GET_DATA, payload: { jobs: res.data } });
      })
      .catch(e => {
        if (axois.isCancel(e)) return;
        dispatch({ type: ACTIONS.ERROR, payload: { error: e } });
      });
    const cancelToken1 = axois.CancelToken.source();
    dispatch({ type: ACTIONS.MAKE_REQUEST });
    axois
      .get(Base_Url, {
        cancelToken: cancelToken.token,
        params: { markdown: true, page: page, ...params }
      })
      .then(res => {
        dispatch({
          type: ACTIONS.UPDATE_NEXT_PAGE,
          payload: { hasNextPage: res.data.length !== 0 }
        });
      })
      .catch(e => {
        if (axois.isCancel(e)) return;
        dispatch({ type: ACTIONS.ERROR, payload: { error: e } });
      });

    return () => {
      cancelToken.cancel();
      cancelToken1.cancel();
    };
  }, [params, page]);

  return state;
}
