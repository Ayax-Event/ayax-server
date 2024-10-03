"use client";
import { poppins, poppinsmedium } from "@/font";
import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";

export default function EoListPage(searchTerm) {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // const router = useRouter();
  const fetchData = async (page = 1) => {
    try {
      let url = `http://localhost:3000/api/event?page=${page}&search=${searchTerm}`;

      const response = await fetch(url);
      const result = await response.json();

      if (page === 1) {
        setData(result.data);
      } else {
        setData([...data, ...result.data]);
      }
      setPagination(result.pagination);
    } catch (error) {
      console.log(error);
    }
  };

  
  useEffect(() => {
    fetchData(1);
  }, [searchTerm]);
  

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex items-center justify-between flex-wrap md:flex-row bg-white dark:bg-gray-900 pb-4 pl-4 pr-4">
          <div className={`font-bold ${poppins.className}`}>Organizer List</div>
          <div className="flex-1 p-10">
            <label htmlFor="table-search" className="sr-only">
              Search
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="table-search-users"
              className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for event organizers"
            />
          </div>
        </div>
        {data.length === 0 ? (
          <p className="text-center">No event found.</p>
        ) : (
          <InfiniteScroll
            dataLength={data.length}
            next={() => fetchData(pagination.currentPage + 1)}
            hasMore={pagination.hasNextPage}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th
                    scope="col"
                    className={`${poppinsmedium.className}  px-6 py-3`}
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className={`${poppinsmedium.className}  px-6 py-3`}
                  >
                    Username
                  </th>
                  <th
                    scope="col"
                    className={`${poppinsmedium.className}  px-6 py-3`}
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className={`${poppinsmedium.className}  px-6 py-3`}
                  >
                    location
                  </th>
                  <th
                    scope="col"
                    className={`${poppinsmedium.className}  px-6 py-3`}
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.map((event) => (
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <th
                      scope="row"
                      className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <img
                        className="w-10 h-10 rounded-full"
                        src={event.creator.profilepict}
                        alt="Neil Sims"
                      />
                      <div className="ps-3">
                        <div className="text-base font-semibold">{event.creator.name}</div>
                        <div className="font-normal text-gray-500">
                          neil.sims@flowbite.com
                        </div>
                      </div>
                    </th>
                    <td className="px-6 py-4">{event.creator.username}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2" />{" "}
                        {event.creator.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2" />{" "}
                        {event.creator.location}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <a
                        href="#"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Belom ada
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}
