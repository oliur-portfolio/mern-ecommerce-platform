interface ErrorUIProps {
  message?: string;
  title?: string;
}

const ErrorUI = ({
  title = "Something went wrong",
  message = "Please try again later.",
}: ErrorUIProps) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl py-8 md:py-12 px-4 md:px-6 text-center w-full">
      <h5 className="text-xl md:text-2xl font-medium text-red-700 mb-2">
        {title}
      </h5>
      <p className="text-base text-red-500">{message}</p>
    </div>
  );
};

export default ErrorUI;
