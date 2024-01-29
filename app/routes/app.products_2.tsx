import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "~/shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  if (!session.accessToken) return { products: [] };

  const productsResponse = await fetch(
    "https://krb-kuro.myshopify.com/admin/api/2024-01/graphql.json",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": session.accessToken,
      },
      body: JSON.stringify({
        query: `#graphql
          query getProducts {
            products(first: 10) {
              nodes {
                id
                title
              }
            }
          }`,
      }),
    },
  );

  const jsonData = await productsResponse.json();
  const products = jsonData?.data?.products?.nodes;
  console.log(products, "products");

  return json({
    products,
  });
};

export default function AppProductsRoute() {
  const { products } = useLoaderData<typeof loader>();
  console.log(products, "products");

  return (
    <div>
      <h1>AppProductsRoute</h1>
      <ul>
        {products?.map((product: any) => (
          <li key={product.title}>{product.title}</li>
        ))}
      </ul>
    </div>
  );
}
