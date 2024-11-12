import { useToast } from "@/components/ui/use-toast";
import { Button } from "./ui/button";

type RefreshProps = {
  refetch: () => void;
  className?: string;
};

const Refresh = ({ refetch, className }: RefreshProps) => {
  const { toast } = useToast();

  const handleRefetch = () => {
    try {
      refetch();
      toast({
        variant: "default",
        title: "Data refetched successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to refetch data",
      });
    }
  };

  return (
    <Button onClick={handleRefetch} className={className}>
      Refresh
    </Button>
  );
};

export default Refresh;
