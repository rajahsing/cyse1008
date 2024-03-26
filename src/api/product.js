import useSWR from 'swr';
import { useMemo, useState, useEffect, useCallback, } from 'react';
import { doc, query, getDoc, getDocs, deleteDoc, collection } from "firebase/firestore";
import { fetcher, endpoints } from 'src/utils/axios';
import { DB } from 'src/auth/context/firebase/lib';
import { useSnackbar } from 'src/components/snackbar';
// ----------------------------------------------------------------------

// export function useGetProducts() {
//   const URL = endpoints.product.list;

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

//   const memoizedValue = useMemo(
//     () => ({
//       products: data?.products || [],
//       productsLoading: isLoading,
//       productsError: error,
//       productsValidating: isValidating,
//       productsEmpty: !isLoading && !data?.products.length,
//     }),
//     [data?.products, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }

export function useGetProducts() {
  const [data, setData] = useState({ products: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const q = query(collection(DB, "products")); // Assuming you have a collection named 'products'
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map(docSnapshot => ({ id: docSnapshot.id, ...docSnapshot.data() }));
        setData({ products });
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching products from Firestore:", err);
        setError(err);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []); // This effect runs once on component mount

  // Memoize value to avoid unnecessary re-renders
  const memoizedValue = useMemo(() => ({
    products: data.products,
    productsLoading: isLoading,
    productsError: error,
    productsValidating: isLoading, // For consistency with the original function's return value
    productsEmpty: !isLoading && !data.products.length,
  }), [data.products, error, isLoading]);

  return memoizedValue;
}

export const useDeleteProduct = () => {
  const { enqueueSnackbar } = useSnackbar();

  const deleteProduct = useCallback(async (productId) => {
    try {
      await deleteDoc(doc(DB, 'products', productId));
      enqueueSnackbar('Product successfully deleted', { variant: 'success' });
    } catch (error) {
      console.error('Error deleting product: ', error);
      enqueueSnackbar('Failed to delete product', { variant: 'error' });
    }
  }, [enqueueSnackbar]);

  return deleteProduct;
};


// ----------------------------------------------------------------------

// export function useGetProduct(productId) {
//   const URL = productId ? [endpoints.product.details, { params: { productId } }] : '';

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

//   const memoizedValue = useMemo(
//     () => ({
//       product: data?.product,
//       productLoading: isLoading,
//       productError: error,
//       productValidating: isValidating,
//     }),
//     [data?.product, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }
export function useGetProduct(productId) {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) {
      // If no productId is provided, immediately return without fetching
      setProduct(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const productRef = doc(DB, "products", productId); // Assuming 'products' is your collection
        const docSnap = await getDoc(productRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          // Handle the case where the document does not exist
          console.log("No such document!");
          setError("No such document!");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]); // Depend on productId to re-fetch when it changes

  // Memoize the returned object to avoid unnecessary re-renders
  const memoizedValue = useMemo(() => ({
    product,
    productLoading: isLoading,
    productError: error,
    productValidating: isLoading, // Using isLoading for consistency with the original function's interface
  }), [product, error, isLoading]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchProducts(_query) {
  const URL = _query ? [endpoints.product.search, { params: { _query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}
