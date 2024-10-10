"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconArrowLeft,
  IconHome2,
  IconUserCheck,
  IconUserPentagon,
  IconUserPlus,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SidebarCMS() {
  const [data, setData] = useState([]);
  const fetchUser = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/current-user`
      );
      const result = await response.json();

      setData(result);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    document.cookie =
      "Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  const links = [
    {
      label: "Home",
      href: "/",
      icon: (
        <IconHome2 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Event Organizer List",
      href: "/eo-list",
      icon: (
        <IconUserPentagon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "User Approval List",
      href: "/user-approval",
      icon: (
        <IconUserCheck className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Add User",
      href: "/add-user",
      icon: (
        <IconUserPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: (
        <button
          onClick={handleLogout}
          className="flex items-center text-neutral-700 dark:text-neutral-200"
        >
          <span>Logout</span>
        </button>
      ),
      href: "/login",
      icon: (
        <IconArrowLeft
          onClick={handleLogout}
          className="h-5 w-5 flex-shrink-0"
        />
      ),
    },
  ];
  const [open, setOpen] = useState(false);

  return (
    <Sidebar open={open} setOpen={setOpen} className="h-screen">
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: data.name,
              href: "#",
              icon: (
                <img
                  src={data.profilepict}
                  className="h-7 w-7 flex-shrink-0 rounded-full"
                  width={50}
                  height={50}
                  alt="Avatar"
                />
              ),
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <img
        src="https://ik.imagekit.io/axellgadiel/image.png?updatedAt=1727850866110"
        alt="Ayax CMS Logo"
        className="h-5 w-6 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Ayax System
      </motion.span>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <img
        src="https://ik.imagekit.io/axellgadiel/image.png?updatedAt=1727850866110"
        alt="Ayax CMS Logo"
        className="h-5 w-6 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"
      />
    </Link>
  );
};
