type EmptyStateProps = {
  message?: string;
  title?: string;
};

const EmptyState = ({ message = "Try changing your search or add a new record.", title = "No records found" }: EmptyStateProps) => (
  <div className="rounded-[24px] border border-dashed border-black/10 bg-[#f8f7f6] px-6 py-12 text-center">
    <h3 className="text-lg font-bold text-black">{title}</h3>
    <p className="mt-2 text-sm font-medium text-black/45">{message}</p>
  </div>
);

export default EmptyState;
