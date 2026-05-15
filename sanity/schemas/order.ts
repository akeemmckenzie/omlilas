import { defineType, defineField } from "sanity";

export default defineType({
  name: "order",
  title: "Order",
  type: "document",
  readOnly: true,
  groups: [
    { name: "summary", title: "Summary", default: true },
    { name: "customer", title: "Customer" },
    { name: "items", title: "Items" },
    { name: "stripe", title: "Stripe" },
  ],
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order #",
      type: "string",
      group: "summary",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      group: "summary",
      options: {
        list: [
          { title: "Paid", value: "paid" },
          { title: "Fulfilled", value: "fulfilled" },
          { title: "Refunded", value: "refunded" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      initialValue: "paid",
    }),
    defineField({
      name: "placedAt",
      title: "Placed At",
      type: "datetime",
      group: "summary",
    }),
    defineField({
      name: "subtotal",
      title: "Subtotal (USD)",
      type: "number",
      group: "summary",
    }),
    defineField({
      name: "shipping",
      title: "Shipping (USD)",
      type: "number",
      group: "summary",
    }),
    defineField({
      name: "tax",
      title: "Tax (USD)",
      type: "number",
      group: "summary",
    }),
    defineField({
      name: "total",
      title: "Total (USD)",
      type: "number",
      group: "summary",
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      group: "summary",
      initialValue: "usd",
    }),

    // Customer
    defineField({
      name: "customerEmail",
      title: "Customer Email",
      type: "string",
      group: "customer",
    }),
    defineField({
      name: "customerName",
      title: "Customer Name",
      type: "string",
      group: "customer",
    }),
    defineField({
      name: "shippingAddress",
      title: "Shipping Address",
      type: "object",
      group: "customer",
      fields: [
        { name: "line1", title: "Line 1", type: "string" },
        { name: "line2", title: "Line 2", type: "string" },
        { name: "city", title: "City", type: "string" },
        { name: "state", title: "State / Region", type: "string" },
        { name: "postalCode", title: "Postal Code", type: "string" },
        { name: "country", title: "Country", type: "string" },
      ],
    }),

    // Items
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      group: "items",
      of: [
        {
          type: "object",
          name: "orderItem",
          title: "Item",
          fields: [
            { name: "artwork", title: "Artwork", type: "reference", to: [{ type: "artwork" }] },
            { name: "title", title: "Title", type: "string" },
            {
              name: "variant",
              title: "Variant",
              type: "string",
              options: {
                list: [
                  { title: "Signed Print", value: "signed" },
                  { title: "Unsigned Print", value: "unsigned" },
                ],
              },
            },
            { name: "sizeLabel", title: "Size", type: "string" },
            { name: "sizeKey", title: "Size Key", type: "string", readOnly: true },
            { name: "quantity", title: "Quantity", type: "number" },
            { name: "unitPrice", title: "Unit Price (USD)", type: "number" },
          ],
          preview: {
            select: {
              title: "title",
              variant: "variant",
              sizeLabel: "sizeLabel",
              quantity: "quantity",
            },
            prepare: ({ title, variant, sizeLabel, quantity }) => ({
              title: `${title} × ${quantity}`,
              subtitle: sizeLabel
                ? `${variant} · ${sizeLabel}`
                : variant,
            }),
          },
        },
      ],
    }),

    // Stripe
    defineField({
      name: "stripeSessionId",
      title: "Stripe Session ID",
      type: "string",
      group: "stripe",
    }),
    defineField({
      name: "stripePaymentIntentId",
      title: "Stripe Payment Intent",
      type: "string",
      group: "stripe",
    }),
  ],
  orderings: [
    {
      title: "Placed (Newest)",
      name: "placedDesc",
      by: [{ field: "placedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "orderNumber",
      subtitle: "customerEmail",
      total: "total",
      status: "status",
    },
    prepare: ({ title, subtitle, total, status }) => ({
      title: title ? `Order ${title}` : "Order",
      subtitle: `${subtitle ?? ""} — $${total ?? 0} (${status ?? "—"})`,
    }),
  },
});
