import './Header.css'
import { ExitToApp } from '@mui/icons-material';
import React, {useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserService from '../../Services/UserService';


function Header() {
    const navigate = useNavigate();
        const [isOpen, setIsOpen] = useState(false);
        const location = useLocation();
        const [show, setShow] = useState(true);
        const toggleDropdown = () => {
          setIsOpen(!isOpen);
        };
        useEffect(() => {
          console.log('Current route:', location.pathname);
          if(location.pathname.includes('/login')){
            setShow(false)
          }else{
            setShow(true)
          }
      
        }, [location]);
        
      
        const handleSelect = (option) => {
          setIsOpen(false); 
          if(option=="profile"){
            navigate("/profile")
          }else{
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('userData');
            navigate("/login")
          }
        };

    return (<>
        {show ==true && <header className="fixed-header">
            <div class="bar">
                <div class="icon" onClick={() => handleSelect("logout")}>
                    <ExitToApp/>
                </div>

    </div>

        </header>}
        </>
    )
}
export default Header

