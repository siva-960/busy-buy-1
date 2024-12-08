import { Navigate } from "react-router-dom";
import { useAuthContext } from "./context/AuthnticationContext"

export const ProtectedRoutes = ({children}) =>{
    const user = useAuthContext();
    console.log("Protected route component",user);
    return user.userDetails ? children : <Navigate to={"/signIn"} />
}