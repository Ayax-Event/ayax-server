"use client";
import React, { useState, useEffect } from "react";
import { poppins, poppinsmedium } from "../../../font";
import { getCookie } from "cookies-next";

export default function UpgradeRolePage() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const handleSearch = (e) => {
    e.preventDefault();

    fetchUserPending(searchTerm.trim());
  };

  const handleInputChange = (e) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    if (newTerm === "") {
      fetchUserPending("");
    }
  };

  const handleApproveUser = async (_id, ) => {
    try {
      const token = getCookie("Authorization");
      const res = await fetch(`http://localhost:3000/api/approve-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ _id: _id }),
      });
      await res.json();
      fetchUserPending();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserAction = async (requestId, isApprove) => {
    console.log(requestId, isApprove);
    try {
      const token = getCookie("Authorization");
      const res = await fetch(`http://localhost:3000/api/approve-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ requestId, isApprove}),
      });
      await res.json();
      fetchUserPending();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAction = async (requestId, isApprove) => {
    handleUserAction(requestId, isApprove);
  };

  const fetchUserPending = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:3000/api/user-request`;

      const response = await fetch(url, { cache: "no-store" });
      const result = await response.json();

      setData(result.userRequest);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPending();
  }, []);

  console.log(data);
  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex items-center justify-between flex-wrap md:flex-row bg-white dark:bg-gray-900 pb-4 pl-4 pr-4 pt-4">
          <div className={`font-bold ${poppins.className}`}>
            User Approval List
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
                className={`${poppinsmedium.className} block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                placeholder="Search for event organizers"
              />
              <button type="submit" className="hidden">
                Search
              </button>
            </form>
          </div>
        </div>
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
                Status
              </th>
              <th
                scope="col"
                className={`${poppinsmedium.className} px-6 py-3`}
              >
                Description
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
                <td colSpan="5" className={`${poppinsmedium.className} text-center py-4`}>
                No users have registered as event organizers yet.
                </td>
              </tr>
            ) : (
              data.map((user) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th
                    scope="row"
                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <img
                      className="w-10 h-10 rounded-full"
                      src={user.userDetail.profilepict}
                    />
                    <div className="ps-3">
                      <div className="text-base font-semibold">
                        {user.userDetail.name}
                      </div>
                      <div className="font-normal text-gray-500">
                        {user.userDetail.email}
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">{user.userDetail.username}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">{user.status}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">{user.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      onClick={() => handleAction(user._id, true)}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Approve
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      onClick={() => handleAction(user._id, false)}
                      className="font-medium text-red-600 dark:text-red-500 hover:underline"
                    >
                      Decline
                    </a>
                  </td>
                  
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
