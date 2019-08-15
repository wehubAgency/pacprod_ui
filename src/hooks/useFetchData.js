import { useState, useEffect } from 'react';
import iaxios from '../axios';
import store from '../store';

function useFetchData(urls, initState = []) {
  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState(initState);

  const { currentApp, currentEntity, currentSeason } = store.getState().general;

  useEffect(() => {
    setFetching(true);
    const ax = iaxios();
    let requests;
    if (Array.isArray(urls)) {
      requests = urls.map(url => ax.get(url));
    } else {
      requests = [ax.get(urls)];
    }
    Promise.all(requests).then((res) => {
      if (res.indexOf('error') === -1) {
        setData(res.map(r => r.data));
      }
      setFetching(false);
    });
    return () => ax.source.cancel();
    // eslint-disable-next-line
  }, [currentApp, currentEntity, currentSeason]);

  if (data === null) {
    return { data: null, fetching };
  }
  if (data.length === 1) {
    return { data: data[0], fetching };
  }
  return { data, fetching };
}

export { useFetchData };
