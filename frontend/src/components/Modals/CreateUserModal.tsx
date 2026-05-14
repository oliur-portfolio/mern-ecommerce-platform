// import { z } from "zod";
// import { BsEye } from "react-icons/bs";
// import { IoMdClose } from "react-icons/io";
// import { Controller } from "react-hook-form";

// interface CreateUserModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const registerSchema = z.object({
//   name: z.string().min(3, "Name must be at least 3 characters"),
//   email: z.email(),
//   password: z.string().min(6, "Password must be at least 6 characters"),
//   role: z.enum(["admin", "manager", "employee", "intern"]),
// });

// export type TRegisterSchema = z.infer<typeof registerSchema>;

// const CreateUserModal = ({ isOpen, onClose }: CreateUserModalProps) => {
//   return (
//     <div
//       onClick={onClose}
//       className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-all duration-300 ease-in-out ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
//     >
//       <div
//         onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
//         className="bg-white border border-gray-200 rounded-xl p-8 w-full max-w-105 shadow-sm relative"
//       >
//         <button
//           type="button"
//           onClick={onClose}
//           className="text-black cursor-pointer absolute top-5 right-5"
//         >
//           <IoMdClose className="w-6 h-6" />
//         </button>

//         <h1 className="font-semibold text-gray-900 mb-5">Create User</h1>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div>
//             <label className="block text-base font-medium text-gray-700 mb-1.5">
//               Full name
//             </label>

//             <Controller
//               name="name"
//               control={control}
//               render={({ field }) => (
//                 <input
//                   {...field}
//                   type="text"
//                   placeholder="Your name"
//                   className="w-full h-11 px-3 border border-gray-300 rounded-md text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
//                 />
//               )}
//             />

//             {errors.name && (
//               <p className="text-red-500">{errors.name.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-base font-medium text-gray-700 mb-1.5">
//               Email address
//             </label>
//             <Controller
//               name="email"
//               control={control}
//               render={({ field }) => (
//                 <input
//                   {...field}
//                   type="email"
//                   placeholder="you@company.com"
//                   className="w-full h-11 px-3 border border-gray-300 rounded-md text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
//                 />
//               )}
//             />

//             {errors.email && (
//               <p className="text-red-500">{errors.email.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-base font-medium text-gray-700 mb-1.5">
//               Password
//             </label>

//             <Controller
//               name="password"
//               control={control}
//               render={({ field }) => (
//                 <div className="relative">
//                   <input
//                     {...field}
//                     type="password"
//                     placeholder="Enter your password"
//                     className="w-full h-11 px-3 pr-9 border border-gray-300 rounded-md text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
//                   />
//                   <button
//                     type="button"
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
//                   >
//                     <BsEye className="w-4 h-4" />
//                   </button>
//                 </div>
//               )}
//             />

//             {errors.password && (
//               <p className="text-red-500">{errors.password.message}</p>
//             )}
//           </div>

//           <div>
//             <label className="block text-base font-medium text-gray-700 mb-1.5">
//               Role
//             </label>

//             <Controller
//               name="role"
//               control={control}
//               render={({ field }) => (
//                 <select
//                   {...field}
//                   className="w-full h-11 px-3 border border-gray-300 rounded-md text-base text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition bg-white"
//                 >
//                   <option value="admin">Admin</option>
//                   <option value="manager">Manager</option>
//                   <option value="employee">Employee</option>
//                   <option value="intern">Intern</option>
//                 </select>
//               )}
//             />

//             {errors.role && (
//               <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
//             )}
//           </div>

//           <button
//             disabled={isPending}
//             type="submit"
//             className="custom-btn w-full"
//           >
//             {isPending ? "Loading..." : "Create User"}
//           </button>
//         </form>

//         {isError && (
//           <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-base text-red-600 mt-4">
//             {error.message}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CreateUserModal;
