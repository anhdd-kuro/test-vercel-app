import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  const mockedData = await fetch("https://jsonplaceholder.typicode.com/todos/1")

  return json({
    mockedData
  })
};


export default function Index() {
  const { mockedData } = useLoaderData<typeof loader>();

  console.log(mockedData, "mockedData")

  return (
    <div>
      Hello
    </div>
  );
}
