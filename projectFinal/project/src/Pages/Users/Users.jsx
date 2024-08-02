import { useEffect, useState } from "react";
import "./Users.css";
import { useParams } from 'react-router-dom';
import SocialService from "../../Services/SocialService";
import { useLocation, useNavigate } from 'react-router-dom';
import UserService from '../../Services/UserService';
import {Search} from "@mui/icons-material"

function Users() {
    const urlSearchString = window.location.search;
    const { userId } = useParams();
    const params = new URLSearchParams(urlSearchString);
    const req = params.get('req');
    const navigate = useNavigate();
    const [details, setDetails] = useState([]);
    const location = useLocation();
    const [userDetails, setUserDetails] =  useState([]);
    const [searchText, setSearch] = useState('');

    useEffect(() => {
        setDetails([]);
        if(req !="search"){
            fetchRequests();
            fetchData();
        }
    }, [location]);
    const fetchRequests = async () => {
        const response = await SocialService.fetchRequests(req.toLocaleLowerCase(),10, 0);
        console.log("details",response);
        setDetails(response.users);
    };
    const handleAction = async (detail, action)=>{
        console.log(detail)
        const response = await SocialService.action(action,detail["user_id"]);
        console.log("details",response);
        setDetails((prevDetails) =>
            prevDetails.filter((item) => item.user_id !== detail.user_id)
          );

    } 
    const goToProfile = async (detail)=>{
        console.log(detail)
        navigate("/profile/"+detail["user_id"])

    } 
    const fetchData = async () => {
        setUserDetails(await UserService.getUserProfile(userId));
    };

    const search = async (event)=>{
        const response = await SocialService.searchUsers(searchText,100, 0);
        console.log("details",response);
        setDetails(response.users);
    }
    const handleChange = (event) => {
        console.log(event,event.target.name,event.target.value);
        setSearch(event.target.value);
      };
    
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            search();
        }
    };

    return (
        <>
            <div className="hii">
                {req != "search" && <div className="name">{userDetails.user_name}'s &nbsp;{req}</div>}
                <br />{req == "search" &&
                    <div _ngcontent-mla-c116="" class="ca23_search_wrap" >
                        <div _ngcontent-mla-c116="" class="space_15"></div>
                        <div _ngcontent-mla-c116="" class="ca23_search_option">
                            <input _ngcontent-mla-c116="" type="text" placeholder="Search" title="Search" style={{color:"black"}} class="ca23_social_search_input active_state ng-untouched ng-pristine ng-valid" onChange={handleChange} onKeyPress={handleKeyPress} /></div>
                        <div _ngcontent-mla-c116="" class="ca23_search_close_new">
                            <a _ngcontent-mla-c116="">
                                <Search onClick={search} /></a>
                        </div>
                    </div>}


                {details && details.length > 0 && details.map((detail) => (<div _ngcontent-mla-c116="" class="ca23_social_follow_wrap">
                    <div _ngcontent-mla-c116="" class="profile_photo_wrap">
                        <div _ngcontent-mla-c116="" class="profile_photo offline_status">
                            <img _ngcontent-mla-c116="" width="250" height="250" alt="" style={{cursor:"pointer"}} src={"/assets/user_images/" + detail["image"]} onClick={() => goToProfile(detail)} />
                        </div>
                    </div>
                    <div _ngcontent-mla-c116="" class="detail_wrap"><div _ngcontent-mla-c116="" class="text1">{detail["user_name"]}</div>
                    </div>
                    <div _ngcontent-mla-c116="" class="btn_wrap" style={{cursor:"pointer"}}>
                        {req == 'requests' && <><div _ngcontent-mla-c116="" class="ca23_social_follow_btn_red green" onClick={() => handleAction(detail, 'accept')}> Accept </div>
                            <div _ngcontent-mla-c116="" class="ca23_social_follow_btn_red red" onClick={() => handleAction(detail, 'decline')}>  Decline </div></>}
                    </div>
                </div>))

                }

            </div>
        </>
    )
}
        
         
        


export default Users