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
        // revalidate: true, // 기본값
        // optimisticData는 undefined가 기본값
        // optimisticData: (currentData, displayedData) => {
        //   console.log("optimisticData", { currentData, displayedData });
        //   return `optimistic ${count}`;
        // },
        // populateCache: true, // 기본값이고
        // populateCache: (result, currentData) => result; // 와 같다.
        // result는 mutate의 첫번째 인자인 data의 값, 또는 그 리턴값이다.
        // populateCache: (result, currentData) => {
        //   console.log("populateCache", { result, currentData });
        //   return `populateCache ${result}`;
        // },
      }
    );
  };

  const handleClick2 = async () => {
    mutate("click 2", {
      revalidate: true,
      // optiomisticData는 mutation data가 cache에 업데이트 되기 전까지만 유효하다.
      // mutation data가 비동기가 아니고 populateCache: true이면 optimisticData를 지정하는 것은 의미가 없다.
      optimisticData: (currentData, displayedData) => {
        console.log("optimisticData", { currentData, displayedData });
        return `optimistic ${count}`;
      },
      // populateCache: false
      populateCache: (result, currentData) => {
        console.log("populateCache", { result, currentData });
        return `populateCache ${result}`;
      },
    });
  };

  return (
    <div className="font-sans p-4">
      <h2>{data ?? "undefined"}</h2>
      <button onClick={handleClick1} type="button">
        버튼1
      </button>
      <br />
      <button onClick={handleClick2} type="button">
        버튼2
      </button>
      <br />
    </div>
  );
}
