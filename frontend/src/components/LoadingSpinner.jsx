export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-700" aria-label="Loading" />
    </div>
  );
}
