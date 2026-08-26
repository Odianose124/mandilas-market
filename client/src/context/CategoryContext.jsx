import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    getCategories,
    getSubcategories,
    getDepartments,
    getCategoriesByDepartment
} from "../services/categoryService";

const CategoryContext = createContext();

export function CategoryProvider({ children }) {

    const [departments, setDepartments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);

    const [loadingDepartments, setLoadingDepartments] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingSubcategories, setLoadingSubcategories] = useState(false);

    useEffect(() => {
        loadDepartments();
    }, []);

    async function loadDepartments() {

        try {

            setLoadingDepartments(true);

            const data = await getDepartments();

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

            setCategories([]);
            setSubcategories([]);

            const data =
                await getCategoriesByDepartment(
                    department
                );

            setCategories(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load categories by department:",
                error
            );

            setCategories([]);

        } finally {

            setLoadingCategories(false);

        }
    }

    async function loadSubcategories(
        category
    ) {

        if (!category) {

            setSubcategories([]);

            return;
        }

        try {

            setLoadingSubcategories(true);

            setSubcategories([]);

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

                loadCategoriesByDepartment,
                loadSubcategories,

                loadingDepartments,
                loadingCategories,
                loadingSubcategories
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
