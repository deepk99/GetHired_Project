import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import {
  SignedIn,
  SignedOut,
  SignIn,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { BriefcaseBusiness, Heart, PenBox, PenBoxIcon } from "lucide-react";

function Header() {
  const [showSignIn, setshowSignIn] = useState(false);
  const [Search, setSearch] = useSearchParams();
  const { user } = useUser();

  useEffect(() => {
    if (Search.get("sign-in")) {
      setshowSignIn(true);
    }
  }, [Search]);

  const handleOverLayClick = (e) => {
    if (e.target === e.currentTarget) {
      setshowSignIn(false);
      setSearch({});
    }
  };
  return (
    <>
      <nav className="py-4 flex justify-between items-center">
        <Link>
          <img src="/Hired.png" alt="" className="h-22 w-24" />
        </Link>

        <div className="flex gap-8">
          <SignedOut>
            <Button varient="outline" onClick={() => setshowSignIn(true)}>
              Login
            </Button>
          </SignedOut>
          <SignedIn>
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/post-job">
                <Button variant="destructive" className="rounded-full">
                  <PenBox size={20} className="mr-2" />
                  Post a Job
                </Button>
              </Link>
            )}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Jobs"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/my-jobs"
                />
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<Heart size={15} />}
                  href="/saved-jobs"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-55"
          onClick={handleOverLayClick}
        >
          <SignIn
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div> //login pe click karne ke baad ye code show ho jayega
      )}
    </>
  );
}

export default Header;
//agar sign in kia toh onboarding page pe redirect ho jayega
