"use client";

import { User } from "@/model/User";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function UserDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  const getUsers = async () => {
    try {
      setLoading(true);
      const response = await axios("/api/get-all-users");
      console.log("Fetched users:", await response.data.users);
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  if (loading) {
    return (
      <div className=" flex flex-col justify-center items-center w-full h-screen ">
        <div className="h-12 w-12 rounded-full border-b-2 border-black  animate-spin"></div>
       <h1 className="font-semibold"> wait while data is loading .....</h1>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center text-xl font-bold mt-6">
        Drop anonymous messages like a ninja with WiFi.
      </h1>
      <div className="mt-10 grid gap-4 grid-cols-4 sm:grid-cols-2 md:grid-cols-3  font-semibold lg:mx-16">
        {/* User dashboard content goes here */}
        {users.map((user, idx) => (
          <div
            key={idx}
            className="border py-7 px-7 rounded-md shadow-md flex gap-5 items-center justify-between"
          >
            <div>
              <p>Username: {user.username}</p>
              <p>Email: {user.email}</p>
            </div>
            <button
              onClick={() => router.push(`u/${user.username}`)}
              className="py-3 text-gray-800 cursor-pointer px-7 bg-linear-to-br from-blue-300 to-blue-800 rounded-2xl"
            >
              Send message
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserDashboard;
