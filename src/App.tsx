//Behöver enbart importera App.css i denna, komponenter som nyttjas i denna får automatisk styling
import './App.css'
import Calcounter from './Components/calcounter/Calcounter'
import "react-datepicker/dist/react-datepicker.css";

function App() {

  return (
    <div>
      <Calcounter></Calcounter>
    </div>

  )
}

export default App
