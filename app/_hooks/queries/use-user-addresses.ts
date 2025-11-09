import { useQuery } from "@tanstack/react-query";

import { getUserAddresses } from "@/app/_actions/get-user-addresses";
import { shippingAddressTable } from "@/app/_db/schema";

export const getUserAddressesQueryKey = () => ["user-addresses"] as const;

export const useUserAddresses = (params?: {
  initialData?: (typeof shippingAddressTable.$inferSelect)[];
}) => {
  return useQuery({
    queryKey: getUserAddressesQueryKey(),
    queryFn: getUserAddresses,
    initialData: params?.initialData,
  });
};
