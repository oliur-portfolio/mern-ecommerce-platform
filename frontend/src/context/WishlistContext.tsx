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
import { useAuth } from "./AuthContext";
import {
  clearWishlistApi,
  getWishlist,
  mergeWishlistApi,
  removeWishlistItemApi,
  toggleWishlistApi,
} from "../api/wishlist.api";

interface IWishlistContext {
  wishlistItems: IProduct[];
  wishlistCount: number;
  isWishlistLoading: boolean;
  isWishlistError: boolean;
  wishlistError: Error | null;

  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: IProduct) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  clearWishlistStateOnly: () => void;

  togglingWishlistProductId: string | null;
  removingWishlistProductId: string | null;
  isClearingWishlist: boolean;
}

const WishlistContext = createContext<IWishlistContext | null>(null);

const WISHLIST_KEY = "oliurshop_wishlist";

const getLocalWishlist = (): IProduct[] => {
  const savedWishlist = localStorage.getItem(WISHLIST_KEY);
  return savedWishlist ? JSON.parse(savedWishlist) : [];
};

const saveLocalWishlist = (items: IProduct[]) => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
};

const formatBackendWishlist = (wishlist: any): IProduct[] => {
  return wishlist?.products || [];
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useAuth();

  const [wishlistItems, setWishlistItems] =
    useState<IProduct[]>(getLocalWishlist);

  const [isGuestWishlistReady, setIsGuestWishlistReady] = useState(false);

  const [togglingWishlistProductId, setTogglingWishlistProductId] = useState<
    string | null
  >(null);

  const [removingWishlistProductId, setRemovingWishlistProductId] = useState<
    string | null
  >(null);

  const isAdmin = user?.role === "admin";

  const {
    data,
    isLoading: isWishlistLoading,
    isError: isWishlistError,
    error: wishlistError,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    enabled: isAuthenticated && !isAdmin,
  });

  const mergeWishlistMutation = useMutation({
    mutationFn: mergeWishlistApi,
    onSuccess: (data) => {
      setWishlistItems(formatBackendWishlist(data.wishlist));
      localStorage.removeItem(WISHLIST_KEY);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to merge wishlist");
    },
  });

  const toggleWishlistMutation = useMutation({
    mutationFn: toggleWishlistApi,
    onSuccess: (data) => {
      setWishlistItems(formatBackendWishlist(data.wishlist));
      toast.success(data.message);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update wishlist");
    },
  });

  const removeWishlistMutation = useMutation({
    mutationFn: removeWishlistItemApi,
    onSuccess: (data) => {
      setWishlistItems(formatBackendWishlist(data.wishlist));
      toast.success(data.message || "Product removed from wishlist");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to remove product");
    },
  });

  const clearWishlistMutation = useMutation({
    mutationFn: clearWishlistApi,
    onSuccess: () => {
      setWishlistItems([]);
      localStorage.removeItem(WISHLIST_KEY);
      toast.success("Wishlist cleared");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to clear wishlist");
    },
  });

  useEffect(() => {
    if (!data?.wishlist) return;

    setWishlistItems(formatBackendWishlist(data.wishlist));
  }, [data?.wishlist]);

  useEffect(() => {
    if (!isAuthenticated && isGuestWishlistReady) {
      saveLocalWishlist(wishlistItems);
    }
  }, [wishlistItems, isAuthenticated, isGuestWishlistReady]);

  useEffect(() => {
    if (!isAuthenticated) return;

    if (isAdmin) {
      localStorage.removeItem(WISHLIST_KEY);
      setWishlistItems([]);
      return;
    }

    const localWishlist = getLocalWishlist();

    if (localWishlist.length === 0) return;

    const productIds = localWishlist.map((product) => product._id);

    mergeWishlistMutation.mutate(productIds);
  }, [isAuthenticated, isAdmin]);

  useEffect(() => {
    if (!isAuthenticated) {
      setWishlistItems(getLocalWishlist());
      setIsGuestWishlistReady(true);
    } else {
      setIsGuestWishlistReady(false);
    }
  }, [isAuthenticated]);

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((product) => product._id === productId);
  };

  const toggleWishlist = async (product: IProduct) => {
    if (isAdmin) {
      toast.error("Admin cannot add products to wishlist");
      return;
    }

    if (togglingWishlistProductId === product._id) return;
    if (removingWishlistProductId === product._id) return;

    if (isAuthenticated) {
      setTogglingWishlistProductId(product._id);

      try {
        await toggleWishlistMutation.mutateAsync(product._id);
      } finally {
        setTogglingWishlistProductId(null);
      }

      return;
    }

    setWishlistItems((prev) => {
      const alreadyExists = prev.some((item) => item._id === product._id);

      if (alreadyExists) {
        toast.success("Product removed from wishlist");
        return prev.filter((item) => item._id !== product._id);
      }

      toast.success("Product added to wishlist");
      return [...prev, product];
    });
  };

  const removeFromWishlist = async (productId: string) => {
    if (removingWishlistProductId === productId) return;
    if (togglingWishlistProductId === productId) return;

    if (isAuthenticated) {
      setRemovingWishlistProductId(productId);

      try {
        await removeWishlistMutation.mutateAsync(productId);
      } finally {
        setRemovingWishlistProductId(null);
      }

      return;
    }

    setWishlistItems((prev) => prev.filter((item) => item._id !== productId));

    toast.success("Product removed from wishlist");
  };

  const clearWishlist = () => {
    if (clearWishlistMutation.isPending) return;

    if (isAuthenticated) {
      clearWishlistMutation.mutate();
      return;
    }

    setWishlistItems([]);
    localStorage.removeItem(WISHLIST_KEY);
    toast.success("Wishlist cleared");
  };

  const clearWishlistStateOnly = () => {
    setWishlistItems([]);
    localStorage.removeItem(WISHLIST_KEY);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        isWishlistLoading,
        isWishlistError,
        wishlistError,

        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        clearWishlistStateOnly,

        togglingWishlistProductId,
        removingWishlistProductId,
        isClearingWishlist: clearWishlistMutation.isPending,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);

  if (!ctx) {
    throw new Error("useWishlist must be used inside WishlistProvider");
  }

  return ctx;
};
