import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { changePassword, getProfile, updateProfile } from "../../apis/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangePassword, UpdateProfile } from "../../types/user";
import { toast } from "react-toastify";

type Props = {
  isOpen: boolean;
  toggleProfileModal: () => void;
};

type FormValues = {
  email: string;
  username: string;
  phone: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ProfileModal(props: Props) {
  const { isOpen, toggleProfileModal } = props;
  const [tab, setTab] = React.useState("profile");
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateProfile) => updateProfile(data),
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
      toast.success("Profile updated successfully");
      onClose();
    },
    onError(error: Error) {
      toast.error(error.message);
    },
  });

  const { mutate: changePwd, isPending: isPendingChangePwd } = useMutation({
    mutationFn: (data: ChangePassword) => changePassword(data),
    onSuccess() {
      toast.success("Password changed successfully");
      onClose();
    },
    onError(error: Error) {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    reset({
      email: profile?.data.email,
      username: profile?.data.username,
      phone: profile?.data.phone,
    });
  }, [profile, reset]);

  const onSubmit = (data: FormValues) => {
    if (tab === "profile") {
      mutate({
        username: data.username,
        phone: data.phone,
      });
    } else {
      changePwd({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
    }
  };

  const onClose = () => {
    reset();
    toggleProfileModal();
  };

  return (
    <div
      className={`fixed z-[61] inset-0 flex items-center justify-center ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white w-96 px-4 pb-4 rounded-lg shadow-lg overflow-hidden">
        <ul className="flex flex-wrap font-medium text-center">
          {["profile", "password"].map((item) => (
            <li className="w-1/2" key={item}>
              <button
                className={`w-full p-4 border-b-2 ${
                  tab === item
                    ? "text-primary border-primary hover:text-primary"
                    : "text-gray-500 border-b-gray-200 hover:text-gray-700"
                }`}
                type="button"
                role="tab"
                onClick={() => setTab(item)}
              >
                {item === "profile" ? "Profile" : "Change password"}
              </button>
            </li>
          ))}
        </ul>
        <form className=" pt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {tab === "profile" && (
            <>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  disabled
                  className={`bg-gray-200 border text-gray-900 h-[42px] rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  {...register("username", {
                    required: "username is required",
                  })}
                  placeholder="Your username"
                  className={`bg-gray-50 border ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  } text-gray-900 h-[42px] rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  {...register("phone")}
                  placeholder="Your phone number"
                  className={`bg-gray-50 border ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } text-gray-900 h-[42px] rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                />
              </div>
            </>
          )}
          {tab === "password" && (
            <>
              <div>
                <label
                  htmlFor="oldPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Old Password
                </label>
                <input
                  type="password"
                  id="oldPassword"
                  {...register("oldPassword", {
                    required: "Old password is required",
                    minLength: {
                      value: 6,
                      message: "Old password must be at least 6 characters",
                    },
                  })}
                  placeholder="••••••••"
                  className={`bg-gray-50 border ${
                    errors.oldPassword ? "border-red-500" : "border-gray-300"
                  } text-gray-900 h-[42px] text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                />
                {errors.oldPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.oldPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="newPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 6,
                      message: "New password must be at least 6 characters",
                    },
                  })}
                  placeholder="••••••••"
                  className={`bg-gray-50 border ${
                    errors.newPassword ? "border-red-500" : "border-gray-300"
                  } text-gray-900 h-[42px] text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (value) =>
                      value === watch("newPassword") ||
                      "Passwords do not match",
                  })}
                  placeholder="••••••••"
                  className={`bg-gray-50 border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } text-gray-900 h-[42px] text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </>
          )}
          <div className="flex justify-end">
            <button
              // onClick={}
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md"
            >
              {isPending || isPendingChangePwd ? "Submitting" : "Submit"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
