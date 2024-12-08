import { useEffect, useState } from "react";
import { usePageLoadContext } from "../context/AuthnticationContext";
import axios from "axios";
import { Card } from "./Card";
import { Bounce, toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const HomePage = () => {
  const pageLoad = usePageLoadContext();
  const [products, setProducts] = useState([]);
  const [price, setPrice] = useState(75000);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]); // Tracks selected categories
  const [searchByName, setSearchByName] = useState("");

  const items = [
    { id: 1, viewValue: "Men's Clothing", value: "men's clothing" },
    { id: 2, viewValue: "Women's Clothing", value: "women's clothing" },
    { id: 3, viewValue: "Jewelery", value: "jewelery" },
    { id: 4, viewValue: "Electronics", value: "electronics" },
  ];

  useEffect(() => {
    pageLoad.setPageLoad(true);
    async function fetchData() {
      try {
        let response = await axios.get("https://fakestoreapi.com/products");
        console.log("response from server is ", response.data);
        setProducts([...response.data]);
        setOriginalProducts([...response.data]);
        pageLoad.setPageLoad(false);
      } catch (e) {
        console.log("error occurred while getting data");
        pageLoad.setPageLoad(false);
      }
    }
    fetchData();
  }, []);

  const onPriceChange = (price) => {
    setPrice(price);
    filterProducts(price, selectedCategories,searchByName);
  };

  const handleCategoryChange = (category) => {
    console.log("selected catagory: ",selectedCategories)
    let updatedCategories = [...selectedCategories];
    if (updatedCategories.includes(category)) {
      updatedCategories = updatedCategories.filter((c) => c !== category); // Remove category
    } else {
      updatedCategories.push(category); // Add category
    }
    setSelectedCategories(updatedCategories);
    filterProducts(price, updatedCategories,searchByName);
  };

  const filterProducts = (price, categories, globalSearchValue) => {
    console.log("global Search Value",globalSearchValue)
    let tempProducts = originalProducts.filter((product) => product.price <= price);
    if (categories.length > 0) {
      tempProducts = tempProducts.filter((product) =>
        categories.includes(product.category.toLowerCase())
      );
    }
    if(globalSearchValue!==''){
        tempProducts = tempProducts.filter((product) => product.title.includes(globalSearchValue))
    }
    setProducts(tempProducts);
    return 
  };

  //search by name
  const searchByNamefun = (value) =>{
    setSearchByName(value);
    filterProducts(price, selectedCategories,searchByName);
  }

  //success toast 
  const successTrigger = ()=>{
    console.log("success function trigger");
    toast.success('Item added successfully', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        });
  }

  return (
    <div className="home-container">
      <div className="header-container">
        <div className="global-search">
          <input type="text" placeholder="Search By Name" name="globalSearch" onChange={(e)=>searchByNamefun(e.target.value)} />
        </div>
      </div>
      <div className="body-container">
        <div className="filter">
          <div className="select-filter">
            <h1>Filter</h1>
            <p>Price: {price}</p>
            <input
              type="range"
              id="price-range"
              min="0"
              max="100000"
              step="10"
              value={price}
              onChange={(e) => onPriceChange(e.target.value)}
            />
            <div style={{ textAlign: "left" }}>
              <h1 style={{ textAlign: "center" }}>Category</h1>
              {items.map((item) => {
                return (
                  <div className="filter-checkbox" key={item.id}>
                    <label>
                      <input
                        type="checkbox"
                        onChange={() => handleCategoryChange(item.value)}
                        checked={selectedCategories.includes(item.value)}
                      />
                      {item.viewValue}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="card-container">
          {products.map((product) => {
            return (
              <div key={product.id} className="card">
                <Card product={product} successTrigger={successTrigger}/>
              </div>
            );
          })}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
        />
{/* Same as */}
<ToastContainer />
    </div>
  );
};
