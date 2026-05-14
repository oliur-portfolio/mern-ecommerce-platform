import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useModal } from "../context/ModalContext";
import { deleteProduct, getProducts } from "../api/product.api";
import type { IProduct } from "../types/product.types";
import DropdownTableAction from "../components/Common/DropdownTableAction";
import { Link, useNavigate, useSearchParams } from "react-router";
import ConfirmModal from "../components/Modals/ConfirmModal";
import toast from "react-hot-toast";
import EmptyState from "../components/Common/EmptyState";
import ErrorUI from "../components/Common/ErrorUI";
import Pagination from "../components/Common/Pagination";

const PRODUCTS_PER_PAGE = 10;

const AdminProductsPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { activeModal, closeModal, openModal, selectedId } = useModal();

  const page = Number(searchParams.get("page") || 1);

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    setSearchParams(params);
  };

  const queryParams = {
    page,
    limit: PRODUCTS_PER_PAGE,
    sort: "latest" as const,
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: () => getProducts(queryParams),
  });

  // Product Delete Mutation
  const productDeleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });

      closeModal();

      toast.success(data.message);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const products = data?.products || [];
  const totalProducts = data?.totalProducts || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <>
      <ConfirmModal
        isOpen={activeModal === "productDelete"}
        onClose={() => closeModal()}
        onConfirm={() => productDeleteMutation.mutate(selectedId!)}
        isLoading={productDeleteMutation.isPending}
        title="Delete Product"
        description="Are you sure you want to delete this product?"
        confirmText="Delete"
        type="danger"
      />

      <section>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="">
            <h1 className="">Product Lists</h1>

            {!isLoading && !isError && (
              <p className="text-gray-500 mt-1">
                Showing {products.length} of {totalProducts} products
              </p>
            )}
          </div>

          <Link to="create" className="custom-btn ">
            Create Product
          </Link>
        </div>

        {/* Table */}
        {isLoading ? (
          <p className="font-semibold">Loading products...</p>
        ) : isError ? (
          <ErrorUI message={error?.message} />
        ) : products.length === 0 ? (
          <EmptyState
            title="No products found"
            message="Create your first product to start selling."
          />
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 relative w-full overflow-x-auto">
              <table className="w-full min-w-7xl text-base">
                <thead className="bg-blue-50 border-b border-gray-200 rounded-tl-xl">
                  <tr>
                    <th className="text-left font-medium text-black px-5 py-3 rounded-tl-xl">
                      Title
                    </th>
                    <th className="text-left font-medium text-black px-5 py-3">
                      Description
                    </th>
                    <th className="text-left font-medium text-black px-5 py-3">
                      Price
                    </th>
                    <th className="text-left font-medium text-black px-5 py-3">
                      Category
                    </th>
                    <th className="text-left font-medium text-black px-5 py-3 rounded-tr-xl">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product: IProduct, index: number) => {
                    const isLastRow = index === products.length - 1;

                    return (
                      <tr
                        key={product._id}
                        className="border-b last:border-b-0 border-gray-100 hover:bg-gray-50 last:hover:rounded-bl-xl last:hover:rounded-br-xl"
                      >
                        <td
                          className={`px-5 py-3 text-gray-900 w-120 ${isLastRow ? "rounded-bl-xl" : ""}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="">{product.title}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 w-150 text-gray-500">
                          {product.description
                            ? `${product.description.slice(0, 50)}...`
                            : "No description"}
                        </td>
                        <td className="px-5 py-3 w-40 text-gray-500">
                          {product.price}
                        </td>
                        <td className="px-5 py-3 w-44 text-gray-500">
                          {product.category}
                        </td>
                        <td
                          className={`px-5 py-3 ${isLastRow ? "rounded-br-xl" : ""}`}
                        >
                          <DropdownTableAction
                            items={[
                              {
                                label: "Edit",
                                onClick: () => {
                                  navigate(
                                    `/admin-products/edit/${product._id}`,
                                  );
                                },
                              },
                              {
                                label: "Delete",
                                onClick: () =>
                                  openModal("productDelete", product._id),
                              },
                            ]}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={changePage}
            />
          </>
        )}
      </section>
    </>
  );
};

export default AdminProductsPage;
