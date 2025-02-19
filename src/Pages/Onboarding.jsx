import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { LogIn } from "lucide-react";
import React, { use, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
function Onboarding() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  console.log(user);
  const navigateUser = (currRole) => {
    navigate(currRole === "recruiter" ? "/post-job" : "/jobs");
  };

  const handleRoleSelection = async (role) => {
    await user
      .update({ unsafeMetadata: { role } })
      .then(() => {
        console.log(`Role updated to :${role}`);
        navigateUser(role);
      })
      .catch((err) => {
        console.log("Error in updating role", err);
      });
  }; //async function because we are calling to clerk to update unsafeMetaData

  useEffect(() => {
    if (user?.unsafeMetadata?.role) {
      navigateUser(user.unsafeMetadata.role);
    }
  }, [user]);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="blue" />;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-32">
      <h2
        className="gradient-title font-extrabold text-7xl
    sm:text-8xl tracking-tighter"
      >
        I am a...
      </h2>
      <div className="mt-16 grid grid-cols-2 gap-4 w-full md:px-40">
        <Button
          variant="blue"
          className="h-36 text-2xl"
          onClick={() => handleRoleSelection("candidate")}
        >
          Candidate
        </Button>
        <Button
          variant="destructive"
          className="h-36 text-2xl"
          onClick={() => handleRoleSelection("recruiter")}
        >
          Recruiter
        </Button>
      </div>
    </div>
  );
}

export default Onboarding;
//isLoaded-->It indicates whether Clerk has finished loading the user’s authentication data.
