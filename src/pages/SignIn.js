import { Link, useNavigate } from "react-router-dom"
import { useAuthContext, usePageLoadContext } from "../context/AuthnticationContext"
import { useState } from "react";

export const SignIn = () =>{
    const authendication = useAuthContext();
    // console.log(".............",authendication);
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();
    const pageLoad = usePageLoadContext();
    const onchangeEmail =(e)=>{
        setEmail(e.target.value);
    }

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = async (e)=>{
        pageLoad.setPageLoad(true);
        e.preventDefault();
        console.log("validating user email and password ");
        const reponse = await authendication.signIn(email,password);
        console.log("Response from authentication API",reponse)
        if(reponse){
            pageLoad.setPageLoad(false);
            navigate("/home");
        }else{
            pageLoad.setPageLoad(false);
            navigate("/signUp");
        }
        pageLoad.setPageLoad(false);
    }


    return (
       <div className="signin-container">
            <div className="signin-body">
                <h1 style={{color:"purple",}}>Sign In</h1>
                <form onSubmit={(e)=>handleSubmit(e)}>
                    <input type="text" name="email" placeholder="Enter Email" onChange={(e)=>onchangeEmail(e)}/>
                    <input type="password" name="password" placeholder="Enter Password" onChange={(e)=>onChangePassword(e)} />
                    <input type="submit" name="submit" placeholder="Sign In" />
                </form>
                <Link to="/signUp" ><h3>or click to signup</h3></Link>
            </div>
       </div>
    )
}