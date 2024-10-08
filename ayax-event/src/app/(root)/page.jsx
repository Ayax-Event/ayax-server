"use client";
import React, { useState, useEffect } from "react";
import { poppins, poppinsmedium } from "../../font";
import InfiniteScroll from "react-infinite-scroll-component";

export default function HomePage() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
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

  const handleUpdateStatus = async (eventId, isActive) => {
    try {
      console.log(eventId, isActive);
      const response = await fetch(`http://localhost:3000/api/event-edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId, isActive }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      fetchData();
      console.log("Status updated successfully:", result);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleUpdate = async (eventId, isActive) => {
    handleUpdateStatus(eventId, isActive);
  };

  const fetchData = async (pageNum = page, search = searchTerm) => {
    setLoading(true);
    try {
      let url = `http://localhost:3000/api/event`;
      const params = new URLSearchParams();
      console.log("Fetching data...");

      params.append("page", pageNum);
      if (search) {
        params.append("search_eventName", search);
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

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      const newLocations = {};
      for (const event of data) {
        if (event.location && !locations[event._id]) {
          newLocations[event._id] = await getLocationName(
            event.location.longtitude,
            event.location.latitude
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
          <div className={`${poppins.className}`}> Event List</div>
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
                className={`${poppinsmedium.className} block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                placeholder="Search for events"
              />
              <button type="submit" className="hidden">
                Search
              </button>
            </form>
          </div>
        </div>
        <div id="infinite-table">
          {loading && data.length === 0 ? (
            <div className="text-center py-4">Loading...</div>
          ) : (
            <InfiniteScroll
              dataLength={data.length}
              next={loadMore}
              hasMore={pagination.hasNextPage}
              loader={<h4>Loading more...</h4>}
              endMessage={
                <p
                  className={`${poppinsmedium.className}`}
                  style={{ textAlign: "center" }}
                >
                  No more Events to load
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
                      Event Name
                    </th>
                    <th
                      scope="col"
                      className={`${poppinsmedium.className} px-6 py-3`}
                    >
                      Organizer
                    </th>
                    <th
                      scope="col"
                      className={`${poppinsmedium.className} px-6 py-3`}
                    >
                      Date of Event
                    </th>
                    <th
                      scope="col"
                      className={`${poppinsmedium.className} px-6 py-3`}
                    >
                      Created at
                    </th>
                    <th
                      scope="col"
                      className={`${poppinsmedium.className} px-6 py-3`}
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className={`${poppinsmedium.className} px-6 py-3`}
                    >
                      Location
                    </th>
                    <th
                      scope="col"
                      className={`${poppinsmedium.className} px-6 py-3`}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No events found.
                      </td>
                    </tr>
                  ) : (
                    data.map((event) => (
                      <tr
                        key={event._id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <th
                          scope="row"
                          className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          <img
                            className={`${poppinsmedium.className} w-10 h-10 rounded-full`}
                            src={event.images[0]}
                            alt={event.eventName}
                          />
                          <div className="ps-3">
                            <div className="text-base font-semibold">
                              {event.eventName}
                            </div>
                            <div className="font-normal text-gray-500">
                              {event.creator?.email}
                            </div>
                          </div>
                        </th>
                        <td className="px-6 py-4">{event.creator?.username}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {new Date(event.dateOfEvent).toDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {new Date(event.creator.createdAt).toDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div
                              className={`h-2.5 w-2.5 rounded-full ${
                                event.isActive === "active"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              } me-2`}
                            />
                            {event.isActive}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {locations[event._id] ||
                              formatCoordinates(
                                event.location?.longtitude,
                                event.location?.latitude
                              )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              handleUpdate(
                                event._id,
                                event.isActive === "active"
                                  ? "inactive"
                                  : "active"
                              )
                            }
                            className={`${
                              poppinsmedium.className
                            } font-medium ${
                              event.isActive === "active"
                                ? "text-red-500"
                                : "text-blue-600"
                            } dark:${
                              event.isActive === "active"
                                ? "text-red-500"
                                : "text-blue-500"
                            } hover:underline cursor-pointer`}
                          >
                            {event.isActive === "active"
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </InfiniteScroll>
          )}
          {loading && data.length > 0 && (
            <div className="text-center py-4">Loading more...</div>
          )}
        </div>
      </div>
    </div>
  );
}
