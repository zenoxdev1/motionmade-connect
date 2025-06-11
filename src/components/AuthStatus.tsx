import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

const AuthStatus = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Badge
        variant="secondary"
        className="flex items-center space-x-2 px-3 py-2"
      >
        <WifiOff className="w-3 h-3" />
        <span className="text-xs">Local Mode</span>
      </Badge>
    </div>
  );
};

export default AuthStatus;
