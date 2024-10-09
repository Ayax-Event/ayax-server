"use client";
import React, { useState, useEffect } from "react";
import { poppins, poppinsmedium } from "@/font";
import InfiniteScroll from "react-infinite-scroll-component";

export default function EoListPage() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [locations, setLocations] = useState({});

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData(1, searchTerm.trim());
  };

  const handleInputChange = (e) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    if (newTerm === "") {
      setPage(1);
      fetchData(1, "");
    }
  };

  const formatCoordinates = (longitude, latitude) => {
    if (!longitude || !latitude) return "Location not available";
    return `${parseFloat(latitude).toFixed(4)}°${
      latitude >= 0 ? "N" : "S"
    }, ${parseFloat(longitude).toFixed(4)}°${longitude >= 0 ? "E" : "W"}`;
  };

  const getLocationName = async (longitude, latitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      return data.display_name || formatCoordinates(longitude, latitude);
    } catch (error) {
      console.error("Error fetching location name:", error);
      return formatCoordinates(longitude, latitude);
    }
  };

  const fetchData = async (pageNum = 1, search = searchTerm) => {
    setLoading(true);
    try {
      let url = `http://localhost:3000/api/eo-list`;
      const params = new URLSearchParams();

      params.append("page", pageNum);
      if (search) {
        params.append("search", search);
      }

      url += `?${params.toString()}`;

      const response = await fetch(url, { cache: "no-store" });
      const result = await response.json();

      if (pageNum === 1) {
        setData(result.data);
      } else {
        setData((prevData) => [...prevData, ...result.data]);
      }
      setPagination(result.pagination);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      const newLocations = {};
      for (const eo of data) {
        if (eo.location && !locations[eo._id]) {
          newLocations[eo._id] = await getLocationName(
            eo.location.longitude,
            eo.location.latitude
          );
        }
      }
      setLocations((prev) => ({ ...prev, ...newLocations }));
    };

    fetchLocations();
  }, [data]);

  const loadMore = () => {
    if (pagination.hasNextPage) {
      fetchData(page + 1);
    }
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex items-center justify-between flex-wrap md:flex-row bg-white dark:bg-gray-900 pb-4 pl-4 pr-4 pt-4">
          <div className={`font-bold ${poppins.className}`}>
            Event Organizer List
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
            <form onChange={handleSearch}>
              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search for event organizers"
              />
              <button type="submit" className="hidden">
                Search
              </button>
            </form>
          </div>
        </div>
        <div id="infinite-table">
          <InfiniteScroll
            dataLength={data.length}
            next={loadMore}
            hasMore={pagination.hasNextPage}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p
                className={`${poppinsmedium.className}`}
                style={{ textAlign: "center" }}
              >
                No more Event Organizers to load
              </p>
            }
            height={500}
          >
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th
                    scope="col"
                    className={`${poppinsmedium.className} px-6 py-3`}
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className={`${poppinsmedium.className} px-6 py-3`}
                  >
                    Username
                  </th>
                  <th
                    scope="col"
                    className={`${poppinsmedium.className} px-6 py-3`}
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className={`${poppinsmedium.className} px-6 py-3`}
                  >
                    Location
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No event organizers found.
                    </td>
                  </tr>
                ) : (
                  data.map((eo) => (
                    <tr
                      key={eo._id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <th
                        scope="row"
                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        <img
                          className="w-10 h-10 rounded-full"
                          src={eo.profilepict}
                          alt={eo.name}
                        />
                        <div className="ps-3">
                          <div className="text-base font-semibold">
                            {eo.name}
                          </div>
                          <div className="font-normal text-gray-500">
                            {eo.email}
                          </div>
                        </div>
                      </th>
                      <td className="px-6 py-4">{eo.username}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2" />
                          {eo.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2" />
                          {locations[eo._id] ||
                            formatCoordinates(
                              eo.location?.longitude,
                              eo.location?.latitude
                            )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </InfiniteScroll>
          {loading && <div className="text-center py-4">Loading...</div>}
        </div>
      </div>
    </div>
  );
}
