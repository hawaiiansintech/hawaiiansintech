export default function LoadingSpinner() {
  return (
    <figure
      className={`
        inline-block
        h-6
        w-6
        animate-spin
        rounded-full
        border-4
        border-white/50
        border-t-white
      `}
    ></figure>
  );
}
