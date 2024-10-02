import { poppins, poppinsmedium } from "@/font";

export default function Home() {
  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <div className="flex items-center justify-between flex-wrap md:flex-row bg-white dark:bg-gray-900 pb-4 pl-4 pr-4">
        <div className={`${poppins.className }`}> Event List</div>
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

        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className={`${poppinsmedium.className}  px-6 py-3`}>
                Event Name
              </th>
              <th scope="col" className={`${poppinsmedium.className}  px-6 py-3`}>
                Organizer
              </th>
              <th scope="col" className={`${poppinsmedium.className}  px-6 py-3`}>
                Date of Event
              </th>
              <th scope="col" className={`${poppinsmedium.className}  px-6 py-3`}>
                Created at
              </th>
              <th scope="col" className={`${poppinsmedium.className}  px-6 py-3`}>
                Updated at
              </th>
              <th scope="col" className={`${poppinsmedium.className}  px-6 py-3`}>
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <th
                scope="row"
                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
              >
                <img
                  className="w-10 h-10 rounded-full"
                  src="data:image/jpeg;base64,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"
                  alt="Neil Sims"
                />
                <div className="ps-3">
                  <div className="text-base font-semibold">Neil Sims</div>
                  <div className="font-normal text-gray-500">
                    neil.sims@flowbite.com
                  </div>
                </div>
              </th>

              <td className="px-6 py-4">React Developer</td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2" />{" "}
                  Online
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2" />{" "}
                  Online
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500 me-2" />{" "}
                  Offline
                </div>
              </td>

              <td className="px-6 py-4">
                <a
                  href="#"
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Edit user
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
