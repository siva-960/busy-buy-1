import { useState } from "react"
import { useAuthContext, usePageLoadContext } from "../context/AuthnticationContext";
import { useNavigate } from "react-router-dom";


export const SignUp = () =>{
    const [userName,setUserName] = useState();
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const authendication = useAuthContext();
    const navigate = useNavigate();
    const pageLoad = usePageLoadContext();
    return (
        <div className="signin-container">
             <div className="signin-body">
             <h1 style={{color:"purple",}}>Sign Up</h1>
                 <form onSubmit={async (e)=>{
                    pageLoad.setPageLoad(true);
                    e.preventDefault();
                    const response = await authendication.signUp(userName,email,password);
                    if(response){
                        pageLoad.setPageLoad(false);  
                        navigate("/signIn");
                    }else{
                        pageLoad.setPageLoad(false);  
                    }
                     pageLoad.setPageLoad(false);  
                 }}>
                     <input type="text" name="userName" placeholder="Enter UserName" onChange={(e)=>setUserName(e.target.value)} required/>
                     <input type="email" name="email" placeholder="Enter Email" onChange={(e)=>setEmail(e.target.value)} required/>
                     <input type="password" name="password" placeholder="Enter Password" onChange={(e)=>setPassword(e.target.value)} required />
                     <input type="submit" name="submit" placeholder="Sign In" />
                 </form>
             </div>
        </div>
     )
}