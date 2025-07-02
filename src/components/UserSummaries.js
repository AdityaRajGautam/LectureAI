import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserSummaries, deleteSummary } from '../store/slices/summarySlice';

const UserSummaries = () => {
  const dispatch = useDispatch();
  const { userSummaries, isLoading, error } = useSelector((state) => state.summary);

  useEffect(() => {
    dispatch(fetchUserSummaries());
  }, [dispatch]);

  const handleDelete = (summaryId) => {
    if (window.confirm('Are you sure you want to delete this summary?')) {
      dispatch(deleteSummary(summaryId));
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6">
        <div className="text-center">Loading summaries...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">My Summaries</h2>

      {userSummaries.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>No summaries found. Start by transcribing some speech and creating summaries.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userSummaries.map((summary) => (
            <div key={summary._id} className="bg-white p-6 rounded-lg shadow-md border">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Summary from {new Date(summary.createdAt).toLocaleDateString()}
                </h3>
                <button
                  onClick={() => handleDelete(summary._id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              </div>

              <div className="mb-4">
                <h4 className="text-md font-medium text-gray-700 mb-2">Original Transcript:</h4>
                <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">
                  {summary.transcript}
                </p>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-700 mb-2">Summary:</h4>
                <p className="text-gray-800">
                  {summary.summary}
                </p>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                Created: {new Date(summary.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSummaries;
