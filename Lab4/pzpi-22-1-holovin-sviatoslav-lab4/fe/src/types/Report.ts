export type Report = {
  location_id: string;
  name: string;
  address: string;
  inventories: {
    inventory_id: string;
    max_quantity: number;
    used_quantity: number;
    stored_vaccines: {
      vaccine_id: string;
      name: string;
      description: string;
      quantity: number;
    }[];
  }[];
};
