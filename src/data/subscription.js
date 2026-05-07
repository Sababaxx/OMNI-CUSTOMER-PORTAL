// Placeholder data for the OMNI customer portal.
// Replace with your real backend data source.

export const subscription = {
  id: "76645269745",
  status: "Active",
  customerName: "Debbie Wickersham",
  memberSince: "2025-09-12",
  nextOrderDate: "June 26, 2026",
  frequency: "Deliver every 4 weeks",
  shippingPerDelivery: 8.0,
  total: 115.0,
  // Used for offer banner mapping. pouchCount: 1 | 2 | 3. orderCount: total orders placed.
  pouchCount: 3,
  orderCount: 2,
  products: [
    {
      id: "p1",
      title: "OMNI Creatine Gummy",
      variant: "3x / Peach",
      quantity: 1,
      price: 115.0,
      compareAt: 290.0,
      image: "creatine-pouch",
    },
    {
      id: "p2",
      title: "Daily Creatine Gummy",
      variant: "Peach",
      quantity: 1,
      price: 0.0,
      compareAt: 42.0,
      oneTime: true,
      discount: "One time discount (100%)",
      free: true,
      image: "daily-bottle",
    },
  ],
  plan: { label: "Deliver every 4 weeks" },
  shipping: {
    name: "Debbie Wickersham",
    line1: "595 North Main street",
    cityRegion: "Hiawassee, Georgia, 30546",
    country: "United States",
    phone: "+18283427163",
  },
  payment: {
    method: "ShopPay ending in 6047",
    expires: "11/26",
    updatedOn: "April 30, 2026",
  },
};
