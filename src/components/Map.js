import React, { useRef, useState, useEffect } from 'react';
import {
  GoogleMap,
  Marker,
  withGoogleMap,
  withScriptjs,
  Circle,
} from 'react-google-maps';
import SearchBox from 'react-google-maps/lib/components/places/SearchBox';
import { compose, withProps } from 'recompose';
import { withLocalize } from 'react-localize-redux';

/* global google */

const Map = compose(
  withLocalize,
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyBAOsCe_VL3DTH7LPwoglt80VBUEzZ-M5c',
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '400px', margin: '15px 0' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),
  withScriptjs,
  withGoogleMap,
)((props) => {
  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);
  const [zoom, setZoom] = useState(props.zoom || 3);
  const [center, setCenter] = useState(props.center || { lat: 46, lng: 0 });
  const [markers, setMarkers] = useState(props.markers || []);

  useEffect(() => {
    if (props.checkChanges) {
      props.checkChanges(markers);
    }
    /* eslint-disable-next-line */
  }, [markers]);

  const displayMarkers = (markerLocation, zooming = true) => {
    const newMarkerLocation = { ...markerLocation };
    const newMarkers = [...markers, newMarkerLocation];
    if (newMarkers.length > props.canSetMarkers) {
      newMarkers.splice(0, newMarkers.length - props.canSetMarkers);
    }
    setMarkers(newMarkers);
    if (zooming) {
      setZoom(15);
    }
    setCenter(newMarkerLocation);
  };

  const onPlacesChanged = () => {
    const { location } = searchBoxRef.current.getPlaces()[0].geometry;
    const markerLocation = {
      lat: location.lat(),
      lng: location.lng(),
    };
    displayMarkers(markerLocation);
  };

  const onMapClick = (e) => {
    if (props.canSetMarkers) {
      const { latLng } = e;
      const markerLocation = {
        lat: latLng.lat(),
        lng: latLng.lng(),
      };
      displayMarkers(markerLocation, false);
    }
  };

  return (
    <div>
      {props.canSetMarkers && (
        <SearchBox
          ref={searchBoxRef}
          bounds={props.bounds}
          controlPosition={google.maps.ControlPosition.TOP_CENTER}
          onPlacesChanged={onPlacesChanged}
        >
          <input
            type="text"
            placeholder={props.translate('map.searchAdress')}
            autoComplete="nope"
            style={{
              boxSizing: 'border-box',
              border: '1px solid transparent',
              width: '240px',
              height: '32px',
              marginTop: '27px',
              padding: '0 12px',
              borderRadius: '3px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
              fontSize: '14px',
              outline: 'none',
              textOverflow: 'ellipses',
            }}
          />
        </SearchBox>
      )}
      <GoogleMap
        ref={mapRef}
        zoom={zoom}
        center={center}
        defaultOptions={{
          mapTypeControlOptions: {
            position: google.maps.ControlPosition.BOTTOM_LEFT,
          },
        }}
        onClick={onMapClick}
      >
        {markers.map((m) => (
          <Marker
            key={`${m.lat}${m.lng}`}
            position={{ lat: m.lat, lng: m.lng }}
          />
        ))}
        {props.radius &&
          markers.map((m) => (
            <Circle
              key={`${m.lat}${m.lng}circle`}
              radius={+props.radius}
              onClick={onMapClick}
              center={{ lat: m.lat, lng: m.lng }}
            />
          ))}
      </GoogleMap>
    </div>
  );
});

export default Map;
