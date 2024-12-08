import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthContext, usePageLoadContext } from "./context/AuthnticationContext";
import Spinner from "react-spinner-material";
export const NavBar = () =>{
    const navigate = useNavigate();
    const authendication = useAuthContext();
    const pageLoad = usePageLoadContext();
    useEffect(()=>{
        navigate("/home");
    },[navigate]);
    return (
        <>
            <div className="spinner">
                <Spinner radius={120} color={"purple"} stroke={10} visible={pageLoad.pageLoad} />
            </div>
            <div className="main-container">
                <div className="nav-container">
                    <div className={"leftMenu"}>
                        {authendication.userDetails ? <h1 className="links">User:{authendication.userDetails.userName}</h1> : null }
                        <NavLink className="links" to={"/home"}>BusyBuy</NavLink>
                    </div>
                    <div className="rightMenu">
                        <NavLink className="links"  to={"/home"}>Home</NavLink>
                        {authendication.userDetails ? <NavLink className="links" to={"/cart"}>MyCart</NavLink> : null}
                        {authendication.userDetails ? <NavLink className="links" to={"/bill"}>Orders</NavLink> : null}
                        {authendication.userDetails ? <NavLink className="links"  to={"/signIn"} onClick={authendication.logout}>LogOut</NavLink> :<NavLink className="links"  to={"/signIn"}>SignIn</NavLink>}
                    </div>
                </div>
                <div className={`body-container ${pageLoad.pageLoad ? "blur" : ""}`}>
                    <Outlet />
                </div>
            </div>
        </>


       
        
        
    );
}