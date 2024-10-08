"use client";
import React, { useState, useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import InfiniteScroll from "react-infinite-scroll-component";
import { poppins, poppinsmedium } from "../../font";
import Swal from "sweetalert2";

// or via CommonJS

export default function ExpandableEventList() {
  const Swal = require("sweetalert2");
  const [active, setActive] = useState(null);
  const id = useId();
  const ref = useRef(null);
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

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

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
  // kalo mau nambahin button
  // const handleUpdateStatus = async (eventId, isActive) => {
  //   try {
  //     const response = await fetch(`http://localhost:3000/api/event-edit`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ eventId, isActive }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     const result = await response.json();
  //     fetchData();
  //     console.log("Status updated successfully:", result);
  //   } catch (error) {
  //     console.error("Error updating status:", error);
  //   }
  // };

  const fetchData = async (pageNum = page, search = searchTerm) => {
    setLoading(true);
    try {
      let url = `http://localhost:3000/api/event`;
      const params = new URLSearchParams();
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

  const formatCoordinates = (longitude, latitude) => {
    if (!longitude || !latitude) return "Location not available";
    return `${parseFloat(latitude).toFixed(4)}°${
      latitude >= 0 ? "N" : "S"
    }, ${parseFloat(longitude).toFixed(4)}°${longitude >= 0 ? "E" : "W"}`;
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  return (
    <>
      {/* ANIMASI DI DALAM CARD */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active._id}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active._id}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active._id}-${id}`}>
                <img
                  src={active.images[0]}
                  alt={active.eventName}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div>
                    <motion.h3
                      layoutId={`title-${active._id}-${id}`}
                      className="font-medium text-neutral-700 dark:text-neutral-200 text-base"
                    >
                      {active.eventName}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active._id}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 text-base"
                    >
                      Organized by: {active.creator?.username}
                    </motion.p>
                  </div>

                  <motion.button
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() =>
                      Toast.fire({
                        icon: "info",
                        title: "Buy tickets from Ayax Mobile App",
                      })
                    }
                    className={`px-4 py-3 text-sm rounded-full font-bold ${
                      active.isActive === "active"
                        ? "bg-red-500"
                        : "bg-[#37B7C3]"
                    } text-white`}
                  >
                    Buy Tickets
                  </motion.button>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400"
                  >
                    <p>
                      Date of Event:{" "}
                      {new Date(active.dateOfEvent).toDateString()}
                    </p>
                    <p>
                      Created at:{" "}
                      {new Date(active.creator.createdAt).toDateString()}
                    </p>
                    <p>Status: {active.isActive}</p>
                    <p>
                      Location:{" "}
                      {locations[active._id] ||
                        formatCoordinates(
                          active.location?.longtitude,
                          active.location?.latitude
                        )}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      {/* PAGE MULAI DARI SINI */}
      <div className="flex-1 p-6 overflow-auto bg-[#acccd3]">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
          <div className="flex items-center justify-between flex-wrap md:flex-row bg-white dark:bg-gray-900 pb-4 pl-4 pr-4 pt-4">
            <div className={`${poppins.className}`}>Event List</div>
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
          {/* CARD DI DEPAN */}
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
                height={700}
              >
                <ul className=" bg-white max-w-full mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-4 p-4">
                  {data.map((event) => (
                    <motion.li
                      layoutId={`card-${event._id}-${id}`}
                      key={event._id}
                      onClick={() => setActive(event)}
                      className="p-4 flex flex-col bg-white hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer shadow-md"
                    >
                      <div className="flex gap-4 flex-col w-full">
                        <motion.div layoutId={`image-${event._id}-${id}`}>
                          <img
                            src={event.images[0]}
                            alt={event.eventName}
                            className="h-60 w-full rounded-lg object-cover object-top"
                          />
                        </motion.div>
                        <div className="flex justify-center items-center flex-col">
                          <motion.h3
                            layoutId={`title-${event._id}-${id}`}
                            className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-base"
                          >
                            {event.eventName}
                          </motion.h3>
                          <motion.p
                            layoutId={`description-${event._id}-${id}`}
                            className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-base"
                          >
                            {event.creator?.username}
                          </motion.p>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </InfiniteScroll>
            )}
            {loading && data.length > 0 && (
              <div className="text-center py-4">Loading more...</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
