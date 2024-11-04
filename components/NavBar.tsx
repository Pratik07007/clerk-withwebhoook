import React from "react";
import {
  SignedOut,
  SignInButton,
  SignedIn,
  UserButton,
  SignUpButton,
} from "@clerk/nextjs";

function NavBar() {
  return (
    <div className="flex w-screen h-20 bg-slate-500 items-center justify-between px-10 ">
      <div>
        <h1 className="text-4xl font-medium">Logo</h1>
      </div>
      <SignedOut>
        <div className="flex gap-4 items-center">
          <SignInButton>
            <button className="bg-gray-300 rounded-3xl px-5 py-1">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton forceRedirectUrl={"/cart"}>
            <button className="bg-gray-300 rounded-3xl px-5 py-1">
              Sign Up
            </button>
          </SignUpButton>
        </div>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}

export default NavBar;
