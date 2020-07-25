import React, { useState } from "react";
import { Container } from "react-bootstrap";
import useFetchjobs from "./useFetchjobs";
import Job from "./job";
import JobPagination from "./jobsPagination";
import SearchForm from "./searchForm";

export default function App() {
  const [params, setParams] = useState({});
  const [page, setPage] = useState(1);
  const { jobs, loading, error, hasNextPage } = useFetchjobs(params, page);

  const handleParamChange = e => {
    const param = e.target.name;
    const value = e.target.value;
    setPage(1);
    setParams(prevParams => {
      return { ...prevParams, [param]: value };
    });
  };

  return (
    <Container className="my-4">
      <h1 className="mb-4">Github Jobs</h1>
      <SearchForm params={params} onParamChange={handleParamChange} />
      <JobPagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
      {loading && <h1>Loading</h1>}
      {error && <h1>Error. Try Refreshing.</h1>}
      {jobs &&
        jobs.map(job => {
          return <Job key={job} job={job} />;
        })}
      <JobPagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
    </Container>
  );
}
