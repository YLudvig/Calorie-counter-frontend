//Behöver enbart importera App.css i denna, komponenter som nyttjas i denna får automatisk styling
import './App.css'
import Calcounter from './Components/calcounter/Calcounter'
import { sampleMealItems } from './types/mealtypes'

function App() {

  return (
    <div>
      <Calcounter items={sampleMealItems}></Calcounter>

    </div>
  )
}

export default App
