import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { IProduct } from "../types/product.types";
import type { ICartItem } from "../types/cart.types";
import { useAuth } from "./AuthContext";
import {
  addCartItem,
  clearCartApi,
  getCart,
  mergeCart,
  removeCartItem,
  updateCartItemQuantity,
} from "../api/cart.api";

interface ICartContext {
  cartItems: ICartItem[];
  cartCount: number;
  subtotal: number;
  isCartLoading: boolean;
  isCartError: boolean;
  cartError: Error | null;
  addToCart: (product: IProduct) => void;
  addingCartProductId: string | null;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  clearCartOnLogout: () => void;
}

const CartContext = createContext<ICartContext | null>(null);

const CART_KEY = "oliurshop_cart";

const getLocalCart = (): ICartItem[] => {
  const savedCart = localStorage.getItem(CART_KEY);
  return savedCart ? JSON.parse(savedCart) : [];
};

const saveLocalCart = (items: ICartItem[]) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

const formatBackendCart = (cart: any): ICartItem[] => {
  return (
    cart?.items?.map((item: any) => ({
      product: item.product,
      quantity: item.quantity,
    })) || []
  );
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useAuth();

  const [isGuestCartReady, setIsGuestCartReady] = useState(false);
  const [cartItems, setCartItems] = useState<ICartItem[]>(getLocalCart);
  const [addingCartProductId, setAddingCartProductId] = useState<string | null>(
    null,
  );

  const isAdmin = user?.role === "admin";

  const {
    data,
    isLoading: isCartLoading,
    isError: isCartError,
    error: cartError,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: isAuthenticated && !isAdmin,
  });

  const mergeCartMutation = useMutation({
    mutationFn: mergeCart,
    onSuccess: (data) => {
      setCartItems(formatBackendCart(data.cart));
      localStorage.removeItem(CART_KEY);
    },
  });

  const addCartMutation = useMutation({
    mutationFn: addCartItem,
    onSuccess: (data) => {
      setCartItems(formatBackendCart(data.cart));
      toast.success(data.message || "Product added to cart");
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: updateCartItemQuantity,
    onSuccess: (data) => {
      setCartItems(formatBackendCart(data.cart));
    },
  });

  const removeCartMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: (data) => {
      setCartItems(formatBackendCart(data.cart));
      toast.success(data.message || "Product removed from cart");
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: clearCartApi,
    onSuccess: () => {
      setCartItems([]);
      localStorage.removeItem(CART_KEY);
      toast.success("Cart cleared");
    },
  });

  useEffect(() => {
    if (!data?.cart) return;

    setCartItems(formatBackendCart(data.cart));
  }, [data?.cart]);

  useEffect(() => {
    if (!isAuthenticated && isGuestCartReady) {
      saveLocalCart(cartItems);
    }
  }, [cartItems, isAuthenticated, isGuestCartReady]);

  useEffect(() => {
    if (!isAuthenticated) return;

    if (isAdmin) {
      localStorage.removeItem(CART_KEY);

      setCartItems([]);
      return;
    }

    const localCart = getLocalCart();

    if (localCart.length === 0) return;

    const items = localCart.map((item) => ({
      productId: item.product._id,
      quantity: item.quantity,
    }));

    mergeCartMutation.mutate(items);
  }, [isAuthenticated, isAdmin]);

  useEffect(() => {
    if (!isAuthenticated) {
      setCartItems(getLocalCart());
      setIsGuestCartReady(true);
    } else {
      setIsGuestCartReady(false);
    }
  }, [isAuthenticated]);

  const addToCart = async (product: IProduct) => {
    if (isAdmin) {
      toast.error("Admin cannot add products to cart");
      return;
    }

    setAddingCartProductId(product._id);

    try {
      if (isAuthenticated) {
        await addCartMutation.mutateAsync({
          productId: product._id,
          quantity: 1,
        });

        return;
      }

      setCartItems((prev) => {
        const existingItem = prev.find(
          (item) => item.product._id === product._id,
        );

        if (existingItem) {
          toast.success("Product quantity updated");

          return prev.map((item) =>
            item.product._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }

        toast.success("Product added to cart");

        return [...prev, { product, quantity: 1 }];
      });
    } finally {
      setAddingCartProductId(null);
    }
  };

  const removeFromCart = (productId: string) => {
    if (isAuthenticated) {
      removeCartMutation.mutate(productId);
      return;
    }

    setCartItems((prev) =>
      prev.filter((item) => item.product._id !== productId),
    );

    toast.success("Product removed from cart");
  };

  const increaseQuantity = (productId: string) => {
    const currentItem = cartItems.find(
      (item) => item.product._id === productId,
    );
    if (!currentItem) return;

    const newQuantity = currentItem.quantity + 1;

    if (isAuthenticated) {
      updateQuantityMutation.mutate({
        productId,
        quantity: newQuantity,
      });
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  };

  const decreaseQuantity = (productId: string) => {
    const currentItem = cartItems.find(
      (item) => item.product._id === productId,
    );
    if (!currentItem) return;

    const newQuantity = currentItem.quantity - 1;

    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    if (isAuthenticated) {
      updateQuantityMutation.mutate({
        productId,
        quantity: newQuantity,
      });
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item,
      ),
    );
  };

  const clearCart = () => {
    if (isAuthenticated) {
      clearCartMutation.mutate();
      return;
    }

    setCartItems([]);
    localStorage.removeItem(CART_KEY);
    toast.success("Cart cleared");
  };

  const clearCartOnLogout = () => {
    setCartItems([]);
    localStorage.removeItem(CART_KEY);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const subtotal = cartItems.reduce(
    (total, item) => total + item?.product?.price * item?.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        isCartLoading,
        isCartError,
        cartError,
        addToCart,
        addingCartProductId,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        clearCartOnLogout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return ctx;
};
