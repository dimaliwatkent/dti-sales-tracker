import { Spinner } from "@/components/ui/spinner";

interface SpinnerTextProps {
  spin: boolean;
}

const SpinnerText = ({ spin }: SpinnerTextProps) => {
  return (
    <div className="flex items-center justify-center gap-3">
      <Spinner show={spin}>Loading...</Spinner>
    </div>
  );
};

export default SpinnerText;
