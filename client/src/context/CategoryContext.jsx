import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";


import {
    getCategories,
    getSubcategories
} from "../services/categoryService";


const CategoryContext =
    createContext();



export function CategoryProvider({
    children
}){


    const [
        categories,
        setCategories
    ] = useState([]);


    const [
        subcategories,
        setSubcategories
    ] = useState([]);



    useEffect(()=>{

        loadCategories();

    },[]);



    async function loadCategories(){

        try{

            const data =
                await getCategories();


            setCategories(data);

        }
        catch(error){

            console.error(error);

        }

    }




    async function loadSubcategories(category){

        try{

            const data =
                await getSubcategories(
                    category
                );


            setSubcategories(data);

        }
        catch(error){

            console.error(error);

        }

    }



    return (

        <CategoryContext.Provider
            value={{
                categories,
                subcategories,
                loadSubcategories
            }}
        >

            {children}

        </CategoryContext.Provider>

    );

}



export function useCategories(){

    return useContext(CategoryContext);

}