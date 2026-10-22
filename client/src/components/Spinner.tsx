export function Spinner({ className = 'size-6' }: { className?: string }) {
  return (
    <div
      className={`${className} animate-spin rounded-full border-2 border-line border-t-accent`}
    />
  );
}
