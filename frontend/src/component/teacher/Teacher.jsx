import React from "react";
import { MyHeader } from "../../component";
import { TeacherTable } from "../dataTables";
import { teachers } from "../../studentsData.js";
import { useAuth } from "../../context/authContext.jsx";

const Teacher = () => {
  const { loggedUser } = useAuth();

  return (
    <div className="w-full">
      <MyHeader
        title="Teacher"
        icon="LiaChalkboardTeacherSolid"
        btnTitle="Create new teacher"
        path={`/${loggedUser.role}/teacher/create`}
      />

      <div className="w-full shadowbox p-7">
        {/* TODO: custom filter based on class section */}
        {/* <div className="w-full mb-8">
          <form
            // onSubmit={}
            className="w-4/5 mx-auto grid grid-cols-10 gap-4 text-lg"
          >
            <div className="col-span-4">
              <select
                className="block w-full p-2 border-[1px] border-slate-300 rounded-md text-md appearance-none"
                id="class"
                placeholder="class"
                name="class"
                // value={}
                // onChange={}
                required
              >
                <option value="" disabled selected>
                  Select a class
                </option>
                <option value="11th">11th</option>
                <option value="12th">12th</option>
              </select>
            </div>
            <div className="col-span-4">
              <select
                className="block w-full p-2 border-[1px] border-slate-300 rounded-md text-md appearance-none"
                id="section"
                placeholder="section"
                name="section"
                // value={}
                // onChange={}
                required
              >
                <option value="" disabled selected>
                  Select a section
                </option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
            <div className="col-span-2">
              <input
                type="submit"
                value="Filter"
                className="btnAdd rounded-md px-5"
              />
            </div>
          </form>
        </div> */}

        <TeacherTable users={teachers} />
      </div>
    </div>
  );
};

export default Teacher;
