import "./Leftbar.css"
import {Feed,PersonAdd,Diversity3,Person,Search} from "@mui/icons-material"
import { useNavigate } from "react-router-dom";
import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';


function Leftbar() {
  const navigate = useNavigate();
  const [show,setShow] = useState(true)
  const goLoc = (loc) => {
    navigate("/"+loc)
  };
  const location = useLocation();
  useEffect(() => {
    console.log('Current route:', location.pathname);
    if(location.pathname.includes('/login')){
      setShow(false)
    }else{
      setShow(true)
    }

  }, [location]);
  

  return (<><div></div>
    {show ==true &&
    <div className="Leftbar">
      <div className="LeftbarScreen">
        <ul className="LeftbarList">
            <li className="LeftbarListItem">
                <Feed className="LeftbarIcon"/>
                <span className="LeftbarListItemText" onClick={()=>{goLoc("home")}}>News Feed</span>
            </li>
            <li className="LeftbarListItem">
            <PersonAdd className="LeftbarIcon"/>
                <span className="LeftbarListItemText" onClick={()=>{goLoc("users?req=requests")}}>Requests</span>
            </li>
            <li className="LeftbarListItem">
            <Search className="LeftbarIcon"/>
                <span className="LeftbarListItemText" onClick={()=>{goLoc("users?req=search")}}>Search People</span>
            </li>
            <li className="LeftbarListItem">
            <Person className="LeftbarIcon"/>
                <span className="LeftbarListItemText"onClick={()=>{goLoc("profile")}}>Profile</span>
            </li>
            <li className="LeftbarListItem">
            <Diversity3 className="LeftbarIcon"/>
                <span className="LeftbarListItemText" onClick={()=>{goLoc("post")}}>Post</span>
            </li>
        </ul>
      </div>
    </div>}
    </>

  )
}

export default Leftbar
