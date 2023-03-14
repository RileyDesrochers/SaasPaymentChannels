//import axios from 'axios';
import placeholder from './bad_City.png';
import img from './City_night.png';
import { /*useEffect*/useState  } from "react"
//import Loaded from "./loaded.js";
//import PreLoaded from "./preLoaded.js";

/*
    data = {
        cid: {
            data,
            placeholder,
            isLoaded,
            price,
            hash
        },
        cid: {
            data,
            placeholder,
            isLoaded,
            price,
            hash
        },
    }

*/
export default function Atmosphere(props) {
    /*function load(){
        if(isLoaded){
            return;
        }
        setData(img);
        setIsLoaded(true);
    }*/
    if(props.isLoaded){

    }else{

    }


    return (
        <img src={props.data} alt="Atmosphere" /*onClick={load}*/ width="640" height="480"/>
    )
}
//<img src={placeholder} width="200" height="220" onClick={load}/>
//<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Speaker McCarthy has held the gavel for less than three months.<br><br>But by sharing the January 6th security footage with Fox News, he has already done more than any party leader in Congress to enable the spread of Donald Trump’s Big Lie.</p>&mdash; Chuck Schumer (@SenSchumer) <a href="https://twitter.com/SenSchumer/status/1633534991274475521?ref_src=twsrc%5Etfw">March 8, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
