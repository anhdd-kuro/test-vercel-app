import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  const mockedData = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  })

  return json({
    mockedData: await mockedData.json()
  })
};


export default function Index() {
  const { mockedData } = useLoaderData<typeof loader>();

  console.log(mockedData, "mockedData")

  return (
    <div>
      Hello
      {mockedData?.title}
    </div>
  );
}
