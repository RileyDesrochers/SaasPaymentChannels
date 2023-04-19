import axios from 'axios';
import logo from './logo.svg';
import { /*useEffect*/useState  } from "react"
import Loaded from "./loaded.js";

export default function Header() {
    const [data, setData] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);

    async function load(){

    }

    return (
        <div>
            {isLoaded ? (
                <Loaded/>
            ) : (
                <img src={logo} width="500" height="600"/>
            )}
        </div>
    )
}
