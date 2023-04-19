import './App.css';
import Atmosphere from "./Atmosphere.js"
import { /*useEffect*/useState  } from "react"
import AtmosphereMetaData from "./Atmosphere.json"

function initImageData(){
  
  for(let x in AtmosphereMetaData){
    AtmosphereMetaData[x].data = "";
    AtmosphereMetaData[x].isLoaded = false;
  }
  return AtmosphereMetaData;
}

function App() {
  const [imageData, setImageData] = useState(initImageData());
  const [paymentData, setPaymentData] = useState();
  
  return (
    <div className="App">
      <header className="App-header">
        <Atmosphere metaData={AtmosphereMetaData[0]}/>
        <Atmosphere metaData={AtmosphereMetaData[1]}/>
      </header>
    </div>
  );
}

export default App;
