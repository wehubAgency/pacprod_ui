import { useState, useEffect } from 'react';
import iaxios from '../axios';
import store from '../store';

function useFetchData(url, initState = '') {
  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState(initState);

  const { currentApp, currentEntity, currentSeason } = store.getState().general;

  useEffect(() => {
    setFetching(true);
    const ax = iaxios();
    ax.get(url).then((res) => {
      if (res !== 'error') {
        setData(res.data);
      }
      setFetching(false);
    });
    return () => ax.source.cancel();
    // eslint-disable-next-line
  }, [currentApp, currentEntity, currentSeason]);

  return { data, fetching };
}

export { useFetchData };
