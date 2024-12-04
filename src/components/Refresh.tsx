import { useToast } from "@/components/ui/use-toast";
import { Button } from "./ui/button";
import { RefreshCcw } from "lucide-react";

type RefreshProps = {
  refetch: () => void;
  className?: string;
  icon?: boolean;
};

const Refresh = ({ refetch, className, icon = false }: RefreshProps) => {
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
    <div>
      {icon ? (
        <Button variant="outline" onClick={handleRefetch} className={className}>
          <RefreshCcw size={20} />
        </Button>
      ) : (
        <Button onClick={handleRefetch} className={className}>
          Refresh
        </Button>
      )}
    </div>
  );
};

export default Refresh;
