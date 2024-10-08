"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { poppinsmedium, poppins } from "../../font.js"

export default function AddUser() {
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/addAdmin`, {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw await response.json();
      }
      router.push("/");
    } catch (err) {
      alert("Failed to login");
      console.error(err);
    }
  };

  console.log(user);

  return (
    <div className="max-w-md w-full mx-auto pt-16">
      <div className="bg-white dark:bg-black shadow-md rounded-lg p-8">
        <h2 className={`${poppins.className} font-bold text-xl text-neutral-800 text-center dark:text-neutral-200 mb-8`}>
          Register New Admin
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label className={`${poppinsmedium.className}`} htmlFor="Name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Input your name here"
              type="name"
              onChange={handleChange}
              value={user.name}
              className={`${poppinsmedium.className}`}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label className={`${poppinsmedium.className}`} htmlFor="email">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="Input your username here"
              type="username"
              onChange={handleChange}
              value={user.username}
              className={`${poppinsmedium.className}`}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label className={`${poppinsmedium.className}`} htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              placeholder="Input your email here"
              type="email"
              onChange={handleChange}
              value={user.email}
              className={`${poppinsmedium.className}`}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label className={`${poppinsmedium.className}`} htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              onChange={handleChange}
              value={user.password}
              className={`${poppinsmedium.className}`}
            />
          </LabelInputContainer>

          <button
            className="w-full bg-gradient-to-br text-white rounded-md h-10 font-medium"
            type="submit"
            style={{
              background: "linear-gradient(to bottom right, #37B7C3, #088395)",
            }}
          >
            Register &rarr;
            <BottomGradient />
          </button>
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
