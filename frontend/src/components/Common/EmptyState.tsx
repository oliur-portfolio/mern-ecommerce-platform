interface EmptyStateProps {
  title: string;
  message?: string;
}

const EmptyState = ({ title, message }: EmptyStateProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl py-8 md:py-12 px-4 md:px-6 text-center">
      <h5 className="text-xl md:text-2xl font-medium text-gray-900 mb-2">
        {title}
      </h5>

      {message && <p className="text-base text-gray-500">{message}</p>}
    </div>
  );
};

export default EmptyState;
