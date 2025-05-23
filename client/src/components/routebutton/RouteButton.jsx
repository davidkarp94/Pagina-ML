import React from 'react';
import './routebutton.css';
import { Link } from 'react-router-dom';

const RouteButton = ({ text, route }) => {
  return (
    <div className='routebutton-container'>
        <Link to={ route }>
          <button className='routebutton-btn'>
            { text }
          </button>
        </Link>
    </div>
  )
}

export default RouteButton