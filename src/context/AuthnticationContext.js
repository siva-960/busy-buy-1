import { collection, getDocs,query, where ,addDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase.configuration";



const authContext = createContext();
const pageLoadContext = createContext();

export const PageLoadContextProvider = ({children}) =>{
    const [pageLoad,setPageLoad] = useState(false);
    return (
        <pageLoadContext.Provider value={{pageLoad,setPageLoad}}>
            {children}
        </pageLoadContext.Provider>
    )
}

export const usePageLoadContext = () =>{
    return useContext(pageLoadContext);
}

export const  AuthContextProvider = ({children })=>{
    const [userDetails,setUserDetails] = useState(null);
    //signup method 

    const signUp = async (userName,email,password) =>{

        
        const docRef = await addDoc(collection(db, "userAuthentication"), {
            userName,
            email,
            password
          });
          console.log("Document written with ID: ", docRef.id);
          console.log("you have registered success fully");
          return "success";
    }

    // on load fetching user 
    useEffect(()=>{
        const user = localStorage.getItem("user");
        if(user){
            setUserDetails(JSON.parse(user));
        }
    },[])

    useEffect(() => {
        if (userDetails) {
          console.log("user found in local storage: ", userDetails);
        }
      }, [userDetails]); 

    //sign in method 
    const signIn = async (email,password)=>{
        const q = query(collection(db,"userAuthentication"),
                    where("email","==",email),
                    where("password","==",password)
            );
        const querySnapshot = await getDocs(q);
        if(!querySnapshot.empty>0){
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                const user = {
                    email:doc.data().email,
                    userName:doc.data().userName,
                    password:doc.data().password
                }
                localStorage.setItem("user",JSON.stringify(user));
                setUserDetails(user);
             });
             console.log("User exists");
             return true;
        }else{
            console.log("User Not Found please register");
            return false;
        }
            
    }

    //logout method 
    const logout = () =>{
        setUserDetails(null);
        localStorage.removeItem("user");
        console.log("u have logged out success fully ");
    }


    return (
        <authContext.Provider value={{signIn,userDetails,logout,signUp}}>
            {children}
        </authContext.Provider>
    )
}

export const  useAuthContext = ()=>{
    return useContext(authContext);
}