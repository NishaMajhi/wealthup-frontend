"use client";
import React from "react";
import { useCodes } from "../../../store/useCodes";

const ArrayDisplayPage = () => {
  const { codes } = useCodes();

  return (
    <div className="">
      <h1>Codes Inputed by User Display</h1>
      {codes && codes.length === 0 ? (
        <p className="text-red-900">No Codes Inputed by User </p>
      ) : (
        <ul>
          {codes?.map((item, index) => (
            <li key={index} className="list-item">
              {item}
            </li>
          ))}
        </ul>
      )}
      <style jsx>{`
        .list-item {
          background-color: #f0f0f0;
          padding: 10px;
          margin: 5px 0;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};

export default ArrayDisplayPage;
