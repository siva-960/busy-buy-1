import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { NavBar } from "./NavBar";
import { HomePage } from "./pages/HomePage";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/signUp";
import { AuthContextProvider, PageLoadContextProvider, } from "./context/AuthnticationContext";
import { Cart } from "./pages/Cart";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { ProductContextProvider } from "./context/ProductsContext";
import { OrdersBill } from "./pages/OrdersBill";
import { BillContext } from "./context/BillContext";




export const App = ()=>{
  const router = createBrowserRouter([
    {
    path:"/" , 
    element:<NavBar /> ,
     children:[
      {
        path:"/home",
        element: <HomePage />
      },{
        path:"/signIn",
        element: <SignIn />
      },{
        path:"/signUp",
        element: <SignUp />
      },{
        path:"/cart",
        element: <ProtectedRoutes>
          <Cart />
        </ProtectedRoutes>
      },
      {
        path:"/bill",
        element: <ProtectedRoutes>
          <OrdersBill />
        </ProtectedRoutes>
      }
    ]
  }
]);
 
  return(
      <AuthContextProvider>
        <PageLoadContextProvider>
          <ProductContextProvider>
            <BillContext>
              <RouterProvider router={router} />
            </BillContext>
          </ProductContextProvider>
        </PageLoadContextProvider>
      </AuthContextProvider>
  )
}