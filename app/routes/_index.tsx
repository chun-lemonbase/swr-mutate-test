import type { MetaFunction } from "@remix-run/node";
import useSWR from "swr";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const timeout = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

let count = 0;

const fetchData = async () => {
  console.log("fetchData start");
  await timeout(2000);
  console.log("fetchData end");
  return `abc ${count}`;
};

const updateData = async (data: string) => {
  console.log(`updateData (${data}) start`);
  await timeout(2000);
  console.log(`updateData (${data}) end`);
  return data;
};

export default function Index() {
  const { data, mutate } = useSWR("/data", fetchData);
  console.log({ data });

  const handleClick1 = async () => {
    mutate(
      async (data) => {
        count += 1;
        console.log("handleClick1", data);
        return await updateData(count.toString());
      },
      {
        revalidate: true,
        optimisticData: (currentData, displayedData) => {
          console.log("optimisticData", { currentData, displayedData });
          return `optimistic ${count}`;
        },
        // populateData: true 는
        // populateData: (result, currentData) => result; 와 같다.
        // result는 mutate의 첫번째 인자인 data의 값, 또는 그 리턴값이다.
        populateCache: (result, currentData) => {
          console.log("populateCache", { result, currentData });
          return `populateCache ${result}`;
        },
      }
    );
  };

  return (
    <div className="font-sans p-4">
      <button onClick={handleClick1} type="button">
        버튼1
      </button>
      <h1 className="text-3xl">Welcome to Remix</h1>
      <ul className="list-disc mt-4 pl-6 space-y-2">
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/start/quickstart"
            rel="noreferrer"
          >
            5m Quick Start
          </a>
        </li>
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/start/tutorial"
            rel="noreferrer"
          >
            30m Tutorial
          </a>
        </li>
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/docs"
            rel="noreferrer"
          >
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
