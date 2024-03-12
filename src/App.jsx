import React from 'react'
import Hero from './components/Hero'
import TimeLine from './components/TimeLine'
import About from './components/About'
import WhatIDo from './components/WhatIDo'

function App() {
  return (
    <div className="app">
          <Hero />
          <About/>
          <WhatIDo/>
          <TimeLine/>
    </div>
  )
}

export default App