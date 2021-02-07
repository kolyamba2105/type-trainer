import { Trainer } from 'App/Trainer'
import React from 'react'
import './App.scss'

const TEXT_FROM_API =
  'Gaston was not only a fierce lover, with endless wisdom and imagination, but he was also, perhaps, the first man in the history of the species who had made an emergency landing and had come close to killing himself and his sweetheart simply to make love in a field of violets.'

const App: React.FC = () => (
  <div className='app'>
    <Trainer text={TEXT_FROM_API} />
  </div>
)

export default App
