import React, { forwardRef } from 'react';
import { FullscreenControl as LeafletFullscreenControl } from 'react-leaflet-fullscreen';

const FullscreenControlWrapper = forwardRef((props, ref) => (
  <LeafletFullscreenControl {...props} ref={ref} />
));

export default FullscreenControlWrapper;
