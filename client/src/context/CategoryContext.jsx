import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    getDepartments,
    getCategories,
    getCategoriesByDepartment,
    getSubcategories
} from "../services/categoryService";


const CategoryContext = createContext();


export function CategoryProvider({
    children
}) {

    const [
        departments,
        setDepartments
    ] = useState([]);

    const [
        categories,
        setCategories
    ] = useState([]);

    const [
        subcategories,
        setSubcategories
    ] = useState([]);

    const [
        loadingDepartments,
        setLoadingDepartments
    ] = useState(false);

    const [
        loadingCategories,
        setLoadingCategories
    ] = useState(false);

    const [
        loadingSubcategories,
        setLoadingSubcategories
    ] = useState(false);


    // ======================================================
    // LOAD DEPARTMENTS
    // ======================================================

    useEffect(() => {

        loadDepartments();

    }, []);


    async function loadDepartments() {

        try {

            setLoadingDepartments(true);

            const data =
                await getDepartments();

            setDepartments(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load departments:",
                error
            );

            setDepartments([]);

        } finally {

            setLoadingDepartments(false);

        }
    }


    // ======================================================
    // LOAD ALL CATEGORIES
    // ======================================================

    async function loadCategories() {

        try {

            setLoadingCategories(true);

            const data =
                await getCategories();

            setCategories(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load categories:",
                error
            );

            setCategories([]);

        } finally {

            setLoadingCategories(false);

        }
    }


    // ======================================================
    // LOAD CATEGORIES BY DEPARTMENT
    // ======================================================

    async function loadCategoriesByDepartment(
        department
    ) {

        if (!department) {

            setCategories([]);
            setSubcategories([]);

            return;

        }

        try {

            setLoadingCategories(true);

            const data =
                await getCategoriesByDepartment(
                    department
                );

            setCategories(
                Array.isArray(data)
                    ? data
                    : []
            );

            setSubcategories([]);

        } catch (error) {

            console.error(
                "Failed to load categories by department:",
                error
            );

            setCategories([]);
            setSubcategories([]);

        } finally {

            setLoadingCategories(false);

        }
    }


    // ======================================================
    // LOAD SUBCATEGORIES
    // ======================================================

    async function loadSubcategories(
        category
    ) {

        if (!category) {

            setSubcategories([]);

            return;

        }

        try {

            setLoadingSubcategories(true);

            const data =
                await getSubcategories(
                    category
                );

            setSubcategories(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load subcategories:",
                error
            );

            setSubcategories([]);

        } finally {

            setLoadingSubcategories(false);

        }
    }


    return (

        <CategoryContext.Provider
            value={{
                departments,
                categories,
                subcategories,

                loadingDepartments,
                loadingCategories,
                loadingSubcategories,

                loadDepartments,
                loadCategories,
                loadCategoriesByDepartment,
                loadSubcategories
            }}
        >

            {children}

        </CategoryContext.Provider>

    );
}


export function useCategories() {

    return useContext(
        CategoryContext
    );

}
