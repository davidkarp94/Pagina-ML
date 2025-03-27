import React from 'react';
import './home.css';
import RouteButton from '../../components/routebutton/RouteButton';

const Home = () => {
  return (
    <div className='home-container'>
      <RouteButton text="Lista de Productos" route="/products" />
    </div>
  )
}

export default Home