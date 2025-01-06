import React from 'react'
import './style.css'
export default function Home() {
  return (
    <div className='Home'>
      <div className='home-main'>

      </div>
      <div className='player'>
      <img src='https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'></img>
      <div className='controls-container'>
        <input type="range" min="0" max="100"></input>
          <div className='controls'>
            <button><i class="ri-skip-back-fill"></i></button>
            <button><i class="ri-play-circle-fill"></i></button>
            <button><i class="ri-skip-forward-fill"></i></button>
          </div>
      </div>
      </div>
    </div>
  )
}
