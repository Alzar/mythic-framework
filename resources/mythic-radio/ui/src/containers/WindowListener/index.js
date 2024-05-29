import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Nui from '../../util/Nui';

const WindowListener = props => {
  const handleEvent = event => {
    if (!event.isTrusted) {
      return;
    }

    const { dispatch } = props;
    const { type, data } = event.data;
    if (type != null) dispatch({ type, payload: { ...data } });
  };

  const handleKeyEvent = event => {
    const { dispatch } = props;
    if (event.keyCode === 27 || event.keyCode === 127) {
      Nui.send('Close');
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleEvent);
    window.addEventListener('keyup', handleKeyEvent);

    // returned function will be called on component unmount
    return () => {
      window.removeEventListener('message', handleEvent);
    };
  }, []);

  return React.Children.only(props.children);
};

WindowListener.propTypes = {
  dispatch: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
};

export default connect(null, null)(WindowListener);
