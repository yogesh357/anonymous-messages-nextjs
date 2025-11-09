"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const router = useRouter();

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-xl font-bold mb-4 md:mb-0">
          True Feedback
        </Link>
        <button
          onClick={() => router.push("/user-dashboard")}
          className="py-2 px-4 cursor-pointer bg-linear-to-br from-black to-gray-500 font-semibold  rounded-md text-white mb-4 md:mb-0"
        >
          Start the Fun
        </button>
        {session ? (
          <>
            <span className="mr-4">Welcome, {user.username || user.email}</span>
            <Button
              onClick={() => signOut()}
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button
              className="w-full md:w-auto bg-slate-100 text-black cursor-pointer"
              variant={"outline"}
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
