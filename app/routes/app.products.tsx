import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "~/shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  try {
    const productsResponse = await admin.graphql(`#graphql
      query getProducts {
        products(first: 10) {
          nodes {
            id
            title
          }
        }
      }`
    )

    const jsonData = await productsResponse.json();
    const products = jsonData?.data?.products?.nodes;
    console.log(products, "products")

    return json({
      products
    });
  } catch (error) {
    console.log(error)
    return json({
      products: []
    });
  }
};


export default function AppProductsRoute() {
  const { products } = useLoaderData<typeof loader>();
  console.log(products, "products")

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
