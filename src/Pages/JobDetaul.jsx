import { getSingleJob, updateHiringStatus } from "@/api/apijobs";
import ApplicationCard from "@/components/ApplicationCard";
import ApplyJobDrawer from "@/components/ApplyJobDrawer";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import MarkdownEditor from "@uiw/react-markdown-editor";
import MDEditor from "@uiw/react-md-editor";
import { BriefcaseIcon, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

function JobDetaul() {
  const { user, isLoaded } = useUser();

  const { id } = useParams();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  const {
    loading: loadingHiringStatus,

    fn: fnHiringStatus,
  } = useFetch(updateHiringStatus, {
    job_id: id,
  });

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  useEffect(() => {
    if (isLoaded) {
      fnJob();
    }
  }, [isLoaded]);

  console.log(job);

  if (!isLoaded) {
    return <BarLoader className="mb-4" width={"100%"} color="blue" />;
  }
  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {job?.title}
        </h1>
        <img src={job?.company?.logo_url} alt={job?.title} className="h-12" />
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <MapPinIcon />
          {job?.location}
        </div>
        <div className="flex gap-2">
          <BriefcaseIcon /> {job?.applications?.length} Applicants
        </div>
        <div className="flex gap-2">
          {job?.isOpen ? (
            <>
              <DoorOpen />
              Open
            </>
          ) : (
            <>
              <DoorClosed />
              Closed
            </>
          )}
        </div>
      </div>

      {loadingHiringStatus && (
        <BarLoader className="mb-4" width={"100%"} color="blue" />
      )}
      {job?.recruiter_id === user?.id && (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger
            className={`w-full ${job?.isOpen ? "bg-green-600" : "bg-red-600"}`}
          >
            <SelectValue
              placeholder={
                "Hiring Status" + (job?.isOpen ? "(Open)" : "(Closed)")
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      )}

      <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
      <p className="sm:text-lg">{job?.description}</p>
      <h2 className="text-2xl sm:text-3xl font-bold">
        What we are looking for
      </h2>
      <MDEditor.Markdown
        source={job?.requirements}
        className="bg-transparent sm:text-lg"
      />

      {job?.recruiter_id !== user?.id && (
        <ApplyJobDrawer
          job={job}
          user={user}
          fetchJob={fnJob}
          applied={job?.applications?.find((ap) => ap.candidate_id === user.id)}
        />
      )}

      {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
        <div className="flex flex-col  gap-2">
          <h2 className="text-2xl sm:text-3xl font-bold">Applications</h2>
          {job?.applications.map((application) => {
            return (
              <ApplicationCard key={application.id} application={application} />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default JobDetaul;
//fetchjob->its because after we have created the application we want to fetch that job again to update that applicants number
//and need to check if user has already applied or not
//whatever job application we have try to find user inside that job application
