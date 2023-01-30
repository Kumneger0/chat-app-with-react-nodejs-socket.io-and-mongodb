import React,{useContext} from "react";
import { userContext } from "../App.jsx";
import "./Footer.css";

export default function Footer() {
 
const myContext = useContext(userContext)

// console.log(myContext)

  return (
    <div className="footer">
      <div>Kune Chat</div>
      <div>All Right Reserved 2022 </div>
    </div>
  );
}
