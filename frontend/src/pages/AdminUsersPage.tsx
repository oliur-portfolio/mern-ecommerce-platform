import { useModal } from "../context/ModalContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUser, getUsers } from "../api/user.api";
import type { IUser } from "../types/user.types";
import ConfirmModal from "../components/Modals/ConfirmModal";
import toast from "react-hot-toast";
import DropdownTableAction from "../components/Common/DropdownTableAction";
import EmptyState from "../components/Common/EmptyState";
import ErrorUI from "../components/Common/ErrorUI";

const AdminUsersPage = () => {
  const queryClient = useQueryClient();

  const { activeModal, closeModal, openModal, selectedId } = useModal();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  // User Delete Mutation
  const userDeleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });

      closeModal();

      toast.success(data.message);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <>
      <ConfirmModal
        isOpen={activeModal === "userDelete"}
        onClose={() => closeModal()}
        onConfirm={() => userDeleteMutation.mutate(selectedId!)}
        isLoading={userDeleteMutation.isPending}
        title="Delete User"
        description="Are you sure you want to delete this user?"
        confirmText="Delete"
        type="danger"
      />

      <section>
        <div className="flex items-center justify-between mb-8">
          <h1>Users Lists</h1>
        </div>

        {/* Table */}
        {isLoading ? (
          <p className="font-semibold">Loading users...</p>
        ) : isError ? (
          <ErrorUI message={error?.message} />
        ) : data?.users.length === 0 ? (
          <EmptyState
            title="No users found"
            message="Registered users will appear here."
          />
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full min-w-200 text-base">
              <thead className="bg-blue-50 border-b border-gray-200">
                <tr>
                  <th className="text-left font-medium text-black px-5 py-3 rounded-tl-xl">
                    Name
                  </th>
                  <th className="text-left font-medium text-black px-5 py-3">
                    Email
                  </th>
                  <th className="text-left font-medium text-black px-5 py-3">
                    Role
                  </th>
                  <th className="text-left font-medium text-black px-5 py-3">
                    Status
                  </th>
                  <th className="text-left font-medium text-black px-5 py-3 rounded-tr-xl">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user: IUser, index: number) => {
                  const isLastRow = index === data.users.length - 1;

                  return (
                    <tr
                      key={user._id}
                      className="border-b last:border-b-0 border-gray-100 hover:bg-gray-50 last:hover:rounded-bl-xl last:hover:rounded-br-xl"
                    >
                      <td
                        className={`px-5 py-3 text-gray-900 ${isLastRow ? "rounded-bl-xl" : ""}`}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            className="w-9 h-auto object-contain rounded-full"
                            src={user.avatar.url || "/images/user.jpg"}
                            alt={user.name}
                            loading="lazy"
                          />
                          <span className="">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{user.email}</td>
                      <td className="px-5 py-3 text-gray-500 capitalize">
                        {user.role}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-md capitalize ${user.status === "blocked" ? "bg-red-50 text-red-600 border border-red-600" : "bg-green-50 text-green-600 border border-green-600"}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td
                        className={`px-5 py-3 ${isLastRow ? "rounded-br-xl" : ""}`}
                      >
                        <DropdownTableAction
                          items={[
                            { label: "Edit", onClick: () => {} },
                            {
                              label: "Delete",
                              onClick: () => openModal("userDelete", user._id),
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
        )}
      </section>
    </>
  );
};

export default AdminUsersPage;
